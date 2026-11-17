const { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } = require('node:fs');
const { dirname, extname, join, resolve } = require('node:path');

const dir = join(__dirname, '..', 'esm');
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'package.json'), JSON.stringify({ type: 'module' }) + '\n');

// 1. 把 ESM 产物标成原生模块。 脚本写入 core/esm/package.json，内容只有 {"type":"module"}。
// 包根目录仍然是 CommonJS，require 走 lib/。
// Node 和 Webpack 遇到 esm/ 时按严格 ESM 解析，所以相对导入必须带扩展名。
// 
// 2. 给漏掉的相对导入补上 .js。 
// tsbb 用的插件会把 ./Editor 改成 ./Editor.js，但 path.extname('./Editor.common') 得到的是 .common，
// 插件以为扩展名已经存在，就原样留下。脚本再扫一遍 esm/**/*.js，把这种相对路径改成真实文件，
// 例如 ./Editor.common.js、./Editor.factory.js。已经是 .js、.css 这类扩展名的导入不会动。
// 
// tsbb compiles ESM with @uiw/babel-plugin-add-import-extension and
// skipUnlistedExtensions. path.extname('./Editor.common') is ".common", so the
// plugin leaves the specifier extensionless. Webpack then refuses it because
// esm/package.json marks these files as strict ESM.
const KNOWN_EXTENSIONS = new Set(['.js', '.mjs', '.cjs', '.json', '.css', '.less', '.node', '.wasm']);
const specifierPattern = /(\bfrom\s+|import\s*\(\s*|import\s+)(['"])(\.[^'"]+)\2/g;

function walk(directory, files = []) {
  for (const entry of readdirSync(directory)) {
    const full = join(directory, entry);
    if (statSync(full).isDirectory()) {
      walk(full, files);
    } else if (entry.endsWith('.js')) {
      files.push(full);
    }
  }
  return files;
}

function fullySpecify(fromFile, specifier) {
  const extension = extname(specifier);
  if (KNOWN_EXTENSIONS.has(extension)) {
    return specifier;
  }
  const base = dirname(fromFile);
  if (existsSync(resolve(base, `${specifier}.js`))) {
    return `${specifier}.js`;
  }
  if (existsSync(resolve(base, specifier, 'index.js'))) {
    return specifier.endsWith('/') ? `${specifier}index.js` : `${specifier}/index.js`;
  }
  return specifier;
}

for (const file of walk(dir)) {
  const code = readFileSync(file, 'utf8');
  const next = code.replace(specifierPattern, (match, prefix, quote, specifier) => {
    const specified = fullySpecify(file, specifier);
    return specified === specifier ? match : `${prefix}${quote}${specified}${quote}`;
  });
  if (next !== code) {
    writeFileSync(file, next);
  }
}
