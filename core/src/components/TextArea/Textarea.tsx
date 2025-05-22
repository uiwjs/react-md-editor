import React, { useContext, useEffect } from 'react';
import { IProps } from '../../Types';
import { EditorContext, ExecuteCommandState } from '../../Context';
import { TextAreaCommandOrchestrator } from '../../commands/';
import handleKeyDown from './handleKeyDown';
import shortcuts from './shortcuts';
import './index.less';

export interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value'>, IProps {}

export default function Textarea(props: TextAreaProps) {
  const { prefixCls, onChange, ...other } = props;
  const {
    markdown,
    commands,
    fullscreen,
    preview,
    highlightEnable,
    extraCommands,
    tabSize,
    defaultTabEnable,
    autoFocusEnd,
    textareaWarp,
    dispatch,
    ...otherStore
  } = useContext(EditorContext);
  const textRef = React.useRef<HTMLTextAreaElement>(null);
  const executeRef = React.useRef<TextAreaCommandOrchestrator>();
  const statesRef = React.useRef<ExecuteCommandState>({ fullscreen, preview });

  useEffect(() => {
    statesRef.current = { fullscreen, preview, highlightEnable };
  }, [fullscreen, preview, highlightEnable]);

  useEffect(() => {
    if (textRef.current && dispatch) {
      const commandOrchestrator = new TextAreaCommandOrchestrator(textRef.current);
      executeRef.current = commandOrchestrator;
      dispatch({ textarea: textRef.current, commandOrchestrator });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (autoFocusEnd && textRef.current && textareaWarp) {
      textRef.current.focus();
      const length = textRef.current.value.length;
      textRef.current.setSelectionRange(length, length);
      setTimeout(() => {
        if (textareaWarp) {
          textareaWarp.scrollTop = textareaWarp.scrollHeight;
        }
        if (textRef.current) {
          textRef.current.scrollTop = textRef.current.scrollHeight;
        }
      }, 0);
    }
  }, [textareaWarp]);

  const onKeyDown = (e: KeyboardEvent | React.KeyboardEvent<HTMLTextAreaElement>) => {
    handleKeyDown(e, tabSize, defaultTabEnable);
    shortcuts(e, [...(commands || []), ...(extraCommands || [])], executeRef.current, dispatch, statesRef.current);
  };
  useEffect(() => {
    if (textRef.current) {
      textRef.current.addEventListener('keydown', onKeyDown);
    }
    return () => {
      if (textRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        textRef.current.removeEventListener('keydown', onKeyDown);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <textarea
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      {...other}
      ref={textRef}
      className={`${prefixCls}-text-input ${other.className ? other.className : ''}`}
      value={markdown}
      onChange={(e) => {
        dispatch && dispatch({ markdown: e.target.value });
        onChange && onChange(e);
      }}
    />
  );
}
