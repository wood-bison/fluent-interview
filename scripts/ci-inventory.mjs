#!/usr/bin/env node

/**
 * W03-001..004 — workflow inventory and stale-reference gate.
 *
 * The umbrella repository does not vendor child repositories. This report
 * therefore inspects each declared checkout in place, records the workflow
 * surface, and fails on references to the retired Angular/Nx product or
 * deleted task-image paths. Missing optional workflows are reported as gaps,
 * never silently treated as CI coverage.
 */
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');
const output = path.resolve(process.env.CI_INVENTORY_JSON ?? 'docs/verification/two-audit-remediation/W03/ci-inventory.json');
const markdownOutput = path.resolve(process.env.CI_INVENTORY_MD ?? 'docs/verification/two-audit-remediation/W03/ci-inventory.md');
const workspaceText = await readFile(path.join(root, 'workspace.yaml'), 'utf8');

function repositoryEntries(text) {
  const section = text.match(/^repositories:\n([\s\S]*?)(?=^services:)/mu)?.[1] ?? '';
  return section.split(/\n(?=  - id: )/u)
    .filter((block) => /^  - id: /mu.test(block))
    .map((block) => ({
      id: block.match(/^  - id: (.+)$/mu)?.[1]?.trim(),
      path: block.match(/^    path: (.+)$/mu)?.[1]?.trim(),
      role: block.match(/^    role: (.+)$/mu)?.[1]?.trim(),
    }))
    .filter((entry) => entry.id && entry.path);
}

async function workflowFiles(dir) {
  try {
    return (await readdir(path.join(dir, '.github/workflows'), { withFileTypes: true }))
      .filter((entry) => entry.isFile() && /\.(?:yml|yaml)$/u.test(entry.name))
      .map((entry) => entry.name)
      .sort();
  } catch {
    return [];
  }
}

const requiredMarkers = {
  'fluent-engineering-lab': ['lint', 'test', 'build', 'g13:boundary'],
  'fluent-engineering-vue': ['pnpm check', 'frozen-lockfile'],
  'fluent-question-brain': ['go test', 'go vet', 'gofmt'],
  'fluent-task-runtime': ['go test', 'go vet', 'image-manifest'],
  // Vault is a history mirror. It deliberately has no product CI owner.
  'fluent-question-vault': [],
};
const retiredReference = /(?:fluent-engineering-lab\/apps\/web|angular\.json|@angular\/|nx\s+serve\s+web|fluent-interview-studio|task-images\/|docker\/task-images)/giu;
const repositories = repositoryEntries(workspaceText);
const rows = [];
const failures = [];
const warnings = [];

for (const repository of repositories) {
  const repositoryRoot = path.join(root, repository.path);
  const names = await workflowFiles(repositoryRoot);
  const workflows = [];
  for (const name of names) {
    const file = path.join(repositoryRoot, '.github/workflows', name);
    const text = await readFile(file, 'utf8');
    workflows.push({ name, bytes: Buffer.byteLength(text), markers: requiredMarkers[repository.id]?.filter((marker) => text.includes(marker)) ?? [], staleReferences: [...text.matchAll(retiredReference)].map((match) => match[0]) });
  }
  const combined = workflows.map((workflow) => workflow.name + '\n' + workflow.markers.join('\n') + '\n' + workflow.staleReferences.join('\n')).join('\n');
  const markers = requiredMarkers[repository.id] ?? [];
  const missingMarkers = markers.filter((marker) => !combined.includes(marker));
  const stale = workflows.flatMap((workflow) => workflow.staleReferences.map((reference) => ({ workflow: workflow.name, reference })));
  const row = {
    id: repository.id,
    path: repository.path,
    role: repository.role,
    workflowCount: workflows.length,
    workflows,
    requiredMarkers: markers,
    missingMarkers,
    staleReferences: stale,
    status: stale.length || missingMarkers.length ? 'review' : 'pass',
  };
  rows.push(row);
  if (stale.length) failures.push({ code: 'stale-reference', repository: repository.id, detail: stale });
  if (missingMarkers.length) warnings.push({ code: 'missing-ci-marker', repository: repository.id, detail: missingMarkers });
  if (repository.id !== 'fluent-question-vault' && names.length === 0) warnings.push({ code: 'missing-workflow', repository: repository.id, detail: 'No .github/workflows/*.yml found.' });
  if (repository.id === 'fluent-question-vault' && names.length === 0) warnings.push({ code: 'intentional-no-ci', repository: repository.id, detail: 'History mirror; CI owner is the content source/release gate.' });
}

const report = {
  reportVersion: 'ci-inventory.v1',
  generatedAt: new Date().toISOString(),
  workspace: 'fluent-interview',
  valid: failures.length === 0,
  status: failures.length === 0 ? 'pass-with-coverage-gaps' : 'fail',
  failures,
  warnings,
  repositories: rows,
};
const markdown = [
  '# W03 — CI/workflow inventory',
  '',
  `Снимок: ${report.generatedAt}`,
  `Статус: **${report.status}**`,
  '',
  'Инвентарь не притворяется aggregate CI: он показывает, какие child workflows реально существуют, какие обязательные маркеры покрыты и какие gaps остаются.',
  '',
  '| Repository | Workflows | Required markers missing | Stale refs | Status |',
  '| --- | ---: | --- | ---: | --- |',
  ...rows.map((row) => `| ${row.id} | ${row.workflowCount} | ${row.missingMarkers.length ? row.missingMarkers.join(', ') : '—'} | ${row.staleReferences.length} | ${row.status} |`),
  '',
  '## W03 interpretation',
  '',
  '- `valid` означает только отсутствие stale references; warnings показывают coverage gaps и не скрываются.',
  '- Question Vault намеренно не считается product CI owner: его проверяет umbrella provenance и Brain release gate.',
  '- Полный cross-repository aggregate запускается отдельной командой `pnpm release:verify`.',
  '',
].join('\n');

await mkdir(path.dirname(output), { recursive: true });
await mkdir(path.dirname(markdownOutput), { recursive: true });
await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
await writeFile(markdownOutput, markdown);
console.log(JSON.stringify({ reportVersion: report.reportVersion, valid: report.valid, status: report.status, failures, warnings, output, markdown: markdownOutput }, null, 2));
if (check && !report.valid) process.exitCode = 1;
