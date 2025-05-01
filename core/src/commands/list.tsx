import React from 'react';
import { type ICommand, type ExecuteState, TextAreaTextApi } from './';
import {
  selectWord,
  getBreaksNeededForEmptyLineBefore,
  getBreaksNeededForEmptyLineAfter,
  insertBeforeEachLine,
  AlterLineFunction,
} from '../utils/markdownUtils';

export const makeList = (state: ExecuteState, api: TextAreaTextApi, insertBefore: string | AlterLineFunction) => {
  const newSelectionRange = selectWord({ text: state.text, selection: state.selection, prefix: state.command.prefix! });
  const state1 = api.setSelectionRange(newSelectionRange);

  const breaksBeforeCount = getBreaksNeededForEmptyLineBefore(state1.text, state1.selection.start);
  const breaksBefore = Array(breaksBeforeCount + 1).join('\n');

  const breaksAfterCount = getBreaksNeededForEmptyLineAfter(state1.text, state1.selection.end);
  const breaksAfter = Array(breaksAfterCount + 1).join('\n');

  const { modifiedText, insertionLength } = insertBeforeEachLine(state1.selectedText, insertBefore);
  if (insertionLength < 0) {
    // Remove
    let selectionStart = state1.selection.start;
    let selectionEnd = state1.selection.end;
    if (state1.selection.start > 0 && state.text.slice(state1.selection.start - 1, state1.selection.start) === '\n') {
      selectionStart -= 1;
    }
    if (
      state1.selection.end < state.text.length - 1 &&
      state.text.slice(state1.selection.end, state1.selection.end + 1) === '\n'
    ) {
      selectionEnd += 1;
    }

    api.setSelectionRange({ start: selectionStart, end: selectionEnd });
    api.replaceSelection(`${modifiedText}`);
    api.setSelectionRange({ start: selectionStart, end: selectionStart + modifiedText.length });
  } else {
    // Add
    api.replaceSelection(`${breaksBefore}${modifiedText}${breaksAfter}`);
    const selectionStart = state1.selection.start + breaksBeforeCount;
    const selectionEnd = selectionStart + modifiedText.length;
    api.setSelectionRange({ start: selectionStart, end: selectionEnd });
  }
};

export const unorderedListCommand: ICommand = {
  name: 'unordered-list',
  keyCommand: 'list',
  shortcuts: 'ctrl+shift+u',
  prefix: '- ',
  buttonProps: {
    'aria-label': 'Add unordered list (ctrl + shift + u)',
    title: 'Add unordered list (ctrl + shift + u)',
  },
  icon: (
    <svg data-name="unordered-list" width="12" height="12" viewBox="0 0 512 512">
      <path
        fill="currentColor"
        d="M96 96c0 26.51-21.49 48-48 48S0 122.51 0 96s21.49-48 48-48 48 21.49 48 48zM48 208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm0 160c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm96-236h352c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H144c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h352c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H144c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h352c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H144c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"
      />
    </svg>
  ),
  execute: (state: ExecuteState, api: TextAreaTextApi) => {
    makeList(state, api, '- ');
  },
};

export const orderedListCommand: ICommand = {
  name: 'ordered-list',
  keyCommand: 'list',
  shortcuts: 'ctrl+shift+o',
  prefix: '1. ',
  buttonProps: { 'aria-label': 'Add ordered list (ctrl + shift + o)', title: 'Add ordered list (ctrl + shift + o)' },
  icon: (
    <svg data-name="ordered-list" width="12" height="12" role="img" viewBox="0 0 512 512">
      <path
        fill="currentColor"
        d="M3.263 139.527c0-7.477 3.917-11.572 11.573-11.572h15.131V88.078c0-5.163.534-10.503.534-10.503h-.356s-1.779 2.67-2.848 3.738c-4.451 4.273-10.504 4.451-15.666-1.068l-5.518-6.231c-5.342-5.341-4.984-11.216.534-16.379l21.72-19.938C32.815 33.602 36.732 32 42.785 32H54.89c7.656 0 11.749 3.916 11.749 11.572v84.384h15.488c7.655 0 11.572 4.094 11.572 11.572v8.901c0 7.477-3.917 11.572-11.572 11.572H14.836c-7.656 0-11.573-4.095-11.573-11.572v-8.902zM2.211 304.591c0-47.278 50.955-56.383 50.955-69.165 0-7.18-5.954-8.755-9.28-8.755-3.153 0-6.479 1.051-9.455 3.852-5.079 4.903-10.507 7.004-16.111 2.451l-8.579-6.829c-5.779-4.553-7.18-9.805-2.803-15.409C13.592 201.981 26.025 192 47.387 192c19.437 0 44.476 10.506 44.476 39.573 0 38.347-46.753 46.402-48.679 56.909h39.049c7.529 0 11.557 4.027 11.557 11.382v8.755c0 7.354-4.028 11.382-11.557 11.382h-67.94c-7.005 0-12.083-4.028-12.083-11.382v-4.028zM5.654 454.61l5.603-9.28c3.853-6.654 9.105-7.004 15.584-3.152 4.903 2.101 9.63 3.152 14.359 3.152 10.155 0 14.358-3.502 14.358-8.23 0-6.654-5.604-9.106-15.934-9.106h-4.728c-5.954 0-9.28-2.101-12.258-7.88l-1.05-1.926c-2.451-4.728-1.226-9.806 2.801-14.884l5.604-7.004c6.829-8.405 12.257-13.483 12.257-13.483v-.35s-4.203 1.051-12.608 1.051H16.685c-7.53 0-11.383-4.028-11.383-11.382v-8.755c0-7.53 3.853-11.382 11.383-11.382h58.484c7.529 0 11.382 4.027 11.382 11.382v3.327c0 5.778-1.401 9.806-5.079 14.183l-17.509 20.137c19.611 5.078 28.716 20.487 28.716 34.845 0 21.363-14.358 44.126-48.503 44.126-16.636 0-28.192-4.728-35.896-9.455-5.779-4.202-6.304-9.805-2.626-15.934zM144 132h352c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H144c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h352c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H144c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h352c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H144c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"
      />
    </svg>
  ),
  execute: (state: ExecuteState, api: TextAreaTextApi) => {
    makeList(state, api, (item, index) => `${index + 1}. `);
  },
};

export const checkedListCommand: ICommand = {
  name: 'checked-list',
  keyCommand: 'list',
  shortcuts: 'ctrl+shift+c',
  prefix: '- [ ] ',
  buttonProps: { 'aria-label': 'Add checked list (ctrl + shift + c)', title: 'Add checked list (ctrl + shift + c)' },
  icon: (
    <svg data-name="checked-list" width="12" height="12" role="img" viewBox="0 0 512 512">
      <path
        fill="currentColor"
        d="M208 132h288c8.8 0 16-7.2 16-16V76c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16v40c0 8.8 7.2 16 16 16zm0 160h288c8.8 0 16-7.2 16-16v-40c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16v40c0 8.8 7.2 16 16 16zm0 160h288c8.8 0 16-7.2 16-16v-40c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16v40c0 8.8 7.2 16 16 16zM64 368c-26.5 0-48.6 21.5-48.6 48s22.1 48 48.6 48 48-21.5 48-48-21.5-48-48-48zm92.5-299l-72.2 72.2-15.6 15.6c-4.7 4.7-12.9 4.7-17.6 0L3.5 109.4c-4.7-4.7-4.7-12.3 0-17l15.7-15.7c4.7-4.7 12.3-4.7 17 0l22.7 22.1 63.7-63.3c4.7-4.7 12.3-4.7 17 0l17 16.5c4.6 4.7 4.6 12.3-.1 17zm0 159.6l-72.2 72.2-15.7 15.7c-4.7 4.7-12.9 4.7-17.6 0L3.5 269c-4.7-4.7-4.7-12.3 0-17l15.7-15.7c4.7-4.7 12.3-4.7 17 0l22.7 22.1 63.7-63.7c4.7-4.7 12.3-4.7 17 0l17 17c4.6 4.6 4.6 12.2-.1 16.9z"
      />
    </svg>
  ),
  execute: (state: ExecuteState, api: TextAreaTextApi) => {
    makeList(state, api, (item, index) => `- [ ] `);
  },
};
