/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import MDEditor, { commands } from '../core/src';
// TODO add tests for command remove prefix/suffix on 2nd click

it('MDEditor commands bold', async () => {
  const MyComponent = () => {
    const [value, setValue] = React.useState('title');
    return (
      <MDEditor
        value={value}
        textareaProps={{ title: 'test' }}
        onChange={(value) => {
          setValue(value || '');
        }}
      />
    );
  };
  render(<MyComponent />);
  const btn = screen.getByTitle('Add bold text (ctrl + b)');
  btn.focus();
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );
  const inputNode = screen.getByTitle('test');
  expect(inputNode).toHaveValue('**title**');
});

it('MDEditor commands italic', async () => {
  const MyComponent = () => {
    const [value, setValue] = React.useState('title');
    return (
      <MDEditor
        value={value}
        textareaProps={{ title: 'test' }}
        onChange={(value) => {
          setValue(value || '');
        }}
      />
    );
  };
  render(<MyComponent />);
  const btn = screen.getByTitle('Add italic text (ctrl + i)');
  btn.focus();
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );
  const inputNode = screen.getByTitle('test');
  expect(inputNode).toHaveValue('*title*');
});

it('MDEditor commands code', async () => {
  const handleChange = jest.fn((value) => value);
  render(<MDEditor value={`He llo \nWold!`} textareaProps={{ title: 'test' }} onChange={handleChange} />);
  const input = screen.getByTitle<HTMLInputElement>('test');
  input.setSelectionRange(0, 5);
  const btn = screen.getByLabelText('Insert code (ctrl + j)');
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );
  expect(handleChange).toHaveReturnedWith('`He ll`o \nWold!');
});

it('MDEditor commands selectOptions code', async () => {
  const handleChange = jest.fn((value) => value);
  render(<MDEditor value={`Hello\nWold!`} textareaProps={{ title: 'test' }} onChange={handleChange} />);
  const input = screen.getByTitle<HTMLInputElement>('test');
  input.setSelectionRange(0, 11);
  const btn = screen.getByLabelText('Insert code (ctrl + j)');
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );
  expect(handleChange).toHaveReturnedWith('```\nHello\nWold!\n```');
});

it('MDEditor commands code `ctrlcmd+j`', async () => {
  const handleChange = jest.fn((value) => value);
  render(<MDEditor value={`Hello`} textareaProps={{ title: 'test' }} onChange={handleChange} />);
  const input = screen.getByTitle('test');
  fireEvent.keyDown(input, { key: 'J', code: 'KeyJ', ctrlKey: true, shiftKey: true });
  expect(handleChange).toHaveReturnedWith('```\nHello\n```');
});

it('MDEditor commands quote', async () => {
  const MyComponent = () => {
    const [value, setValue] = React.useState('title');
    return (
      <MDEditor
        value={value}
        textareaProps={{ title: 'test' }}
        onChange={(value) => {
          setValue(value || '');
        }}
      />
    );
  };
  render(<MyComponent />);
  const btn = screen.getByLabelText('Insert a quote (ctrl + q)');
  btn.focus();
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );
  const inputNode = screen.getByTitle('test');
  expect(inputNode).toHaveValue('> title');
});

it('MDEditor commands HR', async () => {
  const MyComponent = () => {
    const [value, setValue] = React.useState('title');
    return (
      <MDEditor
        value={value}
        textareaProps={{ title: 'test' }}
        onChange={(value) => {
          setValue(value || '');
        }}
      />
    );
  };
  render(<MyComponent />);
  const btn = screen.getByLabelText('Insert HR (ctrl + h)');
  btn.focus();
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );
  const inputNode = screen.getByTitle('test');
  expect(inputNode).toHaveValue('\n\n---\ntitle');
});

it('MDEditor commands strikethrough text', async () => {
  const MyComponent = () => {
    const [value, setValue] = React.useState('title');
    return (
      <MDEditor
        value={value}
        textareaProps={{ title: 'test' }}
        onChange={(value) => {
          setValue(value || '');
        }}
      />
    );
  };
  render(<MyComponent />);
  const btn = screen.getByLabelText('Add strikethrough text (ctrl + shift + x)');
  btn.focus();
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );
  const inputNode = screen.getByTitle('test');
  expect(inputNode).toHaveValue('~~title~~');
});

it('MDEditor commands link', async () => {
  const MyComponent = () => {
    const [value, setValue] = React.useState('page');
    return (
      <MDEditor
        value={value}
        textareaProps={{ title: 'test' }}
        onChange={(value) => {
          setValue(value || '');
        }}
      />
    );
  };
  render(<MyComponent />);
  const btn = screen.getByLabelText('Add a link (ctrl + l)');
  btn.focus();
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );
  const inputNode = screen.getByTitle('test');
  expect(inputNode).toHaveValue('[page](url)');
});

it("MDEditor commands link ===''", async () => {
  const MyComponent = () => {
    const [value, setValue] = React.useState('');
    return (
      <MDEditor
        value={value}
        textareaProps={{ title: 'test' }}
        onChange={(value) => {
          setValue(value || '');
        }}
      />
    );
  };
  render(<MyComponent />);
  const btn = screen.getByLabelText('Add a link (ctrl + l)');
  btn.focus();
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );
  const inputNode = screen.getByTitle('test');
  expect(inputNode).toHaveValue('[title](url)');
});

it('MDEditor commands link link', async () => {
  const MyComponent = () => {
    const [value, setValue] = React.useState('https://example.com');
    return (
      <MDEditor
        value={value}
        textareaProps={{ title: 'test' }}
        onChange={(value) => {
          setValue(value || '');
        }}
      />
    );
  };
  render(<MyComponent />);
  const btn = screen.getByLabelText('Add a link (ctrl + l)');
  btn.focus();
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );
  const inputNode = screen.getByTitle('test');
  expect(inputNode).toHaveValue('[](https://example.com)');
});

it('MDEditor commands image', async () => {
  const MyComponent = () => {
    const [value, setValue] = React.useState('title');
    return (
      <MDEditor
        value={value}
        textareaProps={{ title: 'test' }}
        onChange={(value) => {
          setValue(value || '');
        }}
      />
    );
  };
  render(<MyComponent />);
  const btn = screen.getByLabelText('Add image (ctrl + k)');
  btn.focus();
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );
  const inputNode = screen.getByTitle('test');
  expect(inputNode).toHaveValue('![title]()');
});

it('MDEditor commands image link', async () => {
  const MyComponent = () => {
    const [value, setValue] = React.useState('https://example.com/image.png');
    return (
      <MDEditor
        value={value}
        textareaProps={{ title: 'test' }}
        onChange={(value) => {
          setValue(value || '');
        }}
      />
    );
  };
  render(<MyComponent />);
  const btn = screen.getByLabelText('Add image (ctrl + k)');
  btn.focus();
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );
  const inputNode = screen.getByTitle('test');
  expect(inputNode).toHaveValue('![image](https://example.com/image.png)');
});

it("MDEditor commands image === ''", async () => {
  const MyComponent = () => {
    const [value, setValue] = React.useState('');
    return (
      <MDEditor
        value={value}
        textareaProps={{ title: 'test' }}
        onChange={(value) => {
          setValue(value || '');
        }}
      />
    );
  };
  render(<MyComponent />);
  const btn = screen.getByLabelText('Add image (ctrl + k)');
  btn.focus();
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );
  const inputNode = screen.getByTitle('test');
  expect(inputNode).toHaveValue('![image](url)');
});

it('MDEditor commands Add unordered list', async () => {
  const MyComponent = () => {
    const [value, setValue] = React.useState('title');
    return (
      <MDEditor
        value={value}
        textareaProps={{ title: 'test' }}
        onChange={(value) => {
          setValue(value || '');
        }}
      />
    );
  };
  render(<MyComponent />);
  const btn = screen.getByLabelText('Add unordered list (ctrl + shift + u)');
  btn.focus();
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );
  const inputNode = screen.getByTitle('test');
  expect(inputNode).toHaveValue('- title');
});

it('MDEditor commands Add ordered list', async () => {
  const handleChange = jest.fn((value) => value);
  render(<MDEditor value="title" textareaProps={{ title: 'test' }} onChange={handleChange} />);
  const btn = screen.getByLabelText('Add ordered list (ctrl + shift + o)');
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );
  expect(handleChange).toHaveReturnedWith('1. title');
});

it('MDEditor commands Add checked list', async () => {
  const MyComponent = () => {
    const [value, setValue] = React.useState('title');
    return (
      <MDEditor
        value={value}
        textareaProps={{ title: 'test' }}
        onChange={(value) => {
          setValue(value || '');
        }}
      />
    );
  };
  render(<MyComponent />);
  const btn = screen.getByLabelText('Add checked list (ctrl + shift + c)');

  btn.focus();
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );
  const inputNode = screen.getByTitle('test');
  expect(inputNode).toHaveValue('- [ ] title');
});

it('MDEditor commands fullscreen', async () => {
  const handleChange = jest.fn((value) => value);
  await render(<MDEditor value="title" textareaProps={{ title: 'test' }} onChange={handleChange} />);
  const btn = screen.getByLabelText('Toggle fullscreen (ctrl + 0)');
  fireEvent(btn, new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(document.body.style).toMatchObject({
    overflow: 'hidden',
  });
  const input = screen.getByTitle('test');
  input.focus();
  expect(handleChange).not.toHaveReturned();
  // await fireEvent.keyDown(input, { key: 'Escape' });
  // await fireEvent.keyDown(input, { key: 'Escape' });
  userEvent.type(input, `{esc}`);
  userEvent.keyboard('{esc}');
  expect(document.body.style).toMatchObject({
    // overflow: 'visible',
    // 🚨🚨🚨🚨🚨🚨🚨🚨🚨 ??????????
    overflow: 'hidden',
  });
});

it('MDEditor commands comment `ctrlcmd+/`', async () => {
  const handleChange = jest.fn((value) => value);
  render(<MDEditor value={`Hello`} textareaProps={{ title: 'test' }} onChange={handleChange} />);
  const input = screen.getByTitle('test');
  fireEvent.keyDown(input, { key: '/', code: 'Slash', ctrlKey: true });
  expect(handleChange).toHaveReturnedWith('<!-- Hello -->');
});

it('MDEditor commands heading1 value === undefined', async () => {
  const handleChange = jest.fn((value) => value);
  render(<MDEditor onChange={handleChange} commands={[commands.heading1]} />);
  const btn = screen.getByLabelText('Insert Heading 1 (ctrl + 1)');
  fireEvent(btn, new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(handleChange).toHaveReturnedWith('# ');
});

it('MDEditor commands heading1 value === test', async () => {
  const handleChange = jest.fn((value) => value);
  render(
    <MDEditor
      value="test"
      textareaProps={{ title: 'textarea' }}
      onChange={handleChange}
      commands={[commands.heading1]}
    />,
  );
  const btn = screen.getByLabelText('Insert Heading 1 (ctrl + 1)');
  const input = screen.getByTitle<HTMLTextAreaElement>('textarea');
  input.setSelectionRange(2, 2);

  fireEvent(btn, new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(handleChange).toHaveReturnedWith('# test');
});

it('MDEditor commands heading2 value === undefined', async () => {
  const handleChange = jest.fn((value) => value);
  render(<MDEditor onChange={handleChange} textareaProps={{ title: 'test' }} commands={[commands.heading2]} />);
  const input = screen.getByTitle<HTMLInputElement>('test');
  input.setSelectionRange(0, 0);
  const btn = screen.getByLabelText('Insert Heading 2 (ctrl + 2)');
  fireEvent(btn, new MouseEvent('click', { bubbles: true, cancelable: true }));
  input.setSelectionRange(0, 0);
  expect(handleChange).toHaveReturnedWith('## ');
});

it('MDEditor commands heading2 value === test', async () => {
  const handleChange = jest.fn((value) => value);
  render(
    <MDEditor value="test" onChange={handleChange} textareaProps={{ title: 'test' }} commands={[commands.heading2]} />,
  );
  const input = screen.getByTitle<HTMLInputElement>('test');
  input.setSelectionRange(2, 2);
  const btn = screen.getByLabelText('Insert Heading 2 (ctrl + 2)');
  fireEvent(btn, new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(handleChange).toHaveReturnedWith('## test');
});

it('MDEditor commands heading3 value === undefined', async () => {
  const handleChange = jest.fn((value) => value);
  render(<MDEditor onChange={handleChange} commands={[commands.heading3]} />);
  const btn = screen.getByLabelText('Insert Heading 3 (ctrl + 3)');
  fireEvent(btn, new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(handleChange).toHaveReturnedWith('### ');
});

it('MDEditor commands heading3 value === test', async () => {
  const handleChange = jest.fn((value) => value);
  render(
    <MDEditor
      value="test"
      textareaProps={{ title: 'textarea' }}
      onChange={handleChange}
      commands={[commands.heading3]}
    />,
  );
  const btn = screen.getByLabelText('Insert Heading 3 (ctrl + 3)');
  const input = screen.getByTitle<HTMLInputElement>('textarea');
  input.setSelectionRange(2, 2);
  fireEvent(btn, new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(handleChange).toHaveReturnedWith('### test');
});

it('MDEditor commands heading4 value === undefined', async () => {
  const handleChange = jest.fn((value) => value);
  render(<MDEditor onChange={handleChange} commands={[commands.heading4]} />);
  const btn = screen.getByLabelText('Insert Heading 4 (ctrl + 4)');
  fireEvent(btn, new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(handleChange).toHaveReturnedWith('#### ');
});

it('MDEditor commands heading4 value === test', async () => {
  const handleChange = jest.fn((value) => value);
  render(
    <MDEditor
      value="test"
      textareaProps={{ title: 'textarea' }}
      onChange={handleChange}
      commands={[commands.title4]}
    />,
  );
  const btn = screen.getByLabelText('Insert Heading 4 (ctrl + 4)');
  const input = screen.getByTitle('textarea');
  (input as any).setSelectionRange(2, 2);
  fireEvent(btn, new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(handleChange).toHaveReturnedWith('#### test');
});

it('MDEditor commands heading5 value === undefined', async () => {
  const handleChange = jest.fn((value) => value);
  render(<MDEditor onChange={handleChange} commands={[commands.heading5]} />);
  const btn = screen.getByLabelText('Insert Heading 5 (ctrl + 5)');
  fireEvent(btn, new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(handleChange).toHaveReturnedWith('##### ');
});

it('MDEditor commands heading5 value === test', async () => {
  const handleChange = jest.fn((value) => value);
  render(
    <MDEditor
      value="test"
      textareaProps={{ title: 'textarea' }}
      onChange={handleChange}
      commands={[commands.heading5]}
    />,
  );
  const btn = screen.getByLabelText('Insert Heading 5 (ctrl + 5)');
  const input = screen.getByTitle<HTMLInputElement>('textarea');
  input.setSelectionRange(2, 2);
  fireEvent(btn, new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(handleChange).toHaveReturnedWith('##### test');
});

it('MDEditor commands heading6 value === undefined', async () => {
  const handleChange = jest.fn((value) => value);
  render(<MDEditor onChange={handleChange} commands={[commands.heading6]} />);
  const btn = screen.getByLabelText('Insert Heading 6 (ctrl + 6)');
  fireEvent(btn, new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(handleChange).toHaveReturnedWith('###### ');
});

it('MDEditor commands heading6 value === test', async () => {
  const handleChange = jest.fn((value) => value);
  render(
    <MDEditor
      value="test"
      textareaProps={{ title: 'textarea' }}
      onChange={handleChange}
      commands={[commands.title6]}
    />,
  );
  const btn = screen.getByLabelText('Insert Heading 6 (ctrl + 6)');
  const input = screen.getByTitle('textarea');
  (input as any).setSelectionRange(2, 2);
  fireEvent(btn, new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(handleChange).toHaveReturnedWith('###### test');
});
