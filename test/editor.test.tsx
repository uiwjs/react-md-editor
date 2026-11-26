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
import MDEditorCommon from '../core/src/index.common';
import MDEditorNoHighlight from '../core/src/index.nohighlight';

const modeEditors = [
  ['default', MDEditor],
  ['common', MDEditorCommon],
  ['nohighlight', MDEditorNoHighlight],
] as const;

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

it('accepts a React state setter as onChange', () => {
  const MyComponent = () => {
    const [value, setValue] = React.useState('**Hello world!!!**');
    return (
      <>
        <MDEditor value={value} textareaProps={{ title: 'test' }} onChange={setValue} />
        <output data-testid="markdown-value">{value}</output>
      </>
    );
  };
  render(<MyComponent />);
  const textarea = screen.getByTitle('test');
  const markdown = screen.getByTestId('markdown-value');
  fireEvent.change(textarea, { target: { value: '# title' } });
  expect(markdown.textContent).toBe('# title');
  fireEvent.change(textarea, { target: { value: '' } });
  expect(markdown.textContent).toBe('');
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

describe.each(modeEditors)('MDEditor %s mode', (modeName, EditorComponent) => {
  it('exposes Markdown preview component', () => {
    expect(EditorComponent.Markdown).toBeDefined();
  });

  it('renders editor textarea', () => {
    render(<EditorComponent value="**Hello world!!!**" textareaProps={{ title: `${modeName}-textarea` }} />);
    expect(screen.getByTitle(`${modeName}-textarea`)).toBeInTheDocument();
  });

  it('calls onChange when textarea value changes', () => {
    const handleChange = jest.fn();
    render(
      <EditorComponent
        value="**Hello world!!!**"
        textareaProps={{ title: `${modeName}-change-textarea` }}
        onChange={handleChange}
      />,
    );
    const textarea = screen.getByTitle(`${modeName}-change-textarea`);
    fireEvent.change(textarea, { target: { value: '# title' } });
    expect(handleChange.mock.calls.at(-1)?.[0]).toBe('# title');
    fireEvent.change(textarea, { target: { value: '' } });
    expect(handleChange.mock.calls.at(-1)?.[0]).toBe('');
  });

  it('Markdown renders source content', () => {
    const { container } = render(<EditorComponent.Markdown source={'```js\nconsole.log("hello")\n```'} />);
    expect(container).toHaveTextContent('console.log("hello")');
  });
});
