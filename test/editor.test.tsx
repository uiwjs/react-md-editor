/**
 * @jest-environment jsdom
 */
/* eslint-disable jest/no-conditional-expect */
import React from 'react';
import TestRenderer from 'react-test-renderer';
import { render, fireEvent } from '@testing-library/react';
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
    if (tree.children && tree.children.length > 0) {
      expect(tree.children.length).toEqual(3);
      tree.children.forEach((chid, idx) => {
        if (typeof chid !== 'string') {
          expect(chid.type).toEqual('div');
          idx === 0 && expect(chid.props.className).toEqual('w-md-editor-toolbar');
          idx === 1 && expect(chid.props.className).toEqual('w-md-editor-content');
          idx === 2 && expect(chid.props.className).toEqual('w-md-editor-bar');
        }
      })
    }
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
  const { getByTitle } = render(<MyComponent />);
  const inputNode = getByTitle('test')
  inputNode.focus();
  fireEvent.change(inputNode, { target: { value: '# title' } });
  inputNode.blur();
});


it('MDEditor KeyboardEvent onChange', async () => {
  const MyComponent = () => {
    const [value, setValue] = React.useState("");
    return (
      <MDEditor
        value={value}
        textareaProps={{
          title: 'test'
        }}
        onChange={(value) => {
          setValue(value || '');
        }}
      />
    );
  };
  const { getByTitle } = render(<MyComponent />);
  const inputNode = getByTitle('test');
  userEvent.type(inputNode, 'Hello,{enter}World!');
  expect(inputNode).toHaveValue('Hello,\nWorld!');
});

