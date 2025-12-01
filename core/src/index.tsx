import MDEditor from './Editor';
import * as commands from './commands/';
import * as MarkdownUtil from './utils/markdownUtils';
import './index.less';

export { headingExecute } from './commands/title';
export * from './commands/';
export * from './commands/group';
export * from './utils/markdownUtils';
export * from './utils/InsertTextAtPosition';
export * from './Editor';
export * from './Context';
export * from './Types';
export { default as handleKeyDown } from './components/TextArea/handleKeyDown';
export { default as shortcuts } from './components/TextArea/shortcuts';

export { MarkdownUtil, commands };

export default MDEditor;
