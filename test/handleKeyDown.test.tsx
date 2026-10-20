/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import handleKeyDown from '../core/src/components/TextArea/handleKeyDown';

function pressEnter(value: string) {
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.selectionStart = value.length;
  textarea.selectionEnd = value.length;
  document.body.appendChild(textarea);
  textarea.addEventListener('keydown', (e) => handleKeyDown(e));

  const event = new KeyboardEvent('keydown', {
    key: 'Enter',
    code: 'Enter',
    bubbles: true,
    cancelable: true,
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
