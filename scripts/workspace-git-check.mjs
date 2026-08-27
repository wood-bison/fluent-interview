#!/usr/bin/env node

/**
 * Read-only Git provenance check for the five-repository workspace.
 *
 * The umbrella deliberately does not vendor child source.  This check keeps
 * that topology honest: every repository must exist at the declared path,
 * stay on its declared branch, and (in strict mode) have a real remote,
 * immutable revision pin and a clean tree.  `--development` is the explicit
 * local exception used while a release is being assembled; it reports those
 * gaps as warnings instead of silently pretending that a fresh clone is
 * reproducible.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contractPath = path.join(root, 'workspace.yaml');
const development = process.argv.includes('--development');
const gitOnly = process.argv.includes('--git-only');
const outputArg = process.argv.find((value) => value.startsWith('--out='));
const outputPath = outputArg ? path.resolve(root, outputArg.slice('--out='.length)) : null;

function parseRepositories(text) {
  const entries = [];
  const section = text.match(/^repositories:\n([\s\S]*?)(?=^services:)/mu)?.[1] ?? '';
  const blocks = section.split(/\n(?=  - id: )/u).filter((block) => /^  - id: /mu.test(block));
  for (const block of blocks) {
    const value = (key) => block.match(new RegExp(`^    ${key}: (.+)$`, 'mu'))?.[1]?.trim() ?? null;
    const id = block.match(/^  - id: (.+)$/mu)?.[1]?.trim() ?? null;
    if (!id) continue;
    entries.push({
      id,
      path: value('path'),
      remote: value('remote'),
      branch: value('branch'),
      revision: value('revision'),
    });
  }
  return entries;
}

function command(args, cwd) {
  try {
    return execFileSync(args[0], args.slice(1), {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 8 * 1024 * 1024,
    }).trim();
  } catch {
    return '';
  }
}

function gitSnapshot(repoPath) {
  const topLevel = command(['git', 'rev-parse', '--show-toplevel'], repoPath);
  if (!topLevel) return null;
  const remote = command(['git', 'remote', 'get-url', 'origin'], repoPath) || null;
  const revision = command(['git', 'rev-parse', 'HEAD'], repoPath) || null;
  const treeDigest = command(['git', 'rev-parse', 'HEAD^{tree}'], repoPath) || null;
  const branch = command(['git', 'branch', '--show-current'], repoPath) || null;
  const dirtyFiles = command(['git', 'status', '--porcelain', '--untracked-files=all'], repoPath)
    .split('\n')
    .map((line) => line.trimEnd())
    .filter(Boolean);
  return {
    topLevel: path.resolve(topLevel),
    remote,
    branch,
    revision,
    treeDigest,
    clean: dirtyFiles.length === 0,
    dirtyFiles,
  };
}

const failures = [];
const warnings = [];
const repositories = parseRepositories(readFileSync(contractPath, 'utf8'));
const seenPaths = new Set();
const snapshots = [];

if (repositories.length !== 5) {
  failures.push({ code: 'repository-count', detail: `workspace.yaml declares ${repositories.length} repositories; expected 5` });
}

for (const repository of repositories) {
  const relativePath = repository.path ?? '';
  const resolvedPath = path.resolve(root, relativePath);
  const row = { ...repository, resolvedPath: relativePath, present: false, snapshot: null, failures: [], warnings: [] };
  if (seenPaths.has(relativePath)) row.failures.push({ code: 'duplicate-path', detail: relativePath });
  seenPaths.add(relativePath);
  const snapshot = gitSnapshot(resolvedPath);
  row.present = Boolean(snapshot);
  row.snapshot = snapshot;
  if (!snapshot) {
    row.failures.push({ code: 'missing-git-root', detail: resolvedPath });
    failures.push({ code: 'missing-git-root', detail: `${repository.id}: ${resolvedPath}` });
    snapshots.push(row);
    continue;
  }
  if (repository.branch && snapshot.branch !== repository.branch) {
    const vaultReviewBranch = repository.id === 'fluent-question-vault' && Boolean(snapshot.branch?.startsWith('codex/'));
    if (vaultReviewBranch && development) {
      row.warnings.push({ code: 'review-branch', detail: `${snapshot.branch} is an explicit development-only vault review branch` });
    } else {
      row.failures.push({ code: 'branch-policy', detail: `${snapshot.branch ?? 'detached'} != ${repository.branch}` });
    }
  }
  if (!repository.remote || repository.remote === 'local-only') {
    row.warnings.push({ code: 'remote-unavailable', detail: repository.remote ?? 'missing remote' });
  } else if (!snapshot.remote) {
    row.failures.push({ code: 'remote-missing', detail: `origin is not configured; expected ${repository.remote}` });
  } else if (snapshot.remote !== repository.remote) {
    row.failures.push({ code: 'remote-mismatch', detail: `${snapshot.remote} != ${repository.remote}` });
  }
  if (!repository.revision) {
    row.warnings.push({ code: 'revision-unpinned', detail: 'workspace.yaml has no immutable 40-character revision pin' });
  } else if (!/^[0-9a-f]{40}$/u.test(repository.revision)) {
    row.failures.push({ code: 'revision-invalid', detail: repository.revision });
  } else if (snapshot.revision !== repository.revision) {
    row.failures.push({ code: 'revision-mismatch', detail: `${snapshot.revision} != ${repository.revision}` });
  }
  if (!snapshot.clean) row.warnings.push({ code: 'dirty-tree', detail: `${snapshot.dirtyFiles.length} changed path(s)` });
  if (row.failures.length) failures.push(...row.failures.map((item) => ({ code: item.code, detail: `${repository.id}: ${item.detail}` })));
  if (row.warnings.length) warnings.push(...row.warnings.map((item) => ({ code: item.code, detail: `${repository.id}: ${item.detail}` })));
  snapshots.push(row);
}

const report = {
  reportVersion: 'workspace-git-audit.v1',
  generatedAt: new Date().toISOString(),
  mode: development ? 'development' : 'strict',
  contract: path.relative(root, contractPath),
  valid: failures.length === 0 && (development || warnings.length === 0),
  strictReleaseReady: failures.length === 0 && warnings.length === 0,
  failures,
  warnings,
  repositories: snapshots,
};

if (outputPath) {
  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
}

if (!gitOnly) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(JSON.stringify({ ...report, repositories: report.repositories.map((item) => ({
    id: item.id,
    path: item.path,
    remote: item.remote,
    branch: item.branch,
    revision: item.revision,
    present: item.present,
    clean: item.snapshot?.clean ?? false,
    actualRevision: item.snapshot?.revision ?? null,
    treeDigest: item.snapshot?.treeDigest ?? null,
    failures: item.failures,
    warnings: item.warnings,
  })) }, null, 2));
}

if (!development && !report.strictReleaseReady) process.exitCode = 1;
