import * as React from 'react';
import { ICommand, TextState, TextAreaTextApi } from './';

export const title5: ICommand = {
  name: 'title5',
  keyCommand: 'title5',
  shortcuts: 'ctrlcmd+5',
  buttonProps: { 'aria-label': 'Insert title5', title: 'Insert title 5' },
  icon: <div style={{ fontSize: 12, textAlign: 'left' }}>Title 5</div>,
  execute: (state: TextState, api: TextAreaTextApi) => {
    let modifyText = `##### ${state.selectedText}\n`;
    if (!state.selectedText) {
      modifyText = `##### `;
    }
    api.replaceSelection(modifyText);
  },
};
