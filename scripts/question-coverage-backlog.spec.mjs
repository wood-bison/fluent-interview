import assert from 'node:assert/strict';
import { test } from 'node:test';

import { buildBacklog, CONTRACT_VERSION, MAX_OPEN_BATCH } from './question-coverage-backlog.mjs';

function fixture() {
  const question = (id, disposition = 'theory_only', bindings = []) => ({
    stable_key: id,
    revision_id: `00000000-0000-0000-0000-${id.slice(-12).padStart(12, '0')}`,
    content_hash: 'a'.repeat(64),
    disposition,
    bindings,
  });
  return {
    pathManifest: {
      contractVersion: 'learner-path-completion.v1',
      manifestId: 'path-completion-fixture',
      contentDigest: 'path-digest',
      source: {
        questionReleaseId: 'question-release-fixture',
        capabilityBindingReleaseId: 'question-capability-release-1111111111111111',
      },
      paths: [
        {
          pathKey: 'path.nodejs-typescript',
          label: 'Node.js + TypeScript',
          current: {
            unresolvedCapabilityBindingIds: ['question.alpha', 'question.shared'],
            unresolvedQuestionIds: ['question.alpha'],
          },
        },
        {
          pathKey: 'path.java-spring',
          label: 'Java + Spring',
          current: {
            unresolvedCapabilityBindingIds: ['question.shared'],
            unresolvedQuestionIds: ['question.shared'],
          },
        },
      ],
    },
    bindingManifest: {
      contract_version: 'question-brain.capability-binding.v1',
      question_release_id: 'question-release-fixture',
      entries: [question('question.alpha'), question('question.shared')],
    },
    bindingReport: {
      binding_release_id: 'question-capability-release-1111111111111111',
      question_release_id: 'question-release-fixture',
      manifest_entries: 2,
    },
  };
}

test('buildBacklog deduplicates issue kinds per path and keeps shared cards explicit', () => {
  const input = fixture();
  const report = buildBacklog(input.pathManifest, input.bindingManifest, input.bindingReport);
  assert.equal(report.reportVersion, CONTRACT_VERSION);
  assert.equal(report.maxOpenBatch, MAX_OPEN_BATCH);
  assert.equal(report.summary.openItemCount, 3);
  assert.equal(report.summary.uniqueQuestionCount, 2);
  assert.equal(report.summary.repeatedAcrossPaths, 1);
  assert.equal(report.summary.actionCounts['review-capability-binding'], 3);
  assert.equal(report.summary.actionCounts['review-path-role'] ?? 0, 0);
  const alpha = report.items.find((item) => item.questionId === 'question.alpha');
  assert.deepEqual(alpha.workKinds, ['capability-binding', 'question-role']);
  assert.equal(report.policy.autoBinding, false);
  assert.equal(report.policy.productionReady, false);
});

test('buildBacklog fails closed when a path references a missing Brain card', () => {
  const input = fixture();
  input.pathManifest.paths[0].current.unresolvedCapabilityBindingIds.push('question.missing');
  assert.throws(
    () => buildBacklog(input.pathManifest, input.bindingManifest, input.bindingReport),
    /absent from pinned Brain binding manifest/,
  );
});

test('buildBacklog fails closed when Lab and Brain release pins differ', () => {
  const input = fixture();
  input.pathManifest.source.capabilityBindingReleaseId = 'question-capability-release-2222222222222222';
  assert.throws(
    () => buildBacklog(input.pathManifest, input.bindingManifest, input.bindingReport),
    /path\/Brain capability binding release mismatch/,
  );
});
