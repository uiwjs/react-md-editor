import React from 'react';
import { ICommand, TextAreaCommandOrchestrator } from './commands';

export type PreviewType = 'live' | 'edit' | 'preview';

export type ContextStore = {
  commands?: ICommand<string>[];
  extraCommands?: ICommand<string>[];
  markdown?: string;
  preview?: PreviewType;
  height?: number;
  fullscreen?: boolean;
  highlightEnable?: boolean;
  autoFocus?: boolean;
  onChange?: (value?: string) => void;
  textarea?: HTMLTextAreaElement;
  commandOrchestrator?: TextAreaCommandOrchestrator;
  textareaWarp?: HTMLDivElement;
  textareaPre?: HTMLPreElement;
  container?: HTMLDivElement | null;
  dispatch?: React.Dispatch<ContextStore>;
  barPopup?: Record<string, boolean>;
  scrollTop?: number;
  scrollTopPreview?: number;
  tabSize?: number;
};

export type ExecuteCommandState = Pick<ContextStore, 'fullscreen' | 'preview' | 'highlightEnable'>;

export function reducer(state: ContextStore, action: ContextStore) {
  return { ...state, ...action };
}

export const EditorContext = React.createContext<ContextStore>({ markdown: '' });
