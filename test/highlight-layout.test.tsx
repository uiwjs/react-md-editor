/**
 * @jest-environment jsdom
 */
import React from 'react';
import { readFileSync } from 'fs';
import { join } from 'path';
import { render } from '@testing-library/react';
import MDEditor from '../core/src';
import MDEditorCommon from '../core/src/index.common';

const lessStyles = readFileSync(join(__dirname, '../core/src/components/TextArea/index.less'), 'utf8');

// jsdom 20 applies the last matching rule and ignores specificity, so
// getComputedStyle cannot show that this rule beats DaisyUI's `.list` / `.table`.
function blockAfter(source: string, header: string) {
  const start = source.indexOf(header);
  const open = start < 0 ? -1 : source.indexOf('{', start + header.length);
  if (open < 0) return undefined;
  let depth = 0;
  for (let index = open; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    else if (source[index] === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(open + 1, index);
    }
  }
  return undefined;
}

const textPreStyles = blockAfter(lessStyles, '.@{md-editor}-text-pre');
const tokenDeclarations = textPreStyles?.match(/\.token\.list,\s*\.token\.table\s*\{([^}]+)\}/)?.[1];

describe.each([
  ['default', MDEditor],
  ['common', MDEditorCommon],
] as const)('%s Markdown highlight layout', (_mode, Editor) => {
  it.each([
    ['ordered lists', '1. one\n2. two', 'list'],
    ['bullet lists', '* one\n- two', 'list'],
    ['tables', '| a | b |\n| --- | --- |\n| 1 | 2 |', 'table'],
  ])('keeps %s inline when component styles collide', (_name, markdown, tokenType) => {
    // `.w-md-editor-text-pre .token.list` (0,3,0) beats DaisyUI's `.list` / `.table` (0,1,0).
    expect(lessStyles).toContain("@md-editor: ~'w-md-editor';");
    expect(tokenDeclarations).toContain('display: inline;');
    expect(tokenDeclarations).toContain('font-size: inherit;');

    const { container } = render(<Editor value={markdown} preview="edit" />);
    expect(container.querySelectorAll('.w-md-editor-text-pre .token.' + tokenType).length).toBeGreaterThan(0);
  });
});
