import { bold } from './bold';
import { code, codeBlock } from './code';
import { italic } from './italic';
import { link } from './link';
import { unorderedListCommand, orderedListCommand, checkedListCommand } from './list';
import { quote } from './quote';
import { hr } from './hr';
import { title } from './title';
import { title1 } from './title1';
import { title2 } from './title2';
import { title3 } from './title3';
import { title4 } from './title4';
import { title5 } from './title5';
import { title6 } from './title6';
import { comment } from './comment';
import { group } from './group';
import { divider } from './divider';
import { codePreview, codeEdit, codeLive } from './preview';
import { fullscreen } from './fullscreen';
import { image } from './image';
import { strikethrough } from './strikeThrough';
import insertText from '../utils/InsertTextAtPosition';
import { ContextStore, ExecuteCommandState } from '../Context';

export interface CommandOrchestrator {
  executeCommand(command: ICommand): void;
}

export interface ICommandChildHandle<T = string> extends ICommandBase<T> {
  children?: (handle: {
    close: () => void;
    execute: () => void;
    getState?: TextAreaCommandOrchestrator['getState'];
    textApi?: TextAreaTextApi;
  }) => React.ReactElement;
}

export interface ICommandChildCommands<T = string> extends ICommandBase<T> {
  children?: Array<ICommand<T>>;
}

export interface ICommandBase<T> {
  parent?: ICommand<any>;
  keyCommand?: string;
  name?: string;
  shortcuts?: string;
  groupName?: string;
  icon?: React.ReactElement;
  value?: T;
  position?: 'right';
  liProps?: React.LiHTMLAttributes<HTMLLIElement>;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement> | null;
  execute?: (
    state: TextState,
    api: TextAreaTextApi,
    dispatch?: React.Dispatch<ContextStore>,
    executeCommandState?: ExecuteCommandState,
  ) => void;
}

export type ICommand<T = string> = ICommandChildCommands<T> | ICommandChildHandle<T>;

export interface TextRange {
  start: number;
  end: number;
}

export interface TextState {
  text: string;
  selectedText: string;
  selection: TextRange;
}

const getCommands: () => ICommand[] = () => [
  comment,
  bold,
  italic,
  strikethrough,
  hr,
  title,
  divider,
  link,
  quote,
  code,
  codeBlock,
  image,
  divider,
  unorderedListCommand,
  orderedListCommand,
  checkedListCommand,
];

const getExtraCommands: () => ICommand[] = () => [codeEdit, codeLive, codePreview, divider, fullscreen];

function getStateFromTextArea(textArea: HTMLTextAreaElement): TextState {
  return {
    selection: {
      start: textArea.selectionStart,
      end: textArea.selectionEnd,
    },
    text: textArea.value,
    selectedText: textArea.value.slice(textArea.selectionStart, textArea.selectionEnd),
  };
}

class TextAreaTextApi {
  textArea: HTMLTextAreaElement;

  constructor(textArea: HTMLTextAreaElement) {
    this.textArea = textArea;
  }

  /**
   * Replaces the current selection with the new text. This will make the new selectedText to be empty, the
   * selection start and selection end will be the same and will both point to the end
   * @param text Text that should replace the current selection
   */
  replaceSelection(text: string): TextState {
    insertText(this.textArea, text);
    return getStateFromTextArea(this.textArea);
  }

  /**
   * Selects the specified text range
   * @param selection
   */
  setSelectionRange(selection: TextRange): TextState {
    this.textArea.focus();
    this.textArea.selectionStart = selection.start;
    this.textArea.selectionEnd = selection.end;
    return getStateFromTextArea(this.textArea);
  }
}

class TextAreaCommandOrchestrator implements CommandOrchestrator {
  textArea: HTMLTextAreaElement;
  textApi: TextAreaTextApi;

  constructor(textArea: HTMLTextAreaElement) {
    this.textArea = textArea;
    this.textApi = new TextAreaTextApi(textArea);
  }

  getState() {
    if (!this.textArea) return false;
    return getStateFromTextArea(this.textArea);
  }

  executeCommand(
    command: ICommand<string>,
    dispatch?: React.Dispatch<ContextStore>,
    state?: ExecuteCommandState,
  ): void {
    command.execute && command.execute(getStateFromTextArea(this.textArea), this.textApi, dispatch, state);
  }
}

export {
  // Toolbars.
  title,
  title1,
  title2,
  title3,
  title4,
  title5,
  title6,
  bold,
  codeBlock,
  italic,
  strikethrough,
  hr,
  group,
  divider,
  link,
  quote,
  code,
  image,
  unorderedListCommand,
  orderedListCommand,
  checkedListCommand,
  codeEdit,
  codeLive,
  codePreview,
  fullscreen,
  // Tool method.
  getCommands,
  getExtraCommands,
  getStateFromTextArea,
  TextAreaCommandOrchestrator,
  TextAreaTextApi,
};
