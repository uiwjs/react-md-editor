import React from 'react';
import { insertAtLineStart } from '../utils/InsertTextAtPosition';
import { ICommand, TextState, TextAreaTextApi } from './';

export const title4: ICommand = {
  name: 'title4',
  keyCommand: 'title4',
  shortcuts: 'ctrlcmd+4',
  value: 'title4',
  buttonProps: { 'aria-label': 'Insert title4 (ctrl + 4)', title: 'Insert title4 (ctrl + 4)' },
  icon: <div style={{ fontSize: 14, textAlign: 'left' }}>Title 4</div>,
  execute: (state: TextState, api: TextAreaTextApi) => {
    if (state.selection.start === 0 || /\n$/.test(state.text)) {
      api.replaceSelection('#### ');
    } else {
      insertAtLineStart('#### ', state.selection.start, api.textArea);
    }
  },
};
