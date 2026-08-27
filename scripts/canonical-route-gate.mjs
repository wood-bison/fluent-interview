#!/usr/bin/env node

/**
 * Static guard for the learner route boundary.
 *
 * The server owns canonical destinations, while Vue may keep compatibility
 * aliases for old releases.  This gate catches two regressions cheaply before
 * a browser run: aliases must be declared and normalized with their query/
 * hash intact, and learner views must not invent an Event Loop destination.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const vueRoot = path.join(root, 'fluent-engineering-vue');
const files = {
  router: path.join(vueRoot, 'apps/web/src/router.ts'),
  routeLinks: path.join(vueRoot, 'apps/web/src/lib/route-links.ts'),
  lesson: path.join(vueRoot, 'apps/web/src/views/LessonView.vue'),
  question: path.join(vueRoot, 'apps/web/src/views/QuestionDetailView.vue'),
  smoke: path.join(vueRoot, 'apps/web/tests/smoke.spec.ts'),
};

const failures = [];
const checks = [];
function check(id, ok, detail) {
  const row = { id, status: ok ? 'pass' : 'fail', detail };
  checks.push(row);
  if (!ok) failures.push(row);
  console.log(`${ok ? 'PASS' : 'FAIL'} ${id} — ${detail}`);
}
function read(name) {
  try { return readFileSync(files[name], 'utf8'); } catch (error) {
    check(`read:${name}`, false, String(error?.message ?? error));
    return '';
  }
}

const router = read('router');
const routeLinks = read('routeLinks');
const lesson = read('lesson');
const question = read('question');
const smoke = read('smoke');

check('router-program-alias', router.includes("path: '/program'") && router.includes("name: 'program-alias'"), 'legacy /program redirects to the root Program route');
check('router-map-alias', router.includes("path: '/map'") && router.includes("name: 'learning-map-alias'"), 'legacy /map redirects to /learning-map');
check('route-links-program-normalization', /canonical === '\/program'[\s\S]{0,80}canonical = '\/'/u.test(routeLinks), 'vueHref normalizes /program to /');
check('route-links-map-normalization', /canonical === '\/map'[\s\S]{0,100}canonical = '\/learning-map'/u.test(routeLinks), 'vueHref normalizes /map to /learning-map');
check('route-links-preserves-suffix', /return `\$\{canonical\}\$\{suffix\}`/u.test(routeLinks), 'query/hash suffix is retained after normalization');
check('lesson-no-event-loop-hardcode', !lesson.includes("labId === 'node-event-loop-001'") && !lesson.includes("'/lab/node-event-loop-001'"), 'LessonView reads controlled destination from Program map');
check('question-no-event-loop-hardcode', !question.includes("'/lab/node-event-loop-001'") && !question.includes("node-event-loop-001"), 'QuestionDetailView never invents a Node Event Loop destination');
check('browser-alias-regression', smoke.includes('canonicalizes legacy Program and Map routes without losing context'), 'desktop browser coverage exercises aliases and query/hash preservation');

const report = {
  reportVersion: 'canonical-route-gate.v1',
  generatedAt: new Date().toISOString(),
  valid: failures.length === 0,
  checks,
  failures,
};
const outputArg = process.argv.find((value) => value.startsWith('--out='));
if (outputArg) {
  const { mkdirSync, writeFileSync } = await import('node:fs');
  const output = path.resolve(root, outputArg.slice('--out='.length));
  mkdirSync(path.dirname(output), { recursive: true });
  writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
}
if (failures.length) process.exitCode = 1;
