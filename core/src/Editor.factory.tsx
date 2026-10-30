import React, { useEffect, useLayoutEffect, useReducer, useMemo, useRef, useImperativeHandle } from 'react';
import { ToolbarVisibility } from './components/Toolbar/';
import DragBar from './components/DragBar/';
import { getCommands, getExtraCommands, type ICommand, type TextState, TextAreaCommandOrchestrator } from './commands/';
import { reducer, EditorContext, type ContextStore } from './Context';
import type { MDEditorProps } from './Types';

function setGroupPopFalse(data: Record<string, boolean> = {}) {
  Object.keys(data).forEach((keyname) => {
    data[keyname] = false;
  });
  return data;
}

const DEFAULT_PREVIEW_OPTIONS: NonNullable<MDEditorProps['previewOptions']> = {};

/**
 * Lets the preview render after the textarea on React 18+, so typing in a large
 * document stays responsive. Older React versions render it right away, as before.
 */
const useDeferredValue: <T>(value: T) => T = (React as any).useDeferredValue || ((value) => value);

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const SLOW_PREVIEW_MS = 50;
const MAX_PREVIEW_DELAY_MS = 500;

/**
 * Keeps the preview in step with every keystroke while it renders fast. Once a preview
 * render takes longer than SLOW_PREVIEW_MS, it waits for a pause in typing as long as
 * that render (at most MAX_PREVIEW_DELAY_MS) before updating.
 * https://github.com/uiwjs/react-md-editor/issues/620
 */
function usePreviewSource(markdown: string, previewRenderMs: React.MutableRefObject<number>) {
  const [, rerender] = useReducer((count: number) => count + 1, 0);
  const shownRef = useRef(markdown);
  if (previewRenderMs.current < SLOW_PREVIEW_MS) {
    shownRef.current = markdown;
  }
  useEffect(() => {
    if (shownRef.current === markdown) {
      return;
    }
    const delay = Math.min(previewRenderMs.current, MAX_PREVIEW_DELAY_MS);
    const timer = setTimeout(() => {
      shownRef.current = markdown;
      rerender();
    }, delay);
    return () => clearTimeout(timer);
  }, [markdown, previewRenderMs]);
  return shownRef.current;
}

export interface RefMDEditor extends ContextStore {}

type PreviewComponent = React.ComponentType<any>;
type TextAreaComponent = React.ComponentType<any>;

export function createMDEditor<
  TMarkdownPreview extends PreviewComponent,
  TTextArea extends TextAreaComponent,
>(options: { MarkdownPreview: TMarkdownPreview; TextArea: TTextArea }) {
  const { MarkdownPreview, TextArea } = options;
  const PreviewComponent = MarkdownPreview as React.ComponentType<any>;
  const TextAreaComponent = TextArea as React.ComponentType<any>;

  function TimedPreview(props: { renderMsRef: React.MutableRefObject<number>; [key: string]: any }) {
    const { renderMsRef, ...previewProps } = props;
    const renderStart = performance.now();
    useIsomorphicLayoutEffect(() => {
      renderMsRef.current = performance.now() - renderStart;
    });
    return <PreviewComponent {...previewProps} />;
  }

  const InternalMDEditor = React.forwardRef<RefMDEditor, MDEditorProps>(
    (props: MDEditorProps, ref: React.ForwardedRef<RefMDEditor>) => {
      const {
        prefixCls = 'w-md-editor',
        className,
        value: propsValue,
        commands = getCommands(),
        commandsFilter,
        direction,
        extraCommands = getExtraCommands(),
        height = 200,
        enableScroll = true,
        visibleDragbar = typeof props.visiableDragbar === 'boolean' ? props.visiableDragbar : true,
        highlightEnable = true,
        preview: previewType = 'live',
        fullscreen = false,
        overflow = true,
        previewOptions = DEFAULT_PREVIEW_OPTIONS,
        textareaProps,
        id,
        name,
        required,
        disabled,
        readOnly,
        placeholder,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledBy,
        'aria-describedby': ariaDescribedBy,
        'aria-invalid': ariaInvalid,
        'aria-required': ariaRequired,
        'aria-errormessage': ariaErrorMessage,
        maxHeight = 1200,
        minHeight = 100,
        autoFocus,
        autoFocusEnd = false,
        tabSize = 2,
        defaultTabEnable = false,
        onChange,
        onStatistics,
        onHeightChange,
        hideToolbar,
        toolbarBottom = false,
        components,
        renderTextarea,
        ...other
      } = props || {};
      const cmds = commands
        .map((item) => (commandsFilter ? commandsFilter(item, false) : item))
        .filter(Boolean) as ICommand[];
      const extraCmds = extraCommands
        .map((item) => (commandsFilter ? commandsFilter(item, true) : item))
        .filter(Boolean) as ICommand[];
      let [state, dispatch] = useReducer(reducer, {
        markdown: propsValue,
        preview: previewType,
        components,
        height,
        minHeight,
        highlightEnable,
        tabSize,
        defaultTabEnable,
        scrollTop: 0,
        scrollTopPreview: 0,
        commands: cmds,
        extraCommands: extraCmds,
        fullscreen,
        barPopup: {},
      });
      const container = useRef<HTMLDivElement>(null);
      const previewRef = useRef<HTMLDivElement>(null);
      const enableScrollRef = useRef(enableScroll);

      useImperativeHandle(ref, () => ({ ...state, container: container.current, dispatch }));
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
        'wmde-markdown-var',
        direction ? `${prefixCls}-${direction}` : null,
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
      useMemo(() => tabSize !== state.tabSize && dispatch({ tabSize }), [tabSize]);
      useMemo(
        () => highlightEnable !== state.highlightEnable && dispatch({ highlightEnable }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [highlightEnable],
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
      useMemo(() => autoFocus !== state.autoFocus && dispatch({ autoFocus: autoFocus }), [autoFocus]);
      useMemo(() => autoFocusEnd !== state.autoFocusEnd && dispatch({ autoFocusEnd: autoFocusEnd }), [autoFocusEnd]);
      useMemo(
        () => fullscreen !== state.fullscreen && dispatch({ fullscreen: fullscreen }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [fullscreen],
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
      useMemo(() => height !== state.height && dispatch({ height: height }), [height]);
      useMemo(
        () => height !== state.height && onHeightChange && onHeightChange(state.height, height, state),
        [height, onHeightChange, state],
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
      useMemo(() => commands !== state.commands && dispatch({ commands: cmds }), [props.commands]);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      useMemo(
        () => extraCommands !== state.extraCommands && dispatch({ extraCommands: extraCmds }),
        [props.extraCommands],
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
        const previewDom = previewRef.current ? previewRef.current : undefined;
        if (!initScroll.current) {
          active.current = type;
          initScroll.current = true;
        }
        if (textareaDom && previewDom) {
          const inputRange = Math.max(0, textareaDom.scrollHeight - textareaDom.offsetHeight);
          const previewRange = Math.max(0, previewDom.scrollHeight - previewDom.offsetHeight);
          if (inputRange > 0 && previewRange > 0) {
            if (e.target === textareaDom && active.current === 'text') {
              previewDom.scrollTop = (textareaDom.scrollTop / inputRange) * previewRange;
            }
            if (e.target === previewDom && active.current === 'preview') {
              textareaDom.scrollTop = (previewDom.scrollTop / previewRange) * inputRange;
            }
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

      const previewClassName = `${prefixCls}-preview ${previewOptions.className || ''}`;
      const handlePreviewScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => handleScroll(e, 'preview');
      const previewRenderMs = useRef(0);
      const previewMarkdown = useDeferredValue(usePreviewSource(state.markdown || '', previewRenderMs));
      let mdPreview = useMemo(
        () => (
          <div ref={previewRef} className={previewClassName} onScroll={handlePreviewScroll}>
            <TimedPreview {...previewOptions} renderMsRef={previewRenderMs} source={previewMarkdown} />
          </div>
        ),
        [previewClassName, previewOptions, previewMarkdown],
      );
      const preview = components?.preview && components?.preview(state.markdown || '', state, dispatch);
      if (preview && React.isValidElement(preview)) {
        mdPreview = (
          <div className={previewClassName} ref={previewRef} onScroll={handlePreviewScroll}>
            {preview}
          </div>
        );
      }

      const containerStyle = { ...other.style, height: state.height || '100%' };
      const containerClick = () => dispatch({ barPopup: { ...setGroupPopFalse(state.barPopup) } });
      const dragBarChange = (newHeight: number) => dispatch({ height: newHeight });

      const changeHandle = (evn: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange && onChange(evn.target.value, evn, state);
        if (textareaProps && textareaProps.onChange) {
          textareaProps.onChange(evn);
        }
        if (state.textarea && state.textarea instanceof HTMLTextAreaElement && onStatistics) {
          const obj = new TextAreaCommandOrchestrator(state.textarea!);
          const objState = (obj.getState() || {}) as TextState;
          onStatistics({
            ...objState,
            lineCount: evn.target.value.split('\n').length,
            length: evn.target.value.length,
          });
        }
      };
      return (
        <EditorContext.Provider value={{ ...state, dispatch }}>
          <div ref={container} className={cls} {...other} onClick={containerClick} style={containerStyle}>
            <ToolbarVisibility
              hideToolbar={hideToolbar}
              toolbarBottom={toolbarBottom}
              prefixCls={prefixCls}
              overflow={overflow}
              placement="top"
            />
            <div className={`${prefixCls}-content`}>
              {/(edit|live)/.test(state.preview || '') && (
                <TextAreaComponent
                  className={`${prefixCls}-input`}
                  prefixCls={prefixCls}
                  autoFocus={autoFocus}
                  id={id}
                  name={name}
                  required={required}
                  disabled={disabled}
                  readOnly={readOnly}
                  placeholder={placeholder}
                  aria-label={ariaLabel}
                  aria-labelledby={ariaLabelledBy}
                  aria-describedby={ariaDescribedBy}
                  aria-invalid={ariaInvalid}
                  aria-required={ariaRequired}
                  aria-errormessage={ariaErrorMessage}
                  {...textareaProps}
                  onChange={changeHandle}
                  renderTextarea={components?.textarea || renderTextarea}
                  onScroll={(e: React.UIEvent<HTMLDivElement>) => handleScroll(e, 'text')}
                />
              )}
              {/(live|preview)/.test(state.preview || '') && mdPreview}
            </div>
            {visibleDragbar && !state.fullscreen && (
              <DragBar
                prefixCls={prefixCls}
                height={state.height as number}
                maxHeight={maxHeight!}
                minHeight={minHeight!}
                onChange={dragBarChange}
              />
            )}
            <ToolbarVisibility
              hideToolbar={hideToolbar}
              toolbarBottom={toolbarBottom}
              prefixCls={prefixCls}
              overflow={overflow}
              placement="bottom"
            />
          </div>
        </EditorContext.Provider>
      );
    },
  );

  type EditorComponent = typeof InternalMDEditor & {
    Markdown: TMarkdownPreview;
  };

  const Editor = InternalMDEditor as EditorComponent;
  Editor.Markdown = MarkdownPreview;
  Editor.displayName = 'MDEditor';

  return Editor;
}
