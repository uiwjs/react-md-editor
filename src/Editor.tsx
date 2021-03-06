import React, { useEffect, useReducer, useMemo, useRef } from 'react';
import classnames from 'classnames';
import MarkdownPreview, { MarkdownPreviewProps, MarkdownPreviewRef } from '@uiw/react-markdown-preview';
import { IProps } from './utils';
import TextArea, { ITextAreaProps, TextAreaRef } from './components/TextArea';
import Toolbar from './components/Toolbar';
import DragBar from './components/DragBar';
import { getCommands, ICommand } from './commands';
import { reducer, EditorContext, ContextStore, PreviewType } from './Context';
import './index.less';

export interface MDEditorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>, IProps {
  /**
   * The Markdown value.
   */
  value?: string;
  /**
   * Event handler for the `onChange` event.
   */
  onChange?: (value?: string) => void;
  /**
   * Can be used to make `Markdown Editor` focus itself on initialization. Defaults to on.
   * it will be set to true when either the source `textarea` is focused,
   * or it has an `autofocus` attribute and no other element is focused.
   */
  autoFocus?: ITextAreaProps['autoFocus'];
  /**
   * The height of the editor.
   */
  height?: number;
  /**
   * Show drag and drop tool. Set the height of the editor.
   */
  visiableDragbar?: boolean;
  /**
   * Show markdown preview.
   */
  preview?: PreviewType;
  /**
   * Full screen display editor.
   */
  fullscreen?: boolean;
  /**
   * Maximum drag height. `visiableDragbar=true`
   */
  maxHeight?: number;
  /**
   * Minimum drag height. `visiableDragbar=true`
   */
  minHeight?: number;
  /**
   * This is reset [react-markdown](https://github.com/rexxars/react-markdown) settings.
   */
  previewOptions?: Omit<MarkdownPreviewProps, 'source'>;
  /**
   * Set the `textarea` related props.
   */
  textareaProps?: ITextAreaProps;
  /**
   * Disable editing area code highlighting. The value is `false`, which increases the editing speed.
   * @default true
   */
  highlightEnable?: boolean;
  /**
   * The number of characters to insert when pressing tab key.
   * Default `2` spaces.
   */
  tabSize?: number;
  /**
   * You can create your own commands or reuse existing commands.
   */
  commands?: ICommand[];
  /**
   * Hide the tool bar
   */
  hideToolbar?: boolean;
}

function setGroupPopFalse(data: Record<string, boolean> = {}) {
  Object.keys(data).forEach((keyname) => {
    data[keyname] = false;
  });
  return data;
}

const InternalMDEditor = (
  props: MDEditorProps,
  ref?: ((instance: HTMLDivElement) => void) | React.RefObject<HTMLDivElement | null> | null,
) => {
  const {
    prefixCls = 'w-md-editor',
    className,
    value: propsValue,
    commands = getCommands(),
    height = 200,
    visiableDragbar = true,
    highlightEnable = true,
    preview: previewType = 'live',
    fullscreen = false,
    previewOptions = {},
    textareaProps,
    maxHeight = 1200,
    minHeight = 100,
    autoFocus,
    tabSize = 2,
    onChange,
    hideToolbar,
    ...other
  } = props || {};
  let [state, dispatch] = useReducer(reducer, {
    markdown: propsValue,
    preview: previewType,
    height,
    highlightEnable,
    tabSize,
    scrollTop: 0,
    scrollTopPreview: 0,
    commands,
    fullscreen,
    onChange,
    barPopup: {},
  });
  const container = useRef<HTMLDivElement>(null);
  const previewRef = useRef<MarkdownPreviewRef>(null);
  useEffect(() => {
    const stateInit: ContextStore = {};
    if (container.current) {
      stateInit.container = container.current || undefined;
    }
    stateInit.markdown = propsValue || '';
    stateInit.barPopup = {};
    if (dispatch) {
      dispatch({ ...state, ...stateInit });
    }
  }, []);

  const cls = classnames(className, prefixCls, {
    [`${prefixCls}-show-${state.preview}`]: state.preview,
    [`${prefixCls}-fullscreen`]: state.fullscreen,
  });
  useMemo(() => propsValue !== state.markdown && dispatch({ markdown: propsValue }), [propsValue]);
  useMemo(() => previewType !== state.preview && dispatch({ preview: previewType }), [previewType]);
  useMemo(() => height !== state.height && dispatch({ height: height }), [height]);
  useMemo(() => tabSize !== state.tabSize && dispatch({ tabSize }), [tabSize]);
  useMemo(() => highlightEnable !== state.highlightEnable && dispatch({ highlightEnable }), [highlightEnable]);
  useMemo(() => autoFocus !== state.autoFocus && dispatch({ autoFocus: autoFocus }), [autoFocus]);
  useMemo(() => fullscreen !== state.fullscreen && dispatch({ fullscreen: fullscreen }), [fullscreen]);

  const textareaDomRef = useRef<HTMLDivElement>();
  const previewDomRef = useRef<HTMLDivElement>();
  const active = useRef<'text' | 'preview'>();
  useMemo(() => {
    if (previewRef.current) {
      previewDomRef.current = previewRef.current.mdp.current || undefined;
    }
  }, [previewRef.current]);

  useMemo(() => {
    textareaDomRef.current = state.textareaWarp;
    if (state.textareaWarp) {
      state.textareaWarp.addEventListener('mouseover', () => {
        active.current = 'text';
      });
      state.textareaWarp.addEventListener('mouseleave', () => {
        active.current = 'preview';
      });
    }
  }, [state.textareaWarp]);

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const textareaDom = textareaDomRef.current;
    const previewDom = previewDomRef.current;
    if (textareaDom && previewDom) {
      const scale =
        (textareaDom.scrollHeight - textareaDom.offsetHeight) / (previewDom.scrollHeight - previewDom.offsetHeight);
      if (e.target === textareaDom && active.current === 'text') {
        previewDom.scrollTop = textareaDom.scrollTop / scale;
      }
      if (e.target === previewDom && active.current === 'preview') {
        textareaDom.scrollTop = previewDom.scrollTop * scale;
      }
      let scrollTop = 0;
      if (active.current === 'text') {
        scrollTop = textareaDom.scrollTop || 0;
      } else if (active.current === 'preview') {
        scrollTop = previewDom.scrollTop || 0;
      }
      dispatch({ scrollTop });
    }
  }
  return (
    <EditorContext.Provider value={{ ...state, dispatch }}>
      <div
        ref={container}
        className={cls}
        onClick={() => {
          dispatch({ barPopup: { ...setGroupPopFalse(state.barPopup) } });
        }}
        style={{ height: state.fullscreen ? '100%' : hideToolbar ? Number(state.height) - 29 : state.height }}
        {...other}
      >
        {!hideToolbar && <Toolbar prefixCls={prefixCls} />}
        <div
          className={`${prefixCls}-content`}
          style={{ height: state.fullscreen ? 'calc(100% - 29px)' : Number(state.height) - 29 }}
        >
          {/(edit|live)/.test(state.preview || '') && (
            <TextArea
              className={`${prefixCls}-input`}
              prefixCls={prefixCls}
              autoFocus={autoFocus}
              {...textareaProps}
              onScroll={handleScroll}
            />
          )}
          {/(live|preview)/.test(state.preview || '') && (
            <MarkdownPreview
              {...(previewOptions as unknown)}
              onScroll={handleScroll}
              ref={previewRef}
              source={state.markdown || ''}
              className={`${prefixCls}-preview`}
            />
          )}
        </div>
        {visiableDragbar && !state.fullscreen && (
          <DragBar
            prefixCls={prefixCls}
            height={state.height as number}
            maxHeight={maxHeight!}
            minHeight={minHeight!}
            onChange={(newHeight) => {
              dispatch({ height: newHeight });
            }}
          />
        )}
      </div>
    </EditorContext.Provider>
  );
};

const MDEditor = React.forwardRef<HTMLDivElement, MDEditorProps>(InternalMDEditor);

type MDEditor = typeof MDEditor & {
  Markdown: typeof MarkdownPreview;
};

(MDEditor as MDEditor).Markdown = MarkdownPreview;

export default MDEditor as MDEditor;
