'use client';
import dynamic from 'next/dynamic';
import React from 'react';
import type { ContextStore } from '@uiw/react-md-editor';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });
type OnChange = (value?: string, event?: React.ChangeEvent<HTMLTextAreaElement>, state?: ContextStore) => void;

export default function Home() {
  const [value, setValue] = React.useState('**Hello world!!!**');

  const onChange = React.useCallback<OnChange>((val) => {
    setValue(val || '');
  }, []);
  return (
    <main className=" w-auto mx-auto p-4">
      <MDEditor style={{ width: '100%' }} value={value} onChange={onChange} />
    </main>
  );
}
