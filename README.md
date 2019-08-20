<p align="center">
  <a href="https://github.com/uiwjs/react-md-editor">
    <img src="https://raw.githubusercontent.com/uiwjs/react-markdown-editor/4884f29f2aad59bf7f512184ba3726d76bbd7170/website/logo.svg?sanitize=true">
  </a>
</p>

<!--dividing-->

<p align="center">
  <a href="https://github.com/uiwjs/react-md-editor/issues">
    <img src="https://img.shields.io/github/issues/uiwjs/react-md-editor.svg">
  </a>
  <a href="https://github.com/uiwjs/react-md-editor/network">
    <img src="https://img.shields.io/github/forks/uiwjs/react-md-editor.svg">
  </a>
  <a href="https://github.com/uiwjs/react-md-editor/stargazers">
    <img src="https://img.shields.io/github/stars/uiwjs/react-md-editor.svg">
  </a>
  <a href="https://github.com/uiwjs/react-md-editor/releases">
    <img src="https://img.shields.io/github/release/uiwjs/react-md-editor.svg">
  </a>
  <a href="https://www.npmjs.com/package/@uiw/react-md-editor">
    <img src="https://img.shields.io/npm/v/@uiw/react-md-editor.svg">
  </a>
</p>

<p align="center">
  A markdown editor with preview, implemented with React.js and TypeScript.  
</p>

## Install

```bash
npm i @uiw/react-md-editor
```

## Using

```jsx
import React from "react";
import ReactDOM from "react-dom";
import MEDitor from '@uiw/react-md-editor';

export default function App() {
  const [value, setValue] = React.useState("**Hello world!!!**");
  return (
    <div className="container">
      <MEDitor
        value={value}
        onChange={setValue}
      />
    </div>
  );
}
```

- [Demo preview for CodeSandbox](https://codesandbox.io/s/markdown-editor-for-react-izdd6)  
- [Demo preview for Github gh-pages](https://uiwjs.github.io/react-md-editor/)  

### Props

- `value: string`: The Markdown value.
- `onChange?: (value: string)`: Event handler for the `onChange` event.
- `commands?: ICommand[]`: An array of `ICommand`, which, each one, contain a `commands` property. If no commands are specified, the default will be used. Commands are explained in more details below.
- `autoFocus?: number=true`: Can be used to make `Markdown Editor` focus itself on initialization.
- `previewOptions?: ReactMarkdown.ReactMarkdownProps`: This is reset [react-markdown](https://github.com/rexxars/react-markdown) settings.
- `height?: number=200`: The height of the editor.
- `visiableDragbar?: boolean=true`: Show drag and drop tool. Set the height of the editor.
- `fullscreen?: boolean=false`: Show markdown preview.
- `preview?: boolean=true`: Show markdown preview.
- `maxHeight?: number=1200`: Maximum drag height. The `visiableDragbar=true` value is valid.
- `minHeights?: number=100`: Minimum drag height. The `visiableDragbar=true` value is valid.

### Development

```bash
npm run watch # Listen compile .tsx files.
npm run build # compile .tsx files.

npm run doc
```

## License

Licensed under the MIT License.