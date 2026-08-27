#!/usr/bin/env node

/**
 * Brain ↔ Task Runtime release join gate.
 *
 * The learner must never execute a revision that is not part of the same
 * published Question Brain release the Lab advertises.  This check is
 * intentionally read-only and verifies the public, answer-free projections:
 * release identity, question binding revision/hash, and released runnable
 * revisions.  A missing or mismatched tuple is a hard failure.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const brainUrl = (process.env.BRAIN_API_URL ?? 'http://127.0.0.1:48127').replace(/\/$/u, '');
const runtimeUrl = (process.env.RUNTIME_API_URL ?? 'http://127.0.0.1:48227').replace(/\/$/u, '');
const jsonPath = path.resolve(process.env.RUNTIME_RELEASE_JOIN_JSON ?? 'docs/verification/two-audit-remediation/W11/runtime-release-join.json');
const markdownPath = path.resolve(process.env.RUNTIME_RELEASE_JOIN_MD ?? jsonPath.replace(/\.json$/u, '.md'));
const timeoutMs = Number(process.env.RUNTIME_JOIN_TIMEOUT_MS ?? 5000);

const checks = [];
const failures = [];
const record = (id, ok, detail, extra = {}) => {
  const row = { id, status: ok ? 'pass' : 'fail', detail, ...extra };
  checks.push(row);
  if (!ok) failures.push(row);
  console.log(`${ok ? 'PASS' : 'FAIL'} ${id} — ${detail}`);
};

async function fetchJson(id, url) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
    const text = await response.text();
    let body = null;
    try { body = JSON.parse(text); } catch { /* reported as a contract failure */ }
    record(id, response.ok && body !== null, response.ok ? 'JSON projection available' : `HTTP ${response.status}`, {
      url,
      httpStatus: response.status,
    });
    if (!response.ok || body === null) return null;
    return body;
  } catch (error) {
    record(id, false, error instanceof Error ? error.message : String(error), { url });
    return null;
  }
}

const brainRelease = await fetchJson('brain-release-readable', `${brainUrl}/v1/release`);
const brainCatalog = await fetchJson('brain-catalog-readable', `${brainUrl}/v1/catalog?limit=2000`);
const runtimeHealth = await fetchJson('runtime-readiness-readable', `${runtimeUrl}/v1/health/ready`);
const runtimeFamilies = await fetchJson('runtime-catalog-readable', `${runtimeUrl}/v1/task-families`);

const brainReleaseId = typeof brainRelease?.release_id === 'string' ? brainRelease.release_id : null;
const catalogReleaseId = typeof brainCatalog?.release_id === 'string' ? brainCatalog.release_id : null;
const runtimeQuestionRelease = runtimeHealth?.dependencies?.questionRelease ?? null;
const runtimeReleaseId = typeof runtimeFamilies?.releaseId === 'string' ? runtimeFamilies.releaseId : null;

record(
  'brain-catalog-release-identity',
  Boolean(brainReleaseId && catalogReleaseId && brainReleaseId === catalogReleaseId),
  brainReleaseId && catalogReleaseId ? `${brainReleaseId} == ${catalogReleaseId}` : 'Brain release/catalog release ID is missing',
  { brainReleaseId, catalogReleaseId },
);
record(
  'runtime-question-release-identity',
  Boolean(brainReleaseId && runtimeQuestionRelease && brainReleaseId === runtimeQuestionRelease),
  brainReleaseId && runtimeQuestionRelease ? `${brainReleaseId} == ${runtimeQuestionRelease}` : 'Runtime question release dependency is missing',
  { brainReleaseId, runtimeQuestionRelease },
);
record('brain-production-only', brainRelease?.include_fixtures === false && brainRelease?.checks?.fixtures === 0,
  'Question release excludes fixtures', { includeFixtures: brainRelease?.include_fixtures, fixtureCount: brainRelease?.checks?.fixtures });
record('runtime-ready', runtimeHealth?.ready === true && runtimeHealth?.state === 'ready',
  runtimeHealth?.ready === true ? 'Task Runtime reports ready' : 'Task Runtime is not ready', { state: runtimeHealth?.state });
record('runtime-release-id', Boolean(runtimeReleaseId), runtimeReleaseId ?? 'Runtime release ID is missing', { runtimeReleaseId });

const catalogItems = Array.isArray(brainCatalog?.questions) ? brainCatalog.questions : [];
const byStableKey = new Map(catalogItems.map((item) => [item.stable_key, item]));
const families = Array.isArray(runtimeFamilies?.families) ? runtimeFamilies.families : [];
let bindingCount = 0;
let revisionCount = 0;
let runnableRevisionCount = 0;
let deferredRevisionCount = 0;
const bindingMismatches = [];
const invalidRevisions = [];

for (const family of families) {
  const familyRevisions = Array.isArray(family?.revisions) ? family.revisions : [];
  const hasRunnableRevision = familyRevisions.some((revision) => revision?.runnable === true && revision?.availability === 'runnable');
  const deferredCapabilityOnly = !hasRunnableRevision
    && family?.status === 'unreleased'
    && !Array.isArray(family?.questionBindings);
  const familyReleased = family?.status === 'released' || deferredCapabilityOnly;
  record(`family:${family?.key ?? 'unknown'}:${deferredCapabilityOnly ? 'deferred' : 'released'}`, familyReleased,
    familyReleased ? (deferredCapabilityOnly ? 'deferred capability-only family is non-runnable' : 'released') : `status=${family?.status ?? 'missing'}`, { family: family?.key, deferredCapabilityOnly });
  for (const binding of Array.isArray(family?.questionBindings) ? family.questionBindings : []) {
    bindingCount += 1;
    const item = byStableKey.get(binding?.stableKey);
    const sameRevision = item?.revision_id === binding?.revisionId;
    const sameHash = item?.content_hash === binding?.contentHash;
    if (!item || !sameRevision || !sameHash) {
      bindingMismatches.push({ family: family?.key, stableKey: binding?.stableKey, expectedRevision: binding?.revisionId, actualRevision: item?.revision_id ?? null, expectedHash: binding?.contentHash, actualHash: item?.content_hash ?? null });
    }
  }
  for (const revision of familyRevisions) {
    revisionCount += 1;
    const immutable = typeof revision?.immutableHash === 'string' && /^[a-f0-9]{64}$/u.test(revision.immutableHash);
    const runnableRelease = revision?.runnable === true && revision?.availability === 'runnable'
      && revision?.status === 'released';
    const deferredRevision = revision?.runnable === false
      && ['unreleased', 'deferred', 'preview'].includes(revision?.availability);
    if (runnableRelease) runnableRevisionCount += 1;
    if (deferredRevision) deferredRevisionCount += 1;
    if (!immutable || (!runnableRelease && !deferredRevision)) {
      invalidRevisions.push({ family: family?.key, taskId: revision?.taskId, revision: revision?.revision, status: revision?.status, availability: revision?.availability, runnable: revision?.runnable, immutableHash: revision?.immutableHash ?? null });
    }
  }
}

record('runtime-question-bindings', bindingMismatches.length === 0 && bindingCount > 0,
  bindingMismatches.length === 0 ? `${bindingCount} binding(s) match Brain revision and content hash` : `${bindingMismatches.length} binding mismatch(es)`, { bindingCount, mismatches: bindingMismatches });
record('runtime-revisions-immutable-runnable', invalidRevisions.length === 0 && revisionCount > 0,
  invalidRevisions.length === 0 ? `${revisionCount} revision(s) have immutable hashes; ${runnableRevisionCount} runnable and ${deferredRevisionCount} explicitly deferred` : `${invalidRevisions.length} invalid revision(s)`, { revisionCount, runnableRevisionCount, deferredRevisionCount, invalid: invalidRevisions });

const report = {
  reportVersion: 'runtime-release-join-gate.v1',
  generatedAt: new Date().toISOString(),
  brainUrl,
  runtimeUrl,
  releaseTuple: {
    questionReleaseId: brainReleaseId,
    catalogReleaseId,
    runtimeQuestionReleaseId: runtimeQuestionRelease,
    runtimeReleaseId,
  },
  counts: {
    brainCatalog: catalogItems.length,
    runtimeFamilies: families.length,
    runtimeQuestionBindings: bindingCount,
    runtimeRevisions: revisionCount,
    runnableRevisions: runnableRevisionCount,
    deferredRevisions: deferredRevisionCount,
  },
  checks,
  failures,
  valid: failures.length === 0,
};

const markdown = [
  '# Runtime release join gate',
  '',
  `- Status: **${report.valid ? 'PASS' : 'BLOCKED'}**`,
  `- Generated: ${report.generatedAt}`,
  `- Brain question release: \`${brainReleaseId ?? 'missing'}\``,
  `- Runtime question release dependency: \`${runtimeQuestionRelease ?? 'missing'}\``,
  `- Runtime task release: \`${runtimeReleaseId ?? 'missing'}\``,
  `- Catalog bindings checked: ${bindingCount}`,
  `- Revisions checked: ${revisionCount} (${runnableRevisionCount} runnable, ${deferredRevisionCount} deferred)`,
  '',
  report.valid ? 'Every Runtime question binding matches the published Brain revision and content hash; every runnable revision is released and immutable, while deferred revisions are explicitly non-runnable.' : 'The learner release is blocked until every failed identity, binding or revision check is repaired.',
  '',
  '## Checks',
  '',
  ...checks.map((check) => `- ${check.status === 'pass' ? '[x]' : '[ ]'} ${check.id}: ${check.detail}`),
  '',
].join('\n');

await mkdir(path.dirname(jsonPath), { recursive: true });
await writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
await writeFile(markdownPath, markdown, 'utf8');
console.log(JSON.stringify({ reportVersion: report.reportVersion, valid: report.valid, checks: checks.length, failures: failures.length, output: jsonPath, markdown: markdownPath }, null, 2));
if (!report.valid) process.exitCode = 1;
