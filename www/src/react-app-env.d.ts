/// <reference types="react-scripts" />

declare var VERSION: string;

declare module '*.md' {
  import { CodeBlockData } from 'markdown-react-code-preview-loader';
  const src: CodeBlockData;
  export default src;
}
