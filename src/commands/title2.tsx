import * as React from 'react';
import { insertAtLineStart } from '../utils/InsertTextAtPosition';
import { ICommand, TextState, TextAreaTextApi } from './';

export const title2: ICommand = {
  name: 'title2',
  keyCommand: 'title2',
  shortcuts: 'ctrlcmd+2',
  buttonProps: { 'aria-label': 'Insert title2', title: 'Insert title 2' },
  icon: <div style={{ fontSize: 16, textAlign: 'left' }}>Title 2</div>,
  execute: (state: TextState, api: TextAreaTextApi) => {
    insertAtLineStart('## ', state.selection.start, api.textArea);
  },
};
