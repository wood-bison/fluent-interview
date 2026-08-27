#!/usr/bin/env node

/**
 * W15-001..010,020 — Vue build and loading-boundary gate.
 *
 * Reads the Vite manifest and generated assets. The optional `--build` flag
 * lets a local operator refresh dist first; release verification itself uses
 * the already-built owner artifact and never silently substitutes a source
 * estimate for a shipped bundle.
 */
import { execFileSync } from 'node:child_process';
import { gzipSync } from 'node:zlib';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const vueRoot = path.join(root, 'fluent-engineering-vue');
const distRoot = path.join(vueRoot, 'dist/apps/web');
const manifestPath = path.join(distRoot, 'manifest.json');
const output = path.resolve(process.env.VUE_PERFORMANCE_JSON ?? 'docs/verification/two-audit-remediation/W15/vue-performance.json');
const markdownOutput = path.resolve(process.env.VUE_PERFORMANCE_MD ?? 'docs/verification/two-audit-remediation/W15/vue-performance.md');
const check = process.argv.includes('--check');
const build = process.argv.includes('--build');

if (build) {
  const commandEnv = { ...process.env, NO_COLOR: '1' };
  delete commandEnv.FORCE_COLOR;
  execFileSync('pnpm', ['build'], { cwd: vueRoot, stdio: 'inherit', env: commandEnv });
}

const failures = [];
let manifest = null;
try {
  manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
} catch (error) {
  failures.push({ code: 'missing-manifest', detail: String(error?.message ?? error) });
}

const fileCache = new Map();
async function assetInfo(relativeFile) {
  if (fileCache.has(relativeFile)) return fileCache.get(relativeFile);
  const file = path.join(distRoot, relativeFile);
  try {
    const bytes = await readFile(file);
    const info = { file: relativeFile, rawBytes: bytes.byteLength, gzipBytes: gzipSync(bytes).byteLength };
    fileCache.set(relativeFile, info);
    return info;
  } catch (error) {
    const info = { file: relativeFile, rawBytes: null, gzipBytes: null, error: String(error?.message ?? error) };
    fileCache.set(relativeFile, info);
    return info;
  }
}

const entry = manifest ? Object.entries(manifest).find(([, value]) => value?.isEntry === true) : null;
const visited = new Set();
const initialAssetFiles = new Set();
const initialFiles = [];
async function collectInitial(key) {
  if (visited.has(key) || !manifest?.[key]) return;
  visited.add(key);
  const value = manifest[key];
  if (value.file && !initialAssetFiles.has(value.file)) {
    initialAssetFiles.add(value.file);
    initialFiles.push(await assetInfo(value.file));
  }
  for (const cssFile of value.css ?? []) {
    if (!initialAssetFiles.has(cssFile)) {
      initialAssetFiles.add(cssFile);
      initialFiles.push(await assetInfo(cssFile));
    }
  }
  for (const imported of value.imports ?? []) await collectInitial(imported);
}
if (entry) await collectInitial(entry[0]);

const initialJs = initialFiles.filter((asset) => asset.file.endsWith('.js'));
const initialCss = initialFiles.filter((asset) => asset.file.endsWith('.css'));
const initialJsRawBytes = initialJs.reduce((sum, asset) => sum + (asset.rawBytes ?? 0), 0);
const initialJsGzipBytes = initialJs.reduce((sum, asset) => sum + (asset.gzipBytes ?? 0), 0);
const initialCssRawBytes = initialCss.reduce((sum, asset) => sum + (asset.rawBytes ?? 0), 0);
const initialCssGzipBytes = initialCss.reduce((sum, asset) => sum + (asset.gzipBytes ?? 0), 0);

const allAssets = manifest ? await Promise.all([...new Set(Object.values(manifest).map((value) => value.file).filter(Boolean))].map(assetInfo)) : [];
const xtermAsset = allAssets.find((asset) => /(?:^|\/)xterm-[^/]+\.js$/u.test(asset.file));
const dynamicEntries = manifest ? Object.entries(manifest).filter(([, value]) => value?.isDynamicEntry === true).map(async ([key, value]) => ({ key, ...value, asset: await assetInfo(value.file) })) : [];
const dynamic = await Promise.all(dynamicEntries);
const missingAssets = allAssets.filter((asset) => asset.rawBytes === null);
const initialHasXterm = initialFiles.some((asset) => /(?:^|\/)xterm-[^/]+\.js$/u.test(asset.file));

const budgets = {
  initialJsRawBytes: 350_000,
  initialJsGzipBytes: 110_000,
  initialCssRawBytes: 60_000,
  xtermLazyRawBytes: 400_000,
};
if (!entry) failures.push({ code: 'missing-entry', detail: 'No Vite manifest entry found.' });
if (missingAssets.length) failures.push({ code: 'missing-assets', detail: missingAssets });
if (initialJsRawBytes > budgets.initialJsRawBytes) failures.push({ code: 'initial-js-budget', detail: { actual: initialJsRawBytes, limit: budgets.initialJsRawBytes } });
if (initialJsGzipBytes > budgets.initialJsGzipBytes) failures.push({ code: 'initial-js-gzip-budget', detail: { actual: initialJsGzipBytes, limit: budgets.initialJsGzipBytes } });
if (initialCssRawBytes > budgets.initialCssRawBytes) failures.push({ code: 'initial-css-budget', detail: { actual: initialCssRawBytes, limit: budgets.initialCssRawBytes } });
if (!xtermAsset) failures.push({ code: 'missing-xterm-lazy-asset', detail: 'xterm asset is absent from the manifest.' });
else if (xtermAsset.rawBytes > budgets.xtermLazyRawBytes) failures.push({ code: 'xterm-lazy-budget', detail: { actual: xtermAsset.rawBytes, limit: budgets.xtermLazyRawBytes } });
if (initialHasXterm) failures.push({ code: 'xterm-in-initial', detail: initialFiles.filter((asset) => asset.file.includes('xterm')) });

const questionsSource = await readFile(path.join(vueRoot, 'apps/web/src/views/QuestionsView.vue'), 'utf8');
const pagination = { boundedPageSize: /limit:\s*24\b/u.test(questionsSource), hasCursorLoad: /loadNextPage/u.test(questionsSource), noUnboundedRender: !/limit:\s*(?:[1-9]\d{3,}|\d{4,})/u.test(questionsSource) };
if (!pagination.boundedPageSize || !pagination.hasCursorLoad || !pagination.noUnboundedRender) failures.push({ code: 'question-list-boundary', detail: pagination });

const report = {
  reportVersion: 'vue-performance.v1',
  generatedAt: new Date().toISOString(),
  mode: build ? 'build-and-check' : 'read-existing-dist',
  valid: failures.length === 0,
  status: failures.length === 0 ? 'pass' : 'fail',
  budgets,
  entry: entry ? { key: entry[0], file: entry[1].file } : null,
  initial: { js: initialJs, css: initialCss, jsRawBytes: initialJsRawBytes, jsGzipBytes: initialJsGzipBytes, cssRawBytes: initialCssRawBytes, cssGzipBytes: initialCssGzipBytes },
  xterm: xtermAsset ?? null,
  initialHasXterm,
  dynamicEntryCount: dynamic.length,
  largestDynamicAssets: dynamic.map((item) => item.asset).filter((asset) => asset.rawBytes !== null).sort((left, right) => right.rawBytes - left.rawBytes).slice(0, 10),
  pagination,
  failures,
};
const markdown = [
  '# W15 — Vue performance gate',
  '',
  `Снимок: ${report.generatedAt}`,
  `Статус: **${report.status}**`,
  '',
  '| Boundary | Result |',
  '| --- | --- |',
  `| Initial JS | ${(initialJsRawBytes / 1024).toFixed(1)} KiB raw / ${(initialJsGzipBytes / 1024).toFixed(1)} KiB gzip (budget ${(budgets.initialJsRawBytes / 1024).toFixed(0)} KiB) |`,
  `| Initial CSS | ${(initialCssRawBytes / 1024).toFixed(1)} KiB raw / ${(initialCssGzipBytes / 1024).toFixed(1)} KiB gzip |`,
  `| xterm | ${xtermAsset ? `${(xtermAsset.rawBytes / 1024).toFixed(1)} KiB lazy; initial=${initialHasXterm ? 'FAIL' : 'not loaded'}` : 'missing'} |`,
  `| Question list | ${pagination.boundedPageSize && pagination.hasCursorLoad ? 'bounded cursor pagination' : 'FAIL'} |`,
  '',
  'The report is a loading-boundary check, not a claim that all route interactions are fast; interaction budgets and visual performance remain in W17.',
  '',
].join('\n');
await mkdir(path.dirname(output), { recursive: true });
await mkdir(path.dirname(markdownOutput), { recursive: true });
await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
await writeFile(markdownOutput, markdown);
console.log(JSON.stringify({ reportVersion: report.reportVersion, valid: report.valid, status: report.status, initialJsRawBytes, initialJsGzipBytes, initialCssRawBytes, initialCssGzipBytes, xterm: xtermAsset, initialHasXterm, pagination, failures, output, markdown: markdownOutput }, null, 2));
if (check && !report.valid) process.exitCode = 1;
