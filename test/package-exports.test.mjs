import assert from 'node:assert/strict';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { readFile, realpath } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, extname, join, resolve } from 'node:path';
import { test } from 'node:test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const core = join(root, 'core');
const pkg = JSON.parse(await readFile(join(core, 'package.json'), 'utf8'));
const require = createRequire(import.meta.url);
const entrypoints = {
  '.': '@uiw/react-md-editor',
  './common': '@uiw/react-md-editor/common',
  './nohighlight': '@uiw/react-md-editor/nohighlight',
  './commands': '@uiw/react-md-editor/commands',
  './commands-cn': '@uiw/react-md-editor/commands-cn',
};

test('ESM files are marked as modules without changing CommonJS files', async () => {
  assert.equal(JSON.parse(await readFile(join(core, 'esm/package.json'), 'utf8')).type, 'module');
  assert.notEqual(pkg.type, 'module');
  assert.equal(pkg.types, 'lib/index.d.ts');
});

for (const [subpath, specifier] of Object.entries(entrypoints)) {
  test(`${specifier} resolves its ESM, CJS and declaration entries`, async () => {
    const entry = pkg.exports[subpath];
    assert.deepEqual(Object.keys(entry), ['types', 'import', 'require', 'default']);
    assert.equal(entry.default, entry.import);
    for (const target of [entry.types, entry.import, entry.require]) {
      await readFile(join(core, target), 'utf8');
    }
    const esm = await realpath(fileURLToPath(import.meta.resolve(specifier)));
    const cjs = await realpath(require.resolve(specifier));
    assert.equal(esm, await realpath(join(core, entry.import)));
    assert.equal(cjs, await realpath(join(core, entry.require)));
    assert.equal(pathToFileURL(esm).protocol, 'file:');
  });
}

const knownExtensions = new Set(['.js', '.mjs', '.cjs', '.json', '.css', '.less']);
const relativeSpecifier = /(?:\bfrom\s+|import\s*\(\s*|import\s+)(['"])(\.[^'"]+)\1/g;

function walkJs(directory, files = []) {
  for (const entry of readdirSync(directory)) {
    const full = join(directory, entry);
    if (statSync(full).isDirectory()) {
      walkJs(full, files);
    } else if (entry.endsWith('.js')) {
      files.push(full);
    }
  }
  return files;
}

test('ESM relative imports include the extension webpack requires', async () => {
  const missing = [];
  for (const file of walkJs(join(core, 'esm'))) {
    const code = await readFile(file, 'utf8');
    for (const match of code.matchAll(relativeSpecifier)) {
      const specifier = match[2];
      const extension = extname(specifier);
      const target = resolve(dirname(file), specifier);
      if (!knownExtensions.has(extension) || !existsSync(target)) {
        missing.push(`${file.slice(core.length + 1)}: ${specifier}`);
      }
    }
  }
  assert.deepEqual(missing, []);
});

test('published tarball contains the ESM marker and all public entrypoints', async () => {
  const { execFileSync } = await import('node:child_process');
  const entries = JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
    cwd: core,
    encoding: 'utf8',
  }))[0].files.map((file) => file.path);
  assert.ok(entries.includes('esm/package.json'));
  assert.ok(entries.includes('markdown-editor.css'));
  for (const entry of Object.values(entrypoints)) {
    const subpath = Object.entries(entrypoints).find(([, name]) => name === entry)[0];
    for (const target of Object.values(pkg.exports[subpath])) {
      assert.ok(entries.includes(target.slice(2)), `missing ${target} in packed files`);
    }
  }
});
