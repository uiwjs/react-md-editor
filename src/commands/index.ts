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
import { ICommand, CommandOrchestrator, TextState, TextApi, TextRange } from '../Type';
import insertText from '../utils/InsertTextAtPosition';

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

  executeCommand(command: ICommand): void {
    command.execute && command.execute(getStateFromTextArea(this.textArea), this.textApi);
  }
}


export {
  getCommands, TextAreaCommandOrchestrator, TextAreaTextApi, getStateFromTextArea
}
