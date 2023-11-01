import React, { useEffect, Fragment, useContext } from 'react';
import { EditorContext, ContextStore, ExecuteCommandState } from '../../Context';
import shortcuts from './shortcuts';
import Textarea, { TextAreaProps } from './Textarea';
import { IProps } from '../../Types';
import { TextAreaCommandOrchestrator, ICommand } from '../../commands';
import './index.less';

type RenderTextareaHandle = {
  dispatch: ContextStore['dispatch'];
  onChange?: TextAreaProps['onChange'];
  useContext?: {
    commands: ContextStore['commands'];
    extraCommands: ContextStore['extraCommands'];
    commandOrchestrator?: TextAreaCommandOrchestrator;
  };
  shortcuts?: (
    e: KeyboardEvent | React.KeyboardEvent<HTMLTextAreaElement>,
    commands: ICommand[],
    commandOrchestrator?: TextAreaCommandOrchestrator,
    dispatch?: React.Dispatch<ContextStore>,
    state?: ExecuteCommandState,
  ) => void;
};

export interface ITextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onScroll'>,
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
  const { markdown, scrollTop, commands, extraCommands, dispatch } = useContext(EditorContext);
  const textRef = React.useRef<HTMLTextAreaElement>(null);
  const executeRef = React.useRef<TextAreaCommandOrchestrator>();
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

  useEffect(() => {
    if (textRef.current && dispatch) {
      const commandOrchestrator = new TextAreaCommandOrchestrator(textRef.current);
      executeRef.current = commandOrchestrator;
      dispatch({ textarea: textRef.current, commandOrchestrator });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const textStyle: React.CSSProperties = { WebkitTextFillColor: 'initial', overflow: 'auto' };

  return (
    <div ref={warp} className={`${prefixCls}-area ${className || ''}`} onScroll={onScroll}>
      <div className={`${prefixCls}-text`}>
        {renderTextarea ? (
          React.cloneElement(
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
              {
                dispatch,
                onChange: otherProps.onChange,
                shortcuts,
                useContext: { commands, extraCommands, commandOrchestrator: executeRef.current },
              },
            ),
            {
              ref: textRef,
            },
          )
        ) : (
          <Fragment>
            <Textarea prefixCls={prefixCls} {...otherProps} style={textStyle} />
          </Fragment>
        )}
      </div>
    </div>
  );
}
