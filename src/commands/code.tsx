import * as React from 'react';
import { ICommand, TextState, TextAreaTextApi } from './';
import {
  selectWord,
  getBreaksNeededForEmptyLineBefore,
  getBreaksNeededForEmptyLineAfter,
} from '../utils/markdownUtils';

export const code: ICommand = {
  name: 'code',
  keyCommand: 'code',
  shortcuts: 'ctrlcmd+j',
  buttonProps: { 'aria-label': 'Insert code' },
  icon: (
    <svg width="12" height="12" role="img" viewBox="0 0 640 512">
      <path
        fill="currentColor"
        d="M278.9 511.5l-61-17.7c-6.4-1.8-10-8.5-8.2-14.9L346.2 8.7c1.8-6.4 8.5-10 14.9-8.2l61 17.7c6.4 1.8 10 8.5 8.2 14.9L293.8 503.3c-1.9 6.4-8.5 10.1-14.9 8.2zm-114-112.2l43.5-46.4c4.6-4.9 4.3-12.7-.8-17.2L117 256l90.6-79.7c5.1-4.5 5.5-12.3.8-17.2l-43.5-46.4c-4.5-4.8-12.1-5.1-17-.5L3.8 247.2c-5.1 4.7-5.1 12.8 0 17.5l144.1 135.1c4.9 4.6 12.5 4.4 17-.5zm327.2.6l144.1-135.1c5.1-4.7 5.1-12.8 0-17.5L492.1 112.1c-4.8-4.5-12.4-4.3-17 .5L431.6 159c-4.6 4.9-4.3 12.7.8 17.2L523 256l-90.6 79.7c-5.1 4.5-5.5 12.3-.8 17.2l43.5 46.4c4.5 4.9 12.1 5.1 17 .6z"
      />
    </svg>
  ),
  execute: (tate: TextState, api: TextAreaTextApi) => {
    // Adjust the selection to encompass the whole word if the caret is inside one
    const newSelectionRange = selectWord({ text: tate.text, selection: tate.selection });
    const state1 = api.setSelectionRange(newSelectionRange);
    // when there's no breaking line
    if (state1.selectedText.indexOf('\n') === -1) {
      api.replaceSelection(`\`${state1.selectedText}\``);
      // Adjust the selection to not contain the **

      const selectionStart = state1.selection.start + 1;
      const selectionEnd = selectionStart + state1.selectedText.length;

      api.setSelectionRange({
        start: selectionStart,
        end: selectionEnd,
      });
      return;
    }

    const breaksBeforeCount = getBreaksNeededForEmptyLineBefore(state1.text, state1.selection.start);
    const breaksBefore = Array(breaksBeforeCount + 1).join('\n');

    const breaksAfterCount = getBreaksNeededForEmptyLineAfter(state1.text, state1.selection.end);
    const breaksAfter = Array(breaksAfterCount + 1).join('\n');

    api.replaceSelection(`${breaksBefore}\`\`\`\n${state1.selectedText}\n\`\`\`${breaksAfter}`);

    const selectionStart = state1.selection.start + breaksBeforeCount + 4;
    const selectionEnd = selectionStart + state1.selectedText.length;

    api.setSelectionRange({
      start: selectionStart,
      end: selectionEnd,
    });
  },
};

export const codeBlock: ICommand = {
  name: 'codeBlock',
  keyCommand: 'codeBlock',
  shortcuts: 'ctrlcmd+shift+j',
  execute: (tate: TextState, api: TextAreaTextApi) => {
    // Adjust the selection to encompass the whole word if the caret is inside one
    const newSelectionRange = selectWord({ text: tate.text, selection: tate.selection });
    const state1 = api.setSelectionRange(newSelectionRange);

    const breaksBeforeCount = getBreaksNeededForEmptyLineBefore(state1.text, state1.selection.start);
    const breaksBefore = Array(breaksBeforeCount + 1).join('\n');

    const breaksAfterCount = getBreaksNeededForEmptyLineAfter(state1.text, state1.selection.end);
    const breaksAfter = Array(breaksAfterCount + 1).join('\n');

    api.replaceSelection(`${breaksBefore}\`\`\`\n${state1.selectedText}\n\`\`\`${breaksAfter}`);

    const selectionStart = state1.selection.start + breaksBeforeCount + 4;
    const selectionEnd = selectionStart + state1.selectedText.length;

    api.setSelectionRange({
      start: selectionStart,
      end: selectionEnd,
    });
  },
};
