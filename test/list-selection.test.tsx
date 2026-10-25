/**
 * @jest-environment jsdom
 */
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MDEditor, { commands } from '../core/src';

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
    const onChange = jest.fn();
    render(
      <MDEditor
        value="first second"
        textareaProps={{ title: 'list-input' }}
        commands={[command]}
        extraCommands={[]}
        onChange={onChange}
      />,
    );

    const input = screen.getByTitle<HTMLTextAreaElement>('list-input');
    input.setSelectionRange(8, 8);
    fireEvent.click(screen.getByLabelText('Line ' + name + ' list'));
    expect(input).toHaveValue(expected);
    expect(onChange).toHaveBeenCalled();
  });
});

it('line selection includes partially selected lines without changing other lines', () => {
  const command: commands.ICommand = {
    ...commands.unorderedListCommand,
    execute: (state, api) => commands.makeList(state, api, '- ', 'line'),
  };
  render(
    <MDEditor
      value={'intro\nalpha\nbeta\noutro'}
      textareaProps={{ title: 'list-input' }}
      commands={[command]}
      extraCommands={[]}
      onChange={jest.fn()}
    />,
  );
  const input = screen.getByTitle<HTMLTextAreaElement>('list-input');
  input.setSelectionRange(8, 14);
  fireEvent.click(screen.getByLabelText('Add unordered list (ctrl + shift + u)'));
  expect(input).toHaveValue('intro\n\n- alpha\n- beta\n\noutro');
});

it('line selection removes existing list markers', () => {
  const command: commands.ICommand = {
    ...commands.unorderedListCommand,
    execute: (state, api) => commands.makeList(state, api, '- ', 'line'),
  };
  render(
    <MDEditor
      value={'- one\n- two'}
      textareaProps={{ title: 'list-input' }}
      commands={[command]}
      extraCommands={[]}
      onChange={jest.fn()}
    />,
  );
  const input = screen.getByTitle<HTMLTextAreaElement>('list-input');
  input.setSelectionRange(3, 9);
  fireEvent.click(screen.getByLabelText('Add unordered list (ctrl + shift + u)'));
  expect(input).toHaveValue('one\ntwo');
});

it('makeList keeps word selection as its default', () => {
  const command: commands.ICommand = {
    ...commands.unorderedListCommand,
    execute: (state, api) => commands.makeList(state, api, '- '),
  };
  render(
    <MDEditor
      value="first second"
      textareaProps={{ title: 'list-input' }}
      commands={[command]}
      extraCommands={[]}
      onChange={jest.fn()}
    />,
  );
  const input = screen.getByTitle<HTMLTextAreaElement>('list-input');
  input.setSelectionRange(8, 8);
  fireEvent.click(screen.getByLabelText('Add unordered list (ctrl + shift + u)'));
  expect(input).toHaveValue('first \n\n- second');
});
