import React, { useEffect, useMemo, useContext } from 'react';
import 'prismjs/components/prism-markdown.js';
import { IProps } from '../../utils';
import { EditorContext, ContextStore } from '../../Context';

import Markdown from './Markdown';
import Textarea from './Textarea';

export interface ITextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange' | 'onScroll'>,
    IProps {
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  value?: string;
}

export type TextAreaRef = {
  text?: HTMLTextAreaElement;
  warp?: HTMLDivElement;
};

export default (props: ITextAreaProps) => {
  const { prefixCls, className, onScroll } = props || {};
  const { scrollTop, dispatch } = useContext(EditorContext);
  const warp = React.createRef<HTMLDivElement>();
  useEffect(() => {
    const state: ContextStore = {};
    if (warp.current) {
      state.textareaWarp = warp.current || undefined;
      warp.current.scrollTop = scrollTop || 0;
    }
    if (dispatch) {
      dispatch({ ...state });
    }
  }, []);
  return useMemo(
    () => (
      <div ref={warp} className={`${prefixCls}-aree ${className || ''}`} onScroll={onScroll}>
        <div className={`${prefixCls}-text`}>
          <Markdown prefixCls={prefixCls} />
          <Textarea prefixCls={prefixCls} />
        </div>
      </div>
    ),
    [],
  );
};
