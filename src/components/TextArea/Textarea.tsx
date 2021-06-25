import React, { useContext, useEffect } from 'react';
import { IProps } from '../../utils';
import { EditorContext, ExecuteCommandState, ContextStore } from '../../Context';
import { TextAreaCommandOrchestrator } from '../../commands';
import handleKeyDown from './handleKeyDown';
import shortcuts from './shortcuts';
import { MDEditorProps } from '../../Editor';
import './index.less';

type RenderTextareaHandle = {
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export interface ReRenderTextAreaProps {
  renderTextarea?: (
    props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    opts: RenderTextareaHandle,
  ) => JSX.Element;
}

export interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value'>, IProps {}

export default function Textarea(props: TextAreaProps & ReRenderTextAreaProps) {
  const { prefixCls, renderTextarea, ...other } = props;
  const { markdown, commands, fullscreen, preview, highlightEnable, extraCommands, tabSize, onChange, dispatch } =
    useContext(EditorContext);
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

  const onKeyDown = (e: KeyboardEvent | React.KeyboardEvent<HTMLTextAreaElement>) => {
    handleKeyDown(e, tabSize);
    shortcuts(e, [...(commands || []), ...(extraCommands || [])], executeRef.current, dispatch, statesRef.current);
  };
  useEffect(() => {
    if (textRef.current && !renderTextarea) {
      textRef.current.addEventListener('keydown', onKeyDown);
    }
    return () => {
      if (textRef.current && !renderTextarea) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        textRef.current.removeEventListener('keydown', onKeyDown);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch && dispatch({ markdown: e.target.value });
    onChange && onChange(e.target.value);
  };

  if (renderTextarea) {
    return React.cloneElement(
      renderTextarea(
        {
          ...other,
          spellCheck: false,
          className: `${prefixCls}-text-input ${other.className ? other.className : ''}`,
          value: markdown || '',
        },
        { handleChange },
      ),
      {
        ref: textRef,
      },
    );
  }

  return (
    <textarea
      spellCheck={false}
      {...other}
      ref={textRef}
      className={`${prefixCls}-text-input ${other.className ? other.className : ''}`}
      value={markdown}
      onChange={handleChange}
    />
  );
}
