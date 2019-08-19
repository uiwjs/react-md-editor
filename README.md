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
  <b>Markdown Editor for React</b>
</p>

<p align="center">
  A markdown editor with preview, implemented with React.js and TypeScript.
</p>

## Install

```bash
npm i @uiw/react-md-editor
```

### Props

- `value: string`: The Markdown value.
- `commands?: ICommand[]`: An array of `ICommand`, which, each one, contain a `commands` property. If no commands are specified, the default will be used. Commands are explained in more details below.
- `height?: number=200`: The height of the editor.
- `autoFocus?: number=true`: Can be used to make `Markdown Editor` focus itself on initialization.

### Development

```bash
npm run watch # Listen compile .tsx files.
npm run build # compile .tsx files.

npm run doc
```

## License

Licensed under the MIT License.