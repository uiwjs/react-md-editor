/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { executeCommand, selectWord } from '../../core/src/utils/markdownUtils';
import type { TextAreaTextApi } from '../../core/src/commands';

function createApi(initialText: string, selection: { start: number; end: number }) {
  let text = initialText;
  let range = { ...selection };
  const api = {
    replaceSelection(replacement: string) {
      text = text.slice(0, range.start) + replacement + text.slice(range.end);
      range = { start: range.start, end: range.start + replacement.length };
      return {
        text,
        selectedText: replacement,
        selection: range,
      };
    },
    setSelectionRange(next: { start: number; end: number }) {
      range = { ...next };
      return {
        text,
        selectedText: text.slice(range.start, range.end),
        selection: range,
      };
    },
  };
  return {
    api: api as unknown as TextAreaTextApi,
    getText: () => text,
  };
}

it('selectWord does not treat bold ** as italic *', () => {
  const text = '**hello**';
  const selection = { start: 2, end: 7 };
  expect(selectWord({ text, selection, prefix: '*' })).toEqual(selection);
});

it('selectWord still expands a true italic wrap', () => {
  const text = '*hello*';
  const selection = { start: 1, end: 6 };
  expect(selectWord({ text, selection, prefix: '*' })).toEqual({ start: 0, end: 7 });
});

it('selectWord expands italic when already bold+italic', () => {
  const text = '***hello***';
  const selection = { start: 3, end: 8 };
  expect(selectWord({ text, selection, prefix: '*' })).toEqual({ start: 2, end: 9 });
});

it('executeCommand wraps italic around bold instead of stripping bold', () => {
  const { api, getText } = createApi('**hello**', { start: 0, end: 9 });
  executeCommand({
    api,
    selectedText: '**hello**',
    selection: { start: 0, end: 9 },
    prefix: '*',
  });
  expect(getText()).toBe('***hello***');
});

it('executeCommand still unwraps italic', () => {
  const { api, getText } = createApi('*hello*', { start: 0, end: 7 });
  executeCommand({
    api,
    selectedText: '*hello*',
    selection: { start: 0, end: 7 },
    prefix: '*',
  });
  expect(getText()).toBe('hello');
});

it('executeCommand unwraps italic while keeping bold', () => {
  const { api, getText } = createApi('***hello***', { start: 0, end: 11 });
  executeCommand({
    api,
    selectedText: '***hello***',
    selection: { start: 0, end: 11 },
    prefix: '*',
  });
  expect(getText()).toBe('**hello**');
});
