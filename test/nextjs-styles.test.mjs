import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const staticDir = join(root, 'example/nextjs/.next/static');

async function findCss(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return findCss(path);
      return entry.isFile() && entry.name.endsWith('.css') ? [path] : [];
    }),
  );
  return files.flat();
}

test('Next.js build includes the editor and syntax highlighting styles', async () => {
  const files = await findCss(staticDir);
  assert.ok(files.length > 0, 'Next.js did not emit CSS');
  const css = (await Promise.all(files.map((file) => readFile(file, 'utf8')))).join('\n');

  assert.match(css, /\.w-md-editor\b/, 'editor layout CSS missing');
  assert.match(css, /\.wmde-markdown\b/, 'markdown preview CSS missing');
  assert.match(css, /\.token\.keyword\b/, 'Prism highlighting CSS missing');
  assert.match(css, /--color-prettylights-syntax-keyword\b/, 'syntax colour variables missing');
});
