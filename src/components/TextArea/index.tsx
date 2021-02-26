import React, { useEffect, useMemo, useContext } from 'react';
import classnames from 'classnames';
import 'prismjs/components/prism-markdown.js';
import { IProps } from '../../utils';
import './index.less';
import { EditorContext, ContextStore } from '../../Context';

import Markdown from './Markdown';
import Textarea from './Textarea';

export interface ITextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange' | 'onScroll'>,
    IProps {
  // onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  // onMount?: (isMount: boolean) => void;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  value?: string;
  tabSize?: number;
}

export type TextAreaRef = {
  text?: HTMLTextAreaElement;
  warp?: HTMLDivElement;
};

export default (props: ITextAreaProps) => {
  const { prefixCls, className, onScroll } = props || {};
  const { dispatch } = useContext(EditorContext);
  const warp = React.createRef<HTMLDivElement>();
  useEffect(() => {
    const state: ContextStore = {};
    if (warp.current) {
      state.textareaWarp = warp.current || undefined;
    }
    if (dispatch) {
      dispatch({ ...state });
    }
  }, []);
  return useMemo(
    () => (
      <div ref={warp} className={classnames(`${prefixCls}-aree`, className)} onScroll={onScroll}>
        <div className={classnames(`${prefixCls}-text`)}>
          <Markdown prefixCls={prefixCls} />
          <Textarea prefixCls={prefixCls} />
        </div>
      </div>
    ),
    [],
  );
};
