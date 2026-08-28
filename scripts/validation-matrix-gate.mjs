#!/usr/bin/env node

/**
 * W17 read-only validation matrix.
 *
 * This gate deliberately stays outside the browser application.  It checks
 * the public HTTP contract from a clean caller's point of view, while a
 * separate Playwright suite owns visual/layout assertions.  No endpoint in
 * this file mutates learner progress, starts a run, promotes content or
 * changes Docker state.
 */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const vueRoot = path.join(root, 'fluent-engineering-vue');
const webBase = (process.env.WEB_URL ?? 'http://localhost:47350').replace(/\/$/u, '');
const labBase = (process.env.LEARNING_API_URL ?? 'http://127.0.0.1:47000').replace(/\/$/u, '');
const runtimeBase = (process.env.RUNTIME_API_URL ?? 'http://127.0.0.1:48227').replace(/\/$/u, '');
const brainBase = (process.env.BRAIN_API_URL ?? 'http://127.0.0.1:48127').replace(/\/$/u, '');
const staticOnly = process.argv.includes('--static');
const check = process.argv.includes('--check') || !process.argv.includes('--report');
const outArg = process.argv.find((value) => value.startsWith('--out='));
const outPath = path.resolve(root, outArg?.slice('--out='.length) ?? 'docs/verification/two-audit-remediation/W17/validation-matrix.json');
const findings = [];
const checks = [];
const openGaps = [];

function gitSha(repository) {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repository, encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function record(id, ok, detail, meta = {}) {
  const row = { id, status: ok ? 'pass' : 'fail', detail, ...meta };
  checks.push(row);
  if (!ok) findings.push(row);
  console.log(`${ok ? 'PASS' : 'FAIL'} ${id}${detail ? ` — ${detail}` : ''}`);
  return ok;
}

function readRouterSource() {
  try {
    return readFileSync(path.join(vueRoot, 'apps/web/src/router.ts'), 'utf8');
  } catch (error) {
    record('router-source-readable', false, String(error?.message ?? error));
    return '';
  }
}

function staticChecks() {
  const source = readRouterSource();
  if (!source) return;
  const routePaths = [...source.matchAll(/\{\s*path:\s*'([^']+)'/gu)].map((match) => match[1]);
  record('router-route-records', routePaths.length >= 30, `${routePaths.length} route records discovered`, { count: routePaths.length });
  record('router-route-path-unique', new Set(routePaths).size === routePaths.length, 'route record paths are unique');
  record('router-has-recovery', routePaths.some((route) => route.includes(':pathMatch')), 'catch-all recovery route is declared');
  record('router-has-canonical-question-alias', routePaths.includes('/practice/questions'), 'question alias is declared');
  record('router-has-canonical-lab-alias', routePaths.includes('/practice/lab/:labId'), 'lab alias is declared');
  record('router-has-canonical-studio-alias', routePaths.includes('/studio/recovery'), 'Studio recovery alias is declared');
  record('router-uses-history', /createWebHistory\(\)/u.test(source), 'history mode is explicit');
  record('router-has-scroll-policy', /scrollBehavior:/u.test(source), 'router scroll policy is explicit');
  record('router-lazy-loads-views', (source.match(/import\('\.\/views\//gu) ?? []).length >= 20, 'learner views use lazy imports');
  record('router-no-external-navigation', !/window\.location(?:\.href)?\s*=|location\.assign\(/u.test(source), 'router has no uncontrolled external navigation');
  const uncovered = routePaths.filter((pattern) => {
    if (pattern.includes(':pathMatch')) return !routeMatrix.some(([, route]) => route.startsWith('/this-route-is-intentionally-not-published'));
    const expression = pattern
      .split('/')
      .map((segment) => {
        if (!segment) return '';
        if (segment.startsWith(':')) return '[^/]+';
        return segment.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
      })
      .join('/');
    const matcher = new RegExp(`^${expression}$`, 'u');
    return !routeMatrix.some(([, route]) => matcher.test(route.split(/[?#]/u)[0]));
  });
  record(
    'router-route-record-coverage',
    uncovered.length === 0,
    uncovered.length === 0 ? `${routePaths.length} records have a concrete browser sample` : `uncovered records: ${uncovered.join(', ')}`,
    { routeRecordCount: routePaths.length, uncovered },
  );
}

const routeMatrix = [
  ['program', '/'],
  ['program-legacy-alias', '/program'],
  ['practice', '/practice'],
  ['questions', '/questions'],
  ['questions-alias', '/practice/questions'],
  ['question-detail', '/questions/question.q334'],
  ['question-unpublished', '/questions/QB-G4-CMS5'],
  ['learning-map', '/learning-map'],
  ['learning-map-legacy-alias', '/map'],
  ['paths-alias', '/paths'],
  ['path-node', '/paths/nodejs-typescript'],
  ['domain-node-runtime', '/paths/nodejs-typescript/domains/node-runtime'],
  ['capability-event-loop', '/capabilities/capability.event-loop-ordering'],
  ['progress', '/progress'],
  ['journal', '/journal'],
  ['projects', '/projects'],
  ['project-preview', '/projects/project-book-engine-fixture/preview'],
  ['project-reader', '/projects/project-book-engine-fixture/reader'],
  ['project-checkpoint', '/projects/project-book-engine-fixture/chapter-boundary/checkpoint-boundary'],
  ['project-cache', '/projects/content-delivery-platform/cache-learning'],
  ['project-events', '/projects/content-delivery-platform/event-learning'],
  ['project-deployment', '/projects/content-delivery-platform/deployment-learning'],
  ['project-deployment-workspace', '/projects/content-delivery-platform/deployment-workspace'],
  ['project-defense', '/projects/content-delivery-platform/defense'],
  ['failure-states', '/failure-states'],
  ['studio', '/studio'],
  ['studio-content', '/studio/content'],
  ['studio-graph', '/studio/graph'],
  ['studio-review', '/studio/review'],
  ['studio-system', '/studio/system'],
  ['studio-observability', '/studio/observability'],
  ['studio-recovery', '/studio/system/recovery'],
  ['studio-recovery-alias', '/studio/recovery'],
  ['onboarding', '/onboarding'],
  ['lesson', '/practice/lesson/promise-machinery'],
  ['lesson-missing', '/practice/lesson/syscalls-and-kernel-objects'],
  ['task-family', '/practice/task-family/task-family.event-loop-ordering'],
  ['task-family-missing', '/practice/task-family/missing?preview=1#mechanics'],
  ['event-loop', '/lab/node-event-loop-001'],
  ['event-loop-alias', '/practice/lab/node-event-loop-001'],
  ['workspace-node', '/lab/node-cpu-bound-002'],
  ['workspace-deferred', '/lab/deferred'],
  ['ordering', '/lab/ordering-docker-build-cache'],
  ['ordering-alias', '/practice/lab/ordering-docker-build-cache'],
  ['route-recovery', '/this-route-is-intentionally-not-published'],
];

async function http(origin, requestPath, init = {}) {
  try {
    const response = await fetch(`${origin}${requestPath}`, {
      redirect: 'manual',
      signal: AbortSignal.timeout(8_000),
      ...init,
    });
    const contentType = response.headers.get('content-type') ?? '';
    const text = await response.text();
    let body = null;
    if (contentType.includes('json')) {
      try { body = JSON.parse(text); } catch { body = null; }
    }
    return { response, contentType, text, body };
  } catch (error) {
    return { response: null, contentType: '', text: '', body: null, error: String(error?.message ?? error) };
  }
}

async function fetchPathItems(pathKey) {
  const items = [];
  let cursor = null;
  let pages = 0;
  while (true) {
    const params = new URLSearchParams({ limit: '24', locale: 'en', pathKey });
    if (cursor) params.set('cursor', cursor);
    const result = await http(labBase, `/api/questions/query?${params.toString()}`, {
      headers: { 'x-fel-profile': 'validation-matrix', 'x-fel-mode': 'explore' },
    });
    if (!result.response?.ok || !result.body || !Array.isArray(result.body.items) || !result.body.pageInfo) {
      return { items, totalCount: null, error: `${result.response?.status ?? result.error ?? 'unreachable'}` };
    }
    items.push(...result.body.items);
    cursor = result.body.pageInfo.nextCursor;
    pages += 1;
    if (!cursor) return { items, totalCount: result.body.pageInfo.totalCount, error: null };
    if (pages > 100) return { items, totalCount: null, error: 'cursor pagination exceeded 100 pages' };
  }
}

function topicHasAny(topic, markers) {
  return markers.some((marker) => topic.startsWith(marker));
}

async function semanticPathChecks(map) {
  const paths = Array.isArray(map?.pathCatalog?.paths) ? map.pathCatalog.paths : [];
  const pathQueries = {};
  const forbiddenNativeTopics = {
    'path.nodejs-typescript': ['Java /', '.NET /', 'Go /', 'Python /'],
    'path.java-spring': ['Node /', 'Node Runtime', '.NET /', 'Go /', 'Python /'],
    'path.go': ['Node /', 'Node Runtime', 'Java /', '.NET /', 'Python /'],
    'path.dotnet-csharp': ['Node /', 'Node Runtime', 'Java /', 'Go /', 'Python /'],
  };
  for (const path of paths) {
    const key = String(path?.key ?? '');
    if (!key) continue;
    const result = await fetchPathItems(key);
    pathQueries[key] = {
      expected: path?.questionStats?.publishedCount ?? null,
      actual: result.totalCount,
      fetched: result.items.length,
      error: result.error,
    };
    record(`semantic:path-count:${key}`, result.error === null && result.totalCount === path?.questionStats?.publishedCount && result.items.length === result.totalCount, result.error ? `${key} query failed: ${result.error}` : `${key} returns ${result.totalCount} accepted cards`, { pathKey: key, expected: path?.questionStats?.publishedCount ?? null, actual: result.totalCount });
    const placementViolations = result.items.filter((item) =>
      item?.placementVisibility !== 'native' ||
      item?.placementReason !== 'accepted-path-placement',
    );
    record(
      `semantic:path-placement-boundary:${key}`,
      result.error === null && placementViolations.length === 0,
      placementViolations.length === 0
        ? 'every path card exposes accepted native placement metadata'
        : `non-native placement metadata in path projection: ${placementViolations.length}`,
      { pathKey: key, violations: placementViolations.map((item) => item?.id).filter(Boolean) },
    );
    const topics = result.items.map((item) => String(item?.topic ?? ''));
    const forbidden = forbiddenNativeTopics[key] ?? [];
    if (forbidden.length) {
      const violations = topics.filter((topic) => topicHasAny(topic, forbidden));
      record(`semantic:native-isolation:${key}`, result.error === null && violations.length === 0, violations.length === 0 ? 'no foreign native topic markers' : `foreign native topics: ${[...new Set(violations)].join(', ')}`, { pathKey: key, violations: [...new Set(violations)] });
    }
    if (key === 'path.python') {
      const runnableModes = result.items.filter((item) => ['workspace', 'controlled-lab'].includes(String(item?.executionMode ?? '')));
      const foreignRuntime = result.items.filter((item) => ['node', 'go', 'java', 'dotnet'].includes(String(item?.runtime ?? '').toLowerCase()));
      record('semantic:python-no-fake-runtime', result.error === null && runnableModes.length === 0 && foreignRuntime.length === 0, runnableModes.length === 0 && foreignRuntime.length === 0 ? 'Python path is theory-only until a released Python profile exists' : 'Python path exposes an unreleased or foreign runtime', { runnableModes: runnableModes.length, foreignRuntime: foreignRuntime.length });
    }
    if (key === 'path.frontend') {
      const frontendOnly = result.items.every((item) => String(item?.lane ?? '') === 'frontend' && String(item?.runtime ?? '') === 'frontend');
      record('semantic:frontend-lane', result.error === null && frontendOnly, frontendOnly ? 'frontend path keeps frontend-native lane/runtime' : 'frontend path contains a non-frontend lane/runtime', { itemCount: result.items.length });
      if (!topics.some((topic) => /^(Vue|Vue \/)/u.test(topic))) {
        openGaps.push({ id: 'W17-026', detail: 'released Frontend path has no Vue-native topic yet; current cards are React/Angular/frontend shared content' });
      }
    }
    if (key === 'path.algorithms') {
      record('semantic:algorithms-domain', result.error === null && result.items.length > 0 && result.items.every((item) => String(item?.lane ?? '') === 'algorithms' && String(item?.runtime ?? '') === 'algorithms'), 'Algorithms path is language-neutral and isolated', { itemCount: result.items.length });
    }
    if (key === 'path.system-design') {
      const designTopics = topics.filter((topic) => /design|architecture|reliab|capacity|messag|database|api/iu.test(topic));
      record('semantic:system-design-domain', result.error === null && designTopics.length > 0, `${designTopics.length} design-oriented topic cards`, { designTopicCount: designTopics.length });
    }
    if (key === 'path.behavioral') {
      const testingTopics = topics.filter((topic) => /(^|\/)testing|test(ing)?\b/iu.test(topic));
      record('semantic:behavioral-domain', result.error === null && testingTopics.length === 0, testingTopics.length === 0 ? 'no testing-domain topic leakage' : `testing topics leaked: ${[...new Set(testingTopics)].join(', ')}`, { testingTopics: [...new Set(testingTopics)] });
    }
  }
  return pathQueries;
}

async function liveWebChecks() {
  const results = [];
  for (const [id, route] of routeMatrix) {
    const result = await http(webBase, route);
    const ok = Boolean(result.response?.ok) && result.contentType.includes('text/html') && result.text.includes('id="app"');
    record(`web-route:${id}`, ok, ok ? `${route} → ${result.response.status}` : `${route} → ${result.response?.status ?? result.error ?? 'unreachable'}`, { route, httpStatus: result.response?.status ?? null });
    results.push({ id, route, status: ok ? 'pass' : 'fail', httpStatus: result.response?.status ?? null });
  }
  return results;
}

function objectBody(result) {
  return Boolean(result.body && typeof result.body === 'object' && !Array.isArray(result.body));
}

async function liveApiChecks() {
  const exploreHeaders = { 'x-fel-mode': 'explore', 'x-fel-profile': 'validation-matrix' };
  const studioHeaders = { 'x-fel-surface': 'studio', 'x-fel-profile': 'validation-matrix' };
  const probes = [
    ['lab-readiness', labBase, '/api/health/ready', exploreHeaders],
    ['lab-program-map', labBase, '/api/program/map', exploreHeaders],
    ['lab-program-inventory', labBase, '/api/program/inventory', exploreHeaders],
    ['lab-practice', labBase, '/api/practice/current', exploreHeaders],
    ['lab-progress', labBase, '/api/progress', exploreHeaders],
    ['lab-next', labBase, '/api/next', exploreHeaders],
    ['lab-question-summary', labBase, '/api/questions/summary?locale=en', exploreHeaders],
    ['lab-question-query', labBase, '/api/questions/query?limit=24&locale=en', exploreHeaders],
    ['lab-route-context', labBase, '/api/learner/route-context?path=%2Fpractice%2Ftask-family%2Ftask-family.event-loop-ordering', exploreHeaders],
    ['runtime-readiness', runtimeBase, '/v1/health/ready', {}],
    ['runtime-profiles', runtimeBase, '/v1/profiles', {}],
    ['runtime-task-families', runtimeBase, '/v1/task-families', {}],
    ['brain-readiness', brainBase, '/health/ready', {}],
    ['brain-release', brainBase, '/v1/release', {}],
    ['brain-catalog', brainBase, '/v1/catalog', {}],
    ['brain-quality-studio', brainBase, '/v1/quality', studioHeaders],
  ];
  const values = new Map();
  for (const [id, origin, endpoint, headers] of probes) {
    const result = await http(origin, endpoint, { headers });
    const ok = Boolean(result.response?.ok) && (result.contentType.includes('json') || endpoint.endsWith('/ready')) && (endpoint.endsWith('/ready') || objectBody(result));
    record(`api:${id}`, ok, ok ? `${endpoint} → ${result.response.status}` : `${endpoint} → ${result.response?.status ?? result.error ?? 'unreachable'}`, { endpoint, httpStatus: result.response?.status ?? null });
    values.set(id, result);
  }

  const map = values.get('lab-program-map')?.body;
  const inventory = values.get('lab-program-inventory')?.body;
  const practice = values.get('lab-practice')?.body;
  const progress = values.get('lab-progress')?.body;
  const next = values.get('lab-next')?.body;
  const query = values.get('lab-question-query')?.body;
  const families = values.get('runtime-task-families')?.body;
  const release = values.get('brain-release')?.body;
  const catalog = values.get('brain-catalog')?.body;

  const graphRelease = map?.release?.graphReleaseId;
  const manifestVersion = map?.release?.manifestVersion;
  record('identity:program-map', Boolean(graphRelease && manifestVersion && map?.program?.id), 'Program map exposes program/release identity', { graphRelease, manifestVersion });
  record('identity:inventory', inventory?.release?.graphReleaseId === graphRelease && inventory?.release?.manifestVersion === manifestVersion, 'inventory uses the same release tuple');
  record('identity:practice', practice?.program?.graphReleaseId === graphRelease && practice?.program?.manifestVersion === manifestVersion, 'practice uses the same release tuple');
  record('identity:progress', progress?.program?.graphReleaseId === graphRelease && progress?.program?.manifestVersion === manifestVersion, 'progress uses the same release tuple');
  record('identity:next', typeof next?.route === 'string' && next.route.startsWith('/'), 'next action returns a canonical internal route');
  record('question:bounded-page', query?.query?.limit === 24 && Array.isArray(query?.items) && query.items.length <= 24 && query?.pageInfo?.hasNextPage !== undefined, 'question query is bounded and cursor-aware');
  record('question:published-count', inventory?.counts?.questionCardCount === 1591 && catalog?.total === 1591, 'Brain/Lab published card counts agree at 1,591');
  record('runtime:families-release', typeof families?.releaseId === 'string' && Array.isArray(families?.families) && families.families.length > 0, 'Runtime exposes a released family catalogue');
  const codeRateLimiter = families?.families?.find((family) => family?.key === 'task-family.rate-limiter');
  const sqlRateLimiter = families?.families?.find((family) => family?.key === 'task-family.postgresql-rate-limiting');
  record('runtime:language-family-isolation', Boolean(codeRateLimiter && sqlRateLimiter && !codeRateLimiter.revisions?.some((revision) => revision?.language === 'sql' || revision?.profile === 'postgres')), 'code and PostgreSQL rate-limit families remain separate');
  record('brain:release-published', release?.release_id === catalog?.release_id && release?.total === catalog?.total && release?.include_fixtures === false, 'Brain catalog and release share a fixture-free release');

  const pathQueries = await semanticPathChecks(map);

  return { graphRelease, manifestVersion, pathQueries, values: Object.fromEntries(values.entries()) };
}

function staticOnlyReport() {
  staticChecks();
  return { mode: 'static', webRoutes: routeMatrix.length, apiProbes: 16 };
}

const startedAt = new Date().toISOString();
staticChecks();
let webResults = [];
let apiSummary = null;
if (!staticOnly) {
  webResults = await liveWebChecks();
  apiSummary = await liveApiChecks();
}
const report = {
  reportVersion: 'validation-matrix.v1',
  generatedAt: new Date().toISOString(),
  startedAt,
  mode: staticOnly ? 'static' : 'development-live',
  webBase,
  labBase,
  runtimeBase,
  brainBase,
  routeCount: routeMatrix.length,
  apiProbeCount: 16,
  sourceRevisions: {
    umbrella: gitSha(root),
    lab: gitSha(path.join(root, 'fluent-engineering-lab')),
    vue: gitSha(vueRoot),
    brain: gitSha(path.join(root, 'fluent-question-brain')),
    runtime: gitSha(path.join(root, 'fluent-task-runtime')),
    vault: gitSha(path.join(root, 'fluent-question-vault')),
  },
  routeMatrix: routeMatrix.map(([id, route]) => ({ id, route })),
  checks,
  findings,
  openGaps,
  webResults,
  apiSummary: apiSummary ? { graphRelease: apiSummary.graphRelease, manifestVersion: apiSummary.manifestVersion, pathQueries: apiSummary.pathQueries } : null,
  valid: findings.length === 0,
};
report.digest = createHash('sha256')
  .update(JSON.stringify({ reportVersion: report.reportVersion, mode: report.mode, sourceRevisions: report.sourceRevisions, checks: report.checks, webResults: report.webResults, apiSummary: report.apiSummary }))
  .digest('hex');
mkdirSync(path.dirname(outPath), { recursive: true });
writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (check && findings.length > 0) process.exitCode = 1;
