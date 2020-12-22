/// <reference types="react-scripts" />

declare module '*.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
