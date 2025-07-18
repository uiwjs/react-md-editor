declare module '@uiw/react-md-editor/commands' {
  import { ContextStore, ExecuteCommandState } from '@uiw/react-md-editor/esm/Context';
  import { bold } from '@uiw/react-md-editor/esm/commands/bold';
  import { code, codeBlock } from '@uiw/react-md-editor/esm/commands/code';
  import { comment } from '@uiw/react-md-editor/esm/commands/comment';
  import { divider } from '@uiw/react-md-editor/esm/commands/divider';
  import { fullscreen } from '@uiw/react-md-editor/esm/commands/fullscreen';
  import { group } from '@uiw/react-md-editor/esm/commands/group';
  import { hr } from '@uiw/react-md-editor/esm/commands/hr';
  import { image } from '@uiw/react-md-editor/esm/commands/image';
  import { italic } from '@uiw/react-md-editor/esm/commands/italic';
  import { link } from '@uiw/react-md-editor/esm/commands/link';
  import { checkedListCommand, orderedListCommand, unorderedListCommand } from '@uiw/react-md-editor/esm/commands/list';
  import { codeEdit, codeLive, codePreview } from '@uiw/react-md-editor/esm/commands/preview';
  import { quote } from '@uiw/react-md-editor/esm/commands/quote';
  import { strikethrough } from '@uiw/react-md-editor/esm/commands/strikeThrough';
  import { title, heading } from '@uiw/react-md-editor/esm/commands/title';
  import { title1, heading1 } from '@uiw/react-md-editor/esm/commands/title1';
  import { title2, heading2 } from '@uiw/react-md-editor/esm/commands/title2';
  import { title3, heading3 } from '@uiw/react-md-editor/esm/commands/title3';
  import { title4, heading4 } from '@uiw/react-md-editor/esm/commands/title4';
  import { title5, heading5 } from '@uiw/react-md-editor/esm/commands/title5';
  import { title6, heading6 } from '@uiw/react-md-editor/esm/commands/title6';
  import { table } from '@uiw/react-md-editor/esm/commands/table';
  import { issue } from '@uiw/react-md-editor/esm/commands/issue';
  import { help } from '@uiw/react-md-editor/esm/commands/help';
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
  export type ExecuteState = TextState & {
    command: ICommand;
  };
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
  const getCommands: () => ICommand[];
  const getExtraCommands: () => ICommand[];
  function getStateFromTextArea(textArea: HTMLTextAreaElement): TextState;
  class TextAreaTextApi {
    textArea: HTMLTextAreaElement;
    constructor(textArea: HTMLTextAreaElement);
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
  class TextAreaCommandOrchestrator implements CommandOrchestrator {
    textArea: HTMLTextAreaElement;
    textApi: TextAreaTextApi;
    constructor(textArea: HTMLTextAreaElement);
    getState(): false | TextState;
    executeCommand(
      command: ICommand<string>,
      dispatch?: React.Dispatch<ContextStore>,
      state?: ExecuteCommandState,
      shortcuts?: string[],
    ): void;
  }
  export {
    title,
    title1,
    title2,
    title3,
    title4,
    title5,
    title6,
    heading,
    heading1,
    heading2,
    heading3,
    heading4,
    heading5,
    heading6,
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
    getCommands,
    getExtraCommands,
    getStateFromTextArea,
    TextAreaCommandOrchestrator,
    TextAreaTextApi,
  };
}
