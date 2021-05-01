import React from 'react';
import GithubCorner from '@uiw/react-github-corners';
import Github from '@uiw/react-shields/lib/esm/github';
import Npm from '@uiw/react-shields/lib/esm/npm';
import MDEditor from '../';
import ReadmeStr from '../README.md';
import Exmaple from './Exmaple';
import ExmapleKaTeX from './ExmapleKaTeX';
import ExampleMermaid from './ExampleMermaid';
import ExampleCustomToolbar from './ExampleCustomToolbar';
import Logo from './Logo';
import './App.less';

const mdStr = ReadmeStr.replace(/([\s\S]*)<!--dividing-->/, '').replace(/^\s+/, '');

export default function App() {
  return (
    <div className="warpper">
      <GithubCorner fixed target="__blank" zIndex={99999} href="https://github.com/uiwjs/react-md-editor" />
      <header className="header">
        <Logo />
      </header>
      <div className="badges">
        <Npm.Version
          scope="@uiw"
          packageName="react-md-editor"
          href="https://www.npmjs.com/package/@uiw/react-md-editor"
        />
        <Github user="uiwjs" repo="react-md-editor">
          <Github.Social type="forks" href="https://github.com/uiwjs/react-md-editor" />
          <Github.Social type="stars" href="https://github.com/uiwjs/react-md-editor/stargazers" />
          <Github.Social type="watchers" href="https://github.com/uiwjs/react-md-editor/watchers" />
        </Github>
      </div>
      <Exmaple mdStr={mdStr} />
      <div className="page-title">
        Custom toolbar.
        <a
          target="__blank"
          href="https://github.com/uiwjs/react-md-editor/blob/0bf21785b5748c33add999e478a9d804e0505b4c/website/ExampleCustomToolbar.tsx#L4-L67"
        >
          Example Code
        </a>
      </div>
      <ExampleCustomToolbar />
      <div className="page-title">
        Support Custom KaTeX Preview.
        <a
          target="__blank"
          href="https://github.com/uiwjs/react-md-editor/blob/1f0684799c242810df290f82e79cd73121137349/website/ExmapleKaTeX.tsx#L1-L62"
        >
          Example Code
        </a>
      </div>
      <ExmapleKaTeX />
      <div className="page-title">
        Support Custom Mermaid Preview.
        <a
          target="__blank"
          href="https://github.com/uiwjs/react-md-editor/blob/194b47965004ba92df6d691f45b01a8849e006ab/website/ExampleMermaid.tsx#L1-L87"
        >
          Example Code
        </a>
      </div>
      <ExampleMermaid />
      <MDEditor.Markdown style={{ paddingTop: 30 }} source={ReadmeStr.replace(/([\s\S]*)<!--dividing-->/, '')} />
    </div>
  );
}
