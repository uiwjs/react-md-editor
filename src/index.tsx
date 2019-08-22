import MDEditor from './MDEditor';
import * as commands from './commands';
import * as MarkdownUtil from './utils/markdownUtils';
import { ICommand, CommandOrchestrator, TextState, TextApi, TextRange } from './Type';
import Markdown from './components/Markdown';

MDEditor.Markdown = Markdown;

export {
  MarkdownUtil,
  commands,
  ICommand,
  CommandOrchestrator,
  TextState,
  TextApi,
  TextRange,
}

export default MDEditor;