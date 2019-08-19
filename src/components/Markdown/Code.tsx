import React from 'react';
// import Prism from 'prismjs';

export type ICode = {
  language: string;
  value: string;
}

export default function Code({ language, value }: ICode) {
  return (
    <pre className={`language-${language}`}>
      <code>{value}</code>
    </pre>
  );
}
