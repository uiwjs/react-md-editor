/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MDEditor, { commands } from '../src';

it('MDEditor commands bold', async () => {
  const MyComponent = () => {
    const [value, setValue] = React.useState("title");
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
  const { getByTitle } = render(<MyComponent />);
  const btn = getByTitle('Add bold text');
  btn.focus();
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  )
  const inputNode = getByTitle('test');
  expect(inputNode).toHaveValue('**title**');
});


it('MDEditor commands italic', async () => {
  const MyComponent = () => {
    const [value, setValue] = React.useState("title");
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
  const { getByTitle } = render(<MyComponent />);
  const btn = getByTitle('Add italic text');
  btn.focus();
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  )
  const inputNode = getByTitle('test');
  expect(inputNode).toHaveValue('*title*');
});


it('MDEditor commands code', async () => {
  const handleChange = jest.fn((value) => value);
  const { getByLabelText, getByTitle } = render(
    <MDEditor value={`He llo \nWold!`} textareaProps={{ title: 'test' }} onChange={handleChange} />
  );
  const input = getByTitle('test');
  (input as any).setSelectionRange(0, 5)
  const btn = getByLabelText('Insert code');
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  );
  expect(handleChange).toHaveReturnedWith('`He ll`o \nWold!');
});


it('MDEditor commands selectOptions code', async () => {
  const handleChange = jest.fn((value) => value);
  const { getByLabelText, getByTitle } = render(
    <MDEditor value={`Hello\nWold!`} textareaProps={{ title: 'test' }} onChange={handleChange} />
  );
  const input = getByTitle('test');
  (input as any).setSelectionRange(0, 11)
  const btn = getByLabelText('Insert code');
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  );
  expect(handleChange).toHaveReturnedWith('```\nHello\nWold!\n```');
});


it('MDEditor commands code `ctrlcmd+j`', async () => {
  const handleChange = jest.fn((value) => value);
  const { getByTitle } = render(
    <MDEditor value={`Hello`} textareaProps={{ title: 'test' }} onChange={handleChange} />
  );
  const input = getByTitle('test');
  fireEvent.keyDown(input, { key: 'J', code: 'KeyJ', ctrlKey: true, shiftKey: true })
  expect(handleChange).toHaveReturnedWith('```\nHello\n```');
});


it('MDEditor commands quote', async () => {
  const MyComponent = () => {
    const [value, setValue] = React.useState("title");
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
  const { getByTitle, getByLabelText } = render(<MyComponent />);
  const btn = getByLabelText('Insert a quote');
  btn.focus();
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  )
  const inputNode = getByTitle('test');
  expect(inputNode).toHaveValue('> title');
});


it('MDEditor commands HR', async () => {
  const MyComponent = () => {
    const [value, setValue] = React.useState("title");
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
  const { getByTitle, getByLabelText } = render(<MyComponent />);
  const btn = getByLabelText('Insert HR');
  btn.focus();
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  )
  const inputNode = getByTitle('test');
  expect(inputNode).toHaveValue('\n\n----------\n\ntitle');
});


it('MDEditor commands strikethrough text', async () => {
  const MyComponent = () => {
    const [value, setValue] = React.useState("title");
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
  const { getByTitle, getByLabelText } = render(<MyComponent />);
  const btn = getByLabelText('Add strikethrough text');
  btn.focus();
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  )
  const inputNode = getByTitle('test');
  expect(inputNode).toHaveValue('~~title~~');
});


it('MDEditor commands link', async () => {
  const MyComponent = () => {
    const [value, setValue] = React.useState("title");
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
  const { getByTitle, getByLabelText } = render(<MyComponent />);
  const btn = getByLabelText('Add a link');
  btn.focus();
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  )
  const inputNode = getByTitle('test');
  expect(inputNode).toHaveValue('[title](url)');
});


it('MDEditor commands image', async () => {
  const MyComponent = () => {
    const [value, setValue] = React.useState("title");
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
  const { getByTitle, getByLabelText } = render(<MyComponent />);
  const btn = getByLabelText('Add image');
  btn.focus();
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  )
  const inputNode = getByTitle('test');
  expect(inputNode).toHaveValue('![](title)');
});

it('MDEditor commands image === \'\'', async () => {
  const MyComponent = () => {
    const [value, setValue] = React.useState("");
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
  const { getByTitle, getByLabelText } = render(<MyComponent />);
  const btn = getByLabelText('Add image');
  btn.focus();
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  )
  const inputNode = getByTitle('test');
  expect(inputNode).toHaveValue('![](https://example.com/your-image.png)');
});

it('MDEditor commands Add unordered list', async () => {
  const MyComponent = () => {
    const [value, setValue] = React.useState("title");
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
  const { getByTitle, getByLabelText } = render(<MyComponent />);
  const btn = getByLabelText('Add unordered list');
  btn.focus();
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  )
  const inputNode = getByTitle('test');
  expect(inputNode).toHaveValue('- title');
});

it('MDEditor commands Add ordered list', async () => {
  const handleChange = jest.fn((value) => value);
  const { getByLabelText } = render(
    <MDEditor
      value="title"
      textareaProps={{ title: 'test' }}
      onChange={handleChange}
    />
  );
  const btn = getByLabelText('Add ordered list');
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  )
  expect(handleChange).toHaveReturnedWith('1. title');
});

it('MDEditor commands Add checked list', async () => {
  const MyComponent = () => {
    const [value, setValue] = React.useState("title");
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
  const { getByTitle, getByLabelText } = render(<MyComponent />);
  const btn = getByLabelText('Add checked list');
  btn.focus();
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  )
  const inputNode = getByTitle('test');
  expect(inputNode).toHaveValue('- [ ] title');
});

it('MDEditor commands fullscreen', async () => {
  const handleChange = jest.fn((value) => value);
  const { getByLabelText, getByTitle } = render(
    <MDEditor
      value="title"
      textareaProps={{ title: 'test' }}
      onChange={handleChange}
    />
  );
  const btn = getByLabelText('fullscreen');
  fireEvent(btn, new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(document.body.style).toMatchObject({
    overflow: 'hidden'
  });
  const input = getByTitle('test');
  input.focus();
  expect(handleChange).not.toHaveReturned()
  fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });
  expect(document.body.style).toMatchObject({
    overflow: 'initial'
  });
});

it('MDEditor commands comment `ctrlcmd+/`', async () => {
  const handleChange = jest.fn((value) => value);
  const { getByTitle } = render(
    <MDEditor value={`Hello`} textareaProps={{ title: 'test' }} onChange={handleChange} />
  );
  const input = getByTitle('test');
  fireEvent.keyDown(input, { key: '/', code: 'Slash', ctrlKey: true })
  expect(handleChange).toHaveReturnedWith('<!-- Hello -->');
});



it('MDEditor commands title1 value === undefined', async () => {
  const handleChange = jest.fn((value) => value);
  const { getByLabelText } = render(
    <MDEditor onChange={handleChange} commands={[ commands.title1 ]} />
  );
  const btn = getByLabelText('Insert title 1');
  fireEvent(btn, new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(handleChange).toHaveReturnedWith('# ');
});

it('MDEditor commands title2 value === undefined', async () => {
  const handleChange = jest.fn((value) => value);
  const { getByLabelText,getByTitle } = render(
    <MDEditor onChange={handleChange} textareaProps={{ title: 'test' }} commands={[ commands.title2 ]} />
  );
  const input = getByTitle('test');
  (input as any).setSelectionRange(0, 0)
  const btn = getByLabelText('Insert title2');
  fireEvent(btn, new MouseEvent('click', { bubbles: true, cancelable: true }));
  (input as any).setSelectionRange(0, 0)
  expect(handleChange).toHaveReturnedWith('## ');
});


it('MDEditor commands title3 value === undefined', async () => {
  const handleChange = jest.fn((value) => value);
  const { getByLabelText } = render(
    <MDEditor onChange={handleChange} commands={[ commands.title3 ]} />
  );
  const btn = getByLabelText('Insert title3');
  fireEvent(btn, new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(handleChange).toHaveReturnedWith('### ');
});


it('MDEditor commands title4 value === undefined', async () => {
  const handleChange = jest.fn((value) => value);
  const { getByLabelText } = render(
    <MDEditor onChange={handleChange} commands={[ commands.title4 ]} />
  );
  const btn = getByLabelText('Insert title4');
  fireEvent(btn, new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(handleChange).toHaveReturnedWith('#### ');
});


it('MDEditor commands title5 value === undefined', async () => {
  const handleChange = jest.fn((value) => value);
  const { getByLabelText } = render(
    <MDEditor onChange={handleChange} commands={[ commands.title5 ]} />
  );
  const btn = getByLabelText('Insert title5');
  fireEvent(btn, new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(handleChange).toHaveReturnedWith('##### ');
});


it('MDEditor commands title6 value === undefined', async () => {
  const handleChange = jest.fn((value) => value);
  const { getByLabelText } = render(
    <MDEditor onChange={handleChange} commands={[ commands.title6 ]} />
  );
  const btn = getByLabelText('Insert title6');
  fireEvent(btn, new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(handleChange).toHaveReturnedWith('###### ');
});
