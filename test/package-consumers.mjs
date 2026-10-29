import assert from 'node:assert/strict';
import { mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { build } from 'vite';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const fixture = join(root, 'test/fixtures/package-consumers');
const out = await mkdtemp(join(tmpdir(), 'react-md-editor-consumers-'));

try {
  const viteOut = join(out, 'vite');
  await build({
    configFile: false,
    root: fixture,
    logLevel: 'error',
    build: { outDir: viteOut, emptyOutDir: true },
  });
  assert.ok((await readdir(join(viteOut, 'assets'))).some((name) => name.endsWith('.js')));
  console.log('Vite consumer build passed');

  const bunOut = join(out, 'bun');
  const result = spawnSync('bun', [
    'build', join(fixture, 'main.jsx'), '--target', 'browser', '--outdir', bunOut,
  ], { cwd: root, encoding: 'utf8' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Bun consumer build failed\n${result.stderr}\n${result.stdout}`);
  assert.ok((await readdir(bunOut)).some((name) => name.endsWith('.js')));
  console.log('Bun consumer build passed');
} finally {
  await rm(out, { recursive: true, force: true });
}
