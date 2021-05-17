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
  const { markdown, commands, tabSize, onChange, dispatch } = useContext(EditorContext);
  const textRef = React.createRef<HTMLTextAreaElement>();
  const executeRef = React.useRef<TextAreaCommandOrchestrator>();
  useEffect(() => {
    if (textRef.current && dispatch) {
      const commandOrchestrator = new TextAreaCommandOrchestrator(textRef.current);
      executeRef.current = commandOrchestrator;
      dispatch({ textarea: textRef.current, commandOrchestrator });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return useMemo(
    () => (
      <textarea
        spellCheck={false}
        {...other}
        ref={textRef}
        className={`${prefixCls}-text-input ${other.className ? other.className : ''}`}
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [markdown],
  );
}
