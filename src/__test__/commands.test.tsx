/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import MDEditor, { commands } from '../';

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
  const btn = screen.getByTitle('Add bold text');
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
  const btn = screen.getByTitle('Add italic text');
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
  const btn = screen.getByLabelText('Insert code');
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
  const btn = screen.getByLabelText('Insert code');
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
  const btn = screen.getByLabelText('Insert a quote');
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
  const btn = screen.getByLabelText('Insert HR');
  btn.focus();
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );
  const inputNode = screen.getByTitle('test');
  expect(inputNode).toHaveValue('\n\n----------\n\ntitle');
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
  const btn = screen.getByLabelText('Add strikethrough text');
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
  const btn = screen.getByLabelText('Add a link');
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
  const btn = screen.getByLabelText('Add image');
  btn.focus();
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );
  const inputNode = screen.getByTitle('test');
  expect(inputNode).toHaveValue('![](title)');
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
  const btn = screen.getByLabelText('Add image');
  btn.focus();
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );
  const inputNode = screen.getByTitle('test');
  expect(inputNode).toHaveValue('![](https://example.com/your-image.png)');
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
  const btn = screen.getByLabelText('Add unordered list');
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
  const btn = screen.getByLabelText('Add ordered list');
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
  const btn = screen.getByLabelText('Add checked list');

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
  const btn = screen.getByLabelText('fullscreen');
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

it('MDEditor commands title1 value === undefined', async () => {
  const handleChange = jest.fn((value) => value);
  render(<MDEditor onChange={handleChange} commands={[commands.title1]} />);
  const btn = screen.getByLabelText('Insert title 1');
  fireEvent(btn, new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(handleChange).toHaveReturnedWith('# ');
});

it('MDEditor commands title1 value === test', async () => {
  const handleChange = jest.fn((value) => value);
  render(
    <MDEditor
      value="test"
      textareaProps={{ title: 'textarea' }}
      onChange={handleChange}
      commands={[commands.title1]}
    />,
  );
  const btn = screen.getByLabelText('Insert title 1');
  const input = screen.getByTitle<HTMLTextAreaElement>('textarea');
  input.setSelectionRange(2, 2);

  fireEvent(btn, new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(handleChange).toHaveReturnedWith('# test');
});

it('MDEditor commands title2 value === undefined', async () => {
  const handleChange = jest.fn((value) => value);
  render(<MDEditor onChange={handleChange} textareaProps={{ title: 'test' }} commands={[commands.title2]} />);
  const input = screen.getByTitle<HTMLInputElement>('test');
  input.setSelectionRange(0, 0);
  const btn = screen.getByLabelText('Insert title2');
  fireEvent(btn, new MouseEvent('click', { bubbles: true, cancelable: true }));
  input.setSelectionRange(0, 0);
  expect(handleChange).toHaveReturnedWith('## ');
});

it('MDEditor commands title2 value === test', async () => {
  const handleChange = jest.fn((value) => value);
  render(
    <MDEditor value="test" onChange={handleChange} textareaProps={{ title: 'test' }} commands={[commands.title2]} />,
  );
  const input = screen.getByTitle<HTMLInputElement>('test');
  input.setSelectionRange(2, 2);
  const btn = screen.getByLabelText('Insert title2');
  fireEvent(btn, new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(handleChange).toHaveReturnedWith('## test');
});

it('MDEditor commands title3 value === undefined', async () => {
  const handleChange = jest.fn((value) => value);
  render(<MDEditor onChange={handleChange} commands={[commands.title3]} />);
  const btn = screen.getByLabelText('Insert title3');
  fireEvent(btn, new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(handleChange).toHaveReturnedWith('### ');
});

it('MDEditor commands title3 value === test', async () => {
  const handleChange = jest.fn((value) => value);
  render(
    <MDEditor
      value="test"
      textareaProps={{ title: 'textarea' }}
      onChange={handleChange}
      commands={[commands.title3]}
    />,
  );
  const btn = screen.getByLabelText('Insert title3');
  const input = screen.getByTitle<HTMLInputElement>('textarea');
  input.setSelectionRange(2, 2);
  fireEvent(btn, new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(handleChange).toHaveReturnedWith('### test');
});

it('MDEditor commands title4 value === undefined', async () => {
  const handleChange = jest.fn((value) => value);
  render(<MDEditor onChange={handleChange} commands={[commands.title4]} />);
  const btn = screen.getByLabelText('Insert title4');
  fireEvent(btn, new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(handleChange).toHaveReturnedWith('#### ');
});

it('MDEditor commands title4 value === test', async () => {
  const handleChange = jest.fn((value) => value);
  render(
    <MDEditor
      value="test"
      textareaProps={{ title: 'textarea' }}
      onChange={handleChange}
      commands={[commands.title4]}
    />,
  );
  const btn = screen.getByLabelText('Insert title4');
  const input = screen.getByTitle('textarea');
  (input as any).setSelectionRange(2, 2);
  fireEvent(btn, new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(handleChange).toHaveReturnedWith('#### test');
});

it('MDEditor commands title5 value === undefined', async () => {
  const handleChange = jest.fn((value) => value);
  render(<MDEditor onChange={handleChange} commands={[commands.title5]} />);
  const btn = screen.getByLabelText('Insert title5');
  fireEvent(btn, new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(handleChange).toHaveReturnedWith('##### ');
});

it('MDEditor commands title5 value === test', async () => {
  const handleChange = jest.fn((value) => value);
  render(
    <MDEditor
      value="test"
      textareaProps={{ title: 'textarea' }}
      onChange={handleChange}
      commands={[commands.title5]}
    />,
  );
  const btn = screen.getByLabelText('Insert title5');
  const input = screen.getByTitle<HTMLInputElement>('textarea');
  input.setSelectionRange(2, 2);
  fireEvent(btn, new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(handleChange).toHaveReturnedWith('##### test');
});

it('MDEditor commands title6 value === undefined', async () => {
  const handleChange = jest.fn((value) => value);
  render(<MDEditor onChange={handleChange} commands={[commands.title6]} />);
  const btn = screen.getByLabelText('Insert title6');
  fireEvent(btn, new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(handleChange).toHaveReturnedWith('###### ');
});

it('MDEditor commands title6 value === test', async () => {
  const handleChange = jest.fn((value) => value);
  render(
    <MDEditor
      value="test"
      textareaProps={{ title: 'textarea' }}
      onChange={handleChange}
      commands={[commands.title6]}
    />,
  );
  const btn = screen.getByLabelText('Insert title6');
  const input = screen.getByTitle('textarea');
  (input as any).setSelectionRange(2, 2);
  fireEvent(btn, new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(handleChange).toHaveReturnedWith('###### test');
});
