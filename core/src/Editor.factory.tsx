import React, { useEffect, useReducer, useMemo, useRef, useImperativeHandle } from 'react';
import rehypeSanitize from 'rehype-sanitize';
import { ToolbarVisibility } from './components/Toolbar/';
import DragBar from './components/DragBar/';
import { getCommands, getExtraCommands, type ICommand, type TextState, TextAreaCommandOrchestrator } from './commands/';
import { reducer, EditorContext, type ContextStore } from './Context';
import type { MDEditorProps } from './Types';

type RehypePlugin = any;
type RehypePluginTuple = [RehypePlugin, any];
type RehypePluginItem = RehypePlugin | RehypePluginTuple;

/**
 * 安全检查函数：检查插件数组中是否已包含 rehype-sanitize
 * 用于避免重复添加 sanitize 插件
 *
 * 安全责任边界：
 * - 此函数仅用于检测，不修改任何插件配置
 * - 检测逻辑支持两种插件形式：直接函数引用 或 [函数, 配置] 元组
 *
 * @param plugins - rehype 插件数组
 * @returns 是否包含 rehypeSanitize 插件
 */
function containsRehypeSanitize(plugins: RehypePluginItem[]): boolean {
  return plugins.some((plugin) => {
    if (Array.isArray(plugin)) {
      return plugin[0] === rehypeSanitize;
    }
    return plugin === rehypeSanitize;
  });
}

/**
 * 【核心安全函数】合并 previewOptions 并确保 XSS 保护
 *
 * ⚠️ 安全责任边界声明 ⚠️
 *
 * 1. 默认行为（安全）：
 *    - 当用户未提供 previewOptions 或未配置 rehypePlugins 时
 *    - 自动注入默认 rehype-sanitize 插件提供 XSS 保护
 *    - 使用 rehype-sanitize 的默认 schema（GitHub Flavored Markdown 安全策略）
 *
 * 2. 用户自定义 previewOptions 合并规则：
 *    - 规则 A：如果用户已在 rehypePlugins 中显式配置了 rehype-sanitize
 *      → 尊重用户配置，不重复添加，用户自行负责 sanitize 策略
 *    - 规则 B：如果用户配置了其他 rehypePlugins 但未包含 sanitize
 *      → 将默认 rehype-sanitize 添加到插件数组最前面
 *      → 确保 sanitize 在其他插件处理之前执行
 *    - 规则 C：用户通过 previewOptions 传入的其他选项（如 className）保持不变
 *
 * 3. 安全例外（需用户自行负责）：
 *    - 使用 components.preview 自定义预览组件时，此函数完全不生效
 *    - 自定义预览组件接收原始 markdown 源码，用户需自行处理 XSS 风险
 *    - MDEditor.Markdown 静态组件不使用此函数，无默认 XSS 保护
 *
 * @param previewOptions - 用户传入的预览配置选项
 * @returns 合并后的安全配置选项
 */
function mergePreviewOptionsWithSanitize(
  previewOptions: MDEditorProps['previewOptions'],
): MDEditorProps['previewOptions'] {
  // 情况 1：用户完全未提供 previewOptions → 使用默认安全配置
  if (!previewOptions) {
    return { rehypePlugins: [rehypeSanitize] };
  }

  const { rehypePlugins, ...restOptions } = previewOptions;

  // 情况 2：用户提供了 previewOptions 但未配置 rehypePlugins → 添加默认 sanitize
  if (rehypePlugins === undefined) {
    return { ...restOptions, rehypePlugins: [rehypeSanitize] };
  }

  // 情况 3：用户配置了 rehypePlugins 数组
  if (Array.isArray(rehypePlugins)) {
    // 情况 3a：用户已包含 rehype-sanitize → 尊重用户配置，不重复添加
    if (containsRehypeSanitize(rehypePlugins)) {
      return previewOptions;
    }
    // 情况 3b：用户未包含 sanitize → 添加到最前面确保优先执行
    return { ...restOptions, rehypePlugins: [rehypeSanitize, ...rehypePlugins] };
  }

  // 情况 4：用户配置了单个 rehype 插件 → 在其前面添加默认 sanitize
  return { ...restOptions, rehypePlugins: [rehypeSanitize, rehypePlugins] };
}

function setGroupPopFalse(data: Record<string, boolean> = {}) {
  Object.keys(data).forEach((keyname) => {
    data[keyname] = false;
  });
  return data;
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
        previewOptions = {},
        textareaProps,
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

      /**
       * ⚠️ 安全边界：合并后的 previewOptions 已包含默认 XSS 保护
       *
       * 此 mergedPreviewOptions 用于默认的 PreviewComponent（@uiw/react-markdown-preview）。
       * 只要用户不使用自定义 preview 组件，XSS 保护就会自动生效。
       *
       * 详细合并规则见 mergePreviewOptionsWithSanitize 函数注释。
       */
      const mergedPreviewOptions = useMemo(() => mergePreviewOptionsWithSanitize(previewOptions), [previewOptions]);

      const previewClassName = `${prefixCls}-preview ${mergedPreviewOptions.className || ''}`;
      const handlePreviewScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => handleScroll(e, 'preview');

      /**
       * 默认预览渲染路径（安全）：
       * - 使用 @uiw/react-markdown-preview 组件
       * - 传入 mergedPreviewOptions，其中包含 rehype-sanitize 提供 XSS 保护
       * - markdown 源码经过 sanitize 处理后再渲染
       */
      let mdPreview = useMemo(
        () => (
          <div ref={previewRef} className={previewClassName}>
            <PreviewComponent {...mergedPreviewOptions} onScroll={handlePreviewScroll} source={state.markdown || ''} />
          </div>
        ),
        [previewClassName, mergedPreviewOptions, state.markdown],
      );

      /**
       * ⚠️ 安全风险边界：自定义 preview 组件
       *
       * 当用户通过 components.preview 提供自定义预览组件时：
       *
       * 1. 安全责任完全转移给用户
       *    - mergedPreviewOptions 中的 rehype-sanitize 不会被应用
       *    - 自定义组件接收的是原始 markdown 源码（state.markdown）
       *    - 原始源码可能包含 <script>、javascript: 等危险内容
       *
       * 2. 用户必须自行处理 XSS 风险
       *    - 建议在自定义组件中使用 rehype-sanitize 或 DOMPurify
       *    - 或者使用 dangerouslySetInnerHTML 时确保内容已被净化
       *
       * 3. 此设计允许高级用户完全控制渲染流程
       *    - 例如：需要支持自定义 HTML 标签、嵌入特殊组件等场景
       *    - 但代价是用户必须承担安全责任
       *
       * 示例（安全的自定义 preview）：
       * ```tsx
       * import rehypeSanitize from 'rehype-sanitize';
       * import ReactMarkdown from 'react-markdown';
       *
       * <MDEditor
       *   components={{
       *     preview: (source) => (
       *       <ReactMarkdown
       *         rehypePlugins={[rehypeSanitize]}
       *         children={source}
       *       />
       *     )
       *   }}
       * />
       * ```
       */
      const preview = components?.preview && components?.preview(state.markdown || '', state, dispatch);
      if (preview && React.isValidElement(preview)) {
        // 使用用户自定义的 preview 替换默认的安全预览
        // ⚠️ 此时 mergedPreviewOptions 中的 sanitize 配置完全不生效
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
    /**
     * ⚠️ 安全风险边界：MDEditor.Markdown 静态组件
     *
     * 此组件是 @uiw/react-markdown-preview 的直接引用，用途是：
     * - 允许用户在编辑器外部单独渲染 markdown 内容
     * - 提供更轻量的渲染选项，不包含编辑器 UI
     *
     * ⚠️ 重要安全声明：
     * 1. MDEditor.Markdown **没有默认 XSS 保护**
     *    - 与 MDEditor 主组件不同，它不会自动注入 rehype-sanitize
     *    - 这是设计决策：保持底层组件的灵活性，让用户自行决定安全策略
     *
     * 2. 安全责任完全在用户
     *    - 如果渲染的内容来自用户输入或不可信来源，必须手动配置 XSS 保护
     *    - 建议显式传入 rehypePlugins 包含 rehype-sanitize
     *
     * 3. 与 MDEditor 主组件的区别
     *    - MDEditor: 默认安全（自动 sanitize），使用 components.preview 时需注意
     *    - MDEditor.Markdown: 默认不安全，需用户主动配置安全策略
     *
     * 安全使用示例：
     * ```tsx
     * // 不安全用法 ❌
     * <MDEditor.Markdown source={userInput} />
     *
     * // 安全用法 ✅
     * import rehypeSanitize from 'rehype-sanitize';
     * <MDEditor.Markdown
     *   source={userInput}
     *   rehypePlugins={[rehypeSanitize]}
     * />
     * ```
     */
    Markdown: TMarkdownPreview;
  };

  const Editor = InternalMDEditor as EditorComponent;

  /**
   * 将 MarkdownPreview 组件直接赋值给 Editor.Markdown
   *
   * 安全设计考量：
   * - 这是一个"透传"赋值，不添加任何额外的安全层
   * - @uiw/react-markdown-preview 本身不包含默认 XSS 保护
   * - 用户必须通过 rehypePlugins 自行配置安全策略
   *
   * 为什么这样设计？
   * 1. 灵活性：允许高级用户完全控制渲染流程（例如信任的内部内容）
   * 2. 一致性：与 @uiw/react-markdown-preview 的行为保持一致
   * 3. 明确性：让安全责任边界清晰可见
   */
  Editor.Markdown = MarkdownPreview;
  Editor.displayName = 'MDEditor';

  return Editor;
}
