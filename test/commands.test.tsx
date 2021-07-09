/**
 * @jest-environment jsdom
 */
/* eslint-disable jest/no-conditional-expect */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MDEditor from '../src';

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
  const btn = getByLabelText('Insert code');
  btn.focus();
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  )
  const inputNode = getByTitle('test');
  expect(inputNode).toHaveValue('`title`');
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


it('MDEditor commands title2', async () => {
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
  const btn = getByLabelText('Insert title2');
  btn.focus();
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  )
  const inputNode = getByTitle('test');
  expect(inputNode).toHaveValue('## title');
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
  const btn = getByLabelText('Add ordered list');
  btn.focus();
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  )
  const inputNode = getByTitle('test');
  expect(inputNode).toHaveValue('1. title');
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
  const MyComponent = () => {
    const [value, setValue] = React.useState("title");
    return (
      <MDEditor
        value={value}
        textareaProps={{ title: 'test' }}
        onChange={(value) => {
          console.log(value)
          setValue(value || '');
        }}
      />
    );
  };
  const { getByTitle, getByLabelText } = render(<MyComponent />);
  const btn = getByLabelText('fullscreen');
  btn.focus();
  fireEvent(
    btn,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  )
  const inputNode = getByTitle('test');
  expect(inputNode).toHaveValue('title');
});
