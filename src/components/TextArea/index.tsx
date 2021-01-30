import React, { useEffect, useImperativeHandle, useMemo, useState } from 'react';
import classnames from 'classnames';
import Prism from 'prismjs';
import 'prismjs/components/prism-markdown.js';
import { IProps } from '../../utils';
import hotkeys, { IHotkeyOptions } from './hotkeys';
import './index.less';

export interface ITextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange' | 'onScroll'>,
    IProps {
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onMount?: (isMount: boolean) => void;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  value?: string;
  tabSize?: number;
}

export type TextAreaRef = {
  text?: HTMLTextAreaElement;
  warp?: HTMLDivElement;
};

export default React.forwardRef<TextAreaRef, ITextAreaProps>((props, ref) => {
  const { prefixCls, className, onChange, onMount, onScroll, tabSize, style, ...otherProps } = props || {};
  const warp = React.createRef<HTMLDivElement>();
  const preElm = React.createRef<HTMLPreElement>();
  const textElm = React.createRef<HTMLTextAreaElement>();
  useImperativeHandle<TextAreaRef, {}>(ref, () => ({ text: textElm.current, warp: warp.current }), [
    warp.current,
    textElm.current,
  ]);
  const [value, setValue] = useState(props.value);
  const highlight = () => {
    const pre = preElm.current;
    const html = Prism.highlight(value as string, Prism.languages.markdown, 'markdown');
    pre!.innerHTML = `${html}<br />`;
  };
  useEffect(() => {
    onMount && onMount(true);
    return () => {
      onMount && onMount(false);
    };
  }, []);
  useEffect(() => {
    if (props.value !== value) {
      setValue(props.value);
    }
  }, [props.value]);

  useEffect(() => highlight(), [value]);
  useEffect(() => {
    if (props.autoFocus && textElm.current) {
      textElm.current.focus();
    }
  }, [props.autoFocus]);
  return (
    <div ref={warp} className={classnames(`${prefixCls}-aree`, className)} onScroll={onScroll}>
      <div className={classnames(`${prefixCls}-text`)}>
        <pre ref={preElm} className={classnames(`${prefixCls}-text-pre`, 'wmde-markdown-color')} />
        <textarea
          {...otherProps}
          ref={textElm}
          onKeyDown={hotkeys.bind(this, { tabSize } as IHotkeyOptions)}
          className={`${prefixCls}-text-input`}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onChange && onChange(e);
          }}
        />
      </div>
    </div>
  );
});
