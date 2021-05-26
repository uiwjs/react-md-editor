import React from 'react';
import { ICommand, TextState, TextAreaTextApi } from './';

export const title1: ICommand = {
  name: 'title1',
  keyCommand: 'title1',
  shortcuts: 'ctrlcmd+1',
  buttonProps: { 'aria-label': 'Insert title 1', title: 'Insert title 1' },
  icon: <div style={{ fontSize: 18, textAlign: 'left' }}>Title 1</div>,
  execute: (state: TextState, api: TextAreaTextApi) => {
    let modifyText = `# ${state.selectedText}\n`;
    if (!state.selectedText) {
      modifyText = `# `;
    }
    api.replaceSelection(modifyText);
  },
};
