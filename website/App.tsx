import React from 'react';
import GithubCorner from '@uiw/react-github-corners';
import MarkdownPreview from '@uiw/react-markdown-preview';
import Github from '@uiw/react-shields/lib/esm/github';
import Npm from '@uiw/react-shields/lib/esm/npm';
import MDEditor, { commands, ICommand, MDEditorProps } from '../';
import ReadmeStr from '../README.md';
import ExmapleKaTeX from './ExmapleKaTeX';
import Logo from './Logo';
import './App.less';

const mdStr = `<p align="center">
  <img src="https://raw.githubusercontent.com/uiwjs/react-markdown-editor/4884f29f2aad59bf7f512184ba3726d76bbd7170/website/logo.svg?sanitize=true">
</p>
${ReadmeStr.replace(/([\s\S]*)<!--dividing-->/, '')}
`;

const title: ICommand = {
  name: 'title3',
  keyCommand: 'title3',
  buttonProps: null,
  icon: (
    <span style={{ padding: '0 5px' }}>Custom Toolbar</span>
  ),
};

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
      <GithubCorner fixed target="__blank" href="https://github.com/uiwjs/react-md-editor" />
      <header className="header">
        <Logo />
      </header>
      <div className="badges">
        <Npm.Version scope="@uiw" packageName="react-md-editor" href="https://www.npmjs.com/package/@uiw/react-md-editor" />
        <Github user="uiwjs" repo="react-md-editor">
          <Github.Social type="forks" href="https://github.com/uiwjs/react-md-editor" />
          <Github.Social type="stars" href="https://github.com/uiwjs/react-md-editor/stargazers" />
          <Github.Social type="watchers" href="https://github.com/uiwjs/react-md-editor/watchers" />
        </Github>
      </div>
      <MDEditor
        value={state.value}
        height={400}
        visiableDragbar={state.visiableDragbar}
        // preview={state.preview}
        preview={state.preview as MDEditorProps['preview']}
        onChange={(newValue) => {

          setVisiable({ ...state, value: newValue || ''});
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
          title,
          commands.bold, commands.hr, commands.italic, commands.divider,
          commands.codeEdit, commands.codeLive, commands.codePreview, commands.divider,
          commands.fullscreen, 
        ]}
      />
      <div className="page-title">Support Custom KaTeX Preview. <a target="__blank" href="https://github.com/uiwjs/react-md-editor/blob/925a266eb98013c7ba6ad0fe189a926f9e4c1560/website/App.tsx#L111-L146">Example Code</a></div>
      <ExmapleKaTeX />
      <MarkdownPreview style={{ paddingTop: 30 }} source={ReadmeStr.replace(/([\s\S]*)<!--dividing-->/, '')} />
    </div>
  )
}