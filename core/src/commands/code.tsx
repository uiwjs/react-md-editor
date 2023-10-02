import React from 'react';
import { ICommand, ExecuteState, TextAreaTextApi } from './';
import { selectWord, executeCommand } from '../utils/markdownUtils';

export const codeBlock: ICommand = {
  name: 'codeBlock',
  keyCommand: 'codeBlock',
  shortcuts: 'ctrlcmd+shift+j',
  prefix: '```',
  buttonProps: { 'aria-label': 'Insert Code Block (ctrl + shift + j)', title: 'Insert Code Block (ctrl + shift +j)' },
  icon: (
    <svg width="13" height="13" role="img" viewBox="0 0 156 156">
      <path
        fill="currentColor"
        d="M110.85 120.575 43.7 120.483333 43.7083334 110.091667 110.85 110.191667 110.841667 120.583333 110.85 120.575ZM85.1333334 87.1916666 43.625 86.7083332 43.7083334 76.3166666 85.2083334 76.7916666 85.1333334 87.1916666 85.1333334 87.1916666ZM110.841667 53.4166666 43.7 53.3166666 43.7083334 42.925 110.85 43.025 110.841667 53.4166666ZM36 138C27.2916666 138 20.75 136.216667 16.4 132.666667 12.1333334 129.2 10 124.308333 10 118L10 95.3333332C10 91.0666666 9.25 88.1333332 7.7333334 86.5333332 6.3166668 84.8416666 3.7333334 84 0 84L0 72C3.7333334 72 6.3083334 71.2 7.7333334 69.6 9.2416668 67.9083334 10 64.9333334 10 60.6666666L10 38C10 31.775 12.1333334 26.8833334 16.4 23.3333332 20.7583334 19.7749998 27.2916666 18 36 18L40.6666668 18 40.6666668 30 36 30C34.0212222 29.9719277 32.1263151 30.7979128 30.8 32.2666666 29.3605875 33.8216362 28.5938182 35.8823287 28.6666668 38L28.6666668 60.6666666C28.6666668 67.5083332 26.6666668 72.4 22.6666668 75.3333332 20.9317416 76.7274684 18.8640675 77.6464347 16.6666668 78 18.8916668 78.35 20.8916668 79.2416666 22.6666668 80.6666666 26.6666668 83.95 28.6666668 88.8416666 28.6666668 95.3333332L28.6666668 118C28.6666668 120.308333 29.3750002 122.216667 30.8 123.733333 32.2166666 125.241667 33.9583334 126 36 126L40.6666668 126 40.6666668 138 36 138 36 138ZM114.116667 126 118.783333 126C120.833333 126 122.566667 125.241667 123.983333 123.733333 125.422746 122.178364 126.189515 120.117671 126.116667 118L126.116667 95.3333332C126.116667 88.8333332 128.116667 83.9499998 132.116667 80.6666666 133.9 79.2416666 135.9 78.35 138.116667 78 135.919156 77.6468047 133.851391 76.7277979 132.116667 75.3333332 128.116667 72.3999998 126.116667 67.5 126.116667 60.6666666L126.116667 38C126.189515 35.8823287 125.422746 33.8216361 123.983333 32.2666666 122.657018 30.7979128 120.762111 29.9719277 118.783333 30L114.116667 30 114.116667 18 118.783333 18C127.5 18 133.983333 19.775 138.25 23.3333332 142.608333 26.8833332 144.783333 31.7749998 144.783333 38L144.783333 60.6666666C144.783333 64.9333332 145.5 67.9083332 146.916667 69.6 148.433333 71.2 151.05 72 154.783333 72L154.783333 84C151.05 84 148.433333 84.8333334 146.916667 86.5333332 145.5 88.1333332 144.783333 91.0666666 144.783333 95.3333332L144.783333 118C144.783333 124.308333 142.616667 129.2 138.25 132.666667 133.983333 136.216667 127.5 138 118.783333 138L114.116667 138 114.116667 126 114.116667 126Z"
      />
    </svg>
  ),
  execute: (state: ExecuteState, api: TextAreaTextApi) => {
    const newSelectionRange = selectWord({
      text: state.text,
      selection: state.selection,
      prefix: '```\n',
      suffix: '\n```',
    });
    const state1 = api.setSelectionRange(newSelectionRange);

    // Based on context determine if new line is needed or not
    let prefix = '\n```\n';
    let suffix = '\n```\n';

    if (
      state1.selectedText.length >= prefix.length + suffix.length - 2 &&
      state1.selectedText.startsWith(prefix) &&
      state1.selectedText.endsWith(suffix)
    ) {
      // Remove code block
      prefix = '```\n';
      suffix = '\n```';
    } else {
      // Add code block
      if (
        (state1.selection.start >= 1 &&
          state.text.slice(state1.selection.start - 1, state1.selection.start) === '\n') ||
        state1.selection.start === 0
      ) {
        prefix = '```\n';
      }
      if (
        (state1.selection.end <= state.text.length - 1 &&
          state.text.slice(state1.selection.end, state1.selection.end + 1) === '\n') ||
        state1.selection.end === state.text.length
      ) {
        suffix = '\n```';
      }
    }

    const newSelectionRange2 = selectWord({ text: state.text, selection: state.selection, prefix, suffix });
    const state2 = api.setSelectionRange(newSelectionRange2);
    executeCommand({ api, selectedText: state2.selectedText, selection: state.selection, prefix, suffix });
  },
};

export const code: ICommand = {
  name: 'code',
  keyCommand: 'code',
  shortcuts: 'ctrlcmd+j',
  prefix: '`',
  buttonProps: { 'aria-label': 'Insert code (ctrl + j)', title: 'Insert code (ctrl + j)' },
  icon: (
    <svg width="14" height="14" role="img" viewBox="0 0 640 512">
      <path
        fill="currentColor"
        d="M278.9 511.5l-61-17.7c-6.4-1.8-10-8.5-8.2-14.9L346.2 8.7c1.8-6.4 8.5-10 14.9-8.2l61 17.7c6.4 1.8 10 8.5 8.2 14.9L293.8 503.3c-1.9 6.4-8.5 10.1-14.9 8.2zm-114-112.2l43.5-46.4c4.6-4.9 4.3-12.7-.8-17.2L117 256l90.6-79.7c5.1-4.5 5.5-12.3.8-17.2l-43.5-46.4c-4.5-4.8-12.1-5.1-17-.5L3.8 247.2c-5.1 4.7-5.1 12.8 0 17.5l144.1 135.1c4.9 4.6 12.5 4.4 17-.5zm327.2.6l144.1-135.1c5.1-4.7 5.1-12.8 0-17.5L492.1 112.1c-4.8-4.5-12.4-4.3-17 .5L431.6 159c-4.6 4.9-4.3 12.7.8 17.2L523 256l-90.6 79.7c-5.1 4.5-5.5 12.3-.8 17.2l43.5 46.4c4.5 4.9 12.1 5.1 17 .6z"
      />
    </svg>
  ),
  execute: (state: ExecuteState, api: TextAreaTextApi) => {
    if (state.selectedText.indexOf('\n') === -1) {
      const newSelectionRange = selectWord({
        text: state.text,
        selection: state.selection,
        prefix: state.command.prefix!,
      });
      const state1 = api.setSelectionRange(newSelectionRange);
      executeCommand({
        api,
        selectedText: state1.selectedText,
        selection: state.selection,
        prefix: state.command.prefix!,
      });
    } else {
      codeBlock.execute!(state, api);
    }
  },
};
