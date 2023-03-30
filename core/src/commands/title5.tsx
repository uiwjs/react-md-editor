import React from 'react';
import { insertAtLineStart } from '../utils/InsertTextAtPosition';
import { ICommand, TextState, TextAreaTextApi } from './';

export const title5: ICommand = {
  name: 'title5',
  keyCommand: 'title5',
  shortcuts: 'ctrlcmd+5',
  value: 'title5',
  buttonProps: { 'aria-label': 'Insert title5 (ctrl + 5)', title: 'Insert title5 (ctrl + 5)' },
  icon: <div style={{ fontSize: 12, textAlign: 'left' }}>Title 5</div>,
  execute: (state: TextState, api: TextAreaTextApi) => {
    if (state.selection.start === 0 || /\n$/.test(state.text)) {
      api.replaceSelection('##### ');
    } else {
      insertAtLineStart('##### ', state.selection.start, api.textArea);
    }
  },
};
