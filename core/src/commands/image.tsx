import React from 'react';
import { ICommand, ExecuteState, TextAreaTextApi } from './';
import { selectWord } from '../utils/markdownUtils';

export const image: ICommand = {
  name: 'image',
  keyCommand: 'image',
  shortcuts: 'ctrlcmd+k',
  value: '![image]({{text}})',
  buttonProps: { 'aria-label': 'Add image (ctrl + k)', title: 'Add image (ctrl + k)' },
  icon: (
    <svg width="13" height="13" viewBox="0 0 20 20">
      <path
        fill="currentColor"
        d="M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13l-6-5-2 2-4-5-4 8V4h16v11z"
      />
    </svg>
  ),
  execute: (state: ExecuteState, api: TextAreaTextApi) => {
    // Select everything
    const newSelectionRange = selectWord({ text: state.text, selection: state.selection });
    const state1 = api.setSelectionRange(newSelectionRange);
    // Replaces the current selection with the image
    const imageTemplate = state1.selectedText || 'https://example.com/your-image.png';
    const val = state.command.value || '';
    api.replaceSelection(val.replace(/({{text}})/gi, imageTemplate));

    const start = state1.selection.start + val.indexOf('{{text}}');
    let end = state1.selection.start + val.indexOf('{{text}}') + (state1.selection.end - state1.selection.start);
    if (!state1.selectedText) {
      end = end + imageTemplate.length;
    }
    api.setSelectionRange({ start, end });
  },
};
