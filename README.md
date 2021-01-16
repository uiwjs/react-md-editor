<p align="center">
  <a href="https://github.com/uiwjs/react-md-editor">
    <img alt="react-md-editor logo" src="https://raw.githubusercontent.com/uiwjs/react-markdown-editor/4884f29f2aad59bf7f512184ba3726d76bbd7170/website/logo.svg?sanitize=true">
  </a>
</p>

<p align="center">
  <a href="https://github.com/uiwjs/react-md-editor/actions">
    <img alt="Build & Deploy" src="https://github.com/uiwjs/react-md-editor/workflows/Build%20&%20Deploy/badge.svg">
  </a>
  <a href="https://github.com/uiwjs/react-md-editor/issues">
    <img alt="Issues" src="https://img.shields.io/github/issues/uiwjs/react-md-editor.svg">
  </a>
  <a href="https://github.com/uiwjs/react-md-editor/network">
    <img alt="Forks" src="https://img.shields.io/github/forks/uiwjs/react-md-editor.svg">
  </a>
  <a href="https://github.com/uiwjs/react-md-editor/stargazers">
    <img alt="Stars" src="https://img.shields.io/github/stars/uiwjs/react-md-editor.svg">
  </a>
  <a href="https://github.com/uiwjs/react-md-editor/releases">
    <img alt="Release" src="https://img.shields.io/github/release/uiwjs/react-md-editor.svg">
  </a>
  <a href="https://gitee.com/uiw/react-md-editor">
    <img alt="Release" src="https://jaywcjlove.github.io/sb/ico/gitee.svg">
  </a>
  <a href="https://www.npmjs.com/package/@uiw/react-md-editor">
    <img alt="npm version" src="https://img.shields.io/npm/v/@uiw/react-md-editor.svg">
  </a>
</p>

<!--dividing-->

A simple markdown editor with preview, implemented with React.js and TypeScript. This React Component aims to provide a simple Markdown editor with syntax highlighting support. This is based on `textarea` encapsulation, so it does not depend on any modern code editors such as Acs, CodeMirror, Monaco etc.

### Features

- 📑 Indent line or selected text by pressing tab key, with customizable indentation.
- ♻️ Based on `textarea` encapsulation, does not depend on any modern code editors.
- 🚧 Does not depend on the [`uiw`](https://github.com/uiwjs/uiw) component library.
- 🚘 Automatic list on new lines.
- 😻 GitHub flavored markdown support

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
import MDEditor, { commands, ICommand, TextState, TextApi } from '@uiw/react-md-editor';

const title3: ICommand = {
  name: 'title3',
  keyCommand: 'title3',
  buttonProps: { 'aria-label': 'Insert title3' },
  icon: (
    <svg width="12" height="12" viewBox="0 0 520 520">
      <path fill="currentColor" d="M15.7083333,468 C7.03242448,468 0,462.030833 0,454.666667 L0,421.333333 C0,413.969167 7.03242448,408 15.7083333,408 L361.291667,408 C369.967576,408 377,413.969167 377,421.333333 L377,454.666667 C377,462.030833 369.967576,468 361.291667,468 L15.7083333,468 Z M21.6666667,366 C9.69989583,366 0,359.831861 0,352.222222 L0,317.777778 C0,310.168139 9.69989583,304 21.6666667,304 L498.333333,304 C510.300104,304 520,310.168139 520,317.777778 L520,352.222222 C520,359.831861 510.300104,366 498.333333,366 L21.6666667,366 Z M136.835938,64 L136.835937,126 L107.25,126 L107.25,251 L40.75,251 L40.75,126 L-5.68434189e-14,126 L-5.68434189e-14,64 L136.835938,64 Z M212,64 L212,251 L161.648438,251 L161.648438,64 L212,64 Z M378,64 L378,126 L343.25,126 L343.25,251 L281.75,251 L281.75,126 L238,126 L238,64 L378,64 Z M449.047619,189.550781 L520,189.550781 L520,251 L405,251 L405,64 L449.047619,64 L449.047619,189.550781 Z" />
    </svg>
  ),
  execute: (state: TextState, api: TextApi) => {
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
            execute: (state: commands.TextState, api: commands.TextApi)  => {
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

[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?logo=codesandbox)](https://codesandbox.io/embed/markdown-editor-katex-for-react-7v3vl?fontsize=14&hidenavigation=1&theme=dark)

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

const renderers = {
  inlineCode: ({ children }) => {
    if (/^\$\$(.*)\$\$/.test(children)) {
      const html = katex.renderToString(children.replace(/^\$\$(.*)\$\$/, '$1'), {
        throwOnError: false,
      });
      return <code dangerouslySetInnerHTML={{ __html: html }} />
    }
    return children;
  },
  code: ({ children, language, value }) => {
    if (language.toLocaleLowerCase() === 'katex') {
      const html = katex.renderToString(value, {
        throwOnError: false
      });
      return (
        <pre>
          <code dangerouslySetInnerHTML={{ __html: html }} />
        </pre>
      );
    }
    return children;
  }
}

export default function App() {
  return (
    <MDEditor
      value={mdKaTeX || ''}
      previewOptions={{ renderers: renderers }}
    />
  );
}
```

### Props

- `value: string`: The Markdown value.
- `onChange?: (value: string)`: Event handler for the `onChange` event.
- `commands?: ICommand[]`: An array of [`ICommand`](https://github.com/uiwjs/react-md-editor/blob/098c0b657300bfbfef83976558ee37f737e842a2/src/commands/index.ts#L20-L29), which, each one, contain a [`commands`](https://github.com/uiwjs/react-md-editor/blob/098c0b657300bfbfef83976558ee37f737e842a2/src/commands/index.ts#L111-L112) property. If no commands are specified, the default will be used. Commands are explained in more details below.
- `autoFocus?: number=true`: Can be used to make `Markdown Editor` focus itself on initialization.
- `previewOptions?: ReactMarkdown.ReactMarkdownProps`: This is reset [@uiw/react-markdown-preview](https://github.com/uiwjs/react-markdown-preview/tree/55564d16e98591c54236fe3b57cc27b5dbae3004#options-props) settings.
- `textareaProps?: TextareaHTMLAttributes`: Set the `textarea` related props.
- `height?: number=200`: The height of the editor.
- `visiableDragbar?: boolean=true`: Show drag and drop tool. Set the height of the editor.
- `fullscreen?: boolean=false`: Show markdown preview.
- `preview?: 'live' | 'edit' | 'preview'`: Default value `live`, Show markdown preview.
- `maxHeight?: number=1200`: Maximum drag height. The `visiableDragbar=true` value is valid.
- `minHeights?: number=100`: Minimum drag height. The `visiableDragbar=true` value is valid.
- `tabSize?: number=2`: The number of characters to insert when pressing tab key. Default `2` spaces.
- `hideToolbar?: boolean=false`: Option to hide the tool bar.

### Development

```bash
npm run watch  # Listen create type and .tsx files.
npm run start  # Preview code example.
```

### Other

If you need more features-rich Markdown Editor, you can use [@uiwjs/react-markdown-editor](https://github.com/uiwjs/react-markdown-editor)

- [@uiw/react-codemirror](https://github.com/uiwjs/react-codemirror): CodeMirror component for React. @codemirror
- [@uiw/react-monacoeditor](https://github.com/jaywcjlove/react-monacoeditor): Monaco Editor component for React.
- [@uiw/react-markdown-editor](https://github.com/uiwjs/react-markdown-editor): A markdown editor with preview, implemented with React.js and TypeScript.

### License

Licensed under the MIT License.
