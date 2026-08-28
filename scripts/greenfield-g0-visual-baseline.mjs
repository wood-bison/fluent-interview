#!/usr/bin/env node

/**
 * G0 reference visual baseline.
 *
 * This harness deliberately lives in the umbrella repository: it captures the
 * frozen reference product before any greenfield target code exists. Images
 * are written to an explicit external artifact directory; only the manifest
 * (paths, dimensions, hashes and diagnostics) belongs in Git.
 */

// The umbrella package intentionally has no browser dependency. Resolve the
// pinned runner from the reference Vue workspace instead of installing a
// second copy or relying on an ambient global.
import { chromium } from '../fluent-engineering-vue/node_modules/.pnpm/@playwright+test@1.62.1/node_modules/@playwright/test/index.mjs';
import { createHash } from 'node:crypto';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const baseUrl = process.env.WEB_URL ?? 'http://localhost:47350';
const output = process.argv.find((value) => value.startsWith('--out='))?.slice('--out='.length);
const artifactDir = process.argv.find((value) => value.startsWith('--artifacts='))?.slice('--artifacts='.length);

if (!output || !artifactDir) {
  console.error('Usage: node scripts/greenfield-g0-visual-baseline.mjs --out=<manifest.json> --artifacts=<directory>');
  process.exit(2);
}

const viewports = [
  { id: 'macbook-pro-13', cssWidth: 1440, cssHeight: 900, dpr: 1, class: 'desktop' },
  { id: 'macbook-pro-16', cssWidth: 1728, cssHeight: 1117, dpr: 1, class: 'desktop' },
  { id: 'apple-studio-display', cssWidth: 2560, cssHeight: 1440, dpr: 1, class: 'desktop' },
  { id: 'narrow-non-regression', cssWidth: 390, cssHeight: 844, dpr: 1, class: 'narrow' },
];
const routes = [
  { id: 'program', path: '/' },
  { id: 'atlas', path: '/learning-map' },
  { id: 'progress', path: '/progress' },
];
const locales = ['ru', 'en'];
const themes = ['light', 'dark'];

await mkdir(artifactDir, { recursive: true });
await mkdir(dirname(resolve(output)), { recursive: true });

const browser = await chromium.launch({ headless: true });
const states = [];

for (const viewport of viewports) {
  for (const locale of locales) {
    const context = await browser.newContext({
      viewport: { width: viewport.cssWidth, height: viewport.cssHeight },
      deviceScaleFactor: viewport.dpr,
      colorScheme: 'light',
    });
    await context.addInitScript(({ selectedLocale }) => {
      localStorage.setItem('fel.learner-profile', 'g0-greenfield-baseline');
      localStorage.setItem('fel-locale', selectedLocale);
    }, { selectedLocale: locale });
    const page = await context.newPage();
    for (const theme of themes) {
      for (const route of routes) {
        const errors = [];
        const warnings = [];
        const pageErrors = [];
        const onConsole = (message) => {
          if (message.type() === 'error') errors.push(message.text());
          if (message.type() === 'warning') warnings.push(message.text());
        };
        page.on('console', onConsole);
        page.on('pageerror', (error) => pageErrors.push(error.message));
        await page.goto(`${baseUrl}${route.path}`, { waitUntil: 'networkidle' });
        await page.evaluate((value) => document.documentElement.setAttribute('data-theme', value), theme);
        await page.waitForTimeout(120);
        const metrics = await page.evaluate(() => ({
          innerWidth,
          innerHeight,
          dpr: devicePixelRatio,
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          scrollHeight: document.documentElement.scrollHeight,
          heading: document.querySelector('main h1, main h2')?.textContent?.trim() ?? null,
          graphNodes: document.querySelectorAll('.map-node').length,
          theme: document.documentElement.getAttribute('data-theme'),
        }));
        const key = `${viewport.id}-${locale}-${theme}-${route.id}`;
        const screenshotPath = resolve(artifactDir, `${key}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: false });
        const bytes = await readFile(screenshotPath);
        states.push({
          key,
          viewport,
          locale,
          theme,
          route,
          ...metrics,
          screenshot: {
            path: screenshotPath,
            bytes: bytes.byteLength,
            sha256: createHash('sha256').update(bytes).digest('hex'),
          },
          diagnostics: { errors: [...errors, ...pageErrors], warnings },
        });
        page.removeListener('console', onConsole);
      }
    }
    await page.close();
    await context.close();
  }
}

await browser.close();

const expectedStates = viewports.length * locales.length * themes.length * routes.length;
const report = {
  schemaVersion: 'greenfield-g0-visual-baseline.v1',
  generatedAt: new Date().toISOString(),
  baseUrl,
  expectedStates,
  states,
  summary: {
    actualStates: states.length,
    diagnostics: states.reduce((sum, state) => sum + state.diagnostics.errors.length + state.diagnostics.warnings.length, 0),
    maxHorizontalOverflowPx: Math.max(0, ...states.map((state) => state.scrollWidth - state.clientWidth)),
    screenshots: states.length,
    screenshotsPresent: states.every((state) => state.screenshot.bytes > 0),
  },
};

await writeFile(output, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(report.summary, null, 2));
