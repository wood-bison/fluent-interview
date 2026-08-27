#!/usr/bin/env node

/**
 * W14-001..009 — design-token and Tailwind policy gate.
 *
 * The token file is the only place where literal palette values may live.
 * This is intentionally a small, deterministic source audit: it does not
 * attempt to evaluate CSS, and it never edits the tree. It reports the
 * semantic roles/scales, theme hooks, duplicate declarations in one scope,
 * and raw colours in feature code.
 */
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tokenFile = path.join(root, 'fluent-engineering-vue/packages/design-tokens/tokens.css');
const policyFile = path.join(root, 'docs/design-system/fluent-design-tokens.v1.md');
const output = path.resolve(process.env.DESIGN_TOKEN_AUDIT_JSON ?? 'docs/verification/two-audit-remediation/W14/design-token-audit.json');
const markdownOutput = path.resolve(process.env.DESIGN_TOKEN_AUDIT_MD ?? 'docs/verification/two-audit-remediation/W14/design-token-audit.md');
const check = process.argv.includes('--check');

const requiredTokens = [
  '--fel-surface-canvas', '--fel-surface-content', '--fel-surface-muted', '--fel-surface-control',
  '--fel-ink', '--fel-ink-muted', '--fel-border-subtle', '--fel-border-strong',
  '--fel-accent', '--fel-accent-soft', '--fel-accent-contrast', '--fel-success', '--fel-warning', '--fel-danger',
  '--fel-font-display', '--fel-font-body', '--fel-font-mono',
  '--fel-type-xs', '--fel-type-sm', '--fel-type-body', '--fel-type-lead', '--fel-type-title', '--fel-type-display',
  '--fel-space-unit', '--fel-space-0', '--fel-space-1', '--fel-space-2', '--fel-space-3', '--fel-space-4', '--fel-space-5', '--fel-space-6', '--fel-space-8', '--fel-space-10', '--fel-space-12',
  '--fel-radius-xs', '--fel-radius-sm', '--fel-radius-md', '--fel-radius-lg', '--fel-radius-pill',
  '--fel-shadow', '--fel-shadow-control', '--fel-shadow-active', '--fel-glass-blur', '--fel-glass-saturation',
  '--fel-motion-fast', '--fel-motion-normal', '--fel-motion-emphasis', '--fel-ease-standard', '--fel-ease-emphasis',
];

const featureRoots = [
  path.join(root, 'fluent-engineering-vue/apps/web/src'),
  path.join(root, 'fluent-engineering-vue/packages/ui/src'),
];
const sourceExtensions = new Set(['.vue', '.css', '.ts', '.tsx', '.js', '.jsx', '.html']);
const rawColourPattern = /(?:#[0-9a-f]{3,8}\b|rgba?\s*\(|hsla?\s*\()/giu;
const allowedRawFiles = new Set([tokenFile]);

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'test-results') continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesUnder(file));
    else if (sourceExtensions.has(path.extname(entry.name))) files.push(file);
  }
  return files;
}

function lineAt(text, index) {
  return text.slice(0, index).split('\n').length;
}

function declarationsInScope(block) {
  const values = new Map();
  for (const match of block.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/giu)) {
    const name = match[1];
    const value = match[2].trim();
    const rows = values.get(name) ?? [];
    rows.push(value);
    values.set(name, rows);
  }
  return values;
}

const tokenText = await readFile(tokenFile, 'utf8');
const policyText = await readFile(policyFile, 'utf8');
const globalStyleText = await readFile(path.join(root, 'fluent-engineering-vue/apps/web/src/styles.css'), 'utf8');
const themeSurfaceText = `${tokenText}\n${globalStyleText}`;
const allDeclarations = [...tokenText.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/giu)].map((match) => ({ name: match[1], value: match[2].trim(), line: lineAt(tokenText, match.index ?? 0) }));
const tokenNames = new Set(allDeclarations.map((declaration) => declaration.name));
const missingTokens = requiredTokens.filter((name) => !tokenNames.has(name));

const themeBlock = tokenText.match(/@theme\s+inline\s*\{([\s\S]*?)\n\}/iu)?.[1] ?? '';
const themeDeclarations = declarationsInScope(themeBlock);
const duplicateThemeDeclarations = [...themeDeclarations.entries()]
  .filter(([, values]) => values.length > 1)
  .map(([name, values]) => ({ name, values }));

const featureFiles = (await Promise.all(featureRoots.map(filesUnder))).flat();
const rawColourViolations = [];
for (const file of featureFiles) {
  if (allowedRawFiles.has(file)) continue;
  const text = await readFile(file, 'utf8');
  for (const match of text.matchAll(rawColourPattern)) rawColourViolations.push({ file: path.relative(root, file), line: lineAt(text, match.index ?? 0), value: match[0] });
}

const themeHooks = {
  explicitLight: /:root\s*\{/u.test(tokenText) && /color-scheme:\s*light/u.test(tokenText),
  explicitDark: /\[data-theme=["']dark["']\]\s*\{/u.test(tokenText) && /color-scheme:\s*dark/u.test(tokenText),
  systemFallback: /@media\s*\(prefers-color-scheme:\s*dark\)/u.test(tokenText),
  reducedTransparency: /prefers-reduced-transparency/u.test(themeSurfaceText),
  reducedMotion: /prefers-reduced-motion/u.test(themeSurfaceText),
};
const missingThemeHooks = Object.entries(themeHooks).filter(([, present]) => !present).map(([name]) => name);

const policySections = ['Semantic roles', 'Scales', 'Tailwind policy', 'Material boundary', 'Ownership and change protocol'];
const missingPolicySections = policySections.filter((section) => !policyText.includes(`## ${section}`));

const failures = [];
if (missingTokens.length) failures.push({ code: 'missing-token', detail: missingTokens });
if (duplicateThemeDeclarations.length) failures.push({ code: 'duplicate-theme-token', detail: duplicateThemeDeclarations });
if (rawColourViolations.length) failures.push({ code: 'raw-feature-colour', detail: rawColourViolations });
if (missingThemeHooks.length) failures.push({ code: 'missing-theme-hook', detail: missingThemeHooks });
if (missingPolicySections.length) failures.push({ code: 'missing-policy-section', detail: missingPolicySections });

const report = {
  reportVersion: 'design-token-audit.v1',
  generatedAt: new Date().toISOString(),
  tokenFile: path.relative(root, tokenFile),
  policyFile: path.relative(root, policyFile),
  valid: failures.length === 0,
  status: failures.length === 0 ? 'pass' : 'fail',
  tokenCount: tokenNames.size,
  requiredTokenCount: requiredTokens.length,
  missingTokens,
  duplicateThemeDeclarations,
  rawColourViolations,
  themeHooks,
  missingThemeHooks,
  policySections,
  missingPolicySections,
  featureRoots: featureRoots.map((directory) => path.relative(root, directory)),
  failures,
};

const markdown = [
  '# W14 — design token audit',
  '',
  `Снимок: ${report.generatedAt}`,
  `Статус: **${report.status}**`,
  '',
  `Token source: \`${report.tokenFile}\` · ${report.tokenCount}/${report.requiredTokenCount} required names present.`,
  '',
  '| Check | Result |',
  '| --- | --- |',
  `| Required semantic/scales | ${missingTokens.length ? `FAIL (${missingTokens.length} missing)` : 'PASS'} |`,
  `| Duplicate declarations inside @theme | ${duplicateThemeDeclarations.length ? `FAIL (${duplicateThemeDeclarations.length})` : 'PASS'} |`,
  `| Raw colours outside token source | ${rawColourViolations.length ? `FAIL (${rawColourViolations.length})` : 'PASS'} |`,
  `| Light/dark/system/reduced-* hooks | ${missingThemeHooks.length ? `FAIL (${missingThemeHooks.join(', ')})` : 'PASS'} |`,
  `| Policy documentation | ${missingPolicySections.length ? `FAIL (${missingPolicySections.join(', ')})` : 'PASS'} |`,
  '',
  'Feature code may consume semantic `--fel-*` roles or Tailwind utilities mapped by `@theme inline`; palette literals remain confined to the token source.',
  '',
].join('\n');

await mkdir(path.dirname(output), { recursive: true });
await mkdir(path.dirname(markdownOutput), { recursive: true });
await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
await writeFile(markdownOutput, markdown);
console.log(JSON.stringify({ reportVersion: report.reportVersion, valid: report.valid, status: report.status, tokenCount: report.tokenCount, missingTokens, duplicateThemeDeclarations, rawColourViolations: rawColourViolations.length, missingThemeHooks, output, markdown: markdownOutput }, null, 2));
if (check && !report.valid) process.exitCode = 1;
