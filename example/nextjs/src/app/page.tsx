'use client';
import dynamic from 'next/dynamic';
import React from 'react';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const initialMarkdown = [
  '# Syntax highlighting',
  '',
  '```js',
  'const answer = 42;',
  'console.log(answer);',
  '```',
].join('\n');

export default function Home() {
  const [value, setValue] = React.useState(initialMarkdown);

  return (
    <main className=" w-auto mx-auto p-4">
      <MDEditor style={{ width: '100%' }} value={value} onChange={setValue} />
    </main>
  );
}
