/**
 * @jest-environment jsdom
 */
/* eslint-disable jest/no-conditional-expect */
import React from 'react';
import TestRenderer from 'react-test-renderer';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom';
import MDEditor from '../src';

it('MDEditor', () => {
  const component = TestRenderer.create(<MDEditor value="**Hello world!!!**" />);
  let tree = component.toJSON();
  if (tree && !Array.isArray(tree)) {
    expect(tree.type).toEqual('div');
    expect(tree.props.className).toEqual('w-md-editor w-md-editor-show-live');
    expect(tree.props.style).toMatchObject({
      height: 200,
    });
  }
});


it('MDEditor onChange', async () => {
  const MyComponent = () => {
    const [value, setValue] = React.useState("**Hello world!!!**");
    return (
      <MDEditor
        value={value}
        textareaProps={{
          title: 'test'
        }}
        onChange={(value) => {
          expect(value).toEqual('# title')
          setValue(value || '');
        }}
      />
    );
  };
  render(<MyComponent />);
  const inputNode = screen.getByTitle('test')
  inputNode.focus();
  fireEvent.change(inputNode, { target: { value: '# title' } });
  inputNode.blur();
});


it('MDEditor KeyboardEvent onChange', async () => {
  const handleChange = jest.fn((value) => value);
  render(
    <MDEditor
      value=""
      textareaProps={{
        title: 'test'
      }}
      onChange={handleChange}
    />
  );
  const input = screen.getByTitle('test');
  userEvent.type(input, 'Hello,{enter}World!');
  expect(handleChange).toHaveLength(1);
  expect(handleChange).lastReturnedWith('!');
  expect(handleChange).nthCalledWith(7, '\n');
});

