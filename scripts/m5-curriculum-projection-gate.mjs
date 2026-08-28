#!/usr/bin/env node

/**
 * Live contract guard for the learner Path -> Domain -> Capability projection.
 *
 * The API is the source of truth.  This check deliberately does not infer or
 * create curriculum records: it proves that every published path points to
 * real domains, every station has a deterministic capability identity and
 * every learner destination belongs to the published route vocabulary.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const apiBase = (process.env.LEARNING_API_URL ?? 'http://127.0.0.1:47000').replace(/\/$/u, '');
const outArg = process.argv.find((value) => value.startsWith('--out='));
const output = outArg ? path.resolve(root, outArg.slice('--out='.length)) : null;
const checks = [];
const failures = [];

function check(id, ok, detail) {
  const row = { id, status: ok ? 'pass' : 'fail', detail };
  checks.push(row);
  if (!ok) failures.push(row);
  console.log(`${ok ? 'PASS' : 'FAIL'} ${id} — ${detail}`);
}

function slugify(value, fallback = 'unnamed') {
  const normalized = String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-+|-+$/gu, '');
  return normalized || fallback;
}

function unique(values) {
  return new Set(values).size === values.length;
}

function pathSlug(pathKey) {
  return String(pathKey ?? '').replace(/^path\./u, '');
}

let map;
try {
  const response = await fetch(`${apiBase}/api/program/map`, { signal: AbortSignal.timeout(10_000) });
  check('map-http', response.ok, `GET /api/program/map returned ${response.status}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  map = await response.json();
} catch (error) {
  check('map-readable', false, String(error?.message ?? error));
}

if (map) {
  const paths = Array.isArray(map.pathCatalog?.paths) ? map.pathCatalog.paths : [];
  const domains = Array.isArray(map.domains) ? map.domains : [];
  const domainIds = new Set(domains.map((domain) => domain.id));
  const topics = domains.flatMap((domain) => (Array.isArray(domain.topics) ? domain.topics : []).map((topic) => ({ domain, topic })));

  check('release-status', map.release?.status === 'released', `graph release status is ${map.release?.status ?? 'missing'}`);
  check('paths-present', paths.length > 0, `${paths.length} published paths`);
  check('domains-present', domains.length > 0, `${domains.length} published domains`);
  check('path-keys-unique', unique(paths.map((item) => item.key)), 'path keys are unique');
  check('path-entry-routes-unique', unique(paths.map((item) => item.entryRoute)), 'path entry routes are unique');
  check('domain-ids-unique', unique(domains.map((item) => item.id)), 'domain ids are unique');

  for (const pathRecord of paths) {
    const expectedRoute = `/paths/${pathSlug(pathRecord.key)}`;
    check(`path-route:${pathRecord.key}`, pathRecord.entryRoute === expectedRoute, `entryRoute=${pathRecord.entryRoute ?? 'missing'} expected=${expectedRoute}`);
    const areaIds = Array.isArray(pathRecord.curriculumAreaIds) ? pathRecord.curriculumAreaIds : [];
    check(`path-domains:${pathRecord.key}`, areaIds.length > 0 && unique(areaIds) && areaIds.every((id) => domainIds.has(id)), `${areaIds.length} domain references resolve uniquely`);
  }

  const capabilityKeys = new Map();
  for (const { domain, topic } of topics) {
    const topicId = `${domain.id}:${topic.id}`;
    check(`station-route:${topicId}`, /^\/practice\/(?:lesson|lab)\/[a-z0-9-]+$/u.test(String(topic.route ?? '')), `route=${topic.route ?? 'missing'}`);
    check(`station-capability:${topicId}`, typeof topic.capability === 'string' && topic.capability.trim().length > 0, 'capability label is present');
    const key = `capability.${slugify(topic.capability)}`;
    const labels = capabilityKeys.get(key) ?? new Set();
    labels.add(topic.capability);
    capabilityKeys.set(key, labels);
  }

  check('stations-present', topics.length > 0, `${topics.length} published stations`);
  check('station-ids-unique', unique(topics.map(({ topic }) => topic.id)), 'station ids are unique across the published graph');
  check('capability-keys-collision-free', [...capabilityKeys.values()].every((labels) => labels.size === 1), `${capabilityKeys.size} deterministic capability keys`);

  for (const [key, labels] of capabilityKeys) {
    check(`capability-key:${key}`, /^capability\.[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(key), `labels=${[...labels].join(', ')}`);
  }
}

const report = {
  reportVersion: 'm5-curriculum-projection-gate.v1',
  generatedAt: new Date().toISOString(),
  apiBase,
  valid: failures.length === 0,
  checks,
  failures,
};
if (output) {
  mkdirSync(path.dirname(output), { recursive: true });
  writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
}
if (failures.length) process.exitCode = 1;

