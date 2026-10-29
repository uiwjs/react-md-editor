/**
 * @jest-environment jsdom
 */
import React from 'react';
import { readFileSync } from 'fs';
import { join } from 'path';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import MDEditor from '../core/src';
import MDEditorCommon from '../core/src/index.common';
import MDEditorNoHighlight from '../core/src/index.nohighlight';

const textStyles = readFileSync(join(__dirname, '../core/src/components/TextArea/index.less'), 'utf8');

it('keeps an opaque textarea background from covering highlighted text', () => {
  expect(textStyles).toMatch(
    /\.@\{md-editor\}-text-highlighted\s+\.@\{md-editor\}-text-input\s*\{\s*background-color:\s*transparent\s*!important;/,
  );
});

describe.each([
  ['default', MDEditor],
  ['common', MDEditorCommon],
] as const)('%s highlighted textarea background', (_mode, Editor) => {
  it('marks only inputs with a highlighted text layer', () => {
    const { container, rerender } = render(<Editor value="**hello**" preview="edit" />);
    expect(container.querySelector('.w-md-editor-text-highlighted .w-md-editor-text-input')).toBeInTheDocument();

    rerender(<Editor value="**hello**" preview="edit" highlightEnable={false} />);
    expect(container.querySelector('.w-md-editor-text-highlighted')).not.toBeInTheDocument();

    rerender(<Editor value="**hello**" preview="edit" renderTextarea={(props) => <textarea {...props} />} />);
    expect(container.querySelector('.w-md-editor-text-highlighted')).not.toBeInTheDocument();
  });
});

it('leaves nohighlight inputs free to use a custom background', () => {
  const { container } = render(<MDEditorNoHighlight value="hello" preview="edit" />);
  expect(container.querySelector('.w-md-editor-text-input')).toBeInTheDocument();
  expect(container.querySelector('.w-md-editor-text-highlighted')).not.toBeInTheDocument();
});
