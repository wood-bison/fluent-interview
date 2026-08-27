#!/usr/bin/env node

/**
 * Build the cross-repository Question Brain authoring queue.
 *
 * PathCompletionManifest is the learner projection and Brain's binding
 * manifest is the content authority. This script joins their release pins and
 * emits one addressable review item per path/question pair. It never invents a
 * capability, role, prompt, title, answer, or placement; those remain an
 * editorial decision in a future immutable Brain release.
 */
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pathManifestPath = path.resolve(
  process.env.PATH_COMPLETION_MANIFEST ??
    path.join(root, 'fluent-engineering-lab/docs/manifests/path-completion-development-2026-08-27.json'),
);
const bindingManifestPath = path.resolve(
  process.env.CAPABILITY_BINDING_MANIFEST ??
    path.join(root, 'fluent-question-brain/docs/verification/G11-capability-binding-manifest-2026-08-28.json'),
);
const bindingReportPath = path.resolve(
  process.env.CAPABILITY_BINDING_REPORT ??
    path.join(root, 'fluent-question-brain/docs/verification/G11-capability-binding-release-2026-08-28.json'),
);
const outputPath = path.resolve(
  process.env.QUESTION_COVERAGE_BACKLOG_JSON ??
    path.join(root, 'docs/verification/two-audit-remediation/W13/question-coverage-authoring-backlog.json'),
);
const markdownPath = path.resolve(
  process.env.QUESTION_COVERAGE_BACKLOG_MD ??
    path.join(root, 'docs/verification/two-audit-remediation/W13/question-coverage-authoring-backlog.md'),
);
const checkOnly = process.argv.includes('--check');

export const CONTRACT_VERSION = 'question-coverage-authoring-backlog.v1';
export const MAX_OPEN_BATCH = 100;

const PATH_PRIORITY = new Map([
  ['path.nodejs-typescript', 1],
  ['path.java-spring', 2],
  ['path.go', 3],
  ['path.dotnet-csharp', 4],
  ['path.frontend', 5],
  ['path.algorithms', 6],
  ['path.system-design', 7],
  ['path.behavioral', 8],
  ['path.python', 9],
]);

const ISSUE_ACCEPTANCE = [
  'stable question key, revision UUID and content hash match the pinned Brain release',
  'an editor assigns an explicit canonical capability and role, or records an explicit disposition',
  'the decision carries evidence and provenance; title similarity never auto-binds a card',
  'the next immutable Question Brain release updates the Lab projection before learner counting',
];

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

function stableDigest(value) {
  return crypto.createHash('sha256').update(JSON.stringify(canonicalize(value))).digest('hex');
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function itemId(pathKey, questionId) {
  return `backlog:question-coverage:${pathKey}:${questionId}`
    .replace(/[^a-zA-Z0-9:._-]/gu, '-');
}

function validateInputs(pathManifest, bindingManifest, bindingReport) {
  const issues = [];
  if (pathManifest?.contractVersion !== 'learner-path-completion.v1') issues.push('unexpected path completion contractVersion');
  if (!Array.isArray(pathManifest?.paths) || pathManifest.paths.length === 0) issues.push('path completion manifest has no paths');
  if (bindingManifest?.contract_version !== 'question-brain.capability-binding.v1') issues.push('unexpected capability binding contract_version');
  if (!Array.isArray(bindingManifest?.entries) || bindingManifest.entries.length === 0) issues.push('capability binding manifest has no entries');
  if (!cleanString(bindingReport?.binding_release_id).match(/^question-capability-release-[a-f0-9]{16}$/u)) issues.push('binding report has no canonical binding_release_id');
  if (bindingManifest?.question_release_id !== bindingReport?.question_release_id) issues.push('binding manifest/report question release mismatch');
  if (Number(bindingReport?.manifest_entries) !== asArray(bindingManifest?.entries).length) issues.push('binding manifest/report entry count mismatch');
  if (pathManifest?.source?.questionReleaseId !== bindingManifest?.question_release_id) issues.push('path/Brain question release mismatch');
  if (pathManifest?.source?.capabilityBindingReleaseId !== bindingReport?.binding_release_id) issues.push('path/Brain capability binding release mismatch');
  return issues;
}

function bindingIndex(bindingManifest) {
  return new Map(asArray(bindingManifest.entries).map((entry) => [cleanString(entry.stable_key), entry]));
}

/**
 * Build one canonical work item for each unresolved path/question pair. The
 * same Brain card can intentionally appear on multiple paths; `pathKey` is
 * therefore part of the identity and duplicateQuestionCount is reported so
 * reviewers can decide whether one shared binding or path-specific bindings
 * are appropriate.
 */
export function buildBacklog(pathManifest, bindingManifest, bindingReport) {
  const inputIssues = validateInputs(pathManifest, bindingManifest, bindingReport);
  if (inputIssues.length) throw new Error(inputIssues.join('; '));

  const byStableKey = bindingIndex(bindingManifest);
  const pathEntries = [];
  const items = [];
  const questionPathCounts = new Map();

  for (const pathEntry of pathManifest.paths) {
    const pathKey = cleanString(pathEntry.pathKey);
    if (!pathKey) throw new Error('path entry is missing pathKey');
    const current = pathEntry.current ?? {};
    const capabilityIds = new Set(asArray(current.unresolvedCapabilityBindingIds).map(cleanString).filter(Boolean));
    const roleIds = new Set(asArray(current.unresolvedQuestionIds).map(cleanString).filter(Boolean));
    const unresolvedIds = [...new Set([...capabilityIds, ...roleIds])].sort((left, right) => left.localeCompare(right));
    const pathItems = [];

    for (const questionId of unresolvedIds) {
      const entry = byStableKey.get(questionId);
      if (!entry) throw new Error(`${pathKey}: ${questionId} is absent from pinned Brain binding manifest`);
      const workKinds = [];
      if (capabilityIds.has(questionId)) workKinds.push('capability-binding');
      if (roleIds.has(questionId)) workKinds.push('question-role');
      const existingBindings = asArray(entry.bindings)
        .filter((binding) => cleanString(binding.path_key) === pathKey)
        .map((binding) => ({
          capabilityKey: cleanString(binding.capability_key),
          role: cleanString(binding.role),
        }))
        .sort((left, right) => `${left.capabilityKey}:${left.role}`.localeCompare(`${right.capabilityKey}:${right.role}`));
      const action = existingBindings.length > 0 ? 'review-path-role' : 'review-capability-binding';
      const item = {
        itemId: itemId(pathKey, questionId),
        pathKey,
        pathLabel: cleanString(pathEntry.label) || pathKey,
        questionId,
        workKinds,
        action,
        status: 'open',
        source: 'path-completion.unresolved-question-projection',
        sourceQuestionReleaseId: cleanString(bindingManifest.question_release_id),
        sourceCapabilityBindingReleaseId: cleanString(bindingReport.binding_release_id),
        revisionId: cleanString(entry.revision_id),
        contentHash: cleanString(entry.content_hash).toLowerCase(),
        brainDisposition: cleanString(entry.disposition),
        existingBindings,
        acceptance: ISSUE_ACCEPTANCE,
      };
      pathItems.push(item);
      items.push(item);
      questionPathCounts.set(questionId, (questionPathCounts.get(questionId) ?? 0) + 1);
    }
    const byKind = {};
    for (const item of pathItems) for (const kind of item.workKinds) byKind[kind] = (byKind[kind] ?? 0) + 1;
    pathEntries.push({
      pathKey,
      pathLabel: cleanString(pathEntry.label) || pathKey,
      openItemCount: pathItems.length,
      unresolvedCapabilityBindings: capabilityIds.size,
      unresolvedQuestionRoles: roleIds.size,
      byKind,
    });
  }

  items.sort((left, right) => {
    const pathDelta = (PATH_PRIORITY.get(left.pathKey) ?? 99) - (PATH_PRIORITY.get(right.pathKey) ?? 99);
    return pathDelta || left.pathKey.localeCompare(right.pathKey) || left.questionId.localeCompare(right.questionId);
  });
  const batchedItems = items.map((item, index) => ({
    ...item,
    priority: PATH_PRIORITY.get(item.pathKey) ?? 99,
    wave: Math.floor(index / MAX_OPEN_BATCH) + 1,
    batchPosition: (index % MAX_OPEN_BATCH) + 1,
  }));
  const byAction = {};
  const byDisposition = {};
  for (const item of batchedItems) {
    byAction[item.action] = (byAction[item.action] ?? 0) + 1;
    byDisposition[item.brainDisposition] = (byDisposition[item.brainDisposition] ?? 0) + 1;
  }
  const stable = {
    reportVersion: CONTRACT_VERSION,
    source: {
      pathManifestId: cleanString(pathManifest.manifestId),
      pathContentDigest: cleanString(pathManifest.contentDigest),
      questionReleaseId: cleanString(bindingManifest.question_release_id),
      capabilityBindingReleaseId: cleanString(bindingReport.binding_release_id),
    },
    maxOpenBatch: MAX_OPEN_BATCH,
    policy: {
      productionReady: false,
      generatedText: false,
      autoBinding: false,
      humanReviewRequired: true,
      noFiller: true,
    },
    pathEntries,
    items: batchedItems,
  };
  return {
    ...stable,
    status: batchedItems.length > 0 ? 'open' : 'empty',
    summary: {
      pathCount: pathEntries.length,
      openItemCount: batchedItems.length,
      waveCount: Math.ceil(batchedItems.length / MAX_OPEN_BATCH),
      nextBatchIds: batchedItems.slice(0, MAX_OPEN_BATCH).map((item) => item.itemId),
      actionCounts: byAction,
      brainDispositionCounts: byDisposition,
      uniqueQuestionCount: questionPathCounts.size,
      repeatedAcrossPaths: [...questionPathCounts.values()].filter((count) => count > 1).length,
    },
    contentDigest: stableDigest(stable),
  };
}

export function renderMarkdown(report) {
  const lines = [
    '# Question coverage authoring backlog',
    '',
    `Status: **${report.status.toUpperCase()}**; productionReady: **false**`,
    `Question release: \`${report.source.questionReleaseId}\``,
    `Capability binding release: \`${report.source.capabilityBindingReleaseId}\``,
    '',
    'Это answer-free очередь редакторской работы. Она не создаёт capability, role, prompt или ответ и не меняет опубликованный Question Brain release.',
    '',
    `- Open items: **${report.summary.openItemCount}**; unique Brain questions: **${report.summary.uniqueQuestionCount}**; repeated across paths: **${report.summary.repeatedAcrossPaths}**.`,
    `- Bounded waves: **${report.summary.waveCount}**; batch size: **${report.maxOpenBatch}**; auto-binding: **нет**; filler: **запрещён**.`,
    '',
    '## По путям',
    '',
    '| Path | Capability review | Question-role review | Open items |',
    '| --- | ---: | ---: | ---: |',
    ...report.pathEntries.map((entry) => `| ${entry.pathLabel} | ${entry.unresolvedCapabilityBindings} | ${entry.unresolvedQuestionRoles} | ${entry.openItemCount} |`),
    '',
    '## Действия',
    '',
    ...Object.entries(report.summary.actionCounts).sort().map(([action, count]) => `- \`${action}\`: **${count}**`),
    '',
    '## Правило закрытия',
    '',
    'Каждый item закрывается только после editorial evidence, явного capability/role или disposition, нового immutable Brain release и повторной Lab projection. Один title match не является binding.',
    '',
    '## Reproduction',
    '',
    '```bash',
    'cd /Users/sergeyzhechko/developer/fluent-interview',
    'pnpm coverage:backlog',
    'pnpm coverage:backlog:check',
    '```',
    '',
    `Stable content digest: \`${report.contentDigest}\``,
    '',
  ];
  return lines.join('\n');
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

async function main() {
  const [pathManifest, bindingManifest, bindingReport] = await Promise.all([
    readJson(pathManifestPath),
    readJson(bindingManifestPath),
    readJson(bindingReportPath),
  ]);
  const report = buildBacklog(pathManifest, bindingManifest, bindingReport);
  if (checkOnly) {
    const stored = await readJson(outputPath);
    const mismatches = [];
    if (stored.reportVersion !== report.reportVersion) mismatches.push('reportVersion mismatch');
    if (stored.contentDigest !== report.contentDigest) mismatches.push(`contentDigest mismatch: ${stored.contentDigest ?? 'missing'} -> ${report.contentDigest}`);
    if (stored.summary?.openItemCount !== report.summary.openItemCount) mismatches.push('openItemCount mismatch');
    if (stored.productionReady === true || stored.policy?.productionReady !== false) mismatches.push('backlog cannot claim productionReady');
    if (mismatches.length) {
      console.error(mismatches.join('\n'));
      process.exitCode = 1;
    } else {
      console.log(JSON.stringify({ valid: true, contentDigest: report.contentDigest, summary: report.summary }, null, 2));
    }
    return;
  }
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify({ ...report, generatedAt: new Date().toISOString() }, null, 2)}\n`);
  await fs.writeFile(markdownPath, renderMarkdown(report));
  console.log(JSON.stringify({ valid: true, output: outputPath, markdown: markdownPath, contentDigest: report.contentDigest, summary: report.summary }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
