import React, { Fragment } from 'react';
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
    <Fragment>
      <a
        className="product-hunt"
        href="https://www.producthunt.com/posts/react-markdown-editor?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-react-markdown-editor"
        target="_blank"
        rel="noreferrer"
      >
        <img
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=300765&theme=light"
          alt="react markdown editor - A simple markdown editor with preview, with React | Product Hunt"
          height="38"
        />
      </a>
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
          <a href="https://www.npmjs.com/package/@uiw/react-md-editor" target="__blank">
            <img alt="Downloads" src="https://img.shields.io/npm/dm/@uiw/react-md-editor.svg?style=flat" />
          </a>
          <a href="https://coveralls.io/github/uiwjs/react-md-editor?branch=master" target="__blank">
            <img
              alt="Coverage Status"
              src="https://coveralls.io/repos/github/uiwjs/react-md-editor/badge.svg?branch=master"
            />
          </a>
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
            href="https://github.com/uiwjs/react-md-editor/blob/55da02055420451f4a1a6dc4100add390cdf05cd/website/ExmapleKaTeX.tsx#L1-L60"
          >
            Example Code
          </a>
        </div>
        <ExmapleKaTeX />
        <div className="page-title">
          Support Custom Mermaid Preview.
          <a
            target="__blank"
            href="https://github.com/uiwjs/react-md-editor/blob/355795b47a7693d1a030ac09e9893b9a1601a84f/website/ExampleMermaid.tsx#L3-L62"
          >
            Example Code
          </a>
        </div>
        <ExampleMermaid />
        <MDEditor.Markdown style={{ paddingTop: 30 }} source={ReadmeStr.replace(/([\s\S]*)<!--dividing-->/, '')} />
      </div>
    </Fragment>
  );
}
