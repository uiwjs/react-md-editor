/**
 * @jest-environment jsdom
 */
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
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

describe.each(editors)('%s editor accessibility', (_mode, Editor) => {
  it('gives an unlabeled textarea an accessible name', () => {
    render(<Editor value="hello" />);
    expect(screen.getByRole('textbox', { name: 'Markdown editor' })).toHaveValue('hello');
  });

  it('uses a native label and submits the editor value as a form field', () => {
    const { container } = render(
      <form data-testid="editor-form">
        <label htmlFor="notes">Notes</label>
        <Editor id="notes" name="notes" value="hello" />
      </form>,
    );

    const input = screen.getByRole('textbox', { name: 'Notes' });
    expect(input).toHaveAttribute('id', 'notes');
    expect(input).toHaveAttribute('name', 'notes');
    expect(input).not.toHaveAttribute('aria-label');
    expect(container.querySelector('.w-md-editor')).not.toHaveAttribute('id');
    expect(new FormData(screen.getByTestId('editor-form') as HTMLFormElement).get('notes')).toBe('hello');
  });

  it('forwards labels, descriptions and validation state to the textarea', () => {
    render(
      <Editor
        value=""
        aria-label="Post content"
        aria-describedby="post-help"
        aria-invalid="true"
        aria-errormessage="post-error"
        aria-required="true"
        required
        placeholder="Write here"
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Post content' });
    expect(input).toHaveAttribute('aria-describedby', 'post-help');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-errormessage', 'post-error');
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('placeholder', 'Write here');
  });

  it('preserves aria-labelledby and a custom textarea name', () => {
    render(
      <>
        <span id="body-label">Body</span>
        <Editor value="" aria-labelledby="body-label" textareaProps={{ name: 'body' }} />
      </>,
    );

    const input = screen.getByRole('textbox', { name: 'Body' });
    expect(input).toHaveAttribute('name', 'body');
    expect(input).not.toHaveAttribute('aria-label');
  });

  it('keeps textareaProps ahead of the editor props', () => {
    render(
      <Editor
        value=""
        id="outer-id"
        name="outer"
        aria-label="Outer"
        required
        disabled
        readOnly
        textareaProps={{
          id: 'inner-id',
          name: 'inner',
          'aria-label': 'Inner',
          required: false,
          disabled: false,
          readOnly: false,
        }}
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Inner' });
    expect(input).toHaveAttribute('id', 'inner-id');
    expect(input).toHaveAttribute('name', 'inner');
    expect(input).not.toHaveAttribute('required');
    expect(input).not.toHaveAttribute('disabled');
    expect(input).not.toHaveAttribute('readonly');
  });

  it('passes the same field props to renderTextarea and keeps changes working', () => {
    const onChange = jest.fn();
    render(
      <Editor
        value="before"
        id="custom-field"
        name="custom"
        aria-label="Custom markdown"
        onChange={onChange}
        textareaProps={{ renderTextarea }}
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Custom markdown' });
    expect(input).toHaveAttribute('id', 'custom-field');
    expect(input).toHaveAttribute('name', 'custom');
    fireEvent.change(input, { target: { value: 'after' } });
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls.at(-1)?.[0]).toBe('after');
  });

  it('provides a name for an unlabeled custom textarea', () => {
    render(<Editor value="" textareaProps={{ renderTextarea }} />);
    expect(screen.getByRole('textbox', { name: 'Markdown editor' })).toBeInTheDocument();
  });
});
