<p align="center">
  <a href="https://uiwjs.github.io/npm-unpkg/#/pkg/@uiw/react-md-editor/file/README.md">
    <img alt="react-md-editor logo" src="https://raw.githubusercontent.com/uiwjs/react-markdown-editor/4884f29f2aad59bf7f512184ba3726d76bbd7170/website/logo.svg?sanitize=true">
  </a>
</p>

<p align="center">
  <a href="https://github.com/uiwjs/react-md-editor/actions" target="__blank">
    <img alt="Build & Deploy" src="https://github.com/uiwjs/react-md-editor/workflows/Build%20&%20Deploy/badge.svg">
  </a>
  <a href="https://www.npmjs.com/package/@uiw/react-md-editor" target="__blank">
    <img alt="Downloads" src="https://img.shields.io/npm/dm/@uiw/react-md-editor.svg?style=flat">
  </a>
  <a href="https://uiwjs.github.io/npm-unpkg/#/pkg/@uiw/react-md-editor/file/README.md" target="__blank">
    <img src="https://img.shields.io/badge/Open%20in-unpkg-blue" alt="Open in unpkg">
  </a>
  <a href="https://gitee.com/uiw/react-md-editor" target="__blank">
    <img alt="Release" src="https://jaywcjlove.github.io/sb/ico/gitee.svg">
  </a>
  <a href="https://www.npmjs.com/package/@uiw/react-md-editor" target="__blank">
    <img alt="npm version" src="https://img.shields.io/npm/v/@uiw/react-md-editor.svg">
  </a>
  <a href="https://bundlephobia.com/package/@uiw/react-md-editor" target="__blank">
    <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/@uiw/react-md-editor">
  </a>
  <a href="https://coveralls.io/github/uiwjs/react-md-editor?branch=master" target="__blank">
    <img alt="Coverage Status" src="https://coveralls.io/repos/github/uiwjs/react-md-editor/badge.svg?branch=master" />
  </a>
</p>

<!--dividing-->

A simple markdown editor with preview, implemented with React.js and TypeScript. This React Component aims to provide a simple Markdown editor with syntax highlighting support. This is based on `textarea` encapsulation, so it does not depend on any modern code editors such as Acs, CodeMirror, Monaco etc.

### Features

- 📑 Indent line or selected text by pressing tab key, with customizable indentation.
- ♻️ Based on `textarea` encapsulation, does not depend on any modern code editors.
- 🚧 Does not depend on the [`uiw`](https://github.com/uiwjs/uiw) component library.
- 🚘 Automatic list on new lines.
- 😻 GitHub flavored markdown support.
- 💡 Support [next.js](https://github.com/uiwjs/react-md-editor/issues/52#issuecomment-848969341), [Use examples](#support-nextjs) in [next.js](https://nextjs.org/).

### Quick Start

```bash
npm i @uiw/react-md-editor
```

### Using

[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?logo=codesandbox)](https://codesandbox.io/embed/markdown-editor-for-react-izdd6?fontsize=14&hidenavigation=1&theme=dark)
[![Open in Github gh-pages](https://img.shields.io/badge/Open%20In-Github%20gh--pages-blue?logo=github)](https://uiwjs.github.io/react-md-editor/)
[![Open in Gitee gh-pages](https://img.shields.io/badge/Open%20In-Gitee%20gh--pages-blue?logo=web)](https://uiw.gitee.io/react-md-editor/)

```jsx
import React from "react";
import ReactDOM from "react-dom";
import MDEditor from '@uiw/react-md-editor';

export default function App() {
  const [value, setValue] = React.useState("**Hello world!!!**");
  return (
    <div className="container">
      <MDEditor
        value={value}
        onChange={setValue}
      />
      <MDEditor.Markdown source={value} />
    </div>
  );
}
```

### Custom Toolbars

[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?logo=codesandbox)](https://codesandbox.io/embed/react-md-editor-custom-toolbars-m2n10?fontsize=14&hidenavigation=1&theme=dark)

```tsx
import React from "react";
import ReactDOM from "react-dom";
import MDEditor, { commands, ICommand, TextState, TextAreaTextApi } from '@uiw/react-md-editor';

const title3: ICommand = {
  name: 'title3',
  keyCommand: 'title3',
  buttonProps: { 'aria-label': 'Insert title3' },
  icon: (
    <svg width="12" height="12" viewBox="0 0 520 520">
      <path fill="currentColor" d="M15.7083333,468 C7.03242448,468 0,462.030833 0,454.666667 L0,421.333333 C0,413.969167 7.03242448,408 15.7083333,408 L361.291667,408 C369.967576,408 377,413.969167 377,421.333333 L377,454.666667 C377,462.030833 369.967576,468 361.291667,468 L15.7083333,468 Z M21.6666667,366 C9.69989583,366 0,359.831861 0,352.222222 L0,317.777778 C0,310.168139 9.69989583,304 21.6666667,304 L498.333333,304 C510.300104,304 520,310.168139 520,317.777778 L520,352.222222 C520,359.831861 510.300104,366 498.333333,366 L21.6666667,366 Z M136.835938,64 L136.835937,126 L107.25,126 L107.25,251 L40.75,251 L40.75,126 L-5.68434189e-14,126 L-5.68434189e-14,64 L136.835938,64 Z M212,64 L212,251 L161.648438,251 L161.648438,64 L212,64 Z M378,64 L378,126 L343.25,126 L343.25,251 L281.75,251 L281.75,126 L238,126 L238,64 L378,64 Z M449.047619,189.550781 L520,189.550781 L520,251 L405,251 L405,64 L449.047619,64 L449.047619,189.550781 Z" />
    </svg>
  ),
  execute: (state: TextState, api: TextAreaTextApi) => {
    let modifyText = `### ${state.selectedText}\n`;
    if (!state.selectedText) {
      modifyText = `### `;
    }
    api.replaceSelection(modifyText);
  },
};

export default function App() {
  const [value, setValue] = React.useState("**Hello world!!!**");
  return (
    <div className="container">
      <MDEditor
        value="Hello Markdown!"
        onChange={(val) => {
          setValue(val!);
        }}
        commands={[
          // Custom Toolbars
          title3,
          commands.group([commands.title1, commands.title2, commands.title3, commands.title4, commands.title5, commands.title6], {
            name: 'title',
            groupName: 'title',
            buttonProps: { 'aria-label': 'Insert title'}
          }),
          commands.divider,
          commands.group([], {
            name: 'update',
            groupName: 'update',
            icon: (
              <svg viewBox="0 0 1024 1024" width="12" height="12">
                <path fill="currentColor" d="M716.8 921.6a51.2 51.2 0 1 1 0 102.4H307.2a51.2 51.2 0 1 1 0-102.4h409.6zM475.8016 382.1568a51.2 51.2 0 0 1 72.3968 0l144.8448 144.8448a51.2 51.2 0 0 1-72.448 72.3968L563.2 541.952V768a51.2 51.2 0 0 1-45.2096 50.8416L512 819.2a51.2 51.2 0 0 1-51.2-51.2v-226.048l-57.3952 57.4464a51.2 51.2 0 0 1-67.584 4.2496l-4.864-4.2496a51.2 51.2 0 0 1 0-72.3968zM512 0c138.6496 0 253.4912 102.144 277.1456 236.288l10.752 0.3072C924.928 242.688 1024 348.0576 1024 476.5696 1024 608.9728 918.8352 716.8 788.48 716.8a51.2 51.2 0 1 1 0-102.4l8.3968-0.256C866.2016 609.6384 921.6 550.0416 921.6 476.5696c0-76.4416-59.904-137.8816-133.12-137.8816h-97.28v-51.2C691.2 184.9856 610.6624 102.4 512 102.4S332.8 184.9856 332.8 287.488v51.2H235.52c-73.216 0-133.12 61.44-133.12 137.8816C102.4 552.96 162.304 614.4 235.52 614.4l5.9904 0.3584A51.2 51.2 0 0 1 235.52 716.8C105.1648 716.8 0 608.9728 0 476.5696c0-132.1984 104.8064-239.872 234.8544-240.2816C258.5088 102.144 373.3504 0 512 0z" />
              </svg>
            ),
            children: ({ close, execute, getState, textApi }) => {
              return (
                <div style={{ width: 120, padding: 10 }}>
                  <div>My Custom Toolbar</div>
                  <button type="button" onClick={() => console.log('> execute: >>>>>', getState!())}>State</button>
                  <button type="button" onClick={() => close()}>Close</button>
                  <button type="button" onClick={() => execute()}>Execute</button>
                </div>
              );
            },
            execute: (state: TextState, api: TextAreaTextApi)  => {
              console.log('>>>>>>update>>>>>', state)
            },
            buttonProps: { 'aria-label': 'Insert title'}
          }),
        ]}
      />
    </div>
  );
}
```

### Preview Markdown

[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?logo=codesandbox)](https://codesandbox.io/embed/react-md-editor-preview-markdown-vrucl?fontsize=14&hidenavigation=1&theme=dark)

```jsx
import React from "react";
import ReactDOM from "react-dom";
import MDEditor from '@uiw/react-md-editor';

export default function App() {
  return (
    <div className="container">
      <MDEditor.Markdown source="Hello Markdown!" />
    </div>
  );
}
```

### Support Custom KaTeX Preview

KaTeX is a fast, easy-to-use JavaScript library for TeX math rendering on the web, We perform math rendering through [`KaTeX`](https://github.com/KaTeX/KaTeX).

The following example is preview in [CodeSandbox](https://codesandbox.io/s/markdown-editor-katex-for-react-7v3vl).

[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?logo=codesandbox)](https://codesandbox.io/embed/headless-frog-em8yg?fontsize=14&hidenavigation=1&theme=dark)

> ⚠️ Upgrade v2 to v3 [d025430](https://github.com/uiwjs/react-md-editor/blob/d02543050c9abd8f7c72ae02b6421ac2e6ae421a/website/ExmapleKaTeX.tsx#L1-L59)

```bash
npm install katex
```

```jsx
import React from "react";
import ReactDOM from "react-dom";
import MDEditor from '@uiw/react-md-editor';
import katex from 'katex';
import 'katex/dist/katex.css';

const mdKaTeX = `This is to display the 
\`\$\$\c = \\pm\\sqrt{a^2 + b^2}\$\$\`
 in one line

\`\`\`KaTeX
c = \\pm\\sqrt{a^2 + b^2}
\`\`\`
`;

export default function App() {
  return (
    <MDEditor
      value={mdKaTeX}
      previewOptions={{
        components: {
          code: ({ inline, children, className, ...props }) => {
            const txt = children[0] || '';
            if (inline) {
              if (typeof txt === 'string' && /^\$\$(.*)\$\$/.test(txt)) {
                const html = katex.renderToString(txt.replace(/^\$\$(.*)\$\$/, '$1'), {
                  throwOnError: false,
                });
                return <code dangerouslySetInnerHTML={{ __html: html }} />;
              }
              return <code>{txt}</code>;
            }
            if (
              typeof txt === 'string' &&
              typeof className === 'string' &&
              /^language-katex/.test(className.toLocaleLowerCase())
            ) {
              const html = katex.renderToString(txt, {
                throwOnError: false,
              });
              return <code dangerouslySetInnerHTML={{ __html: html }} />;
            }
            return <code className={String(className)}>{txt}</code>;
          },
        },
      }}
    />
  );
}
```

### Markdown text to Imgage

[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?logo=codesandbox)](https://codesandbox.io/embed/react-md-editor-text-to-images-ijqmx?fontsize=14&hidenavigation=1&theme=dark)

```jsx
import React from "react";
import MDEditor, { commands, ICommand, TextState, TextAreaTextApi } from "@uiw/react-md-editor";
import domToImage from "dom-to-image";

const textToImage: ICommand = {
  name: "Text To Image",
  keyCommand: "text2image",
  buttonProps: { "aria-label": "Insert title3" },
  icon: (
    <svg width="12" height="12" viewBox="0 0 20 20">
      <path fill="currentColor" d="M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13l-6-5-2 2-4-5-4 8V4h16v11z" ></path>
    </svg>
  ),
  execute: (state: TextState, api: TextAreaTextApi) => {
    const dom = document.getElementsByClassName("w-md-editor")[0];
    if (dom) {
      domToImage.toJpeg(dom, {}).then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "image.jpg";
        link.href = dataUrl;
        link.click();
      });
    }
  }
};

export default function App() {
  return (
    <div className="container">
      <MDEditor
        value="**Hello world!!!**"
        commands={[
          textToImage,
          commands.divider
        ]}
      />
    </div>
  );
}
```

### Support Custom Mermaid Preview

Using [mermaid](https://github.com/mermaid-js/mermaid) to generation of diagram and flowchart from text in a similar manner as markdown

[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?logo=codesandbox)](https://codesandbox.io/embed/markdown-editor-mermaid-for-react-uvtsx?fontsize=14&hidenavigation=1&theme=dark)

```bash
npm install mermaid
```

```jsx
import React from "react";
import ReactDOM from "react-dom";
import MDEditor from "@uiw/react-md-editor";
import mermaid from "mermaid";

const mdMermaid = `The following are some examples of the diagrams, charts and graphs that can be made using Mermaid and the Markdown-inspired text specific to it. 

\`\`\`mermaid
graph TD
A[Hard] -->|Text| B(Round)
B --> C{Decision}
C -->|One| D[Result 1]
C -->|Two| E[Result 2]
\`\`\`

\`\`\`mermaid
sequenceDiagram
Alice->>John: Hello John, how are you?
loop Healthcheck
    John->>John: Fight against hypochondria
end
Note right of John: Rational thoughts!
John-->>Alice: Great!
John->>Bob: How about you?
Bob-->>John: Jolly good!
\`\`\`
`;

export default function App() {
  return (
    <MDEditor
      height={500}
      value={mdMermaid || ""}
      previewOptions={{
        components: {
          code: ({ inline, children, className, ...props }) => {
            const txt = children[0] || '';
            if (
              typeof txt === 'string' &&
              typeof className === 'string' &&
              /^language-mermaid/.test(className.toLocaleLowerCase())
            ) {
              const Elm = document.createElement("div");
              Elm.id = "demo";
              const svg = mermaid.render("demo", txt);
              return <code dangerouslySetInnerHTML={{ __html: svg }} />
            }
            return <code className={String(className)}>{txt}</code>;
          },
        },
      }}
    />
  );
}

ReactDOM.render(<App />, document.getElementById("container"));
```

### Support Nextjs

Use examples in [nextjs](https://nextjs.org/). [#52](https://github.com/uiwjs/react-md-editor/issues/52#issuecomment-848969341) [#224](https://github.com/uiwjs/react-md-editor/issues/224#issuecomment-901112079)

[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?logo=codesandbox)](https://codesandbox.io/embed/nextjs-example-react-md-editor-qjhn7?fontsize=14&hidenavigation=1&theme=dark) [![Open in StackBlitz](https://img.shields.io/badge/Open%20In-StackBlitz-green)](https://stackblitz.com/edit/nextjs-react-md-editor?embed=1&file=pages/index.js&hideExplorer=1&hideNavigation=1&theme=dark)

```bash
npm install next-remove-imports
```

```js
// next.config.js
const removeImports = require('next-remove-imports')();

module.exports = removeImports({});
```

```jsx
// pages/index.js
import Head from 'next/head'
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/dist/markdown-editor.css'
import '@uiw/react-markdown-preview/dist/markdown.css';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <MDEditor value="**Hello world!!!**" />
    </div>
  )
}
```

### Props

- `value: string`: The Markdown value.
- `onChange?: (value: string)`: Event handler for the `onChange` event.
- `commands?: ICommand[]`: An array of [`ICommand`](https://github.com/uiwjs/react-md-editor/blob/d02543050c9abd8f7c72ae02b6421ac2e6ae421a/src/commands/index.ts#L39-L57), which, each one, contain a [`commands`](https://github.com/uiwjs/react-md-editor/blob/d02543050c9abd8f7c72ae02b6421ac2e6ae421a/src/commands/index.ts#L155-L180) property. If no commands are specified, the default will be used. Commands are explained in more details below.
- `extraCommands?: ICommand[]`: Displayed on the right side of the toolbar.
- `autoFocus?: true`: Can be used to make `Markdown Editor` focus itself on initialization.
- `previewOptions?: ReactMarkdown.ReactMarkdownProps`: This is reset [@uiw/react-markdown-preview](https://github.com/uiwjs/react-markdown-preview/tree/e6e8462d9a5c64a7045e25adcb4928095d74ca37#options-props) settings.
- `textareaProps?: TextareaHTMLAttributes`: Set the `textarea` related props.
- `renderTextarea?: (props, opts) => JSX.Element;`: Use div to replace TextArea or re-render TextArea. [#193](https://github.com/uiwjs/react-md-editor/issues/193)
- `height?: number=200`: The height of the editor.
- `visiableDragbar?: boolean=true`: Show drag and drop tool. Set the height of the editor.
- `highlightEnable?: boolean=true`: Disable editing area code highlighting. The value is `false`, which increases the editing speed.
- `fullscreen?: boolean=false`: Show markdown preview.
- `preview?: 'live' | 'edit' | 'preview'`: Default value `live`, Show markdown preview.
- `maxHeight?: number=1200`: Maximum drag height. The `visiableDragbar=true` value is valid.
- `minHeights?: number=100`: Minimum drag height. The `visiableDragbar=true` value is valid.
- `tabSize?: number=2`: The number of characters to insert when pressing tab key. Default `2` spaces.
- `hideToolbar?: boolean=false`: Option to hide the tool bar.
- `enableScroll?: boolean=true`: Whether to enable scrolling.

### Development

```bash
npm run watch     # Listen create type and .tsx files.
npm run css:watch # listen to the component compile and output the .css file
npm run start  # Preview code example.
```

### Related

- [@uiw/react-textarea-code-editor](https://github.com/uiwjs/react-textarea-code-editor): A simple code editor with syntax highlighting.
- [@uiw/react-md-editor](https://github.com/uiwjs/react-md-editor): A simple markdown editor with preview, implemented with React.js and TypeScript.
- [@uiw/react-codemirror](https://github.com/uiwjs/react-codemirror): CodeMirror component for React. @codemirror
- [@uiw/react-monacoeditor](https://github.com/jaywcjlove/react-monacoeditor): Monaco Editor component for React.
- [@uiw/react-markdown-editor](https://github.com/uiwjs/react-markdown-editor): A markdown editor with preview, implemented with React.js and TypeScript.
- [@uiw/react-markdown-preview](https://github.com/uiwjs/react-markdown-preview): React component preview markdown text in web browser. 

### License

Licensed under the MIT License.
