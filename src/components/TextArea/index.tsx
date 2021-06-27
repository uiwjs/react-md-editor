import React, { useEffect, Fragment, useContext } from 'react';
import { EditorContext, ContextStore } from '../../Context';
import { IProps } from '../../utils';
import Markdown from './Markdown';
import Textarea from './Textarea';
import { MDEditorProps } from '../../Editor';
import './index.less';

type RenderTextareaHandle = {
  dispatch: ContextStore['dispatch'];
  onChange?: MDEditorProps['onChange'];
};

export interface ITextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange' | 'onScroll'>,
    IProps {
  value?: string;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  renderTextarea?: (
    props: React.TextareaHTMLAttributes<HTMLTextAreaElement> | React.HTMLAttributes<HTMLDivElement>,
    opts: RenderTextareaHandle,
  ) => JSX.Element;
}

export type TextAreaRef = {
  text?: HTMLTextAreaElement;
  warp?: HTMLDivElement;
};

export default function TextArea(props: ITextAreaProps) {
  const { prefixCls, className, onScroll, renderTextarea, ...otherProps } = props || {};
  const { markdown, scrollTop, dispatch, onChange } = useContext(EditorContext);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={warp} className={`${prefixCls}-aree ${className || ''}`} onScroll={onScroll}>
      <div className={`${prefixCls}-text`}>
        {renderTextarea ? (
          renderTextarea(
            {
              ...otherProps,
              value: markdown,
              autoComplete: 'off',
              autoCorrect: 'off',
              spellCheck: 'false',
              autoCapitalize: 'off',
              className: `${prefixCls}-text-input`,
              style: {
                WebkitTextFillColor: 'inherit',
                overflow: 'auto',
              },
            },
            { dispatch, onChange },
          )
        ) : (
          <Fragment>
            <Markdown prefixCls={prefixCls} />
            <Textarea prefixCls={prefixCls} {...otherProps} />
          </Fragment>
        )}
      </div>
    </div>
  );
}
