#!/usr/bin/env node

/**
 * W17-006..008 — negative runtime/release boundary checks.
 *
 * The probes are deliberately read-only.  The retry/idempotency/timeout
 * contract is exercised by the owner HTTP/unit fixtures; no learner progress
 * or live run is created by this gate.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const labRoot = path.join(root, 'fluent-engineering-lab');
const brainUrl = (process.env.BRAIN_API_URL ?? 'http://127.0.0.1:48127').replace(/\/$/u, '');
const runtimeUrl = (process.env.RUNTIME_API_URL ?? 'http://127.0.0.1:48227').replace(/\/$/u, '');
const labUrl = (process.env.LEARNING_API_URL ?? 'http://127.0.0.1:47000').replace(/\/$/u, '');
const check = process.argv.includes('--check');
const rows = [];

function row(id, status, detail, extra = {}) {
  const entry = { id, status, ...(detail ? { detail } : {}), ...extra };
  rows.push(entry);
  console.log(`${status === 'pass' ? 'PASS' : 'FAIL'} ${id}${detail ? ` — ${detail}` : ''}`);
  return status === 'pass';
}

async function probe(id, url, expectedStatus, expectedCode) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5_000) });
    const text = await response.text();
    let body = null;
    try { body = JSON.parse(text); } catch { /* diagnostics below */ }
    const code = body?.code ?? body?.error?.code ?? null;
    const ok = response.status === expectedStatus && (!expectedCode || code === expectedCode);
    return row(id, ok ? 'pass' : 'fail', ok ? undefined : `HTTP ${response.status}, code=${code ?? 'none'}`, {
      url,
      httpStatus: response.status,
      code,
    });
  } catch (error) {
    return row(id, 'fail', String(error?.message ?? error), { url });
  }
}

function ownerContractTests() {
  const env = { ...process.env, NX_DAEMON: 'false', NO_COLOR: '1' };
  delete env.FORCE_COLOR;
  const args = [
    'exec', 'nx', 'test', 'learning-api', '--skip-nx-cache', '--runInBand',
    '--testPathPatterns=attempt.coordinator.spec.ts|code-workspace.recovery.http.spec.ts|task-runtime-workspace.client.spec.ts|labs.controller.spec.ts',
  ];
  const result = spawnSync('pnpm', args, {
    cwd: labRoot,
    env,
    encoding: 'utf8',
    timeout: 180_000,
    maxBuffer: 32 * 1024 * 1024,
  });
  const ok = result.status === 0 && !result.error;
  return row('owner-retry-idempotency-timeout-tests', ok ? 'pass' : 'fail', ok ? undefined : (result.stderr || result.stdout || String(result.error)).slice(-4000), {
    command: `pnpm ${args.join(' ')}`,
    tests: '54 targeted tests',
  });
}

const invalidRelease = await probe(
  'invalid-release-id-rejected',
  `${brainUrl}/v1/graph/releases/w17-invalid-release-id`,
  404,
);
const staleRevision = await probe(
  'stale-runtime-revision-rejected',
  `${runtimeUrl}/v1/tasks/node-event-loop-001/workspace?revision=999999`,
  404,
  'unknown_task',
);
const malformedRevision = await probe(
  'invalid-runtime-revision-rejected',
  `${runtimeUrl}/v1/tasks/node-event-loop-001/workspace?revision=0`,
  400,
  'invalid_request',
);
const mismatchedFamily = await probe(
  'mismatched-task-family-refused',
  `${labUrl}/api/labs/node-event-loop-001/workspace?revision=1&taskFamily=task-family.rate-limiter`,
  502,
  'runner.protocol',
);
const ownerTests = ownerContractTests();

const failures = rows.filter((entry) => entry.status === 'fail');
const report = {
  reportVersion: 'runtime-boundary-gate.v1',
  generatedAt: new Date().toISOString(),
  valid: failures.length === 0,
  status: failures.length === 0 ? 'pass' : 'fail',
  contracts: {
    invalidRelease: invalidRelease,
    staleRevision: staleRevision,
    malformedRevision: malformedRevision,
    mismatchedFamily: mismatchedFamily,
    retryIdempotencyTimeout: ownerTests,
  },
  checks: rows,
};
const out = path.join(root, 'docs/verification/two-audit-remediation/W17/runtime-boundary.json');
mkdirSync(path.dirname(out), { recursive: true });
writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (check && failures.length > 0) process.exitCode = 1;
