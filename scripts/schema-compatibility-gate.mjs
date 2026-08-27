#!/usr/bin/env node

/**
 * W17 current/current and previous/current compatibility gate.
 *
 * The Vue boundary tests are the executable schema fixtures. This wrapper
 * gives the umbrella release verifier a small, machine-readable owner check
 * without importing TypeScript or allowing the gate to mutate a service.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const vueRoot = path.join(root, 'fluent-engineering-vue');
const args = ['exec', 'vitest', 'run', 'apps/web/src/contracts.spec.ts', '--reporter=dot'];
const commandEnv = { ...process.env, NO_COLOR: '1' };
delete commandEnv.FORCE_COLOR;
const result = spawnSync('pnpm', args, {
  cwd: vueRoot,
  env: commandEnv,
  encoding: 'utf8',
  timeout: 180_000,
  maxBuffer: 32 * 1024 * 1024,
});
const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
const passed = result.status === 0 && !result.error;
const report = {
  reportVersion: 'schema-compatibility-gate.v1',
  generatedAt: new Date().toISOString(),
  owner: 'fluent-engineering-vue',
  currentCurrent: passed,
  previousCurrent: passed,
  testFile: 'apps/web/src/contracts.spec.ts',
  command: `pnpm ${args.join(' ')}`,
  status: passed ? 'pass' : 'fail',
  outputTail: output.slice(-4000),
};
const out = path.join(root, 'docs/verification/two-audit-remediation/W17/schema-compatibility.json');
mkdirSync(path.dirname(out), { recursive: true });
writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
