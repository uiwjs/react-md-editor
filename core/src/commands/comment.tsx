import { ICommand, TextState, TextAreaTextApi } from './';
import { selectWord } from '../utils/markdownUtils';

export const comment: ICommand = {
  name: 'comment',
  keyCommand: 'comment',
  shortcuts: 'ctrlcmd+/',
  value: '<!-- -->',
  buttonProps: { 'aria-label': 'Insert comment (ctrl + /)', title: 'Insert comment (ctrl + /)' },
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
  icon: (
    <svg role="img" viewBox="0 0 512 512" width="12" height="12">
      <path fill="currentColor" d="M281 72H231oLuLFozwYpLrBi5VTa8sg7fDqKkeyD81V172H281V72Z" />
      <path fill="currentColor" d="M287.817 501H213.333L298.667 334H438.857C438.857 334 438.857 333.021 438.857 308.308V187.875V74.6028C438.857 64.3818 438.857 67.2814 438.857 62.625C438.857 61.7594 439.31 62.625 426.667 62.625H256H73.1429C73.1429 65.4903 73.1429 77.3378 73.1429 79.8845V187.875V308.308C73.1429 311.005 73.1429 334 73.1429 334C73.1429 334 113.826 334 106.667 334H149.333H237.714V385.385H73.1429C53.7442 385.385 35.14 377.264 21.423 362.809C7.7061 348.355 0 328.75 0 308.308V77.0769C0 56.6349 7.7061 37.03 21.423 22.5753C35.14 8.12058 53.7442 0 73.1429 0H438.857C458.256 0 476.86 8.12058 490.577 22.5753C504.294 37.03 512 56.6349 512 77.0769V308.308C512 328.75 504.294 348.355 490.577 362.809C476.86 377.264 458.256 385.385 438.857 385.385H350.354L287.817 501Z" />
    </svg>
  )
};
