import React, { useContext, useEffect, useMemo } from 'react';
import { IProps } from '../../utils';
import { EditorContext } from '../../Context';
import { TextAreaCommandOrchestrator } from '../../commands';
import './index.less';

export interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange'>,
    IProps {
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  // onMount?: (isMount: boolean) => void;
  // onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  // tabSize?: number;
}

export default function Textarea(props: TextAreaProps) {
  const { prefixCls, ...other } = props;
  const { markdown, onChange, dispatch } = useContext(EditorContext);
  const textRef = React.createRef<HTMLTextAreaElement>();
  useEffect(() => {
    if (textRef.current && dispatch) {
      const commandOrchestrator = new TextAreaCommandOrchestrator(textRef.current);
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
        // onKeyDown={hotkeys.bind(this, { tabSize } as IHotkeyOptions)}
        onChange={(e) => {
          dispatch && dispatch({ markdown: e.target.value });
          onChange && onChange(e.target.value);
        }}
      />
    ),
    [markdown],
  );
}
