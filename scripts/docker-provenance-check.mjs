#!/usr/bin/env node

/**
 * Static and optional live Docker provenance guard for the five-repository
 * workspace. The static mode is CI-safe and checks that every owned build
 * starts from a digest-pinned base and emits a source revision label. Live
 * mode additionally inspects the four built service containers and refuses an
 * image without an immutable image ID or a 40-character source revision.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const live = process.argv.includes('--live');
const failures = [];
const checks = [];

function check(id, ok, detail) {
  checks.push({ id, status: ok ? 'pass' : 'fail', detail });
  if (!ok) failures.push({ id, detail });
}

function read(relativePath) {
  const absolute = path.join(root, relativePath);
  try {
    return readFileSync(absolute, 'utf8');
  } catch (error) {
    check(`file:${relativePath}`, false, `cannot read ${absolute}: ${error.message}`);
    return '';
  }
}

const dockerfiles = [
  'fluent-question-brain/deploy/compose/Dockerfile.api',
  'fluent-question-brain/deploy/compose/Dockerfile.indexer',
  'fluent-question-brain/apps/cms/Dockerfile',
  'fluent-task-runtime/deploy/compose/Dockerfile',
];

for (const relativePath of dockerfiles) {
  const source = read(relativePath);
  const fromLines = source
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('FROM '));
  check(
    `base-digest:${relativePath}`,
    fromLines.length > 0 && fromLines.every((line) => /@sha256:[0-9a-f]{64}(?:\s|$)/iu.test(line)),
    fromLines.length > 0
      ? fromLines.join(' | ')
      : 'no FROM instruction found',
  );
  check(
    `revision-arg:${relativePath}`,
    /ARG SOURCE_REVISION=unknown/u.test(source),
    'ARG SOURCE_REVISION=unknown is declared',
  );
  check(
    `revision-label:${relativePath}`,
    /org\.opencontainers\.image\.revision="\$SOURCE_REVISION"/u.test(source),
    'org.opencontainers.image.revision label uses SOURCE_REVISION',
  );
}

const brainCompose = read('fluent-question-brain/deploy/compose/compose.yaml');
check(
  'compose:brain-source-arg',
  /SOURCE_REVISION:\s*\$\{QUESTION_BRAIN_SOURCE_REVISION:-unknown\}/u.test(brainCompose),
  'Brain api/indexer/cms builds accept QUESTION_BRAIN_SOURCE_REVISION',
);
const runtimeCompose = read('fluent-task-runtime/deploy/compose/compose.yaml');
check(
  'compose:runtime-source-arg',
  /SOURCE_REVISION:\s*\$\{TASK_RUNTIME_SOURCE_REVISION:-unknown\}/u.test(runtimeCompose),
  'Runtime build accepts TASK_RUNTIME_SOURCE_REVISION',
);

if (live) {
  const containers = [
    ['fluent-question-brain-api-1', 'fluent-question-brain'],
    ['fluent-question-brain-indexer-1', 'fluent-question-brain'],
    ['fluent-question-brain-cms-1', 'fluent-question-brain'],
    ['fluent-task-runtime-runtime-1', 'fluent-task-runtime'],
  ];
  for (const [container, owner] of containers) {
    let inspection;
    try {
      inspection = JSON.parse(
        execFileSync('docker', ['inspect', container], { encoding: 'utf8' }),
      )[0];
    } catch (error) {
      check(`live:${container}`, false, `${owner} container unavailable: ${error.message}`);
      continue;
    }
    const imageId = String(inspection?.Image ?? '');
    const revision = String(inspection?.Config?.Labels?.['org.opencontainers.image.revision'] ?? '');
    check(
      `live-image:${container}`,
      /^sha256:[0-9a-f]{64}$/iu.test(imageId),
      `image=${imageId || 'missing'}`,
    );
    check(
      `live-revision:${container}`,
      /^[0-9a-f]{40}$/iu.test(revision),
      `org.opencontainers.image.revision=${revision || 'missing'}`,
    );
  }
}

const report = {
  schema: 'fluent-interview.docker-provenance.v1',
  mode: live ? 'live' : 'static',
  valid: failures.length === 0,
  checks,
  failures,
};
console.log(JSON.stringify(report, null, 2));
if (failures.length > 0) process.exitCode = 1;
