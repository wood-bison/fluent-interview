#!/usr/bin/env node

/**
 * W16 promotion evidence: one learner-safe route -> run -> trace journey.
 *
 * The journey deliberately uses a disposable profile and a released
 * code-workspace task. It records only bounded statuses, counts, hashes and
 * trace identities; starter source, hidden tests, answers and learner
 * profile identifiers never enter the evidence file.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash, randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.resolve(process.env.OBSERVABILITY_JOURNEY_JSON ?? 'docs/verification/two-audit-remediation/W16/jaeger-continuity.json');
const markdownOutput = path.resolve(process.env.OBSERVABILITY_JOURNEY_MD ?? 'docs/verification/two-audit-remediation/W16/jaeger-continuity.md');
const apiUrl = (process.env.LEARNING_API_URL ?? 'http://127.0.0.1:47000').replace(/\/$/u, '');
const runtimeUrl = (process.env.RUNTIME_API_URL ?? 'http://127.0.0.1:48227').replace(/\/$/u, '');
const jaegerUrl = (process.env.JAEGER_URL ?? 'http://127.0.0.1:56686').replace(/\/$/u, '');

const correlationId = randomUUID();
const syntheticProfile = `w16-synthetic-${Date.now().toString(36)}`;
const idempotencyKey = `w16-jaeger-${Date.now().toString(36)}`;
const taskId = 'node-rate-limiter-001';
const taskFamilyKey = 'task-family.rate-limiter';
const revision = 1;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sha256(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

async function request(base, requestPath, options = {}) {
  const response = await fetch(`${base}${requestPath}`, {
    ...options,
    headers: {
      accept: 'application/json',
      ...(options.headers ?? {}),
    },
    signal: AbortSignal.timeout(options.timeoutMs ?? 10_000),
  });
  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }
  return { response, body, text };
}

async function progress(profile) {
  const { response, body } = await request(apiUrl, '/api/progress', {
    headers: { 'x-fel-profile': profile },
  });
  assert(response.ok && body, `progress returned HTTP ${response.status}`);
  return body;
}

/** Exclude timestamps and private identifiers from the comparison surface. */
function stableProgressProjection(body) {
  return {
    contractVersion: body.contractVersion,
    status: body.status,
    summary: body.summary,
    currentSession: body.currentSession,
    recall: body.recall,
    capabilities: (body.capabilities ?? []).map((capability) => ({
      id: capability.id,
      availability: capability.availability,
      readiness: capability.readiness,
      phase: capability.phase,
      evidenceSummary: capability.evidenceSummary,
      missingGates: capability.missingGates,
      blockedBy: capability.blockedBy,
      repeat: capability.repeat,
    })),
  };
}

function metricValue(text, metric) {
  const line = text.split('\n').find((candidate) => candidate.startsWith(metric));
  if (!line) return 0;
  const value = Number(line.slice(line.lastIndexOf(' ') + 1));
  return Number.isFinite(value) ? value : 0;
}

async function metrics() {
  const { response, text } = await request(apiUrl, '/api/metrics', {
    headers: { accept: 'text/plain; version=0.0.4' },
  });
  assert(response.ok, `metrics returned HTTP ${response.status}`);
  return {
    firstRunCount: metricValue(text, 'fel_learner_time_to_first_run_seconds_count'),
    learnerEventLines: text.split('\n').filter((line) => line.startsWith('fel_learner_events_total')).length,
  };
}

const rateLimiterSource = `'use strict';

class RateLimiter {
  constructor({ capacity, refillPerSecond, now = () => Date.now() }) {
    this.capacity = capacity;
    this.refillPerSecond = refillPerSecond;
    this.now = now;
    this.buckets = new Map();
  }

  allow(key) {
    const current = this.now();
    const previous = this.buckets.get(key);
    const bucket = previous ?? { tokens: this.capacity, at: current };
    const elapsedSeconds = Math.max(0, current - bucket.at) / 1000;
    bucket.tokens = Math.min(this.capacity, bucket.tokens + elapsedSeconds * this.refillPerSecond);
    bucket.at = current;
    if (bucket.tokens < 1) {
      this.buckets.set(key, bucket);
      return false;
    }
    bucket.tokens -= 1;
    this.buckets.set(key, bucket);
    return true;
  }
}

module.exports = { RateLimiter };
`;

async function jaegerSpans(service) {
  const { response, body } = await request(
    jaegerUrl,
    `/api/traces?service=${encodeURIComponent(service)}&limit=100`,
    { timeoutMs: 5_000 },
  );
  if (!response.ok || !body) return [];
  return (body.data ?? []).flatMap((trace) => (trace.spans ?? []).map((span) => {
    const tags = Object.fromEntries((span.tags ?? []).map((tag) => [tag.key, tag.value]));
    const actualService = trace.processes?.[span.processID]?.serviceName ?? service;
    return {
      service: actualService,
      traceId: span.traceID,
      spanId: span.spanID,
      operationName: span.operationName,
      correlation: tags['fel.correlation_id'] ?? tags['fluent.run.correlation_id'] ?? null,
    };
  })).filter((span) => span.service === service);
}

async function waitForJourneySpans() {
  let spans = [];
  for (let attempt = 0; attempt < 24; attempt += 1) {
    spans = [...await jaegerSpans('learning-api'), ...await jaegerSpans('fluent-task-runtime')]
      .filter((span) => span.correlation === correlationId);
    const operations = new Set(spans.map((span) => span.operationName));
    const routeSeen = [...operations].some((operation) => operation.includes('/api/learner/route-context'));
    const runSeen = [...operations].some((operation) => operation.includes('/api/labs/:labId/run'));
    const runtimeSeen = operations.has('task.run');
    if (routeSeen && runSeen && runtimeSeen) return spans;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return spans;
}

async function main() {
  const beforeSergey = await progress('sergey');
  const beforeSergeyStable = stableProgressProjection(beforeSergey);
  const beforeMetrics = await metrics();

  const routePath = `/practice/lab/${taskId}`;
  const route = await request(apiUrl, `/api/learner/route-context?path=${encodeURIComponent(routePath)}`, {
    headers: {
      'x-fel-profile': syntheticProfile,
      'x-correlation-id': correlationId,
    },
  });
  assert(route.response.ok && route.body, `route context returned HTTP ${route.response.status}`);
  assert(route.body.resource?.id === taskId, 'route context resolved the wrong task');
  assert(route.body.resource?.taskFamilyKey === taskFamilyKey, 'route context family binding drifted');
  assert(route.body.resource?.revision === revision, 'route context revision drifted');
  assert(route.body.readiness?.label === 'ready', 'route context is not ready');
  assert(route.body.allowedActions?.includes('run'), 'route context does not allow run');

  const run = await request(apiUrl, `/api/labs/${taskId}/run`, {
    method: 'POST',
    timeoutMs: 40_000,
    headers: {
      'content-type': 'application/json',
      'x-fel-profile': syntheticProfile,
      'x-correlation-id': correlationId,
      'x-fel-session-started-at': String(Date.now() - 1_200),
    },
    body: JSON.stringify({
      prediction: '',
      revision,
      taskFamilyKey,
      files: { 'rate-limiter.js': rateLimiterSource },
      idempotencyKey,
    }),
  });
  assert(run.response.ok && run.body, `run returned HTTP ${run.response.status}`);
  assert(run.body.results?.status === 'pass', 'released runtime task did not pass');
  const tests = Array.isArray(run.body.results?.tests) ? run.body.results.tests : [];
  assert(tests.length > 0 && tests.every((test) => test.status === 'pass'), 'runtime test summaries are not all passing');

  const afterMetrics = await metrics();
  assert(afterMetrics.firstRunCount >= beforeMetrics.firstRunCount + 1, 'first-run timing histogram did not increment');

  const afterSergey = await progress('sergey');
  const afterSergeyStable = stableProgressProjection(afterSergey);
  const beforeSergeyHash = sha256(beforeSergeyStable);
  const afterSergeyHash = sha256(afterSergeyStable);
  assert(beforeSergeyHash === afterSergeyHash, 'synthetic journey changed Sergey progress');

  const spans = [...new Map((await waitForJourneySpans()).map((span) => [`${span.service}:${span.spanId}`, span])).values()];
  const operations = [...new Set(spans.map((span) => span.operationName))].sort();
  const routeSpans = spans.filter((span) => span.operationName.includes('/api/learner/route-context'));
  const runSpans = spans.filter((span) => span.operationName.includes('/api/labs/:labId/run'));
  const runtimeSpans = spans.filter((span) => span.operationName === 'task.run');
  assert(routeSpans.length > 0, 'Jaeger route-context span missing');
  assert(runSpans.length > 0, 'Jaeger lab-run span missing');
  assert(runtimeSpans.length > 0, 'Jaeger Task Runtime task.run span missing');
  const runTraceIds = new Set(runSpans.map((span) => span.traceId));
  assert(runtimeSpans.some((span) => runTraceIds.has(span.traceId)), 'route run and runtime spans do not share a trace');

  const report = {
    reportVersion: 'w16-observability-journey.v1',
    generatedAt: new Date().toISOString(),
    task: { taskId, taskFamilyKey, revision, execution: 'workspace' },
    correlationId,
    route: {
      status: route.response.status,
      resourceId: route.body.resource.id,
      readiness: route.body.readiness.label,
      runAllowed: route.body.allowedActions.includes('run'),
    },
    run: {
      status: run.response.status,
      result: run.body.results.status,
      testCount: tests.length,
      passedTestCount: tests.filter((test) => test.status === 'pass').length,
    },
    firstRunTiming: {
      beforeCount: beforeMetrics.firstRunCount,
      afterCount: afterMetrics.firstRunCount,
      delta: afterMetrics.firstRunCount - beforeMetrics.firstRunCount,
    },
    syntheticIsolation: {
      profile: 'disposable',
      beforeSergeyHash,
      afterSergeyHash,
      unchanged: beforeSergeyHash === afterSergeyHash,
    },
    jaeger: {
      services: [...new Set(spans.map((span) => span.service))].sort(),
      routeSpanCount: routeSpans.length,
      runSpanCount: runSpans.length,
      runtimeSpanCount: runtimeSpans.length,
      sharedTraceCount: [...new Set(runtimeSpans.filter((span) => runTraceIds.has(span.traceId)).map((span) => span.traceId))].length,
      operations,
      spanIds: spans.map(({ traceId, spanId, service, operationName }) => ({ traceId, spanId, service, operationName })),
    },
    valid: true,
  };
  const markdown = [
    '# W16 — route → run → trace continuity',
    '',
    `Снимок: ${report.generatedAt}`,
    `Статус: **${report.valid ? 'pass' : 'fail'}**`,
    '',
    '| Proof | Result |',
    '| --- | --- |',
    `| Learner route context | HTTP ${report.route.status}; ${report.route.resourceId}; ready; run allowed |`,
    `| Released runtime run | HTTP ${report.run.status}; ${report.run.result}; ${report.run.passedTestCount}/${report.run.testCount} tests pass |`,
    `| First-run timing | histogram delta ${report.firstRunTiming.delta} |`,
    `| Sergey isolation | ${report.syntheticIsolation.unchanged ? 'unchanged' : 'CHANGED'} stable projection hash |`,
    `| Jaeger continuity | ${report.jaeger.services.join(' + ')}; shared trace count ${report.jaeger.sharedTraceCount} |`,
    '',
    'The run used a disposable synthetic learner profile. Evidence contains bounded statuses, counts, hashes and trace identities only; it does not contain source, hidden tests, answers, or learner profile identifiers.',
    '',
  ].join('\n');
  await mkdir(path.dirname(output), { recursive: true });
  await mkdir(path.dirname(markdownOutput), { recursive: true });
  await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
  await writeFile(markdownOutput, markdown);
  console.log(JSON.stringify({ valid: report.valid, output, markdown: markdownOutput, route: report.route, run: report.run, firstRunTiming: report.firstRunTiming, syntheticIsolation: report.syntheticIsolation, jaeger: report.jaeger }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
