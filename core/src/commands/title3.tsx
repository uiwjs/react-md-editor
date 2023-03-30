import React from 'react';
import { insertAtLineStart } from '../utils/InsertTextAtPosition';
import { ICommand, TextState, TextAreaTextApi } from './';

export const title3: ICommand = {
  name: 'title3',
  keyCommand: 'title3',
  shortcuts: 'ctrlcmd+3',
  value: 'title3',
  buttonProps: { 'aria-label': 'Insert title3 (ctrl + 3)', title: 'Insert title3 (ctrl + 3)' },
  icon: <div style={{ fontSize: 15, textAlign: 'left' }}>Title 3</div>,
  execute: (state: TextState, api: TextAreaTextApi) => {
    if (state.selection.start === 0 || /\n$/.test(state.text)) {
      api.replaceSelection('### ');
    } else {
      insertAtLineStart('### ', state.selection.start, api.textArea);
    }
  },
};
