/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import handleKeyDown from '../core/src/components/TextArea/handleKeyDown';

function pressEnter(
  value: string,
  options: { selectionStart?: number; selectionEnd?: number; shiftKey?: boolean } = {},
) {
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.selectionStart = options.selectionStart ?? value.length;
  textarea.selectionEnd = options.selectionEnd ?? textarea.selectionStart;
  document.body.appendChild(textarea);
  textarea.addEventListener('keydown', (e) => handleKeyDown(e));

  const event = new KeyboardEvent('keydown', {
    key: 'Enter',
    code: 'Enter',
    bubbles: true,
    cancelable: true,
    shiftKey: options.shiftKey ?? false,
  });
  Object.defineProperty(event, 'keyCode', { get: () => 13 });
  textarea.dispatchEvent(event);
  return textarea;
}

it('does not continue an ordered list when the line is not a list marker', () => {
  expect(pressEnter('1x text').value).toEqual('1x text');
  expect(pressEnter('2026: year').value).toEqual('2026: year');
  expect(pressEnter('12m von Zaun').value).toEqual('12m von Zaun');
});

it('continues a real ordered list on Enter', () => {
  expect(pressEnter('1. item').value).toEqual('1. item\n2. ');
});

it.each(['- ', '* ', '12. ', '- [ ] ', '- [x] ', '- [X] '])('ends an empty list item %s', (marker) => {
  const textarea = pressEnter(`first\n${marker}`);
  expect(textarea.value).toBe('first\n');
  expect(textarea.selectionStart).toBe(6);
  expect(textarea.selectionEnd).toBe(6);
});

it('keeps the next line when ending a list', () => {
  const value = '- first\n- \nnext';
  const textarea = pressEnter(value, { selectionStart: value.indexOf('\nnext') });
  expect(textarea.value).toBe('- first\n\nnext');
  expect(textarea.selectionStart).toBe(8);
});

it.each([
  ['- item', '- item\n- '],
  ['* item', '* item\n* '],
  ['- [ ] item', '- [ ] item\n- [ ] '],
  ['12. item', '12. item\n13. '],
])('continues nonempty list items %s', (value, expected) => {
  expect(pressEnter(value).value).toBe(expected);
});

it('keeps list continuation when the caret is before content', () => {
  expect(pressEnter('- item', { selectionStart: 2 }).value).toBe('- \n- item');
});

it('does not end empty list items on Shift+Enter', () => {
  expect(pressEnter('- ', { shiftKey: true }).value).toBe('- ');
});

function pressTab(value: string, selectionStart: number, selectionEnd: number, shiftKey = false) {
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.selectionStart = selectionStart;
  textarea.selectionEnd = selectionEnd;
  document.body.appendChild(textarea);
  textarea.addEventListener('keydown', (e) => handleKeyDown(e));
  textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', code: 'Tab', bubbles: true, cancelable: true, shiftKey }));
  return textarea;
}

it('indents the selected line when an identical line comes before it', () => {
  const value = '- [ ] milk\n- [ ] eggs\n- [ ] milk';
  const start = value.lastIndexOf('milk');
  expect(pressTab(value, start, start + 4).value).toBe('- [ ] milk\n- [ ] eggs\n    - [ ] milk');
});

it('indents the selected line when its text also appears earlier in another line', () => {
  const value = 'function f() {\n  if (a) {\n    b();\n  }\n}';
  expect(pressTab(value, value.length - 1, value.length).value).toBe(
    'function f() {\n  if (a) {\n    b();\n  }\n    }',
  );
});

it('outdents the selected line when an identical line comes before it', () => {
  const value = '    - a\n    - a';
  expect(pressTab(value, value.length - 1, value.length, true).value).toBe('    - a\n- a');
});

it('indents a selected line that appears only once', () => {
  const value = '- [ ] bread\n- [ ] eggs\n- [ ] milk';
  const start = value.lastIndexOf('milk');
  expect(pressTab(value, start, start + 4).value).toBe('- [ ] bread\n- [ ] eggs\n    - [ ] milk');
});

it('indents every line of a multi-line selection', () => {
  const value = 'intro\n- a\n- b';
  expect(pressTab(value, value.indexOf('- a'), value.length).value).toBe('intro\n    - a\n    - b');
});

it('keeps the line where the selection starts at its end', () => {
  const value = '- a\n- b';
  expect(pressTab(value, 3, value.length).value).toBe('- a\n    - b');
});
