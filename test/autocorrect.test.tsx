/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MDEditor from '../core/src';
import MDEditorCommon from '../core/src/index.common';
import MDEditorNoHighlight from '../core/src/index.nohighlight';

const editors = [
  ['default', MDEditor],
  ['common', MDEditorCommon],
  ['nohighlight', MDEditorNoHighlight],
] as const;

const renderTextarea = (
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> | React.HTMLAttributes<HTMLDivElement>,
) => <textarea {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} />;

describe.each(editors)('%s textarea autocorrect', (_mode, Editor) => {
  it('leaves autocorrect to the browser by default', () => {
    render(<Editor value="some markdown" textareaProps={{ 'aria-label': 'markdown input' }} />);

    const input = screen.getByRole('textbox', { name: 'markdown input' });
    expect(input).not.toHaveAttribute('autocorrect');
    expect(input).toHaveAttribute('autocomplete', 'off');
    expect(input).toHaveAttribute('autocapitalize', 'off');
  });

  it.each(['on', 'off'])('accepts autoCorrect=%s in textareaProps', (autoCorrect) => {
    render(
      <Editor value="some markdown" textareaProps={{ 'aria-label': 'markdown input', autoCorrect }} />,
    );

    expect(screen.getByRole('textbox', { name: 'markdown input' })).toHaveAttribute('autocorrect', autoCorrect);
  });

  it('does not force autocorrect off in renderTextarea', () => {
    render(
      <Editor
        value="some markdown"
        textareaProps={{ 'aria-label': 'custom input', renderTextarea }}
      />,
    );

    expect(screen.getByRole('textbox', { name: 'custom input' })).not.toHaveAttribute('autocorrect');
  });

  it.each(['on', 'off'])('passes autoCorrect=%s through renderTextarea', (autoCorrect) => {
    render(
      <Editor
        value="some markdown"
        textareaProps={{ 'aria-label': 'custom input', autoCorrect, renderTextarea }}
      />,
    );

    expect(screen.getByRole('textbox', { name: 'custom input' })).toHaveAttribute('autocorrect', autoCorrect);
  });
});
