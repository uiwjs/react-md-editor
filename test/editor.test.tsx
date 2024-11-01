/**
 * @jest-environment jsdom
 */
/* eslint-disable jest/no-conditional-expect */
import React from 'react';
import TestRenderer from 'react-test-renderer';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import MDEditor from '../core/src';

// In your test setup file
// @ts-ignore
// globalThis.IS_REACT_ACT_ENVIRONMENT = true;

it('MDEditor', () => {
  const component = TestRenderer.create(<MDEditor value="**Hello world!!!**" />);
  let tree = component.toJSON();
  if (tree && !Array.isArray(tree)) {
    expect(tree.type).toEqual('div');
    expect(tree.props.className).toEqual('wmde-markdown-var w-md-editor w-md-editor-show-live');
    expect(tree.props.style).toMatchObject({
      height: 200,
    });
  }
});

it('MDEditor onChange', async () => {
  const MyComponent = () => {
    const [value, setValue] = React.useState('**Hello world!!!**');
    return (
      <MDEditor
        value={value}
        textareaProps={{
          title: 'test',
        }}
        onChange={(value) => {
          expect(value).toEqual('# title');
          setValue(value || '');
        }}
      />
    );
  };
  render(<MyComponent />);
  const inputNode = screen.getByTitle('test');
  inputNode.focus();
  fireEvent.change(inputNode, { target: { value: '# title' } });
  inputNode.blur();
});

it('MDEditor KeyboardEvent onChange', async () => {
  const handleChange = jest.fn((value, evn, state) => value);
  render(
    <MDEditor
      value=""
      textareaProps={{
        title: 'test',
      }}
      onChange={handleChange}
    />,
  );
  const input = screen.getByTitle('test');
  userEvent.type(input, 'Hello,{enter}World!');
  expect(handleChange).toHaveLength(3);
  // expect(handleChange).lastReturnedWith('!');
  // expect(handleChange).nthCalledWith(7, '\n');
});

it('MDEditor KeyboardEvent onHeightChange', async () => {
  const handleChange = jest.fn((value, propsValue, state) => {
    return propsValue;
  });
  const MyComponent = () => {
    const [height, setHeight] = React.useState(300);
    React.useEffect(() => {
      setHeight(500);
    }, []);
    return (
      <MDEditor
        value=""
        height={height}
        textareaProps={{
          title: 'test',
        }}
        onHeightChange={handleChange}
      />
    );
  };
  render(<MyComponent />);
  expect(handleChange).lastReturnedWith(500);
  expect(handleChange).toHaveLength(3);
});

it('MDEditor supports asynchronous plugins', async () => {
  const MyComponent = () => {
    const [value, setValue] = React.useState('**Hello world!!!**');
    return (
      <MDEditor
        value={value}
        textareaProps={{
          title: 'test',
        }}
        previewOptions={{
          rehypePlugins: [
            async () => {
              return (tree) => {
                // Example async plugin that adds a class to the first node
                return new Promise((resolve) => {
                  setTimeout(() => {
                    if (tree.children && tree.children.length > 0) {
                      tree.children[0].properties = {
                        ...tree.children[0].properties,
                        className: 'async-plugin',
                      };
                    }
                    resolve(tree);
                  }, 100);
                });
              };
            },
          ],
        }}
        onChange={(value) => {
          setValue(value || '');
        }}
      />
    );
  };
  render(<MyComponent />);
  const inputNode = screen.getByTitle('test');
  inputNode.focus();
  fireEvent.change(inputNode, { target: { value: '# title' } });
  inputNode.blur();
  await new Promise((resolve) => setTimeout(resolve, 200)); // Wait for async plugin to complete
  const previewNode = screen.getByText('title');
  expect(previewNode).toHaveClass('async-plugin');
});
