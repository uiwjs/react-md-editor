/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare module '*.md' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

  const src: string;
  export default src;
}

declare module '*.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
