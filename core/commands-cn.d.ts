declare module '@uiw/react-md-editor/commands-cn' {
  import { type ICommand } from '@uiw/react-md-editor/esm/commands';
  import { divider } from '@uiw/react-md-editor/esm/commands/divider';
  import { group } from '@uiw/react-md-editor/esm/commands/group';
  let bold: ICommand;
  let code: ICommand;
  let codeBlock: ICommand;
  let comment: ICommand;
  let fullscreen: ICommand;
  let hr: ICommand;
  let image: ICommand;
  let italic: ICommand;
  let link: ICommand;
  let checkedListCommand: ICommand;
  let orderedListCommand: ICommand;
  let unorderedListCommand: ICommand;
  let codeEdit: ICommand;
  let codeLive: ICommand;
  let codePreview: ICommand;
  let quote: ICommand;
  let strikethrough: ICommand;
  let issue: ICommand;
  let title: ICommand;
  let title1: ICommand;
  let title2: ICommand;
  let title3: ICommand;
  let title4: ICommand;
  let title5: ICommand;
  let title6: ICommand;
  let table: ICommand;
  let help: ICommand;
  export const getCommands: () => ICommand[];
  export const getExtraCommands: () => ICommand[];
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
  };
}
