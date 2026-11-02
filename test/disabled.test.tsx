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

describe.each(editors)('%s editor disabled state', (_mode, Editor) => {
  it('disables editing, all toolbar actions and resizing', () => {
    const { container } = render(<Editor value="hello" disabled />);

    expect(screen.getByRole('textbox', { name: 'Markdown editor' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Add bold text (ctrl + b)' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Edit code (ctrl + 7)' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Toggle fullscreen (ctrl + 0)' })).toBeDisabled();
    expect(container.querySelector('.w-md-editor-bar')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Toggle fullscreen (ctrl + 0)' }));
    expect(container.querySelector('.w-md-editor-fullscreen')).not.toBeInTheDocument();
  });

  it('updates the toolbar and drag handle when disabled changes', () => {
    const { container, rerender } = render(<Editor value="hello" disabled />);
    expect(container.querySelector('.w-md-editor-bar')).not.toBeInTheDocument();

    rerender(<Editor value="hello" disabled={false} />);
    expect(screen.getByRole('textbox', { name: 'Markdown editor' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Add bold text (ctrl + b)' })).not.toBeDisabled();
    expect(container.querySelector('.w-md-editor-bar')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Toggle fullscreen (ctrl + 0)' }));
    expect(container.querySelector('.w-md-editor-fullscreen')).toBeInTheDocument();

    rerender(<Editor value="hello" disabled fullscreen />);
    expect(screen.getByRole('button', { name: 'Toggle fullscreen (ctrl + 0)' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Toggle fullscreen (ctrl + 0)' }));
    expect(container.querySelector('.w-md-editor-fullscreen')).toBeInTheDocument();
  });

  it('guards command execution even when custom toolbar controls ignore disabled', () => {
    const execute = jest.fn();
    const { container } = render(
      <Editor
        value="hello"
        disabled
        components={{
          toolbar: (command, _disabled, handleCommand) => (
            <button
              type="button"
              data-testid={`custom-${command.name}`}
              onClick={() => {
                execute();
                handleCommand(command);
              }}
            >
              {command.name}
            </button>
          ),
        }}
      />,
    );

    fireEvent.click(screen.getByTestId('custom-fullscreen'));
    fireEvent.click(screen.getByTestId('custom-edit'));
    expect(execute).toHaveBeenCalledTimes(2);
    expect(container.querySelector('.w-md-editor-fullscreen')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Markdown editor' })).toHaveValue('hello');
    expect(container.querySelector('.w-md-editor-show-live')).toBeInTheDocument();
  });
});
