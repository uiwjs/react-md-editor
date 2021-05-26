import * as React from 'react';
import { ICommand, TextState, TextAreaTextApi } from './';

export const title6: ICommand = {
  name: 'title6',
  keyCommand: 'title6',
  shortcuts: 'ctrlcmd+6',
  buttonProps: { 'aria-label': 'Insert title6', title: 'Insert title 6' },
  icon: <div style={{ fontSize: 12, textAlign: 'left' }}>Title 6</div>,
  execute: (state: TextState, api: TextAreaTextApi) => {
    let modifyText = `###### ${state.selectedText}\n`;
    if (!state.selectedText) {
      modifyText = `###### `;
    }
    api.replaceSelection(modifyText);
  },
};
