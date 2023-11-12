<!--rehype:ignore:start-->
<p align="center">
  <a href="https://uiwjs.github.io/npm-unpkg/#/pkg/@uiw/react-md-editor/file/README.md">
    <img alt="react-md-editor logo" src="https://user-images.githubusercontent.com/1680273/146292033-0e5e57fc-6f3e-4032-9fa6-0de05f239e36.png">
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@uiw/react-md-editor" target="__blank">
    <img alt="Downloads" src="https://img.shields.io/npm/dm/@uiw/react-md-editor.svg?style=flat">
  </a>
  <a href="https://www.jsdelivr.com/package/npm/@uiw/react-md-editor" target="__blank">
    <img alt="jsDelivr CDN" src="https://data.jsdelivr.com/v1/package/npm/@uiw/react-md-editor/badge?style=rounded" />
  </a>
  <a href="https://bundlephobia.com/package/@uiw/react-md-editor" target="__blank">
    <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/@uiw/react-md-editor">
  </a>
  <a href="https://uiwjs.github.io/react-md-editor/coverage/lcov-report" target="__blank">
    <img alt="Coverage Status" src="https://uiwjs.github.io/react-md-editor/badges.svg" />
  </a>
  <br />
  <a href="https://github.com/uiwjs/react-md-editor/actions" target="__blank">
    <img alt="Build & Deploy" src="https://github.com/uiwjs/react-md-editor/actions/workflows/ci.yml/badge.svg" />
  </a>
  <a href="https://uiwjs.github.io/npm-unpkg/#/pkg/@uiw/react-md-editor/file/README.md" target="__blank">
    <img src="https://img.shields.io/badge/Open%20in-unpkg-blue" alt="Open in unpkg">
  </a>
  <a href="https://gitee.com/uiw/react-md-editor" target="__blank">
    <img alt="Gitee" src="https://jaywcjlove.github.io/sb/ico/gitee.svg">
  </a>
  <a href="https://www.npmjs.com/package/@uiw/react-md-editor" target="__blank">
    <img alt="npm version" src="https://img.shields.io/npm/v/@uiw/react-md-editor.svg">
  </a>
</p>

<!--rehype:ignore:end-->

A simple markdown editor with preview, implemented with React.js and TypeScript. This React Component aims to provide a simple Markdown editor with syntax highlighting support. This is based on `textarea` encapsulation, so it does not depend on any modern code editors such as Acs, CodeMirror, Monaco etc.

### Features

- 📑 Indent line or selected text by pressing tab key, with customizable indentation.
- ♻️ Based on `textarea` encapsulation, does not depend on any modern code editors.
- 🚧 Does not depend on the [`uiw`](https://github.com/uiwjs/uiw) component library.
- 🚘 Automatic list on new lines.
- 😻 GitHub flavored markdown support.
- 🌒 Support dark-mode/night-mode **@v3.11.0+**.
- 💡 Support [next.js](https://github.com/uiwjs/react-md-editor/issues/52#issuecomment-848969341), [Use examples](#support-nextjs) in [next.js](https://nextjs.org/).
- Line/lines duplication (Ctrl+D) and movement (Alt+UpArrow/DownArrow) **@v3.24.0+**.

### Quick Start

```bash
npm i @uiw/react-md-editor
```

### Using

[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?logo=codesandbox)](https://codesandbox.io/embed/markdown-editor-for-react-izdd6?fontsize=14&hidenavigation=1&theme=dark)
[![Open in Github gh-pages](https://img.shields.io/badge/Open%20In-Github%20gh--pages-blue?logo=github)](https://uiwjs.github.io/react-md-editor/)
[![Open in Gitee gh-pages](https://img.shields.io/badge/Open%20In-Gitee%20gh--pages-blue?logo=web)](https://uiw.gitee.io/react-md-editor/)

```jsx mdx:preview
import React from "react";
import MDEditor from '@uiw/react-md-editor';

export default function App() {
  const [value, setValue] = React.useState("**Hello world!!!**");
  return (
    <div className="container">
      <MDEditor
        value={value}
        onChange={setValue}
      />
      <MDEditor.Markdown source={value} style={{ whiteSpace: 'pre-wrap' }} />
    </div>
  );
}
```

### Special Markdown syntax

**Supports for CSS Style**

Use HTML comments `<!--rehype:xxx-->`<!--rehype:style=color: red; font-weight: bold;--> to let Markdown support style customization.

```markdown
## Title
<!--rehype:style=display: flex; height: 230px; align-items: center; justify-content: center; font-size: 38px;-->

Markdown Supports **Style**<!--rehype:style=color: red;-->
```

**Ignore content display via HTML comments**

Shown in GitHub readme, excluded in HTML.

```markdown
# Hello World

<!--rehype:ignore:start-->Hello World<!--rehype:ignore:end-->

Good!
```

Output:

```html
<h1>Hello World</h1>

<p>Good!</p>
```

### Security

Please note markdown needs to be sanitized if you do not **completely trust** your authors.
Otherwise, your app is vulnerable to XSS. This can be achieved by adding [rehype-sanitize](https://github.com/rehypejs/rehype-sanitize) as a plugin.

```jsx mdx:preview
import React from "react";
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";

export default function App() {
  const [value, setValue] = React.useState(`**Hello world!!!** <IFRAME SRC=\"javascript:javascript:alert(window.origin);\"></IFRAME>`);
  return (
    <div className="container">
      <MDEditor
        value={value}
        onChange={setValue}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
      />
    </div>
  );
}
```

### Remove Code Highlight

The following example can help you _exclude code highlighting code_<!--rehype:style=color: #333;background-color: rgb(196 255 122 / 86%);--> from being included in the bundle. `@uiw/react-md-editor/nohighlight`<!--rehype:style=color: #e24444;--> component does not contain the ~~`rehype-prism-plus`~~ code highlighting package, ~~`highlightEnable`~~, ~~`showLineNumbers`~~ and ~~`highlight line`~~ functions will no longer work. ([#586](https://github.com/uiwjs/react-md-editor/issues/586))

```jsx mdx:preview
import React from "react";
import MDEditor from '@uiw/react-md-editor/nohighlight';

const code = `**Hello world!!!**
\`\`\`js
function demo() {}
\`\`\`
`

export default function App() {
  const [value, setValue] = React.useState(code);
  return (
    <div className="container">
      <MDEditor
        value={value}
        onChange={setValue}
      />
      <MDEditor.Markdown source={value} style={{ whiteSpace: 'pre-wrap' }} />
    </div>
  );
}
```

### Custom Toolbars

[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?logo=codesandbox)](https://codesandbox.io/embed/react-md-editor-custom-toolbars-m2n10?fontsize=14&hidenavigation=1&theme=dark)

```jsx mdx:preview
import React, { useState } from "react";
import MDEditor, { commands } from '@uiw/react-md-editor';

const title3 = {
  name: 'title3',
  keyCommand: 'title3',
  buttonProps: { 'aria-label': 'Insert title3' },
  icon: (
    <svg width="12" height="12" viewBox="0 0 520 520">
      <path fill="currentColor" d="M15.7083333,468 C7.03242448,468 0,462.030833 0,454.666667 L0,421.333333 C0,413.969167 7.03242448,408 15.7083333,408 L361.291667,408 C369.967576,408 377,413.969167 377,421.333333 L377,454.666667 C377,462.030833 369.967576,468 361.291667,468 L15.7083333,468 Z M21.6666667,366 C9.69989583,366 0,359.831861 0,352.222222 L0,317.777778 C0,310.168139 9.69989583,304 21.6666667,304 L498.333333,304 C510.300104,304 520,310.168139 520,317.777778 L520,352.222222 C520,359.831861 510.300104,366 498.333333,366 L21.6666667,366 Z M136.835938,64 L136.835937,126 L107.25,126 L107.25,251 L40.75,251 L40.75,126 L-5.68434189e-14,126 L-5.68434189e-14,64 L136.835938,64 Z M212,64 L212,251 L161.648438,251 L161.648438,64 L212,64 Z M378,64 L378,126 L343.25,126 L343.25,251 L281.75,251 L281.75,126 L238,126 L238,64 L378,64 Z M449.047619,189.550781 L520,189.550781 L520,251 L405,251 L405,64 L449.047619,64 L449.047619,189.550781 Z" />
    </svg>
  ),
  execute: (state, api) => {
    let modifyText = `### ${state.selectedText}\n`;
    if (!state.selectedText) {
      modifyText = `### `;
    }
    api.replaceSelection(modifyText);
  },
};

const title2 = {
  name: 'title2',
  keyCommand: 'title2',
  render: (command, disabled, executeCommand) => {
    return (
      <button 
        aria-label="Insert title2"
        disabled={disabled}
        onClick={(evn) => {
          // evn.stopPropagation();
          executeCommand(command, command.groupName)
        }}
      >
        <svg width="12" height="12" viewBox="0 0 520 520">
          <path fill="currentColor" d="M15.7083333,468 C7.03242448,468 0,462.030833 0,454.666667 L0,421.333333 C0,413.969167 7.03242448,408 15.7083333,408 L361.291667,408 C369.967576,408 377,413.969167 377,421.333333 L377,454.666667 C377,462.030833 369.967576,468 361.291667,468 L15.7083333,468 Z M21.6666667,366 C9.69989583,366 0,359.831861 0,352.222222 L0,317.777778 C0,310.168139 9.69989583,304 21.6666667,304 L498.333333,304 C510.300104,304 520,310.168139 520,317.777778 L520,352.222222 C520,359.831861 510.300104,366 498.333333,366 L21.6666667,366 Z M136.835938,64 L136.835937,126 L107.25,126 L107.25,251 L40.75,251 L40.75,126 L-5.68434189e-14,126 L-5.68434189e-14,64 L136.835938,64 Z M212,64 L212,251 L161.648438,251 L161.648438,64 L212,64 Z M378,64 L378,126 L343.25,126 L343.25,251 L281.75,251 L281.75,126 L238,126 L238,64 L378,64 Z M449.047619,189.550781 L520,189.550781 L520,251 L405,251 L405,64 L449.047619,64 L449.047619,189.550781 Z" />
        </svg>
      </button>
    )
  },
  execute: (state, api) => {
    let modifyText = `## ${state.selectedText}\n`;
    if (!state.selectedText) {
      modifyText = `## `;
    }
    api.replaceSelection(modifyText);
  },
}

function SubChildren({ close, execute, getState, textApi, dispatch }) {
  const [value, setValue] = useState('')
  const insert = () => {
    console.log('value:::', value)
    textApi.replaceSelection(value)
  }
  return (
    <div style={{ width: 120, padding: 10 }}>
      <div>My Custom Toolbar</div>
      <input type="text" onChange={(e) => setValue(e.target.value)} />
      <button
        type="button"
        onClick={() => {
          dispatch({ $value: '~~~~~~' })
          console.log('> execute: >>>>>', getState())
        }}
      >
        State
      </button>
      <button type="button" onClick={insert}>Insert</button>
      <button type="button" onClick={() => close()}>Close</button>
      <button type="button" onClick={() => execute()}>Execute</button>
    </div>
  );
}

const subChild = {
  name: 'update',
  groupName: 'update',
  icon: (
    <svg viewBox="0 0 1024 1024" width="12" height="12">
      <path fill="currentColor" d="M716.8 921.6a51.2 51.2 0 1 1 0 102.4H307.2a51.2 51.2 0 1 1 0-102.4h409.6zM475.8016 382.1568a51.2 51.2 0 0 1 72.3968 0l144.8448 144.8448a51.2 51.2 0 0 1-72.448 72.3968L563.2 541.952V768a51.2 51.2 0 0 1-45.2096 50.8416L512 819.2a51.2 51.2 0 0 1-51.2-51.2v-226.048l-57.3952 57.4464a51.2 51.2 0 0 1-67.584 4.2496l-4.864-4.2496a51.2 51.2 0 0 1 0-72.3968zM512 0c138.6496 0 253.4912 102.144 277.1456 236.288l10.752 0.3072C924.928 242.688 1024 348.0576 1024 476.5696 1024 608.9728 918.8352 716.8 788.48 716.8a51.2 51.2 0 1 1 0-102.4l8.3968-0.256C866.2016 609.6384 921.6 550.0416 921.6 476.5696c0-76.4416-59.904-137.8816-133.12-137.8816h-97.28v-51.2C691.2 184.9856 610.6624 102.4 512 102.4S332.8 184.9856 332.8 287.488v51.2H235.52c-73.216 0-133.12 61.44-133.12 137.8816C102.4 552.96 162.304 614.4 235.52 614.4l5.9904 0.3584A51.2 51.2 0 0 1 235.52 716.8C105.1648 716.8 0 608.9728 0 476.5696c0-132.1984 104.8064-239.872 234.8544-240.2816C258.5088 102.144 373.3504 0 512 0z" />
    </svg>
  ),
  children: (props) => <SubChildren {...props} />,
  execute: (state, api)  => {
    console.log('>>>>>>update>>>>>', state)
  },
  buttonProps: { 'aria-label': 'Insert title'}
}

export default function App() {
  const [value, setValue] = React.useState("Hello Markdown! `Tab` key uses default behavior");
  return (
    <div className="container">
      <MDEditor
        value={value}
        onChange={setValue}
        commands={[
          // Custom Toolbars
          title3, title2,
          commands.group([commands.title1, commands.title2, commands.title3, commands.title4, commands.title5, commands.title6], {
            name: 'title',
            groupName: 'title',
            buttonProps: { 'aria-label': 'Insert title'}
          }),
          commands.divider,
          commands.group([], subChild),
        ]}
      />
    </div>
  );
}
```

Customize the toolbar with `commands` and `extraCommands` props.

```jsx mdx:preview
import React from "react";
import MDEditor, { commands } from '@uiw/react-md-editor';

export default function App() {
  const [value, setValue] = React.useState("Hello Markdown! `Tab` key uses default behavior");
  return (
    <div className="container">
      <MDEditor
        value={value}
        onChange={setValue}
        preview="edit"
        commands={[
          commands.codeEdit, commands.codePreview
        ]}
        extraCommands={[
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
                  <button type="button" onClick={() => console.log('> execute: >>>>>', getState())}>State</button>
                  <button type="button" onClick={() => close()}>Close</button>
                  <button type="button" onClick={() => execute()}>Execute</button>
                </div>
              );
            },
            execute: (state, api)  => {
              console.log('>>>>>>update>>>>>', state)
            },
            buttonProps: { 'aria-label': 'Insert title'}
          }),
          commands.divider, commands.fullscreen
        ]}
      />
    </div>
  );
}
```

re-render `toolbar` element.

```jsx mdx:preview
import React from "react";
import MDEditor, { commands } from '@uiw/react-md-editor';

export default function App() {
  const [value, setValue] = React.useState("Hello Markdown! `Tab` key uses default behavior");
  return (
    <div className="container">
      <MDEditor
        value={value}
        onChange={setValue}
        preview="edit"
        components={{
          toolbar: (command, disabled, executeCommand) => {
            if (command.keyCommand === 'code') {
              return (
                <button 
                  aria-label="Insert code"
                  disabled={disabled}
                  onClick={(evn) => {
                    evn.stopPropagation();
                    executeCommand(command, command.groupName)
                  }}
                >
                  Code
                </button>
              )
            }
          }
        }}
      />
    </div>
  );
}
```

Custom Preview Command Tool

[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?logo=codesandbox)](https://codesandbox.io/embed/react-md-editor-custom-toolbars-https-github-com-uiwjs-react-md-editor-issues-433-9mwuob?fontsize=14&hidenavigation=1&theme=dark)

```jsx mdx:preview
import React, { useContext } from "react";
import MDEditor, { commands, EditorContext } from "@uiw/react-md-editor";

const Button = () => {
  const { preview, dispatch } = useContext(EditorContext);
  const click = () => {
    dispatch({
      preview: preview === "edit" ? "preview" : "edit"
    });
  };
  if (preview === "edit") {
    return (
      <svg width="12" height="12" viewBox="0 0 520 520" onClick={click}>
        <polygon
          fill="currentColor"
          points="0 71.293 0 122 319 122 319 397 0 397 0 449.707 372 449.413 372 71.293"
        />
        <polygon
          fill="currentColor"
          points="429 71.293 520 71.293 520 122 481 123 481 396 520 396 520 449.707 429 449.413"
        />
      </svg>
    );
  }
  return (
    <svg width="12" height="12" viewBox="0 0 520 520" onClick={click}>
      <polygon
        fill="currentColor"
        points="0 71.293 0 122 38.023 123 38.023 398 0 397 0 449.707 91.023 450.413 91.023 72.293"
      />
      <polygon
        fill="currentColor"
        points="148.023 72.293 520 71.293 520 122 200.023 124 200.023 397 520 396 520 449.707 148.023 450.413"
      />
    </svg>
  );
};

const codePreview = {
  name: "preview",
  keyCommand: "preview",
  value: "preview",
  icon: <Button />
};

const Disable = () => {
  const { preview, dispatch } = useContext(EditorContext);
  return (
    <button disabled={preview === "preview"}>
      <svg viewBox="0 0 16 16" width="12px" height="12px">
        <path
          d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8Zm.9 13H7v-1.8h1.9V13Zm-.1-3.6v.5H7.1v-.6c.2-2.1 2-1.9 1.9-3.2.1-.7-.3-1.1-1-1.1-.8 0-1.2.7-1.2 1.6H5c0-1.7 1.2-3 2.9-3 2.3 0 3 1.4 3 2.3.1 2.3-1.9 2-2.1 3.5Z"
          fill="currentColor"
        />
      </svg>
    </button>
  )
}

const customButton = {
  name: "disable",
  keyCommand: "disable",
  value: "disable",
  icon: <Disable />
}

export default function App() {
  const [value, setValue] = React.useState("**Hello world!!!**");
  return (
    <div className="container">
      <div>The system automatically sets the theme</div>
      <MDEditor
        value={value}
        preview="edit"
        extraCommands={[codePreview, customButton, commands.fullscreen]}
        onChange={(val) => setValue(val)}
      />
    </div>
  );
}
```

Add Help Command Tool

[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?logo=codesandbox)](https://codesandbox.io/embed/markdown-editor-for-react-https-github-com-uiwjs-react-md-editor-issues-530-add-help-command-tool-fpnj22?fontsize=14&hidenavigation=1&theme=dark)

```jsx mdx:preview
import React, { useContext } from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";

const help = {
  name: "help",
  keyCommand: "help",
  buttonProps: { "aria-label": "Insert help" },
  icon: (
    <svg viewBox="0 0 16 16" width="12px" height="12px">
      <path
        d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8Zm.9 13H7v-1.8h1.9V13Zm-.1-3.6v.5H7.1v-.6c.2-2.1 2-1.9 1.9-3.2.1-.7-.3-1.1-1-1.1-.8 0-1.2.7-1.2 1.6H5c0-1.7 1.2-3 2.9-3 2.3 0 3 1.4 3 2.3.1 2.3-1.9 2-2.1 3.5Z"
        fill="currentColor"
      />
    </svg>
  ),
  execute: (state, api) => {
    window.open("https://www.markdownguide.org/basic-syntax/", "_blank");
  }
};

export default function App() {
  const [value, setValue] = React.useState("**Hello world!!!**");
  return (
    <MDEditor
      value={value}
      preview="edit"
      commands={[...commands.getCommands(), help]}
      onChange={(val) => setValue(val)}
    />
  );
}
```

### Editor Font Size

[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?logo=codesandbox)](https://codesandbox.io/embed/markdown-editor-for-react-uiwjs-react-md-editor-issues-425-2epmgh?fontsize=14&hidenavigation=1&theme=dark)
[![#425](https://img.shields.io/github/issues/detail/state/uiwjs/react-md-editor/425)](https://github.com/uiwjs/react-md-editor/issues/425#issuecomment-1209514536)

```css
.w-md-editor-text-pre > code,
.w-md-editor-text-input {
  font-size: 23px !important;
  line-height: 24px !important;
}
```

### Editor height adapts to text

The initial height can be adjusted through `minHeight={100}`. Dragbar will automatically expire. You can hide the drag button through `visibleDragbar={false}`

```jsx mdx:preview
import React from "react";
import MDEditor from '@uiw/react-md-editor';

export default function App() {
  const [value, setValue] = React.useState("**Hello world!!!**");
  return (
    <div className="container">
      <MDEditor
        value={value}
        height="100%"
        // minHeight={50}
        visibleDragbar={false}
        onChange={setValue}
      />
    </div>
  );
}
```

### Preview Markdown

[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?logo=codesandbox)](https://codesandbox.io/embed/react-md-editor-preview-markdown-vrucl?fontsize=14&hidenavigation=1&theme=dark)

```jsx mdx:preview
import React from "react";
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

> ⚠️ Upgrade v2 to v3 [d025430](https://github.com/uiwjs/react-md-editor/blob/7b9f11ab689a7ea288df3e82c26f4f0e9a53d271/website/ExmapleKaTeX.tsx#L1-L63)

```bash
npm install katex
```

```jsx mdx:preview
import React from "react";
import MDEditor from '@uiw/react-md-editor';
import { getCodeString } from 'rehype-rewrite';
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
  const [value, setValue] = React.useState(mdKaTeX);
  return (
    <MDEditor
      value={value}
      onChange={(val) => setValue(val)}
      previewOptions={{
        components: {
          code: ({ inline, children = [], className, ...props }) => {
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
            const code = props.node && props.node.children ? getCodeString(props.node.children) : txt;
            if (
              typeof code === 'string' &&
              typeof className === 'string' &&
              /^language-katex/.test(className.toLocaleLowerCase())
            ) {
              const html = katex.renderToString(code, {
                throwOnError: false,
              });
              return <code style={{ fontSize: '150%' }} dangerouslySetInnerHTML={{ __html: html }} />;
            }
            return <code className={String(className)}>{children}</code>;
          },
        },
      }}
    />
  );
}
```

### Markdown text to Image

[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?logo=codesandbox)](https://codesandbox.io/embed/react-md-editor-text-to-images-ijqmx?fontsize=14&hidenavigation=1&theme=dark)

```tsx mdx:preview
import React, { useState } from "react";
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
    const dom = document.getElementsByClassName("gooooooooo")[0];
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
  const [value, setValue] = useState('**Hello world!!!**');
  console.log('value::', value)
  return (
    <div className="container">
      <MDEditor
        className="gooooooooo"
        onChange={(newValue = "") => setValue(newValue)}
        value={value}
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

[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?logo=codesandbox)](https://codesandbox.io/embed/recursing-water-08i59s?fontsize=14&hidenavigation=1&theme=dark)

```bash
npm install mermaid
```

```jsx mdx:preview
import React, { useState, useRef, useEffect, Fragment, useCallback } from "react";
import MDEditor from "@uiw/react-md-editor";
import { getCodeString } from 'rehype-rewrite';
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

const randomid = () => parseInt(String(Math.random() * 1e15), 10).toString(36);
const Code = ({ inline, children = [], className, ...props }) => {
  const demoid = useRef(`dome${randomid()}`);
  const [container, setContainer] = useState(null);
  const isMermaid = className && /^language-mermaid/.test(className.toLocaleLowerCase());
  const code = props.node && props.node.children ? getCodeString(props.node.children) : children[0] || '';
  useEffect(() => {
    if (container && isMermaid) {
      try {
        const str = mermaid.render(demoid.current, code);
        container.innerHTML = str;
      } catch (error) {
        container.innerHTML = error;
      }
    }
  }, [container, isMermaid, code, demoid]);

  const refElement = useCallback((node) => {
    if (node !== null) {
      setContainer(node);
    }
  }, []);

  if (isMermaid) {
    return (
      <Fragment>
        <code id={demoid.current} style={{ display: "none" }} />
        <code ref={refElement} data-name="mermaid" />
      </Fragment>
    );
  }
  return <code>{children}</code>;
};

export default function App() {
  const [value, setValue] = useState(mdMermaid);
  return (
    <MDEditor
      onChange={(newValue = "") => setValue(newValue)}
      textareaProps={{
        placeholder: "Please enter Markdown text"
      }}
      height={500}
      value={value}
      previewOptions={{
        components: {
          code: Code
        }
      }}
    />
  );
}
```

### Support Nextjs

Use examples in [nextjs](https://nextjs.org/). [`#52`](https://github.com/uiwjs/react-md-editor/issues/52#issuecomment-848969341) [`#224`](https://github.com/uiwjs/react-md-editor/issues/224#issuecomment-901112079)

[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?logo=codesandbox)](https://codesandbox.io/embed/nextjs-example-react-md-editor-https-github-com-uiwjs-react-md-editor-issues-516-1z56px?fontsize=14&hidenavigation=1&theme=dark)
[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?logo=codesandbox)](https://codesandbox.io/embed/nextjs-example-react-md-editor-qjhn7?fontsize=14&hidenavigation=1&theme=dark) [![Open in StackBlitz](https://img.shields.io/badge/Open%20In-StackBlitz-green)](https://stackblitz.com/edit/nextjs-react-md-editor?embed=1&file=pages/index.js&hideExplorer=1&hideNavigation=1&theme=dark)
[![#52](https://img.shields.io/github/issues/detail/state/uiwjs/react-md-editor/52)](https://github.com/uiwjs/react-md-editor/issues/52#issuecomment-848969341)
[![#224](https://img.shields.io/github/issues/detail/state/uiwjs/react-md-editor/224)](https://github.com/uiwjs/react-md-editor/issues/224#issuecomment-901112079)

```bash
npm install next-remove-imports
npm install @uiw/react-md-editor@v3.6.0
```

```js
// next.config.js
const removeImports = require('next-remove-imports')();
module.exports = removeImports({});
```

```jsx
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useState } from "react";

import * as commands from "@uiw/react-md-editor/commands"

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

function HomePage() {
  const [value, setValue] = useState("**Hello world!!!**");
  return (
    <div>
      <MDEditor value={value} onChange={setValue} />
    </div>
  );
}

export default HomePage;
```

### Support dark-mode/night-mode

By default, the [`dark-mode`](https://github.com/jaywcjlove/dark-mode/) is automatically switched according to the system. If you need to switch manually, just set the `data-color-mode="dark"` parameter for body. 

```html
<html data-color-mode="dark">
```

```js
document.documentElement.setAttribute('data-color-mode', 'dark')
document.documentElement.setAttribute('data-color-mode', 'light')
```

Inherit custom color variables by adding [`.wmde-markdown-var`](https://github.com/uiwjs/react-markdown-preview/blob/a53be1e93fb1c2327649c4a6b084adb80679affa/src/styles/markdown.less#L1-L193) selector. Setting theme styles with `data-color-mode="light"`.

```html
<div data-color-mode="light">
  <div className="wmde-markdown-var"> </div>
  <MDEditor source="Hello World!" />
</div>
```

### Props

- `value: string`: The Markdown value.
- `onChange?: (value?: string, event?: React.ChangeEvent<HTMLTextAreaElement>, state?: ContextStore)`: Event handler for the `onChange` event.
- `onHeightChange?: ((value?: CSSProperties['height'], oldValue?: CSSProperties['height'], state?: ContextStore)`: editor height change listener.
- `onStatistics?: (data: Statistics) => void;` Some data on the statistics editor.
- `commands?: ICommand[]`: An array of [`ICommand`](https://github.com/uiwjs/react-md-editor/blob/d02543050c9abd8f7c72ae02b6421ac2e6ae421a/src/commands/index.ts#L39-L57), which, each one, contain a [`commands`](https://github.com/uiwjs/react-md-editor/blob/d02543050c9abd8f7c72ae02b6421ac2e6ae421a/src/commands/index.ts#L155-L180) property. If no commands are specified, the default will be used. Commands are explained in more details below.
- `commandsFilter?: (command: ICommand, isExtra: boolean) => false | ICommand`: Filter or modify your commands.
- `extraCommands?: ICommand[]`: Displayed on the right side of the toolbar.
- `autoFocus?: true`: Can be used to make `Markdown Editor` focus itself on initialization.
- `previewOptions?: ReactMarkdown.ReactMarkdownProps`: This is reset [@uiw/react-markdown-preview](https://github.com/uiwjs/react-markdown-preview/tree/e6e8462d9a5c64a7045e25adcb4928095d74ca37#options-props) settings.
- `textareaProps?: TextareaHTMLAttributes`: Set the `textarea` related props.
- ~~`renderTextarea?: (props, opts) => JSX.Element;`~~: `@deprecated` Please use ~~`renderTextarea`~~ -> `components`. Use div to replace TextArea or re-render TextArea. [#193](https://github.com/uiwjs/react-md-editor/issues/193)
- `components`: re-render textarea/toolbar element. [#419](https://github.com/uiwjs/react-md-editor/issues/419)
    - `textarea` Use div to replace TextArea or re-render TextArea
    - `toolbar` Override the default command element. _`toolbar`_ < _`command[].render`_
    - `preview` Custom markdown preview. [#429](https://github.com/uiwjs/react-md-editor/issues/429)
- `height?: number=200`: The height of the editor. ️⚠️ `Dragbar` is invalid when **`height`** parameter percentage.
- `visibleDragbar?: boolean=true`: Show drag and drop tool. Set the height of the editor.
- `highlightEnable?: boolean=true`: Disable editing area code highlighting. The value is `false`, which increases the editing speed.
- `fullscreen?: boolean=false`: Show markdown preview.
- `overflow?: boolean=true`: Disable `fullscreen` setting body styles
- `preview?: 'live' | 'edit' | 'preview'`: Default value `live`, Show markdown preview.
- `maxHeight?: number=1200`: Maximum drag height. The `visibleDragbar=true` value is valid.
- `minHeights?: number=100`: Minimum drag height. The `visibleDragbar=true` value is valid.
- `tabSize?: number=2`: The number of characters to insert when pressing tab key. Default `2` spaces.
- `defaultTabEnable?: boolean=false`: If `false`, the `tab` key inserts a tab character into the textarea. If `true`, the `tab` key executes default behavior e.g. focus shifts to next element. 
- `hideToolbar?: boolean=false`: Option to hide the tool bar.
- `enableScroll?: boolean=true`: Whether to enable scrolling.

### Development

1. Install dependencies

```bash
$ npm install       # Installation dependencies
$ npm run build     # Compile all package
```

2. Development `@uiw/react-md-editor` package:

```bash
$ cd core
# listen to the component compile and output the .js file
# listen for compilation output type .d.ts file
$ npm run watch # Monitor the compiled package `@uiw/react-md-editor`
```

3. Launch documentation site

```bash
npm run start
```

### Related

- [@uiw/react-textarea-code-editor](https://github.com/uiwjs/react-textarea-code-editor): A simple code editor with syntax highlighting.
- [@uiw/react-md-editor](https://github.com/uiwjs/react-md-editor): A simple markdown editor with preview, implemented with React.js and TypeScript.
- [@uiw/react-codemirror](https://github.com/uiwjs/react-codemirror): CodeMirror component for React. @codemirror
- [@uiw/react-monacoeditor](https://github.com/jaywcjlove/react-monacoeditor): Monaco Editor component for React.
- [@uiw/react-markdown-editor](https://github.com/uiwjs/react-markdown-editor): A markdown editor with preview, implemented with React.js and TypeScript.
- [@uiw/react-markdown-preview](https://github.com/uiwjs/react-markdown-preview): React component preview markdown text in web browser. 

## Contributors

As always, thanks to our amazing contributors!

<!--AUTO_GENERATED_PLEASE_DONT_DELETE_IT--><a href="https://github.com/jaywcjlove" title="小弟调调">
  <img src="https://avatars.githubusercontent.com/u/1680273?v=4" width="42;" alt="小弟调调"/>
</a>
<a href="https://github.com/renovate-bot" title="Mend Renovate">
  <img src="https://avatars.githubusercontent.com/u/25180681?v=4" width="42;" alt="Mend Renovate"/>
</a>
<a href="https://github.com/stevemk14ebr" title="Stephen Eckels">
  <img src="https://avatars.githubusercontent.com/u/6619205?v=4" width="42;" alt="Stephen Eckels"/>
</a>
<a href="https://github.com/avalero" title="Alberto Valero Gómez">
  <img src="https://avatars.githubusercontent.com/u/1442682?v=4" width="42;" alt="Alberto Valero Gómez"/>
</a>
<a href="https://github.com/alphacoma18" title="Alpha Romer Coma">
  <img src="https://avatars.githubusercontent.com/u/108984668?v=4" width="42;" alt="Alpha Romer Coma"/>
</a>
<a href="https://github.com/RARgames" title="RAR">
  <img src="https://avatars.githubusercontent.com/u/13639766?v=4" width="42;" alt="RAR"/>
</a>
<a href="https://github.com/Exmirai" title="UniqueUlysees">
  <img src="https://avatars.githubusercontent.com/u/6436703?v=4" width="42;" alt="UniqueUlysees"/>
</a>
<a href="https://github.com/nuragic" title="Andrea Puddu">
  <img src="https://avatars.githubusercontent.com/u/1586378?v=4" width="42;" alt="Andrea Puddu"/>
</a>
<a href="https://github.com/bramus" title="Bramus">
  <img src="https://avatars.githubusercontent.com/u/213073?v=4" width="42;" alt="Bramus"/>
</a>
<a href="https://github.com/CarleneCannon-Conner" title="Carlene Cannon-Conner">
  <img src="https://avatars.githubusercontent.com/u/1942791?v=4" width="42;" alt="Carlene Cannon-Conner"/>
</a>
<a href="https://github.com/MercierCorentin" title="Corentin Mercier">
  <img src="https://avatars.githubusercontent.com/u/46066895?v=4" width="42;" alt="Corentin Mercier"/>
</a>
<a href="https://github.com/dmitriyyan" title="Dmitriy Yanushkevich">
  <img src="https://avatars.githubusercontent.com/u/89025862?v=4" width="42;" alt="Dmitriy Yanushkevich"/>
</a>
<a href="https://github.com/jnishiyama" title="James Finucane">
  <img src="https://avatars.githubusercontent.com/u/2048195?v=4" width="42;" alt="James Finucane"/>
</a>
<a href="https://github.com/allforabit" title="Kevin Nolan">
  <img src="https://avatars.githubusercontent.com/u/537189?v=4" width="42;" alt="Kevin Nolan"/>
</a>
<a href="https://github.com/kseikyo" title="Lucas Sierota">
  <img src="https://avatars.githubusercontent.com/u/29212286?v=4" width="42;" alt="Lucas Sierota"/>
</a>
<a href="https://github.com/michaelkramer" title="Michael Kramer">
  <img src="https://avatars.githubusercontent.com/u/6052223?v=4" width="42;" alt="Michael Kramer"/>
</a>
<a href="https://github.com/peterj" title="Peter Jausovec">
  <img src="https://avatars.githubusercontent.com/u/11080940?v=4" width="42;" alt="Peter Jausovec"/>
</a>
<a href="https://github.com/phillipb" title="Phillip Burch">
  <img src="https://avatars.githubusercontent.com/u/1482089?v=4" width="42;" alt="Phillip Burch"/>
</a>
<a href="https://github.com/toresbe" title="Tore Sinding Bekkedal">
  <img src="https://avatars.githubusercontent.com/u/1761606?v=4" width="42;" alt="Tore Sinding Bekkedal"/>
</a>
<a href="https://github.com/valenfv" title="Valentin">
  <img src="https://avatars.githubusercontent.com/u/34139820?v=4" width="42;" alt="Valentin"/>
</a>
<a href="https://github.com/jmtes" title="juno tesoro">
  <img src="https://avatars.githubusercontent.com/u/38450133?v=4" width="42;" alt="juno tesoro"/>
</a>
<a href="https://github.com/juspky" title="juspky">
  <img src="https://avatars.githubusercontent.com/u/11074890?v=4" width="42;" alt="juspky"/>
</a>
<a href="https://github.com/ryicoh" title="ryicoh">
  <img src="https://avatars.githubusercontent.com/u/37844673?v=4" width="42;" alt="ryicoh"/>
</a>
<a href="https://github.com/wj0990" title="wangjie">
  <img src="https://avatars.githubusercontent.com/u/8792016?v=4" width="42;" alt="wangjie"/>
</a><!--AUTO_GENERATED_PLEASE_DONT_DELETE_IT-END-->

Made with [github-action-contributors](https://github.com/jaywcjlove/github-action-contributors).

### License

Licensed under the MIT License.
