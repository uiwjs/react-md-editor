import * as React from 'react';
import { ICommand, TextState, TextApi } from '../Type';
// import selectWord from '../utils/selectWord';
import { getBreaksNeededForEmptyLineBefore, getBreaksNeededForEmptyLineAfter, selectWord } from '../utils/markdownUtils';

export const quote: ICommand = {
  name: 'quote',
  keyCommand: 'quote',
  buttonProps: { 'aria-label': 'Insert a quote' },
  icon: (
    <svg width="12" height="12" viewBox="0 0 512 512">
      <path fill="currentColor" d="M512 80v128c0 137.018-63.772 236.324-193.827 271.172-15.225 4.08-30.173-7.437-30.173-23.199v-33.895c0-10.057 6.228-19.133 15.687-22.55C369.684 375.688 408 330.054 408 256h-72c-26.51 0-48-21.49-48-48V80c0-26.51 21.49-48 48-48h128c26.51 0 48 21.49 48 48zM176 32H48C21.49 32 0 53.49 0 80v128c0 26.51 21.49 48 48 48h72c0 74.054-38.316 119.688-104.313 143.528C6.228 402.945 0 412.021 0 422.078v33.895c0 15.762 14.948 27.279 30.173 23.199C160.228 444.324 224 345.018 224 208V80c0-26.51-21.49-48-48-48z" />
    </svg>
  ),
  execute: (state: TextState, api: TextApi) => {
    // Adjust the selection to encompass the whole word if the caret is inside one
    const newSelectionRange = selectWord({ text: state.text, selection: state.selection });
    const state1 = api.setSelectionRange(newSelectionRange);
    const breaksBeforeCount = getBreaksNeededForEmptyLineBefore(state1.text, state1.selection.start);
    const breaksBefore = Array(breaksBeforeCount + 1).join("\n");

    const breaksAfterCount = getBreaksNeededForEmptyLineAfter(state1.text, state1.selection.end);
    const breaksAfter = Array(breaksAfterCount + 1).join("\n");

    // Replaces the current selection with the quote mark up
    api.replaceSelection(`${breaksBefore}> ${state1.selectedText}${breaksAfter}`);

    const selectionStart = state1.selection.start + breaksBeforeCount + 2;
    const selectionEnd = selectionStart + state1.selectedText.length;

    api.setSelectionRange({
      start: selectionStart,
      end: selectionEnd
    });
  },
};
