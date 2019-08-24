import React from 'react';
import GithubCorner from './GithubCorner';
import MDEditor, { commands } from '../';
import ReadmeStr from '../README.md';
import { MDEditorProps } from '../lib/cjs/MDEditor';

import Logo from './Logo';
import './App.less';

const mdStr = `<p align="center">
  <img src="https://raw.githubusercontent.com/uiwjs/react-markdown-editor/4884f29f2aad59bf7f512184ba3726d76bbd7170/website/logo.svg?sanitize=true">
</p>
${ReadmeStr.replace(/([\s\S]*)<!--dividing-->/, '')}
`;

export default function App() {
  const [state, setVisiable] = React.useState({
    visiableDragbar: true,
    value: mdStr,
    preview: 'live',
  });
  const upDataVisiable = (keyName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setVisiable({ ...state, [keyName]: e.target.checked });
  }
  const upPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVisiable({ ...state, preview: e.target.value });
  }
  return (
    <div className="warpper">
      <header className="header">
        <Logo />
      </header>
      <GithubCorner url="https://github.com/uiwjs/react-md-editor" />
      <MDEditor
        value={state.value}
        height={400}
        tabSize={6}
        visiableDragbar={state.visiableDragbar}
        preview={state.preview as MDEditorProps['preview']}
        onChange={(newValue) => {
          setVisiable({ ...state, value: newValue });
        }}
      />
      <div className="doc-tools">
        <label>
          <input type="checkbox" checked={state.visiableDragbar} onChange={(e) => upDataVisiable('visiableDragbar', e)} />
          {state.visiableDragbar ? 'Show' : 'Hidden'} Drag Bar
        </label>
        <label>
          <input type="radio" name="preview" value="edit" checked={state.preview === 'edit'} onChange={upPreview} />
          Edit
        </label>
        <label>
          <input type="radio" name="preview" value="live" checked={state.preview === 'live'} onChange={upPreview} />
          Live Preview
        </label>
        <label>
          <input type="radio" name="preview" value="preview" checked={state.preview === 'preview'} onChange={upPreview} />
          Preview
        </label>
      </div>
      <div className="page-title">Custom toolbar</div>
      <MDEditor
        value="Hello Markdown!"
        commands={[
          commands.bold, commands.hr, commands.italic, commands.divider,
          commands.codeEdit, commands.codeLive, commands.codePreview, commands.divider,
          commands.fullscreen, 
        ]}
      />
      <MDEditor.Markdown source={state.value} />
    </div>
  )
}