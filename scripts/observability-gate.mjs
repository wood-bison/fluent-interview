#!/usr/bin/env node

/**
 * W16 — observability contract and topology gate.
 *
 * This gate is deliberately split into a deterministic source check and an
 * optional live probe.  A source check can run in a clean checkout without
 * Docker; a live probe is useful only when the development profile is
 * already running.  Optional collector endpoints are reported as warnings,
 * never treated as proof that a collector is healthy when it was not started.
 * `--check` fails only for contract/topology violations.  No command here
 * starts, stops, prunes, or mutates a service.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.resolve(process.env.OBSERVABILITY_GATE_JSON ?? 'docs/verification/two-audit-remediation/W16/observability.json');
const markdownOutput = path.resolve(process.env.OBSERVABILITY_GATE_MD ?? 'docs/verification/two-audit-remediation/W16/observability.md');
const check = process.argv.includes('--check');
const live = process.argv.includes('--live');
const tests = process.argv.includes('--tests');

const failures = [];
const warnings = [];
const staticChecks = [];
const liveChecks = [];

const journeyEvidencePath = path.resolve(
  process.env.OBSERVABILITY_JOURNEY_JSON ??
    'docs/verification/two-audit-remediation/W16/jaeger-continuity.json',
);
let journeyEvidence = null;
try {
  journeyEvidence = JSON.parse(await readFile(journeyEvidencePath, 'utf8'));
} catch {
  // The source gate can run from a clean checkout before live evidence exists.
}

async function source(relative) {
  const file = path.join(root, relative);
  try {
    return { file, relative, text: await readFile(file, 'utf8') };
  } catch (error) {
    failures.push({ code: 'missing-source', file: relative, detail: String(error?.message ?? error) });
    return { file, relative, text: '' };
  }
}

function has(id, text, patterns, detail = undefined) {
  const missing = patterns.filter((pattern) => !pattern.test(text));
  const row = { id, status: missing.length ? 'fail' : 'pass', missing, ...(detail ? { detail } : {}) };
  staticChecks.push(row);
  if (missing.length) failures.push({ code: id, detail: missing.map(String) });
  return missing.length === 0;
}

function warns(id, condition, detail) {
  const row = { id, status: condition ? 'pass' : 'warn', ...(detail ? { detail } : {}) };
  staticChecks.push(row);
  if (!condition) warnings.push({ code: id, detail });
  return condition;
}

function liveRow(id, url, status, detail = undefined, required = true) {
  const row = { id, url, status, required, ...(detail ? { detail } : {}) };
  liveChecks.push(row);
  if (status === 'fail' && required) failures.push({ code: id, detail: detail ?? `GET ${url} failed` });
  if (status === 'offline' || (status === 'fail' && !required)) warnings.push({ code: id, detail: detail ?? `GET ${url} unavailable` });
  return row;
}

const contract = await source('fluent-engineering-lab/libs/observability/src/lib/observability-contract.ts');
const metrics = await source('fluent-engineering-lab/libs/observability/src/lib/metrics.ts');
const tracing = await source('fluent-engineering-lab/libs/observability/src/lib/tracing.ts');
const logging = await source('fluent-engineering-lab/libs/observability/src/lib/logging.ts');
const retention = await source('fluent-engineering-lab/libs/observability/src/lib/retention.ts');
const replay = await source('fluent-engineering-lab/libs/observability/src/lib/replay.ts');
const labMain = await source('fluent-engineering-lab/apps/learning-api/src/main.ts');
const labTraceBootstrap = await source('fluent-engineering-lab/apps/learning-api/src/tracing.bootstrap.ts');
const labMetricsModule = await source('fluent-engineering-lab/apps/learning-api/src/app/observability/metrics.module.ts');
const studioController = await source('fluent-engineering-lab/apps/learning-api/src/app/observability/studio-observability.controller.ts');
const studioOperator = await source('fluent-engineering-lab/apps/learning-api/src/app/observability/operator.service.ts');
const aiTelemetry = await source('fluent-engineering-lab/apps/learning-api/src/app/ai/ai-telemetry.service.ts');
const aiCompanion = await source('fluent-engineering-lab/apps/learning-api/src/app/ai/ai-companion.service.ts');
const attemptCoordinator = await source('fluent-engineering-lab/apps/learning-api/src/app/attempt.coordinator.ts');
const routeContext = await source('fluent-engineering-lab/apps/learning-api/src/app/learner-route-context/learner-route-context.service.ts');
const labController = await source('fluent-engineering-lab/apps/learning-api/src/app/labs.controller.ts');
const apiClient = await source('fluent-engineering-vue/packages/api-client/src/index.ts');
const runtimeTelemetry = await source('fluent-task-runtime/internal/telemetry/telemetry.go');
const runtimeHTTP = await source('fluent-task-runtime/internal/httpapi/server.go');
const brainTelemetry = await source('fluent-question-brain/internal/telemetry/telemetry.go');
const brainMain = await source('fluent-question-brain/cmd/question-brain/main.go');
const labCompose = await source('fluent-engineering-lab/docker-compose.yml');
const prometheus = await source('fluent-engineering-lab/internals/observability/prometheus.yml');
const loki = await source('fluent-engineering-lab/internals/observability/loki.yml');
const promtail = await source('fluent-engineering-lab/internals/observability/promtail.yml');
const datasources = await source('fluent-engineering-lab/internals/observability/grafana/provisioning/datasources/datasources.yml');
const dashboard = await source('fluent-engineering-lab/internals/observability/grafana/dashboards/fel-golden-signals.json');

has('contract-version', contract.text, [/OBSERVABILITY_CONTRACT_VERSION\s*=\s*'observability\.v1'/u]);
has('service-vocabulary', contract.text, [
  /'learning-api'/u, /'task-runtime'/u, /'web'/u, /'observability-stack'/u,
]);
has('operation-vocabulary', contract.text, [
  /'http\.request'/u, /'lab\.run'/u, /'health\.readiness'/u,
  /'metrics\.scrape'/u, /'trace\.export'/u, /'ai\.advisory'/u,
  /'studio\.diagnostics'/u, /'replay\.reconstruct'/u,
]);
has('bounded-retention', `${contract.text}\n${retention.text}\n${replay.text}`, [
  /aggregateMetricsDays:\s*7/u, /structuredLogsDays:\s*7/u,
  /redactedTraceHours:\s*24/u, /replayArtifactHours:\s*24/u,
  /learnerProjectionHours:\s*0/u, /maxLogFileBytes:\s*50_000_000/u,
  /maxReplayLogLines:\s*500/u, /maxReplaySpans:\s*256/u,
  /pruneExpired/u, /boundedReplayRequest/u,
]);
has('forbidden-field-boundary', contract.text, [
  /'answer'/u, /'source'/u, /'prompt'/u, /'profileId'/u, /'userId'/u,
  /'hiddenTests'|hiddenTests/u, /containsForbiddenObservabilityField/u,
  /redactObservabilityLog/u,
]);
has('identity-and-trace-validation', `${contract.text}\n${tracing.text}`, [
  /isCorrelationId/u, /isTraceId/u, /isSpanId/u,
  /CORRELATION_ATTRIBUTE/u, /traceparent|TraceContext/u,
]);
has('bounded-metrics', metrics.text, [
  /collectDefaultMetrics/u, /labelNames:\s*\['kind', 'outcome'\]/u,
  /labelNames:\s*\['state'\]/u, /fel_learner_events_total/u,
  /recordLearnerEvent/u, /recordTimeToFirstRun/u,
  /fel_learner_time_to_first_run_seconds/u, /erroredRunCount/u,
]);
has('build-release-identity', `${contract.text}\n${logging.text}\n${tracing.text}`, [
  /sourceRevision/u, /releaseId/u, /environment/u,
  /observabilityBuildIdentity/u, /fel\.source_revision/u,
]);
has('learner-funnel-taxonomy', `${contract.text}\n${metrics.text}\n${attemptCoordinator.text}\n${routeContext.text}`, [
  /OBSERVABILITY_LEARNER_EVENTS/u, /OBSERVABILITY_LEARNER_OUTCOMES/u,
  /first_run/u, /failed_run/u, /semantic_gate_violation/u,
  /recordLearnerEvent/u, /readiness/u, /cta/u,
]);
has('learning-api-correlation', `${labMain.text}\n${labTraceBootstrap.text}\n${logging.text}`, [
  /correlationMiddleware/u, /startTracing\(\{\s*service:\s*['"]learning-api['"]/u,
  /loggingParams|PinoLogger/u, /CORRELATION_HEADER/u,
]);
has('learning-api-metrics-boundary', labMetricsModule.text, [
  /@Get\('metrics'\)/u, /text\/plain; version=0\.0\.4/u,
  /createServiceMetrics\('learning-api'\)/u,
]);
has('studio-redacted-boundary', `${studioController.text}\n${studioOperator.text}`, [
  /UseGuards\(StudioBoundaryGuard\)/u, /redacted-only/u,
  /rawSpans: 'refused'/u, /learnerData: 'never-retained'/u,
  /private, no-store/u,
]);
has('ai-telemetry', `${aiTelemetry.text}\n${aiCompanion.text}`, [
  /conversationId/u, /firstToken\(/u, /latencyTotalMs/u,
  /correlatedConversations/u, /ai\.latency\.samples/u,
  /telemetry\.complete/u, /telemetry\.event/u,
]);
has('runtime-trace-boundary', `${runtimeTelemetry.text}\n${runtimeHTTP.text}`, [
  /service\.name/u, /service\.version/u, /propagation\.TraceContext/u,
  /GetTextMapPropagator\(\)\.Extract/u, /fluent\.run\.correlation_id/u,
]);
has('brain-trace-and-metrics', `${brainTelemetry.text}\n${brainMain.text}`, [
  /service\.name|ServiceName/u, /service\.version|ServiceVersion/u, /deployment\.environment/u,
  /MetricsHandler\(\)/u, /HTTP\(rootHandler\)/u,
]);
has('collector-topology', labCompose.text, [
  /prometheus:/u, /loki:/u, /promtail:/u, /grafana:/u,
  /profiles:\s*\['observability'\]/gu,
]);
has('collector-pins-and-bounds', labCompose.text, [
  /prom\/prometheus:[^\s@]+@sha256:/u, /grafana\/loki:[^\s@]+@sha256:/u,
  /grafana\/promtail:[^\s@]+@sha256:/u, /grafana\/grafana:[^\s@]+@sha256:/u,
  /storage\.tsdb\.retention\.time=7d/u, /max-size: "10m"/u,
]);
has('prometheus-scrape-config', prometheus.text, [
  /job_name: learning-api/u, /metrics_path: \/api\/metrics/u,
  /job_name: prometheus/u, /scrape_interval: 5s/u,
]);
has('loki-retention-config', `${loki.text}\n${promtail.text}`, [
  /retention_period: 168h/u, /retention_enabled: true/u,
  /loki\/api\/v1\/push/u, /service:/u, /level:/u,
]);
has('grafana-provisioning', `${datasources.text}\n${dashboard.text}`, [
  /name: Prometheus/u, /name: Loki/u, /name: Jaeger/u,
  /fel-golden-signals/u, /correlationId/u,
]);

// Keep these as explicit promotion decisions even when the local development
// profile is healthy. A direct metrics endpoint is not the same thing as a
// package-owned scrape target, and a timing implementation must not infer a
// session start from run duration.
warns('runtime-metrics-target', /\/metrics|prometheus/u.test(runtimeHTTP.text), 'Task Runtime exposes a bounded Prometheus endpoint; keep its scrape target explicit and cardinality-safe in every promoted profile.');
has('brain-prometheus-target', prometheus.text, [
  /job_name:\s*question-brain/u,
  /metrics_path:\s*\/metrics/u,
  /host\.docker\.internal:48127/u,
]);
warns('learner-funnel-timing', /recordTimeToFirstRun/u.test(`${metrics.text}\n${attemptCoordinator.text}\n${labController.text}\n${apiClient.text}`), 'Time-to-first-run records a bounded browser session marker only after a first run is persisted.');

if (tests) {
  try {
    const commandEnv = { ...process.env, NX_DAEMON: 'false', NO_COLOR: '1' };
    delete commandEnv.FORCE_COLOR;
    execFileSync('pnpm', ['exec', 'nx', 'test', 'observability', '--skip-nx-cache', '--runInBand'], {
      cwd: path.join(root, 'fluent-engineering-lab'),
      env: commandEnv,
      stdio: 'pipe',
      encoding: 'utf8',
      timeout: 180_000,
    });
    staticChecks.push({ id: 'observability-unit-tests', status: 'pass' });
  } catch (error) {
    failures.push({ code: 'observability-unit-tests', detail: String(error?.stderr || error?.stdout || error?.message || error) });
    staticChecks.push({ id: 'observability-unit-tests', status: 'fail' });
  }
}

async function probe(url, id, required = true, expected = undefined, headers = undefined) {
  try {
    const response = await fetch(url, { headers, signal: AbortSignal.timeout(5_000) });
    const body = await response.text();
    const bodyOk = expected ? expected(body, response) : true;
    const status = response.ok && bodyOk ? 'pass' : 'fail';
    liveRow(id, url, status, status === 'fail' ? `HTTP ${response.status}; body contract=${bodyOk}` : undefined, required);
    return { status, response, body };
  } catch (error) {
    liveRow(id, url, 'offline', String(error?.message ?? error), required);
    return { status: 'offline', response: null, body: '' };
  }
}

if (live) {
  await probe('http://127.0.0.1:47000/api/health/ready', 'lab-readiness', true, (body) => /ready|degraded|not_ready/iu.test(body));
  await probe('http://127.0.0.1:47000/api/metrics', 'lab-prometheus-endpoint', true, (body) => /fel_service_readiness|nodejs_eventloop_lag/iu.test(body));
  await probe('http://127.0.0.1:48227/v1/health/ready', 'runtime-readiness', true, (body) => /fluent-task-runtime/iu.test(body));
  await probe('http://127.0.0.1:48227/v1/metrics', 'runtime-prometheus-endpoint', true, (body) => /fel_runtime_http_requests_total|fel_runtime_run_results_total/iu.test(body));
  await probe('http://127.0.0.1:48127/health/ready', 'brain-readiness', true, (body) => /ready|healthy|question/iu.test(body));
  await probe('http://127.0.0.1:48127/metrics', 'brain-prometheus-endpoint', true, (body) => /question_brain_http_requests_total/iu.test(body));
  const studio = await probe(
    'http://127.0.0.1:47000/api/studio/observability',
    'studio-observability',
    true,
    (body) => /studio-observability\.v1|redacted-only|never-retained/iu.test(body),
    { 'x-fel-profile': 'sergey', 'x-fel-surface': 'studio' },
  );
  const forbiddenStudioKey = /"(?:profileId|userId|prompt|answer|source|solution|hiddenTests|privateKey)"\s*:/iu;
  if (studio.status === 'pass' && forbiddenStudioKey.test(studio.body)) {
    liveRow('studio-observability-redaction', 'http://127.0.0.1:47000/api/studio/observability', 'fail', 'forbidden field found in Studio projection', true);
  } else if (studio.status === 'pass') {
    liveRow('studio-observability-redaction', 'http://127.0.0.1:47000/api/studio/observability', 'pass', undefined, true);
  }
  await probe('http://127.0.0.1:49305/api/v1/targets', 'prometheus-targets', true, (body) => {
    const upCount = (body.match(/"health":"up"/gu) ?? []).length;
    return /task-runtime/iu.test(body) && /question-brain/iu.test(body) && upCount >= 2;
  });
  await probe('http://127.0.0.1:49305/-/ready', 'prometheus-collector', false);
  await probe('http://127.0.0.1:49306/ready', 'loki-collector', false);
  const lokiEndNs = BigInt(Date.now()) * 1_000_000n;
  const lokiStartNs = lokiEndNs - 10n * 60n * 1_000_000_000n;
  const lokiQuery = new URL('http://127.0.0.1:49306/loki/api/v1/query_range');
  lokiQuery.searchParams.set('query', '{job="fel"}');
  lokiQuery.searchParams.set('start', String(lokiStartNs));
  lokiQuery.searchParams.set('end', String(lokiEndNs));
  lokiQuery.searchParams.set('limit', '1');
  await probe(lokiQuery.toString(), 'loki-query', false, (body) => /"status":"success"/u.test(body));
  await probe('http://127.0.0.1:49304/api/health', 'grafana-dashboard', false);
  await probe('http://127.0.0.1:49304/api/dashboards/uid/fel-golden-signals', 'grafana-dashboard-projection', false, (body) => /fel-golden-signals|FEL.*golden signals/iu.test(body));
  await probe('http://127.0.0.1:56686/api/services', 'jaeger-trace-explorer', false);
}

const brainTargetReady = staticChecks.some(
  (row) => row.id === 'brain-prometheus-target' && row.status === 'pass',
);
const continuityReady = journeyEvidence?.valid === true &&
  journeyEvidence.jaeger?.sharedTraceCount > 0 &&
  journeyEvidence.jaeger?.routeSpanCount > 0 &&
  journeyEvidence.jaeger?.runSpanCount > 0 &&
  journeyEvidence.jaeger?.runtimeSpanCount > 0;
const syntheticIsolationReady = journeyEvidence?.syntheticIsolation?.unchanged === true;
const openPromotionItems = [
  ...(!live
    ? ['Run live collector probes with the Prometheus/Loki/Jaeger/Grafana profile enabled.']
    : []),
  ...(!continuityReady
    ? ['Capture one golden route → run → trace continuity sample in Jaeger; service discovery alone is not end-to-end proof.']
    : []),
  ...(!brainTargetReady
    ? ['Decide whether Brain should be added as a Prometheus scrape target; keep the decision explicit and cardinality-safe.']
    : []),
  ...(!syntheticIsolationReady
    ? ['Run a synthetic learner journey with the test profile and prove Sergey progress is unchanged before promotion.']
    : []),
];

const report = {
  reportVersion: 'observability-gate.v1',
  generatedAt: new Date().toISOString(),
  mode: live ? (tests ? 'source-and-live-with-tests' : 'source-and-live') : (tests ? 'source-with-tests' : 'source'),
  valid: failures.length === 0,
  status: failures.length === 0 ? (warnings.length ? 'pass-with-warnings' : 'pass') : 'fail',
  staticChecks,
  liveChecks,
  warnings,
  failures,
  promotionEvidence: {
    brainPrometheusTarget: brainTargetReady,
    routeRunTraceContinuity: continuityReady,
    syntheticProgressIsolation: syntheticIsolationReady,
    journeyEvidence: path.relative(root, journeyEvidencePath) || path.basename(journeyEvidencePath),
  },
  supportedSignals: [
    'correlation route → service → run/AI operation',
    'W3C trace identity and redacted replay bounds',
    'Prometheus service/readiness/runtime signals',
    'AI provider/status/latency aggregates without prompt/output',
    'bounded learner funnel and first-run timing without learner labels',
    'Studio-only diagnostics and redacted operator replay',
  ],
  openPromotionItems,
};

const markdown = [
  '# W16 — observability gate',
  '',
  `Снимок: ${report.generatedAt}`,
  `Статус: **${report.status}**` + (live ? ' (source + live)' : ' (source only)'),
  '',
  '| Area | Result |',
  '| --- | --- |',
  `| Static contract/topology | ${staticChecks.filter((row) => row.status === 'pass').length}/${staticChecks.length} checks pass |`,
  `| Live required endpoints | ${liveChecks.filter((row) => row.required && row.status === 'pass').length}/${liveChecks.filter((row) => row.required).length || 0} pass |`,
  `| Optional collectors | ${liveChecks.filter((row) => !row.required && row.status === 'pass').length}/${liveChecks.filter((row) => !row.required).length || 0} online |`,
  `| Privacy failures | ${failures.filter((item) => /redact|forbidden/u.test(item.code)).length ? 'FAIL' : 'PASS'} |`,
  '',
  'The gate proves the shared contract, bounded retention, correlation/tracing seams, AI metadata-only telemetry, and local collector topology. It does not call a missing collector healthy; offline optional endpoints stay explicit warnings.',
  '',
  '## Open promotion items',
  '',
  ...report.openPromotionItems.map((item) => `- ${item}`),
  '',
].join('\n');

await mkdir(path.dirname(output), { recursive: true });
await mkdir(path.dirname(markdownOutput), { recursive: true });
await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
await writeFile(markdownOutput, markdown);
console.log(JSON.stringify({ reportVersion: report.reportVersion, valid: report.valid, status: report.status, staticChecks: staticChecks.length, liveChecks: liveChecks.length, warnings: warnings.length, failures: failures.length, output, markdown: markdownOutput }, null, 2));
if (check && failures.length) process.exitCode = 1;
