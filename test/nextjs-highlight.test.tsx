/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import MDEditor from '../core/src';
import MDEditorCommon from '../core/src/index.common';

const source = ['# Syntax highlighting', '', '```js', 'const answer = 42;', 'console.log(answer);', '```'].join('\n');

describe.each([
  ['default', MDEditor],
  ['common', MDEditorCommon],
] as const)('%s fenced code preview', (_mode, Editor) => {
  it('keeps JavaScript tokens in the preview', () => {
    const { container } = render(<Editor value={source} preview="preview" />);
    const code = container.querySelector('.w-md-editor-preview code.language-js');
    expect(code).not.toBeNull();
    expect(code?.querySelector('.token.keyword')?.textContent).toBe('const');
    expect(code?.querySelector('.token.function')?.textContent).toBe('log');
  });
});
