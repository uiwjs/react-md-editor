/**
 * @jest-environment jsdom
 */
import React from 'react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import less from 'less';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import MDEditor from '../core/src';
import MDEditorCommon from '../core/src/index.common';
import MDEditorNoHighlight from '../core/src/index.nohighlight';

const editors = [
  ['default', MDEditor],
  ['common', MDEditorCommon],
  ['nohighlight', MDEditorNoHighlight],
] as const;

beforeAll(async () => {
  const source = readFileSync(join(__dirname, '../core/src/index.less'), 'utf8');
  const { css } = await less.render(source);
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
});

describe.each(editors)('%s editor adaptive preview height', (_name, Editor) => {
  it('keeps the preview in normal flow when it is the only pane', () => {
    const { container } = render(
      <Editor value={'# Heading\\n\\nSome text'} preview="preview" height="100%" visibleDragbar={false} />,
    );
    const preview = container.querySelector('.w-md-editor-preview')!;
    expect(preview).toHaveTextContent('Heading');
    expect(container.querySelector('.w-md-editor-input')).toBeNull();
    expect(window.getComputedStyle(preview).position).toBe('relative');
  });

  it('keeps the live preview overlaid beside the textarea', () => {
    const { container } = render(<Editor value="Hello" preview="live" height={200} visibleDragbar={false} />);
    const preview = container.querySelector('.w-md-editor-preview')!;
    expect(container.querySelector('.w-md-editor-input')).not.toBeNull();
    expect(window.getComputedStyle(preview).position).toBe('absolute');
  });
});
