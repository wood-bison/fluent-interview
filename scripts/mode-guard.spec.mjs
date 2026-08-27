import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import { tmpdir } from 'node:os';

const root = new URL('..', import.meta.url).pathname.replace(/\/$/u, '');
const guard = join(root, 'scripts', 'mode-guard.sh');

function runGuard(lockDir, action, mode, pid) {
  const result = spawnSync(guard, [action, ...(mode ? [mode] : [])], {
    cwd: root,
    encoding: 'utf8',
    env: {
      ...process.env,
      MODE_LOCK_DIR: lockDir,
      MODE_GUARD_DEV_URL: 'http://127.0.0.1:1/',
      MODE_GUARD_PACKAGE_URL: 'http://127.0.0.1:2/',
      ...(pid ? { MODE_LOCK_PID: String(pid) } : {}),
    },
  });
  return result;
}

test('mode guard serializes development and packaged ownership', async () => {
  const tempRoot = mkdtempSync(join(tmpdir(), 'fel-mode-guard-'));
  const lockDir = join(tempRoot, 'mode-lock');
  const holder = spawn('sleep', ['30'], { stdio: 'ignore' });
  try {
    const acquire = runGuard(lockDir, 'acquire', 'development', holder.pid);
    assert.equal(acquire.status, 0, acquire.stderr);

    const held = runGuard(lockDir, 'check');
    assert.equal(held.status, 0, held.stderr);
    assert.equal(JSON.parse(held.stdout).mode, 'development');

    const conflict = runGuard(lockDir, 'acquire', 'production', process.pid);
    assert.equal(conflict.status, 1);
    assert.match(conflict.stderr, /mode conflict/iu);

    holder.kill('SIGTERM');
    await once(holder, 'exit');
    const release = runGuard(lockDir, 'release');
    assert.equal(release.status, 0, release.stderr);
    assert.equal(JSON.parse(runGuard(lockDir, 'check').stdout).state, 'clear');
  } finally {
    holder.kill('SIGKILL');
    rmSync(tempRoot, { recursive: true, force: true });
  }
});
