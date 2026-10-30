/**
 * @jest-environment node
 */
import fs from 'fs';
import path from 'path';
import { rehype } from 'rehype';
import rehypePrism from 'rehype-prism-plus';
import { splitBlocks } from '../core/src/components/TextArea/splitBlocks';

type Run = { text: string; tokens: string };

const processor = rehype()
  .data('settings', { fragment: true })
  // @ts-ignore
  .use(rehypePrism, { ignoreMissing: true });

function escape(text: string) {
  return text.replace(/[<&"]/g, (c) => ({ '<': '&lt;', '&': '&amp;', '"': '&quot;' })[c] as string);
}

function highlight(markdown: string) {
  return processor.runSync(processor.parse(`<pre><code class="language-markdown">${escape(markdown)}</code></pre>`));
}

/**
 * Flattens highlighted output into one entry per character with the Prism token classes
 * around it, ignoring the per-line wrappers, so two outputs can be compared for colour.
 */
function toCharacterTokens(tree: any, stack: string[] = [], out: Run[] = []) {
  if (tree.type === 'text') {
    for (const char of tree.value) {
      out.push({ text: char, tokens: stack.join(' ') });
    }
    return out;
  }
  const classes: string[] = (tree.properties?.className || []).filter((name: string) => name !== 'code-line');
  const isToken = classes.includes('token');
  (tree.children || []).forEach((child: any) =>
    toCharacterTokens(child, isToken ? [...stack, classes.join('.')] : stack, out),
  );
  return out;
}

function expectSameHighlight(markdown: string) {
  const blocks = splitBlocks(markdown);
  expect(blocks.join('')).toEqual(markdown);
  const whole = toCharacterTokens(highlight(markdown));
  const joined = blocks.flatMap((block) => toCharacterTokens(highlight(block)));
  expect(joined.map((run) => run.text).join('')).toEqual(whole.map((run) => run.text).join(''));
  const firstDifference = whole.findIndex((run, index) => run.tokens !== joined[index]?.tokens);
  if (firstDifference !== -1) {
    const context = markdown.slice(Math.max(0, firstDifference - 40), firstDifference + 40);
    throw new Error(
      `Token mismatch at ${firstDifference}: "${whole[firstDifference].tokens}" vs "${joined[firstDifference].tokens}" near ${JSON.stringify(context)}`,
    );
  }
  expect(joined.length).toEqual(whole.length);
}

const fixtures: Record<string, string> = {
  paragraphs: '# Title\n\nSome **bold** text\nand more.\n\n\n- list\n- items\n',
  fencedCodeWithBlankLines: 'Intro\n\n```js\nconst a = 1;\n\nconst b = 2;\n```\n\nAfter\n',
  unclosedFence: 'Intro\n\n```js\nconst a = 1;\n\nstill code\n',
  indentedCode: 'Paragraph\n\n    indented code\n    more code\n\nText\n',
  frontMatter: '---\ntitle: x\n\nmore: y\n---\n\n# Body\n',
  leadingFrontMatter: '\n---\ntitle: test\n\ndescription: example\n---\n\nBody',
  multilineTag: 'Intro\n\n<div\n\nclass="test">text</div>\n\nAfter',
  multilineReference: '[a\n\nb]: https://example.com\n\nAfter',
  multilineReferenceTitle: '[a]: https://example.com "title\n\nmore"\n\nAfter',
  spacedBold: 'Intro\n\n**a\n \nb**\n\nAfter',
  fenceInComment: '<!--\n```\n\ncomment\n-->\n\nAfter\n\nmore',
  cdata: '<![CDATA[\n\na\n\nb\n]]>\n\nAfter',
  doctype: '<!DOCTYPE html [\n\na\n\nb\n]>\n\nAfter',
  thematicBreakThenSetext: 'Text\n\n---\nHeading\n---\n\nEnd\n',
  htmlComment: 'Text\n\n<!-- a comment\n\nstill comment -->\n\nAfter\n',
  table: '| a | b |\n| - | - |\n| 1 | 2 |\n\ntext\n',
  crlf: '# Title\r\n\r\nText\r\n\r\n```\r\ncode\r\n\r\n```\r\n',
  base64Image: `# Doc\n\n![img](data:image/png;base64,${'iVBORw0KGgo'.repeat(30)})\n\nAfter the image\n`,
  noTrailingNewline: 'a\n\nb',
  onlyBlankLines: '\n\n\n',
  leadingBlankLines: '\n\n# Title\n\ntext',
};

describe('splitBlocks highlighting matches whole-document highlighting', () => {
  Object.entries(fixtures).forEach(([name, markdown]) => {
    it(name, () => expectSameHighlight(markdown));
  });

  it('core/README.md', () => {
    const readme = fs.readFileSync(path.resolve(__dirname, '../core/README.md'), 'utf8');
    expectSameHighlight(readme);
  });
});

describe('splitBlocks', () => {
  it('splits at blank lines and keeps them with the next block', () => {
    expect(splitBlocks('a\n\nb\n\n\nc')).toEqual(['a\n', '\nb\n', '\n\nc']);
  });

  it('keeps fenced code with blank lines in one block', () => {
    expect(splitBlocks('```\na\n\nb\n```\n\nc')).toEqual(['```\na\n\nb\n```\n', '\nc']);
  });

  it('returns no blocks for an empty string', () => {
    expect(splitBlocks('')).toEqual([]);
  });
});
