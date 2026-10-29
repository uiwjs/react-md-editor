import React from 'react';
import { createRoot } from 'react-dom/client';
import MDEditor from '@uiw/react-md-editor';
import CommonEditor from '@uiw/react-md-editor/common';
import NoHighlightEditor from '@uiw/react-md-editor/nohighlight';
import * as commands from '@uiw/react-md-editor/commands';
import * as commandsCn from '@uiw/react-md-editor/commands-cn';
import '@uiw/react-md-editor/markdown-editor.css';

const entries = [MDEditor, CommonEditor, NoHighlightEditor, commands.bold, commandsCn.bold];
if (entries.some((entry) => !entry)) {
  throw new Error('Editor entrypoint missing');
}
createRoot(document.getElementById('root')).render(React.createElement(MDEditor, { value: '# test' }));
