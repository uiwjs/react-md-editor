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
