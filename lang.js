/**
 * Initialize the language.
 * `src/components/Markdown/langs.ts`
 */
const components = require('prismjs/components');
const fs = require('fs');
const path = require('path');

var dt = {};
Object.keys(components.languages).forEach((lang) => {
  const { require, alias, peerDependencies } = components.languages[lang];
  if (!dt[lang]) dt[lang] = {};
  if (peerDependencies) dt[lang]['p'] = peerDependencies;
  if (require) dt[lang]['r'] = require;
  if (alias) dt[lang]['a'] = alias;
});

// var dts = {}
// Object.keys(dt).forEach((item) => {
//   const str = fs.existsSync(path.join(process.cwd(), `node_modules/prismjs/components/prism-${item}.js`));
//   if (str) {
//     dts[item] = dt[item];
//   } else {
//     dts[item] = dt[item];
//     dts[item]['e'] = false;
//   }
// });

console.log('dt::', dt);