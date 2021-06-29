import React, { useEffect, useReducer, useMemo, useRef, useImperativeHandle } from 'react';
import MarkdownPreview, { MarkdownPreviewProps, MarkdownPreviewRef } from '@uiw/react-markdown-preview';
import { IProps } from './utils';
import TextArea, { ITextAreaProps } from './components/TextArea';
import Toolbar from './components/Toolbar';
import DragBar from './components/DragBar';
import { getCommands, getExtraCommands, ICommand } from './commands';
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
   * Custom toolbar heigth
   * @default 29px
   */
  toolbarHeight?: number;
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
  /** Use div to replace TextArea or re-render TextArea */
  renderTextarea?: ITextAreaProps['renderTextarea'];
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
   * You can create your own commands or reuse existing commands.
   */
  extraCommands?: ICommand[];
  /**
   * Hide the tool bar
   */
  hideToolbar?: boolean;
  /** Whether to enable scrolling */
  enableScroll?: boolean;
}

function setGroupPopFalse(data: Record<string, boolean> = {}) {
  Object.keys(data).forEach((keyname) => {
    data[keyname] = false;
  });
  return data;
}

const InternalMDEditor = (
  props: MDEditorProps,
  ref?: ((instance: ContextStore) => void) | React.RefObject<ContextStore> | null,
) => {
  const {
    prefixCls = 'w-md-editor',
    className,
    value: propsValue,
    commands = getCommands(),
    extraCommands = getExtraCommands(),
    height = 200,
    toolbarHeight = 29,
    enableScroll = true,
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
    renderTextarea,
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
    extraCommands,
    fullscreen,
    onChange,
    barPopup: {},
  });
  const container = useRef<HTMLDivElement>(null);
  const previewRef = useRef<MarkdownPreviewRef>(null);
  const enableScrollRef = useRef(enableScroll);

  useImperativeHandle(ref, () => ({ ...state }));
  useMemo(() => (enableScrollRef.current = enableScroll), [enableScroll]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cls = [
    className,
    prefixCls,
    state.preview ? `${prefixCls}-show-${state.preview}` : null,
    state.fullscreen ? `${prefixCls}-fullscreen` : null,
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  useMemo(
    () => propsValue !== state.markdown && dispatch({ markdown: propsValue || '' }),
    [propsValue, state.markdown],
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => previewType !== state.preview && dispatch({ preview: previewType }), [previewType]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => height !== state.height && dispatch({ height: height }), [height]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => tabSize !== state.tabSize && dispatch({ tabSize }), [tabSize]);
  useMemo(
    () => highlightEnable !== state.highlightEnable && dispatch({ highlightEnable }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [highlightEnable],
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => autoFocus !== state.autoFocus && dispatch({ autoFocus: autoFocus }), [autoFocus]);
  useMemo(
    () => fullscreen !== state.fullscreen && dispatch({ fullscreen: fullscreen }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fullscreen],
  );

  const textareaDomRef = useRef<HTMLDivElement>();
  const active = useRef<'text' | 'preview'>('preview');
  const initScroll = useRef(false);

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

  const handleScroll = (e: React.UIEvent<HTMLDivElement>, type: 'text' | 'preview') => {
    if (!enableScrollRef.current) return;
    const textareaDom = textareaDomRef.current;
    const previewDom = previewRef.current ? previewRef.current.mdp.current : undefined;
    if (!initScroll.current) {
      active.current = type;
      initScroll.current = true;
    }
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
  };

  return (
    <EditorContext.Provider value={{ ...state, dispatch }}>
      <div
        ref={container}
        className={cls}
        {...other}
        onClick={() => {
          dispatch({ barPopup: { ...setGroupPopFalse(state.barPopup) } });
        }}
        style={{
          ...other.style,
          height: state.fullscreen ? '100%' : hideToolbar ? Number(state.height) - toolbarHeight : state.height,
        }}
      >
        {!hideToolbar && <Toolbar prefixCls={prefixCls} height={toolbarHeight} />}
        <div
          className={`${prefixCls}-content`}
          style={{
            height: state.fullscreen ? `calc(100% - ${toolbarHeight}px)` : Number(state.height) - toolbarHeight,
          }}
        >
          {/(edit|live)/.test(state.preview || '') && (
            <TextArea
              className={`${prefixCls}-input`}
              prefixCls={prefixCls}
              autoFocus={autoFocus}
              {...textareaProps}
              renderTextarea={renderTextarea}
              onScroll={(e) => handleScroll(e, 'text')}
            />
          )}
          {/(live|preview)/.test(state.preview || '') && (
            <MarkdownPreview
              {...(previewOptions as unknown)}
              onScroll={(e) => handleScroll(e, 'preview')}
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

const mdEditor = React.forwardRef<ContextStore, MDEditorProps>(InternalMDEditor);

type MDEditor = typeof mdEditor & {
  Markdown: typeof MarkdownPreview;
};

(mdEditor as MDEditor).Markdown = MarkdownPreview;

export default mdEditor as MDEditor;
