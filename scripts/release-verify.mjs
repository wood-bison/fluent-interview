#!/usr/bin/env node

/**
 * Cross-repository release verification.
 *
 * `--dev` is a non-promoting learner check against the live development
 * profile.  The default is strict: it performs the same read-only checks but
 * also requires a clean, pinned five-repository package boundary and a ready
 * packaged Lab before running production hardening.  No command here starts,
 * stops, prunes or resets Docker resources.
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dev = process.argv.includes('--dev');
const outArg = process.argv.find((value) => value.startsWith('--out='));
const out = outArg ? path.resolve(root, outArg.slice('--out='.length)) : null;
// Node treats the mere presence of FORCE_COLOR (including `0`) as an opt-in
// and warns when NO_COLOR is present too.  Keep one deterministic policy for
// every owner command: disable colour via NO_COLOR and remove FORCE_COLOR.
const env = { ...process.env, NX_DAEMON: 'false', NO_COLOR: '1' };
delete env.FORCE_COLOR;
const steps = [];
const labRoot = path.join(root, 'fluent-engineering-lab');
const vueRoot = path.join(root, 'fluent-engineering-vue');
const runtimeRoot = path.join(root, 'fluent-task-runtime');

function run(id, command, args, options = {}) {
  const started = Date.now();
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? root,
    env: { ...env, ...(options.env ?? {}) },
    encoding: 'utf8',
    timeout: options.timeoutMs ?? 15 * 60 * 1000,
    maxBuffer: 64 * 1024 * 1024,
  });
  const stdout = result.stdout ?? '';
  const stderr = result.stderr ?? '';
  const ok = result.status === 0 && !result.error;
  const detail = ok ? undefined : (stderr.trim() || stdout.trim()).slice(-4000);
  const row = { id, command: [command, ...args].join(' '), status: ok ? 'pass' : 'fail', durationMs: Date.now() - started, detail };
  steps.push(row);
  console.log(`${ok ? 'PASS' : 'FAIL'} ${id} (${row.durationMs}ms)`);
  if (!ok && detail) console.error(detail);
  return ok;
}

async function httpReady(id, url) {
  const started = Date.now();
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5_000) });
    const ok = response.ok;
    steps.push({ id, command: `GET ${url}`, status: ok ? 'pass' : 'fail', durationMs: Date.now() - started, httpStatus: response.status });
    console.log(`${ok ? 'PASS' : 'FAIL'} ${id} (${response.status})`);
    return ok;
  } catch (error) {
    steps.push({ id, command: `GET ${url}`, status: 'fail', durationMs: Date.now() - started, detail: String(error?.message ?? error) });
    console.error(`FAIL ${id}: ${error?.message ?? error}`);
    return false;
  }
}

function packagePlan() {
  const result = spawnSync('pnpm', ['--dir', path.join(root, 'fluent-engineering-lab'), 'package:local:plan'], {
    cwd: root,
    env,
    encoding: 'utf8',
    timeout: 120_000,
    maxBuffer: 16 * 1024 * 1024,
  });
  let parsed = null;
  try { parsed = JSON.parse(result.stdout?.trim() ?? ''); } catch { /* reported below */ }
  const executable = parsed?.executable === true;
  const boundaryOk = result.status === 0 && Boolean(parsed) && executable;
  const ok = result.status === 0 && Boolean(parsed) && (dev || boundaryOk);
  const detail = !parsed ? (result.stderr?.trim() || 'package plan did not return JSON') : (executable ? undefined : `package boundary is not executable: ${parsed.blockedReason ?? 'dirty or unpinned source'}`);
  const status = !boundaryOk && dev ? 'warn' : ok ? 'pass' : 'fail';
  steps.push({ id: 'package-provenance-plan', command: 'pnpm --dir fluent-engineering-lab package:local:plan', status, executable, sourceClean: parsed?.sourceClean ?? false, detail });
  console.log(`${status === 'pass' ? 'PASS' : status === 'warn' ? 'WARN' : 'FAIL'} package-provenance-plan (executable=${executable})`);
  if (!ok && detail) console.error(detail);
  return { ok, executable, parsed };
}

const staticSteps = [
  ['workspace-git', process.execPath, ['scripts/workspace-git-check.mjs', ...(dev ? ['--development'] : [])]],
  ['workspace-contract', 'bash', ['scripts/workspace-contract.sh', 'check']],
  ['ci-inventory', process.execPath, ['scripts/ci-inventory.mjs', '--check']],
  ['design-tokens', process.execPath, ['scripts/design-token-audit.mjs', '--check']],
  ['vue-performance', process.execPath, ['scripts/vue-performance-gate.mjs', '--check']],
  ['observability', process.execPath, ['scripts/observability-gate.mjs', '--check']],
  ['validation-matrix-static', process.execPath, ['scripts/validation-matrix-gate.mjs', '--static', '--check']],
  ['canonical-routes', process.execPath, ['scripts/canonical-route-gate.mjs']],
  ['schema-compatibility', process.execPath, ['scripts/schema-compatibility-gate.mjs']],
  ['layout', 'bash', ['scripts/layout-check.sh']],
  ['ports', 'bash', ['scripts/ports.sh']],
  ['mode-guard', 'bash', ['scripts/mode-guard.sh', 'check']],
  ['runtime-image-manifest', 'bash', ['fluent-task-runtime/scripts/image-manifest-check.sh', '--static']],
  ['docker-provenance', process.execPath, ['scripts/docker-provenance-check.mjs']],
];
for (const [id, command, args] of staticSteps) run(id, command, args);

// Domain-model and browser ownership guards are source checks. They run in
// every mode so a strict package cannot bypass the same cross-service rules
// used by the development release gate.
run('lab-glossary-code-contract', 'pnpm', ['glossary:code:contract:check'], {
  cwd: labRoot,
  timeoutMs: 180_000,
});
run('lab-browser-owner-boundary', 'pnpm', ['browser:owner-boundary:check'], {
  cwd: labRoot,
  env: { FEL_VUE_ROOT: vueRoot },
  timeoutMs: 180_000,
});

for (const repository of ['fluent-engineering-lab', 'fluent-engineering-vue', 'fluent-task-runtime', 'fluent-question-brain', 'fluent-question-vault']) {
  run(`diff-check:${repository}`, 'git', ['diff', '--check'], { cwd: path.join(root, repository), timeoutMs: 120_000 });
}

const packageState = packagePlan();
// Task Runtime owns the portfolio contract and its answer-free authoring
// backlog. Go is intentionally kept inside the pinned container image so the
// umbrella verifier does not invent a second host toolchain.
run('runtime-task-portfolio-backlog', 'docker', [
  'run', '--rm', '-v', `${runtimeRoot}:/src`, '-w', '/src',
  'golang:1.24', 'go', 'run', './cmd/portfolio-backlog', '--check',
], { cwd: root, timeoutMs: 180_000 });
// Both application owners run their own deterministic quality suites here.
// Go-owned Brain/Runtime checks stay in their repositories' CI because this
// umbrella must not invent a second toolchain or a second dependency cache.
run('lab-check', 'pnpm', ['check'], { cwd: labRoot, timeoutMs: 15 * 60 * 1000 });
run('vue-check', 'pnpm', ['check'], { cwd: vueRoot, timeoutMs: 15 * 60 * 1000 });
if (dev) {
  await httpReady('question-brain-readiness', 'http://127.0.0.1:48127/health/ready');
  await httpReady('task-runtime-readiness', 'http://127.0.0.1:48227/v1/health/ready');
  // Vite binds the learner dev server through the workspace's canonical
  // `localhost` URL (often IPv6 ::1 on macOS). Keep this probe aligned with
  // the launcher instead of hard-coding the API's IPv4 loopback address.
  await httpReady('lab-dev-web', 'http://localhost:47350/');
  run('validation-matrix-live', process.execPath, ['scripts/validation-matrix-gate.mjs', '--check'], {
    cwd: root,
    env: {
      WEB_URL: 'http://localhost:47350',
      LEARNING_API_URL: 'http://127.0.0.1:47000',
      RUNTIME_API_URL: 'http://127.0.0.1:48227',
      BRAIN_API_URL: 'http://127.0.0.1:48127',
    },
    timeoutMs: 180_000,
  });
  run('runtime-boundary-negative', process.execPath, ['scripts/runtime-boundary-gate.mjs', '--check'], {
    cwd: root,
    env: {
      LEARNING_API_URL: 'http://127.0.0.1:47000',
      RUNTIME_API_URL: 'http://127.0.0.1:48227',
      BRAIN_API_URL: 'http://127.0.0.1:48127',
    },
    timeoutMs: 240_000,
  });
  run('runtime-release-join', process.execPath, ['scripts/runtime-release-join-gate.mjs'], {
    cwd: root,
    env: {
      BRAIN_API_URL: 'http://127.0.0.1:48127',
      RUNTIME_API_URL: 'http://127.0.0.1:48227',
      RUNTIME_RELEASE_JOIN_JSON: path.join(root, 'docs/verification/two-audit-remediation/W11/runtime-release-join.json'),
      RUNTIME_RELEASE_JOIN_MD: path.join(root, 'docs/verification/two-audit-remediation/W11/runtime-release-join.md'),
    },
    timeoutMs: 180_000,
  });
  run('runtime-failure-matrix', process.execPath, ['scripts/runtime-failure-matrix-gate.mjs'], {
    cwd: root,
    env: {
      RUNTIME_API_URL: 'http://127.0.0.1:48227',
      RUNTIME_FAILURE_MATRIX_TIMEOUT_MS: '40000',
    },
    timeoutMs: 300_000,
  });
  run('lab-route-audit', 'pnpm', ['m4:route-audit'], { cwd: path.join(root, 'fluent-engineering-lab'), env: { API_URL: 'http://127.0.0.1:47000', WEB_URL: 'http://localhost:47350' }, timeoutMs: 180_000 });
  run('lab-g12-coverage', 'pnpm', ['g12:coverage:matrix:check'], { cwd: labRoot, env: { API_URL: 'http://127.0.0.1:47000' }, timeoutMs: 180_000 });
  run('lab-g12-practice-disposition', 'pnpm', ['g12:practice:disposition:check'], { cwd: labRoot, env: { API_URL: 'http://127.0.0.1:47000' }, timeoutMs: 180_000 });
  run('lab-semantic-placement', 'pnpm', ['semantic:placement:check'], { cwd: labRoot, env: { API_URL: 'http://127.0.0.1:47000' }, timeoutMs: 180_000 });
  run('lab-question-curriculum-shape', 'pnpm', ['question:curriculum:shape:check'], {
    cwd: labRoot,
    env: {
      BRAIN_API_URL: 'http://127.0.0.1:48127',
      CURRICULUM_SHAPE_JSON: path.join(labRoot, 'docs/verification/two-audit-remediation/W05/curriculum-shape.json'),
    },
    timeoutMs: 180_000,
  });
  run('question-graph-release-audit', process.execPath, ['fluent-question-brain/scripts/graph-release-audit.mjs', '--check'], {
    cwd: root,
    env: {
      QUESTION_BRAIN_API_URL: 'http://127.0.0.1:48127',
      GRAPH_AUDIT_JSON: path.join(root, 'docs/verification/two-audit-remediation/W07/graph-release-audit.json'),
      GRAPH_AUDIT_MD: path.join(root, 'docs/verification/two-audit-remediation/W07/graph-release-audit.md'),
    },
    timeoutMs: 180_000,
  });
  run('lab-learning-module-release', 'pnpm', ['learning:modules:gate:check'], {
    cwd: labRoot,
    env: {
      BRAIN_API_URL: 'http://127.0.0.1:48127',
      LEARNING_MODULE_RELEASE_FILE: path.join(labRoot, 'releases/learning-module-release-2026-08-27.json'),
      LEARNING_MODULE_GATE_JSON: path.join(root, 'docs/verification/two-audit-remediation/W08/learning-module-release.json'),
      LEARNING_MODULE_GATE_MD: path.join(root, 'docs/verification/two-audit-remediation/W08/learning-module-release.md'),
    },
    timeoutMs: 180_000,
  });
  run('lab-track-view-isolation', 'pnpm', ['track:views:gate:check'], {
    cwd: labRoot,
    env: {
      LEARNING_API_URL: 'http://127.0.0.1:47000',
      BRAIN_API_URL: 'http://127.0.0.1:48127',
      TRACK_VIEW_GATE_JSON: path.join(root, 'docs/verification/two-audit-remediation/W09/track-view-isolation.json'),
      TRACK_VIEW_GATE_MD: path.join(root, 'docs/verification/two-audit-remediation/W09/track-view-isolation.md'),
    },
    timeoutMs: 180_000,
  });
  run('lab-path-completion', process.execPath, ['scripts/path-completion-manifest-gate.mjs', '--check'], {
    cwd: labRoot,
    env: {
      LEARNING_API_URL: 'http://127.0.0.1:47000',
      BRAIN_API_URL: 'http://127.0.0.1:48127',
      RUNTIME_API_URL: 'http://127.0.0.1:48227',
      TASK_PORTFOLIO_MANIFEST: path.join(root, 'fluent-task-runtime/task-portfolio/manifest.json'),
      PATH_COMPLETION_MANIFEST: path.join(labRoot, 'docs/manifests/path-completion-development-2026-08-27.json'),
    },
    timeoutMs: 180_000,
  });
  run('lab-path-completion-backlog', 'pnpm', ['curriculum:path-completion:backlog:check'], {
    cwd: labRoot,
    env: {
      PATH_COMPLETION_MANIFEST: path.join(labRoot, 'docs/manifests/path-completion-development-2026-08-27.json'),
      PATH_COMPLETION_BACKLOG_JSON: path.join(labRoot, 'docs/manifests/path-completion-backlog-2026-08-27.json'),
      PATH_COMPLETION_BACKLOG_MD: path.join(labRoot, 'docs/manifests/path-completion-backlog-2026-08-27.md'),
    },
    timeoutMs: 180_000,
  });
  run('question-coverage-backlog', 'pnpm', ['coverage:backlog:check'], {
    cwd: root,
    env: {
      PATH_COMPLETION_MANIFEST: path.join(labRoot, 'docs/manifests/path-completion-development-2026-08-27.json'),
      CAPABILITY_BINDING_MANIFEST: path.join(root, 'fluent-question-brain/docs/verification/G7-capability-binding-manifest-2026-08-25.json'),
      CAPABILITY_BINDING_REPORT: path.join(root, 'fluent-question-brain/docs/verification/G7-capability-binding-report-2026-08-25.json'),
      QUESTION_COVERAGE_BACKLOG_JSON: path.join(root, 'docs/verification/two-audit-remediation/W13/question-coverage-authoring-backlog.json'),
      QUESTION_COVERAGE_BACKLOG_MD: path.join(root, 'docs/verification/two-audit-remediation/W13/question-coverage-authoring-backlog.md'),
    },
    timeoutMs: 180_000,
  });
  run('lab-activity-corpus', 'pnpm', ['activity:gate:check'], {
    cwd: labRoot,
    env: {
      BRAIN_API_URL: 'http://127.0.0.1:48127',
      ACTIVITY_GATE_JSON: path.join(root, 'docs/verification/two-audit-remediation/W10/activity-corpus.json'),
      ACTIVITY_GATE_MD: path.join(root, 'docs/verification/two-audit-remediation/W10/activity-corpus.md'),
    },
    timeoutMs: 180_000,
  });
  run('lab-runtime-bindings', 'pnpm', ['runtime:bindings:gate:check'], {
    cwd: labRoot,
    env: {
      RUNTIME_API_URL: 'http://127.0.0.1:48227',
      BRAIN_API_URL: 'http://127.0.0.1:48127',
      RUNTIME_BINDING_GATE_JSON: path.join(root, 'docs/verification/two-audit-remediation/W11/runtime-binding.json'),
      RUNTIME_BINDING_GATE_MD: path.join(root, 'docs/verification/two-audit-remediation/W11/runtime-binding.md'),
    },
    timeoutMs: 180_000,
  });
  run('lab-route-actions', 'pnpm', ['route:actions:gate:check'], {
    cwd: labRoot,
    env: {
      LEARNING_API_URL: 'http://127.0.0.1:47000',
      ROUTE_ACTION_GATE_JSON: path.join(root, 'docs/verification/two-audit-remediation/W12/route-action.json'),
      ROUTE_ACTION_GATE_MD: path.join(root, 'docs/verification/two-audit-remediation/W12/route-action.md'),
    },
    timeoutMs: 180_000,
  });
  run('lab-question-curriculum-funnel-en', 'pnpm', ['question:curriculum:funnel:check', '--', '--locale=en'], {
    cwd: labRoot,
    env: {
      LEARNING_API_URL: 'http://127.0.0.1:47000',
      QUESTION_LOCALE: 'en',
      CURRICULUM_FUNNEL_JSON: path.join(labRoot, 'docs/verification/two-audit-remediation/W06/curriculum-funnel-en.json'),
      CURRICULUM_FUNNEL_MD: path.join(labRoot, 'docs/verification/two-audit-remediation/W06/curriculum-funnel-en.md'),
    },
    timeoutMs: 180_000,
  });
  run('lab-question-curriculum-funnel-ru', 'pnpm', ['question:curriculum:funnel:check', '--', '--locale=ru'], {
    cwd: labRoot,
    env: {
      LEARNING_API_URL: 'http://127.0.0.1:47000',
      QUESTION_LOCALE: 'ru',
      CURRICULUM_FUNNEL_JSON: path.join(labRoot, 'docs/verification/two-audit-remediation/W06/curriculum-funnel-ru.json'),
      CURRICULUM_FUNNEL_MD: path.join(labRoot, 'docs/verification/two-audit-remediation/W06/curriculum-funnel-ru.md'),
    },
    timeoutMs: 180_000,
  });
  run('lab-question-catalog-integrity', 'pnpm', ['question:catalog:integrity:check'], {
    cwd: labRoot,
    env: {
      API_URL: 'http://127.0.0.1:47000',
      QUESTION_BRAIN_API_URL: 'http://127.0.0.1:48127',
      QUESTION_CATALOG_AUDIT_JSON: path.join(root, 'docs/verification/two-audit-remediation/W05/question-catalog-integrity.json'),
    },
    timeoutMs: 180_000,
  });
  run('lab-g13-boundary', 'pnpm', ['g13:boundary:audit:check'], { cwd: labRoot, timeoutMs: 180_000 });
  run('lab-g9-vue-deviations', process.execPath, ['scripts/g9-deviation-gate.mjs', '--check'], { cwd: labRoot, env: { FEL_VUE_ROOT: vueRoot }, timeoutMs: 180_000 });
  run('lab-accessibility', 'pnpm', ['a11y:smoke'], { cwd: labRoot, env: { WEB_URL: 'http://localhost:47350' }, timeoutMs: 180_000 });
  run('lab-desktop-visual', 'pnpm', ['desktop:visual:check'], { cwd: labRoot, env: { WEB_URL: 'http://localhost:47350' }, timeoutMs: 180_000 });
  run('lab-desktop-regression', 'pnpm', ['desktop:regression:guard'], { cwd: labRoot, env: { WEB_URL: 'http://localhost:47350' }, timeoutMs: 180_000 });
  run('vue-e2e', 'pnpm', ['e2e'], { cwd: path.join(root, 'fluent-engineering-vue'), timeoutMs: 15 * 60 * 1000 });
} else {
  if (!packageState.executable) {
    steps.push({ id: 'production-package-boundary', command: 'package:local:plan', status: 'fail', detail: 'clean five-root package boundary is required before production verification' });
  } else {
    await httpReady('lab-package-web', 'http://127.0.0.1:49300/onboarding');
    await httpReady('lab-package-api', 'http://127.0.0.1:49301/api/practice/health');
    run('g14-hardening', 'pnpm', ['g14:hardening:check'], { cwd: labRoot, timeoutMs: 15 * 60 * 1000 });
  }
}

const failures = steps.filter((step) => step.status === 'fail');
const report = {
  reportVersion: 'release-verify.v1',
  generatedAt: new Date().toISOString(),
  mode: dev ? 'development' : 'strict-production',
  valid: failures.length === 0,
  productionPromotable: !dev && failures.length === 0,
  steps,
};
if (out) {
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`);
}
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;
