import React, { useContext, useEffect, useMemo } from 'react';
import { IProps } from '../../utils';
import { EditorContext } from '../../Context';
import { TextAreaCommandOrchestrator } from '../../commands';
import handleKeyDown from './handleKeyDown';
import shortcuts from './shortcuts';
import './index.less';

export interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange'>,
    IProps {
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function Textarea(props: TextAreaProps) {
  const { prefixCls, ...other } = props;
  const { markdown, commands, commandOrchestrator, tabSize, onChange, dispatch } = useContext(EditorContext);
  const textRef = React.createRef<HTMLTextAreaElement>();
  const executeRef = React.useRef<TextAreaCommandOrchestrator>();
  useEffect(() => {
    if (textRef.current && dispatch) {
      const commandOrchestrator = new TextAreaCommandOrchestrator(textRef.current);
      executeRef.current = commandOrchestrator;
      dispatch({ textarea: textRef.current, commandOrchestrator });
    }
  }, []);
  return useMemo(
    () => (
      <textarea
        {...other}
        ref={textRef}
        className={`${prefixCls}-text-input`}
        value={markdown}
        onScroll={props.onScroll}
        onKeyDown={(e) => {
          handleKeyDown(e, tabSize);
          shortcuts(e, commands, executeRef.current);
        }}
        onChange={(e) => {
          dispatch && dispatch({ markdown: e.target.value });
          onChange && onChange(e.target.value);
        }}
      />
    ),
    [markdown],
  );
}
