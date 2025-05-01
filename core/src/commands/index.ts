import React from 'react';
import { type ContextStore, ExecuteCommandState } from '../Context';
import { insertTextAtPosition } from '../utils/InsertTextAtPosition';
import { bold } from './bold';
import { code, codeBlock } from './code';
import { comment } from './comment';
import { divider } from './divider';
import { fullscreen } from './fullscreen';
import { group } from './group';
import { hr } from './hr';
import { image } from './image';
import { italic } from './italic';
import { link } from './link';
import { checkedListCommand, orderedListCommand, unorderedListCommand } from './list';
import { codeEdit, codeLive, codePreview } from './preview';
import { quote } from './quote';
import { strikethrough } from './strikeThrough';
import { title } from './title';
import { title1 } from './title1';
import { title2 } from './title2';
import { title3 } from './title3';
import { title4 } from './title4';
import { title5 } from './title5';
import { title6 } from './title6';
import { table } from './table';
import { issue } from './issue';
import { help } from './help';

export interface CommandOrchestrator {
  executeCommand(command: ICommand): void;
}

export interface ICommandChildHandle<T = string> extends ICommandBase<T> {
  children?: (handle: {
    close: () => void;
    execute: () => void;
    getState?: TextAreaCommandOrchestrator['getState'];
    textApi?: TextAreaTextApi;
    dispatch?: React.Dispatch<ContextStore>;
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
  value?: string;
  prefix?: string;
  suffix?: string;
  position?: 'right';
  liProps?: React.LiHTMLAttributes<HTMLLIElement>;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement> | null;
  render?: (
    command: ICommand<T>,
    disabled: boolean,
    executeCommand: (command: ICommand<T>, name?: string) => void,
    index: number,
  ) => void | undefined | null | React.ReactElement;
  execute?: (
    state: ExecuteState,
    api: TextAreaTextApi,
    dispatch?: React.Dispatch<ContextStore>,
    executeCommandState?: ExecuteCommandState,
    shortcuts?: string[],
  ) => void;
}

export type ExecuteState = TextState & { command: ICommand };

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
  bold,
  italic,
  strikethrough,
  hr,
  group([title1, title2, title3, title4, title5, title6], {
    name: 'title',
    groupName: 'title',
    buttonProps: { 'aria-label': 'Insert title', title: 'Insert title' },
  }),
  divider,
  link,
  quote,
  code,
  codeBlock,
  comment,
  image,
  table,
  divider,
  unorderedListCommand,
  orderedListCommand,
  checkedListCommand,
  divider,
  help,
];

const getExtraCommands: () => ICommand[] = () => [codeEdit, codeLive, codePreview, divider, fullscreen];

function getStateFromTextArea(textArea: HTMLTextAreaElement): TextState {
  return {
    selection: {
      start: textArea.selectionStart,
      end: textArea.selectionEnd,
    },
    text: textArea.value,
    selectedText: textArea.value?.slice(textArea.selectionStart, textArea.selectionEnd),
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
    insertTextAtPosition(this.textArea, text);
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
    shortcuts?: string[],
  ): void {
    command.execute &&
      command.execute({ command, ...getStateFromTextArea(this.textArea) }, this.textApi, dispatch, state, shortcuts);
  }
}

export {
  title,
  title1,
  title2,
  title3,
  title4,
  title5,
  title6,
  bold,
  codeBlock,
  comment,
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
  table,
  issue,
  help,
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
