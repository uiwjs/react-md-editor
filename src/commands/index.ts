import { bold } from './bold';
import { code } from './code';
import { italic } from './italic';
import { link } from './link';
import { unorderedListCommand, orderedListCommand, checkedListCommand } from './list';
import { quote } from './quote';
import { hr } from './hr';
import { title } from './title';
import { divider } from './divider';
import { codePreview, codeEdit, codeLive } from './preview';
import { fullscreen } from './fullscreen';
import { image } from './image';
import { strikethrough } from './strikeThrough';
import insertText from '../utils/InsertTextAtPosition';

export interface CommandOrchestrator {
  executeCommand(command: ICommand): void
}

export interface ICommand<T = string> {
  name?: string,
  icon?: React.ReactElement,
  keyCommand: string,
  value?: T,
  position?: 'right'
  liProps?: React.LiHTMLAttributes<HTMLLIElement>,
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement> | null,
  execute?: (state: TextState, api: TextApi) => void,
}

export interface TextRange {
  start: number;
  end: number;
}

export interface TextState {
  text: string,
  selectedText: string,
  selection: TextRange,
}

export interface TextApi {
  /**
   * Replaces the current selection with the new text. This will make the new selectedText to be empty, the
   * selection start and selection end will be the same and will both point to the end
   * @param text Text that should replace the current selection
   */
  replaceSelection(text: string): TextState;

  /**
   * Selects the specified text range
   * @param selection
   */
  setSelectionRange(selection: TextRange): TextState;
}


const getCommands: () => ICommand[] = () => [
  bold, italic, strikethrough, hr, title, divider, link, quote, code, image, divider,
  unorderedListCommand, orderedListCommand, checkedListCommand, divider, codeEdit, codeLive, codePreview, divider, fullscreen,
];

function getStateFromTextArea(textArea: HTMLTextAreaElement): TextState {
  return {
    selection: {
      start: textArea.selectionStart,
      end: textArea.selectionEnd
    },
    text: textArea.value,
    selectedText: textArea.value.slice(textArea.selectionStart, textArea.selectionEnd)
  };
}

class TextAreaTextApi implements TextApi {
  textArea: HTMLTextAreaElement;

  constructor(textArea: HTMLTextAreaElement) {
    this.textArea = textArea;
  }

  replaceSelection(text: string): TextState {
    insertText(this.textArea, text);
    return getStateFromTextArea(this.textArea);
  }

  setSelectionRange(selection: TextRange): TextState {
    this.textArea.focus();
    this.textArea.selectionStart = selection.start;
    this.textArea.selectionEnd = selection.end;
    return getStateFromTextArea(this.textArea);
  }
}


class TextAreaCommandOrchestrator implements CommandOrchestrator {
  textArea: HTMLTextAreaElement;
  textApi: TextApi;

  constructor(textArea: HTMLTextAreaElement) {
    this.textArea = textArea;
    this.textApi = new TextAreaTextApi(textArea);
  }

  executeCommand(command: ICommand<string>): void {
    command.execute && command.execute(getStateFromTextArea(this.textArea), this.textApi);
  }
}

export {
  // Toolbars.
  bold, italic, strikethrough, hr, title, divider, link, quote, code, image,
  unorderedListCommand, orderedListCommand, checkedListCommand, codeEdit, codeLive, codePreview, fullscreen,
  // Tool method.
  getCommands, getStateFromTextArea, TextAreaCommandOrchestrator, TextAreaTextApi
}
