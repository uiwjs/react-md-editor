import React from 'react';
import GithubCorner from '@uiw/react-github-corners';
import BackToUp from '@uiw/react-back-to-top';
import '@wcj/dark-mode';
import ReadmeStr from '@uiw/react-md-editor/README.md';
import Example from './Example';
import { ReactComponent as Banner } from './banner.svg';
import './App.less';
import pkg from '../package.json';
import Markdown from './Markdown';

export default function App() {
  const openVersionWebsite = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target && e.target.value) {
      window.location.href = e.target.value;
    }
  };
  return (
    <div className="wmde-markdown-var">
      <BackToUp>Top</BackToUp>
      <dark-mode permanent style={{ position: 'fixed', top: 8, left: 10, zIndex: 10 }}></dark-mode>
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
      <select className="version" onChange={openVersionWebsite}>
        <option value="https://raw.githack.com/uiwjs/react-md-editor/gh-pages/index.html">v{pkg.version}</option>
        <option value="https://raw.githack.com/uiwjs/react-md-editor/a7491b9/index.html">v2.1.11</option>
        <option value="https://raw.githack.com/uiwjs/react-md-editor/bbe10be/index.html">v1.14.7</option>
      </select>
      <div className="warpper">
        <GithubCorner fixed target="__blank" zIndex={99999} href="https://github.com/uiwjs/react-md-editor" />
        <header className="header">
          <Banner />
        </header>
        <div className="badges">
          <a href="https://www.npmjs.com/package/@uiw/react-md-editor" target="__blank">
            <img alt="Downloads" src="https://img.shields.io/npm/dm/@uiw/react-md-editor.svg?style=flat" />
          </a>
          <a href="https://www.jsdelivr.com/package/npm/@uiw/react-md-editor" target="__blank">
            <img
              alt="jsDelivr CDN"
              src="https://data.jsdelivr.com/v1/package/npm/@uiw/react-md-editor/badge?style=rounded"
            />
          </a>
          <a href="https://bundlephobia.com/package/@uiw/react-md-editor" target="__blank">
            <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/@uiw/react-md-editor" />
          </a>
          <a href="https://uiwjs.github.io/react-md-editor/coverage/lcov-report" target="__blank">
            <img alt="Coverage Status" src="https://uiwjs.github.io/react-md-editor/coverage/badges.svg" />
          </a>
          <br />
          <a href="https://github.com/uiwjs/react-md-editor/actions" target="__blank">
            <img
              alt="Build & Deploy"
              src="https://github.com/uiwjs/react-md-editor/actions/workflows/ci.yml/badge.svg"
            />
          </a>
          <a href="https://gitee.com/uiw/react-md-editor" target="__blank">
            <img alt="Gitee" src="https://jaywcjlove.github.io/sb/ico/gitee.svg" />
          </a>
          <a href="https://www.npmjs.com/package/@uiw/react-md-editor" target="__blank">
            <img alt="npm version" src="https://img.shields.io/npm/v/@uiw/react-md-editor.svg" />
          </a>
          <a href="https://uiwjs.github.io/npm-unpkg/#/pkg/@uiw/react-md-editor/file/README.md" target="__blank">
            <img src="https://img.shields.io/badge/Open%20in-unpkg-blue" alt="Open in unpkg" />
          </a>
        </div>
        <Example mdStr={ReadmeStr.source} />
        <Markdown />
      </div>
    </div>
  );
}
