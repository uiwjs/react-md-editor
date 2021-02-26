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
    height: height,
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
      dispatch({ ...stateInit });
    }
  }, []);

  const textarea = React.createRef<TextAreaRef>();
  const selectionRange = useRef<{ count: number; scrollTop: number }>({ count: 0, scrollTop: 0 });
  const cls = classnames(className, prefixCls, {
    [`${prefixCls}-show-${state.preview}`]: state.preview,
    [`${prefixCls}-fullscreen`]: state.fullscreen,
  });
  useMemo(() => props.value !== state.markdown && dispatch({ markdown: props.value }), [props.value]);
  useMemo(() => props.preview !== state.preview && dispatch({ preview: props.preview }), [props.preview]);
  useMemo(() => props.height !== state.height && dispatch({ height: props.height }), [props.height]);
  useMemo(() => props.autoFocus !== state.autoFocus && dispatch({ autoFocus: props.autoFocus }), [props.autoFocus]);
  useMemo(() => props.fullscreen !== state.fullscreen && dispatch({ fullscreen: props.fullscreen }), [
    props.fullscreen,
  ]);

  function handleTextAreaMount(isMount: boolean) {
    // if (textarea.current && textarea.current.text && textarea.current.warp && isMount) {
    //   if (autoFocus) {
    //     textarea.current.text.blur();
    //     textarea.current.text.focus();
    //   }
    //   textarea.current.text.selectionStart = selectionRange.current.count;
    //   textarea.current.text.selectionEnd = selectionRange.current.count;
    //   textarea.current.warp.scrollTo(0, selectionRange.current.scrollTop!);
    // }
  }
  function modifySelectionRange() {
    if (textarea.current && textarea.current.text && textarea.current.warp) {
      selectionRange.current.count = textarea.current.text.selectionStart;
      selectionRange.current.scrollTop = textarea.current.warp.scrollTop;
    }
  }
  // function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
  //   modifySelectionRange();
  //   // setValue(event.target.value!);
  //   onChange && onChange(event.target.value || '');
  // }
  const handleScroll = (e: React.UIEvent<HTMLDivElement>, data: ContextStore = {}) => {
    console.group();
    console.log('>11111>', previewRef.current);
    console.log('>11111>', state.textarea);
    console.log('>11111>', state.textareaWarp);
    console.log('>11111>', data);
    console.groupEnd();
    if (!state.textarea || !previewRef.current || !previewRef.current.mdp.current || !state.textareaWarp) {
      return;
    }
    const previewDom = previewRef.current.mdp.current;
    const textareaDom = state.textareaWarp;
    if (textareaDom && previewDom) {
      const scale =
        (textareaDom.scrollHeight - textareaDom.offsetHeight) / (previewDom.scrollHeight - previewDom.offsetHeight);

      if (e.target === textareaDom) {
        previewDom.scrollTop = textareaDom.scrollTop / scale;
      }
      if (e.target === previewDom) {
        textareaDom.scrollTop = previewDom.scrollTop * scale;
      }
    }
  };
  return (
    <EditorContext.Provider value={{ ...state, dispatch }}>
      <div
        ref={container}
        className={cls}
        onClick={() => dispatch({ barPopup: { ...setGroupPopFalse(state.barPopup) } })}
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
              tabSize={tabSize}
              className={`${prefixCls}-input`}
              prefixCls={prefixCls}
              autoFocus={autoFocus}
              {...textareaProps}
              onScroll={handleScroll}
              // onMouseOver={() => (leftScroll.current = true)}
              // onMouseLeave={() => (leftScroll.current = false)}
              // onMount={handleTextAreaMount}
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
