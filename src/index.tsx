import Markdown from '@uiw/react-markdown-preview';
import MDEditor from './MDEditor';
import * as commands from './commands';
import * as MarkdownUtil from './utils/markdownUtils';

export type { ICommand, CommandOrchestrator, TextRange, TextState, TextApi } from './commands';
export type { MDEditorProps, MDEditorState } from './MDEditor';
export type { TextSection } from './utils/markdownUtils';

export type {
  ReactMarkdownProps,
  MarkdownAbstractSyntaxTree,
  NodeType,
  RemarkParseOptions,
  Position,
  Point,
  AlignType,
  ReferenceType,
  LinkTargetResolver,
  Renderers,
} from 'react-markdown';

MDEditor.Markdown = Markdown;

export {
  MarkdownUtil,
  commands,
}

export default MDEditor;