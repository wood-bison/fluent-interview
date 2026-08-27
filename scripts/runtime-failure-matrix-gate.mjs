#!/usr/bin/env node

/**
 * W11 runtime failure matrix.
 *
 * This is a live, read-only-with-respect-to-Lab smoke: it submits disposable
 * task runs to Task Runtime only. It never calls a Lab progress endpoint and
 * it records hashes/typed verdicts rather than learner source. The matrix is
 * deliberately small but exercises the boundary a learner depends on:
 * passing code, an assertion failure, a compile/load failure, a wall-clock
 * timeout, and the resource/isolation policy enforced by Docker args.
 */
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const runtimeRoot = path.join(root, 'fluent-task-runtime');
const runtimeUrl = (process.env.RUNTIME_API_URL ?? 'http://127.0.0.1:48227').replace(/\/$/u, '');
const jaegerApiUrl = (process.env.JAEGER_API_URL ?? 'http://127.0.0.1:56686/api/traces').replace(/\/$/u, '');
const jaegerLookback = process.env.JAEGER_TRACE_LOOKBACK ?? '10m';
const jaegerLimit = Number(process.env.JAEGER_TRACE_LIMIT ?? 20);
const jaegerRequestTimeoutMs = Number(process.env.JAEGER_TRACE_TIMEOUT_MS ?? 5_000);
const outArg = process.argv.find((value) => value.startsWith('--out='));
const out = outArg
  ? path.resolve(root, outArg.slice('--out='.length))
  : path.join(root, 'docs/verification/two-audit-remediation/W11/runtime-failure-matrix.json');
const markdownOut = out.replace(/\.json$/u, '.md');
const timeoutMs = Number(process.env.RUNTIME_FAILURE_MATRIX_TIMEOUT_MS ?? 40_000);
const rows = [];

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function record(id, status, detail, extra = {}) {
  const row = { id, status, ...(detail ? { detail } : {}), ...extra };
  rows.push(row);
  console.log(`${status === 'pass' ? 'PASS' : status === 'warn' ? 'WARN' : 'FAIL'} ${id}${detail ? ` — ${detail}` : ''}`);
  return status === 'pass';
}

async function jsonRequest(url, options = {}) {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(timeoutMs) });
  const text = await response.text();
  let body = null;
  try { body = JSON.parse(text); } catch { /* reported by the caller */ }
  return { response, body, text };
}

async function workspace(taskId, revision = 1) {
  const result = await jsonRequest(`${runtimeUrl}/v1/tasks/${encodeURIComponent(taskId)}/workspace?revision=${revision}`);
  if (!result.response.ok || !result.body?.starterFiles) {
    throw new Error(`workspace ${taskId}@${revision} unavailable: HTTP ${result.response.status}`);
  }
  return result.body;
}

async function checkRevisionRequired(taskId) {
  try {
    const result = await jsonRequest(`${runtimeUrl}/v1/tasks/${encodeURIComponent(taskId)}/workspace`);
    const ok = result.response.status === 400 && result.body?.code === 'revision_required';
    record(
      'missing-revision-rejected',
      ok ? 'pass' : 'fail',
      ok
        ? `HTTP 400 revision_required for ${taskId}`
        : `expected HTTP 400 revision_required, received HTTP ${result.response.status} ${result.body?.code ?? 'non-json'}`,
      { taskId, httpStatus: result.response.status, observedCode: result.body?.code ?? null },
    );
    return ok;
  } catch (error) {
    record('missing-revision-rejected', 'fail', error instanceof Error ? error.message : String(error), { taskId });
    return false;
  }
}

async function runCase(id, taskId, files, expected) {
  const correlationId = `audit-failure-${id}-${Date.now().toString(36)}`;
  const request = {
    taskId,
    taskRevision: 1,
    files,
    locale: 'en',
    correlationId,
  };
  let result;
  try {
    result = await jsonRequest(`${runtimeUrl}/v1/runs`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-request-id': correlationId },
      body: JSON.stringify(request),
    });
  } catch (error) {
    record(id, 'fail', error instanceof Error ? error.message : String(error), { taskId });
    return null;
  }
  const body = result.body;
  const observedStatus = body?.results?.status ?? body?.code ?? null;
  const correlationMatches = expected.requiresCorrelation === false
    ? true
    : body?.correlationId === correlationId;
  const expectedStatus = expected.resultsStatus ?? null;
  const httpMatches = expected.httpStatus === undefined || result.response.status === expected.httpStatus;
  const statusMatches = expectedStatus === null || observedStatus === expectedStatus;
  const tests = Array.isArray(body?.results?.tests) ? body.results.tests : [];
  const hasFailedTest = tests.some((test) => test?.status === 'fail');
  const noPrivateLeakage = ![result.text, body?.results?.message, body?.stderr, body?.stdout]
    .filter((value) => typeof value === 'string')
    .some((value) => /\/hidden-tests(?:\/|$)|(?:^|[\\/])(?:check\.sh|[^\s/]+\.test\.m?js)(?::|$)/iu.test(value));
  const detail = [
    `HTTP ${result.response.status}`,
    `status=${observedStatus ?? 'none'}`,
    `duration=${typeof body?.durationMs === 'number' ? `${body.durationMs.toFixed(0)}ms` : 'n/a'}`,
  ].join(', ');
  const ok = httpMatches && statusMatches && correlationMatches && noPrivateLeakage && (!expected.requiresFailedTest || hasFailedTest);
  record(id, ok ? 'pass' : 'fail', ok ? detail : `${detail}; correlation=${correlationMatches}; privateLeakage=${!noPrivateLeakage}`, {
    taskId,
    correlationId,
    httpStatus: result.response.status,
    observedStatus,
    expectedStatus,
    correlationMatches,
    noPrivateLeakage,
    testCount: tests.length,
    sourceDigest: sha256(Object.values(files).join('\n')),
    durationMs: body?.durationMs ?? null,
  });
  return { result, body, correlationId, taskId, taskRevision: request.taskRevision };
}

async function checkTraceIdentity(run) {
  if (!run?.correlationId) {
    record('trace-evidence-identity', 'fail', 'the pass run did not return a correlation id');
    return false;
  }
  let lastDetail = 'trace was not exported';
  const traceQuery = new URL(jaegerApiUrl);
  traceQuery.searchParams.set('service', 'fluent-task-runtime');
  traceQuery.searchParams.set('lookback', jaegerLookback);
  traceQuery.searchParams.set('limit', String(Number.isFinite(jaegerLimit) && jaegerLimit > 0 ? jaegerLimit : 20));
  // Correlation ids are unique per disposable run.  Filtering at the Jaeger
  // query boundary keeps this gate deterministic even when the shared in-
  // memory store contains many newer readiness/metrics spans; fetching a
  // small “latest N” page and hoping the target is present is not a proof.
  traceQuery.searchParams.set('tag', `fluent.run.correlation_id:${run.correlationId}`);
  for (let attempt = 0; attempt < 12; attempt += 1) {
    try {
      const response = await fetch(traceQuery, {
        signal: AbortSignal.timeout(jaegerRequestTimeoutMs),
      });
      const payload = await response.json();
      const trace = (Array.isArray(payload?.data) ? payload.data : []).find((candidate) =>
        candidate.spans?.some((span) => span.tags?.some((tag) => tag.key === 'fluent.run.correlation_id' && tag.value === run.correlationId)),
      );
      if (trace) {
        const spans = Array.isArray(trace.spans) ? trace.spans : [];
        const runSpan = spans.find((span) => span.operationName === 'task.run');
        const tags = Object.fromEntries((runSpan?.tags ?? []).map((tag) => [tag.key, tag.value]));
        const ok = trace.traceID
          && runSpan
          && tags['fluent.run.correlation_id'] === run.correlationId
          && tags['fluent.task.id'] === run.taskId
          && Number(tags['fluent.task.revision']) === Number(run.taskRevision);
        const detail = ok
          ? `trace ${trace.traceID} contains task.run with correlation, task and revision identity`
          : `trace ${trace.traceID} is missing correlation/task/revision identity`;
        record('trace-evidence-identity', ok ? 'pass' : 'fail', detail, {
          correlationId: run.correlationId,
          traceId: trace.traceID,
          spanCount: spans.length,
        });
        return ok;
      }
      lastDetail = `no trace for ${run.correlationId} after attempt ${attempt + 1}`;
    } catch (error) {
      lastDetail = error instanceof Error ? error.message : String(error);
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  record('trace-evidence-identity', 'fail', lastDetail, { correlationId: run.correlationId });
  return false;
}

function resourcePolicyTests() {
  const env = { ...process.env, GOTOOLCHAIN: 'local', NO_COLOR: '1' };
  const command = ['run', '--rm', '-v', `${runtimeRoot}:/src`, '-w', '/src', 'golang:1.24', 'go', 'test', './internal/engine', '-run', '^TestDockerArgsEnforceResourceAndIsolationLimits$'];
  const result = spawnSync('docker', command, {
    cwd: root,
    env,
    encoding: 'utf8',
    timeout: 120_000,
    maxBuffer: 8 * 1024 * 1024,
  });
  const ok = result.status === 0 && !result.error;
  return record('resource-and-isolation-policy', ok ? 'pass' : 'fail', ok ? 'memory/cpu/PID/network/read-only policy assertions pass' : (result.stderr || result.stdout || String(result.error)).slice(-2000), {
    command: `docker ${command.join(' ')}`,
  });
}

const failures = [];
try {
  if (!(await checkRevisionRequired('node-rate-limiter-001'))) failures.push('missing-revision-rejected');
  const rate = await workspace('node-rate-limiter-001');
  const calculator = await workspace('fluent-calculator');
  const goRate = await workspace('go-rate-limiter-001');
  const javaRate = await workspace('java-rate-limiter-001');
  const csharpRate = await workspace('csharp-rate-limiter-001');
  const postgresRate = await workspace('pg-rate-limiter-001');
  const starter = rate.starterFiles['rate-limiter.js'];
  const correct = starter.replace(
    /    \/\/ TODO:[\s\S]*?    return false;\n/u,
    "    let bucket = this.buckets.get(key);\n    const now = this.now();\n    if (!bucket) { bucket = { tokens: this.capacity, at: now }; this.buckets.set(key, bucket); }\n    const elapsed = Math.max(0, now - bucket.at);\n    bucket.tokens = Math.min(this.capacity, bucket.tokens + elapsed * this.refillPerSecond / 1000);\n    bucket.at = now;\n    if (bucket.tokens < 1) return false;\n    bucket.tokens -= 1;\n    return true;\n",
  );
  const pass = await runCase('pass', 'node-rate-limiter-001', { 'rate-limiter.js': correct }, { httpStatus: 200, resultsStatus: 'pass' });
  if (!pass || pass.body?.results?.status !== 'pass') failures.push('pass');

  const profilePasses = [
    ['go-pass', 'go-rate-limiter-001', 'main.go', `package main\n\nimport "time"\n\ntype bucket struct { tokens float64; last time.Time }\ntype RateLimiter struct { capacity int; refill float64; buckets map[string]bucket }\nfunc NewRateLimiter(capacity int, refillPerSecond float64) *RateLimiter { return &RateLimiter{capacity: capacity, refill: refillPerSecond, buckets: map[string]bucket{}} }\nfunc (r *RateLimiter) Allow(key string, now time.Time) bool { b, ok := r.buckets[key]; if !ok { b = bucket{tokens: float64(r.capacity), last: now} }; elapsed := now.Sub(b.last).Seconds(); if elapsed > 0 { b.tokens += elapsed * r.refill; if b.tokens > float64(r.capacity) { b.tokens = float64(r.capacity) } }; b.last = now; if b.tokens < 1 { r.buckets[key] = b; return false }; b.tokens--; r.buckets[key] = b; return true }\nfunc main() {}`],
    ['java-pass', 'java-rate-limiter-001', 'RateLimiter.java', `import java.time.Instant;\nimport java.util.HashMap;\nimport java.util.Map;\n\npublic final class RateLimiter {\n  private static final class Bucket { double tokens; Instant last; Bucket(double tokens, Instant last) { this.tokens = tokens; this.last = last; } }\n  private final int capacity; private final double refillPerSecond; private final Map<String, Bucket> buckets = new HashMap<>();\n  public RateLimiter(int capacity, double refillPerSecond) { this.capacity = capacity; this.refillPerSecond = refillPerSecond; }\n  public boolean allow(String key, Instant now) { Bucket bucket = buckets.get(key); if (bucket == null) { bucket = new Bucket(capacity, now); buckets.put(key, bucket); } long millis = now.toEpochMilli() - bucket.last.toEpochMilli(); if (millis > 0) { bucket.tokens = Math.min(capacity, bucket.tokens + millis * refillPerSecond / 1000.0); } bucket.last = now; if (bucket.tokens < 1) return false; bucket.tokens -= 1; return true; }\n}`],
    ['csharp-pass', 'csharp-rate-limiter-001', 'RateLimiter.cs', `using System;\nusing System.Collections.Generic;\n\npublic sealed class RateLimiter\n{\n    private sealed class Bucket { public double Tokens; public DateTimeOffset Last; public Bucket(double tokens, DateTimeOffset last) { Tokens = tokens; Last = last; } }\n    private readonly int capacity; private readonly double refillPerSecond; private readonly Dictionary<string, Bucket> buckets = new();\n    public RateLimiter(int capacity, double refillPerSecond) { this.capacity = capacity; this.refillPerSecond = refillPerSecond; }\n    public bool Allow(string key, DateTimeOffset now) { if (!buckets.TryGetValue(key, out var bucket)) { bucket = new Bucket(capacity, now); buckets[key] = bucket; } var elapsed = (now - bucket.Last).TotalSeconds; if (elapsed > 0) bucket.Tokens = Math.Min(capacity, bucket.Tokens + elapsed * refillPerSecond); bucket.Last = now; if (bucket.Tokens < 1) return false; bucket.Tokens -= 1; return true; }\n}`],
    ['postgres-pass', 'pg-rate-limiter-001', 'solution.sql', `CREATE OR REPLACE FUNCTION allow_request(p_client_id text, p_at timestamptz, p_max_requests integer, p_window_seconds integer) RETURNS boolean LANGUAGE plpgsql AS $$\nDECLARE allowed boolean;\nBEGIN\n  PERFORM pg_advisory_xact_lock(hashtextextended(p_client_id, 0));\n  SELECT count(*) < p_max_requests INTO allowed FROM rate_limit_events WHERE client_id = p_client_id AND occurred_at >= p_at - make_interval(secs => p_window_seconds) AND occurred_at < p_at;\n  IF allowed THEN INSERT INTO rate_limit_events(client_id, occurred_at) VALUES (p_client_id, p_at); END IF;\n  RETURN allowed;\nEND;\n$$;`],
  ];
  for (const [id, taskId, file, source] of profilePasses) {
    const result = await runCase(id, taskId, { [file]: source }, { httpStatus: 200, resultsStatus: 'pass' });
    if (!result || result.body?.results?.status !== 'pass') failures.push(id);
  }

  const testFailure = await runCase('test-failure', 'node-rate-limiter-001', {
    'rate-limiter.js': "'use strict'; module.exports = { RateLimiter: class { allow() { return true; } } };",
  }, { httpStatus: 200, resultsStatus: 'fail', requiresFailedTest: true });
  if (!testFailure || testFailure.body?.results?.status !== 'fail') failures.push('test-failure');

  const compileFailure = await runCase('compile-failure', 'node-rate-limiter-001', {
    'rate-limiter.js': "module.exports = { RateLimiter: class { allow( { };",
  }, { httpStatus: 200, resultsStatus: 'error' });
  if (!compileFailure || compileFailure.body?.results?.status !== 'error') failures.push('compile-failure');

  const timeout = await runCase('timeout', 'fluent-calculator', {
    'calculator.js': `${calculator.starterFiles['calculator.js']}\nwhile (true) {}`,
  }, { httpStatus: 504, resultsStatus: null, requiresCorrelation: false });
  if (!timeout || timeout.body?.code !== 'timeout') failures.push('timeout');
  if (!(await checkTraceIdentity(pass))) failures.push('trace-evidence-identity');
} catch (error) {
  record('matrix-setup', 'fail', error instanceof Error ? error.message : String(error));
  failures.push('matrix-setup');
}

if (!resourcePolicyTests()) failures.push('resource-and-isolation-policy');

const report = {
  reportVersion: 'runtime-failure-matrix-gate.v1',
  generatedAt: new Date().toISOString(),
  runtimeUrl,
  valid: failures.length === 0,
  status: failures.length === 0 ? 'pass' : 'blocked',
  cases: rows,
  failures,
  notes: [
    'Runs are disposable Task Runtime executions; Lab progress is not touched.',
    'Source is represented by SHA-256 only; private tests and answers are never persisted.',
    'Resource policy is proven by the engine unit test that inspects Docker arguments; no destructive OOM probe is used.',
  ],
};
mkdirSync(path.dirname(out), { recursive: true });
writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
const markdown = [
  '# Runtime failure matrix',
  '',
  `- Status: **${report.valid ? 'PASS' : 'BLOCKED'}**`,
  `- Generated: ${report.generatedAt}`,
  `- Runtime: ${runtimeUrl}`,
  '',
  'The matrix submits only disposable runtime runs. It does not write Lab progress, and source is recorded as a digest.',
  '',
  '## Cases',
  '',
  ...rows.map((item) => `- ${item.status === 'pass' ? '[x]' : '[ ]'} ${item.id}: ${item.detail ?? '—'}`),
  '',
  report.valid ? 'All exact-revision, cross-profile verdict, timeout, trace identity, redaction, and resource policy checks passed.' : `Blocked cases: ${failures.join(', ')}`,
  '',
].join('\n');
writeFileSync(markdownOut, markdown, 'utf8');
console.log(JSON.stringify({ valid: report.valid, failures, output: out, markdown: markdownOut }, null, 2));
if (!report.valid) process.exitCode = 1;
