declare module '@uiw/react-md-editor/nohighlight' {
  import MDEditor from '@uiw/react-md-editor/esm/Editor.nohighlight';
  import * as commands from '@uiw/react-md-editor/esm/commands';
  import * as MarkdownUtil from '@uiw/react-md-editor/esm/utils/markdownUtils';
  export * from '@uiw/react-md-editor/esm/commands';
  export * from '@uiw/react-md-editor/esm/commands/group';
  export * from '@uiw/react-md-editor/esm/utils/markdownUtils';
  export * from '@uiw/react-md-editor/esm/utils/InsertTextAtPosition';
  export * from '@uiw/react-md-editor/esm/Editor.nohighlight';
  export * from '@uiw/react-md-editor/esm/Context';
  export { MarkdownUtil, commands };
  export default MDEditor;
}
