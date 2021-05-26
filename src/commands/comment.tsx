import { ICommand, TextState, TextAreaTextApi } from './';
import { selectWord } from '../utils/markdownUtils';

export const comment: ICommand = {
  name: 'comment',
  keyCommand: 'comment',
  shortcuts: 'ctrlcmd+/',
  execute: (state: TextState, api: TextAreaTextApi) => {
    // Adjust the selection to encompass the whole word if the caret is inside one
    const newSelectionRange = selectWord({ text: state.text, selection: state.selection });
    const state1 = api.setSelectionRange(newSelectionRange);
    // Replaces the current selection with the bold mark up
    const state2 = api.replaceSelection(`<!-- ${state1.selectedText} -->`);
    // Adjust the selection to not contain the **
    api.setSelectionRange({
      start: state2.selection.end - 4 - state1.selectedText.length,
      end: state2.selection.end - 4,
    });
  },
};
