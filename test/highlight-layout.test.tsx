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

describe.each([
  ['default', MDEditor],
  ['common', MDEditorCommon],
] as const)('%s Markdown highlight layout', (_mode, Editor) => {
  it.each([
    ['ordered lists', '1. one\n2. two', 'list'],
    ['bullet lists', '* one\n- two', 'list'],
    ['tables', '| a | b |\n| --- | --- |\n| 1 | 2 |', 'table'],
  ])('keeps %s inline when component styles collide', (_name, markdown, tokenType) => {
    const declarations = lessStyles.match(/\.token\.list,\s*\.token\.table\s*\{([^}]+)\}/)?.[1];
    expect(declarations).toBeDefined();
    expect(declarations).toContain('font-size: inherit;');

    // DaisyUI uses these same class names for layout components
    const style = document.createElement('style');
    style.textContent =
      '.w-md-editor-text-pre .token.list, .w-md-editor-text-pre .token.table {' +
      declarations +
      '}\n.list { display: flex; font-size: 24px; }\n.table { display: table; font-size: 24px; }';
    document.head.appendChild(style);

    try {
      const { container } = render(<Editor value={markdown} preview="edit" />);
      const tokens = container.querySelectorAll('.w-md-editor-text-pre .token.' + tokenType);
      expect(tokens.length).toBeGreaterThan(0);
      tokens.forEach((token) => {
        expect(window.getComputedStyle(token).display).toBe('inline');
      });
    } finally {
      style.remove();
    }
  });
});
