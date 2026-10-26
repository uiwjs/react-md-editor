/**
 * @jest-environment jsdom
 */
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MDEditor, { commands } from '../core/src';

function renderListEditor(initial: string, command: commands.ICommand) {
  const onChange = jest.fn();
  const Harness = () => {
    const [value, setValue] = React.useState(initial);
    return (
      <MDEditor
        value={value}
        textareaProps={{ title: 'list-input' }}
        commands={[command]}
        extraCommands={[]}
        onChange={(next) => {
          onChange(next);
          setValue(next || '');
        }}
      />
    );
  };
  render(<Harness />);
  return {
    onChange,
    input: screen.getByTitle<HTMLTextAreaElement>('list-input'),
  };
}

describe.each([
  ['unordered', commands.unorderedListCommand, '- ', '- first second'],
  ['ordered', commands.orderedListCommand, '1. ', '1. first second'],
  ['checked', commands.checkedListCommand, '- [ ] ', '- [ ] first second'],
] as const)('%s list selection strategy', (name, originalCommand, prefix, expected) => {
  it('applies a list to the whole line when requested', () => {
    const command: commands.ICommand = {
      ...originalCommand,
      buttonProps: { 'aria-label': 'Line ' + name + ' list' },
      execute: (state, api) => commands.makeList(state, api, prefix, 'line'),
    };
    const { input, onChange } = renderListEditor('first second', command);

    input.setSelectionRange(8, 8);
    fireEvent.click(screen.getByLabelText('Line ' + name + ' list'));
    expect(input).toHaveValue(expected);
    expect(onChange).toHaveBeenCalledWith(expected);
  });
});

it('line selection includes partially selected lines without changing other lines', () => {
  const command: commands.ICommand = {
    ...commands.unorderedListCommand,
    execute: (state, api) => commands.makeList(state, api, '- ', 'line'),
  };
  const { input } = renderListEditor('intro\nalpha\nbeta\noutro', command);
  input.setSelectionRange(8, 14);
  fireEvent.click(screen.getByLabelText('Add unordered list (ctrl + shift + u)'));
  expect(input).toHaveValue('intro\n\n- alpha\n- beta\n\noutro');
});

it('line selection removes existing list markers', () => {
  const command: commands.ICommand = {
    ...commands.unorderedListCommand,
    execute: (state, api) => commands.makeList(state, api, '- ', 'line'),
  };
  const { input } = renderListEditor('- one\n- two', command);
  input.setSelectionRange(3, 9);
  fireEvent.click(screen.getByLabelText('Add unordered list (ctrl + shift + u)'));
  expect(input).toHaveValue('one\ntwo');
});

it('makeList keeps word selection as its default', () => {
  const command: commands.ICommand = {
    ...commands.unorderedListCommand,
    execute: (state, api) => commands.makeList(state, api, '- '),
  };
  const { input } = renderListEditor('first second', command);
  input.setSelectionRange(8, 8);
  fireEvent.click(screen.getByLabelText('Add unordered list (ctrl + shift + u)'));
  expect(input).toHaveValue('first \n\n- second');
});
