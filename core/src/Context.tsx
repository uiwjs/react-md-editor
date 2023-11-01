import React from 'react';
import { ICommand, TextAreaCommandOrchestrator } from './commands';
import { MDEditorProps } from './Types';

export type PreviewType = 'live' | 'edit' | 'preview';

export interface ContextStore {
  components?: MDEditorProps['components'];
  commands?: ICommand<string>[];
  extraCommands?: ICommand<string>[];
  markdown?: string;
  preview?: PreviewType;
  height?: React.CSSProperties['height'];
  fullscreen?: boolean;
  highlightEnable?: boolean;
  autoFocus?: boolean;
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
  defaultTabEnable?: boolean;
  [key: string]: any;
}

export type ExecuteCommandState = Pick<ContextStore, 'fullscreen' | 'preview' | 'highlightEnable'>;

export function reducer(state: ContextStore, action: ContextStore) {
  return { ...state, ...action };
}

export const EditorContext = React.createContext<ContextStore>({ markdown: '' });
