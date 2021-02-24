import React from 'react';
import { ICommand, TextAreaCommandOrchestrator } from './commands';

export type PreviewType = 'live' | 'edit' | 'preview';

export type ContextStore = {
  commands?: ICommand<string>[];
  markdown?: string;
  preview?: PreviewType;
  height?: number;
  fullscreen?: boolean;
  textarea?: HTMLTextAreaElement;
  commandOrchestrator?: TextAreaCommandOrchestrator;
  textareaWarp?: HTMLDivElement;
  textareaPre?: HTMLPreElement;
  container?: HTMLDivElement | null;
  dispatch?: React.Dispatch<ContextStore>;
};

export function reducer(state: ContextStore, action: ContextStore) {
  return { ...state, ...action };
}

export const EditorContext = React.createContext<ContextStore>({ markdown: '' });
