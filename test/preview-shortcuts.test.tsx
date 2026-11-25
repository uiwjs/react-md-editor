/**
 * @jest-environment jsdom
 */
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MDEditor from '../core/src';

it.each([
  ['7', 'edit', { ctrlKey: true }],
  ['8', 'live', { metaKey: true }],
])('switches from the keyboard preview back to mode %s', (key, mode, modifier) => {
  render(<MDEditor value="hello" data-testid="editor" />);
  const editor = screen.getByTestId('editor');
  const textarea = screen.getByRole('textbox');
  textarea.focus();

  fireEvent.keyDown(textarea, { key: '9', ...modifier });

  expect(editor).toHaveClass('w-md-editor-show-preview');
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  expect(editor).toHaveFocus();

  expect(fireEvent.keyDown(editor, { key, ...modifier })).toBe(false);
  expect(editor).toHaveClass(`w-md-editor-show-${mode}`);
  expect(screen.getByRole('textbox')).toHaveFocus();
});

it('leaves disabled or removed view shortcuts alone in preview mode', () => {
  const { rerender } = render(<MDEditor preview="preview" value="hello" extraCommands={[]} data-testid="editor" />);
  const editor = screen.getByTestId('editor');

  expect(fireEvent.keyDown(editor, { key: '7', ctrlKey: true })).toBe(true);
  expect(editor).toHaveClass('w-md-editor-show-preview');

  rerender(<MDEditor preview="preview" disabled value="hello" data-testid="editor" />);

  expect(fireEvent.keyDown(editor, { key: '8', ctrlKey: true })).toBe(true);
  expect(editor).toHaveClass('w-md-editor-show-preview');
});

it('does not take focus from an initially focused external element', () => {
  render(<button type="button">Outside</button>);
  const outside = screen.getByRole('button', { name: 'Outside' });
  outside.focus();

  render(<MDEditor preview="preview" value="hello" data-testid="editor" />);

  expect(outside).toHaveFocus();
  expect(screen.getByTestId('editor')).toHaveAttribute('tabindex', '0');
});
