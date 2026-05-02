import type { CSSProperties, JSX } from 'react';
import type { MarkdownPreviewProps } from '@uiw/react-markdown-preview/nohighlight';
import type { ITextAreaProps } from './components/TextArea/index.nohighlight';
import type { ICommand, TextState } from './commands';
import type { ContextStore, PreviewType } from './Context';

export interface IProps {
  prefixCls?: string;
  className?: string;
}

export interface Statistics extends TextState {
  /** total length of the document */
  length: number;
  /** Get the number of lines in the editor. */
  lineCount: number;
}

export interface MDEditorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>, IProps {
  /**
   * The Markdown value.
   */
  value?: string;
  /**
   * Event handler for the `onChange` event.
   */
  onChange?: (value?: string, event?: React.ChangeEvent<HTMLTextAreaElement>, state?: ContextStore) => void;
  /**
   * editor height change listener
   */
  onHeightChange?: (value?: CSSProperties['height'], oldValue?: CSSProperties['height'], state?: ContextStore) => void;
  /** Some data on the statistics editor. */
  onStatistics?: (data: Statistics) => void;
  /**
   * Can be used to make `Markdown Editor` focus itself on initialization. Defaults to on.
   * it will be set to true when either the source `textarea` is focused,
   * or it has an `autofocus` attribute and no other element is focused.
   */
  autoFocus?: ITextAreaProps['autoFocus'];
  /**
   * Can be used to make `Markdown Editor` focus on the end of text on initialization.
   */
  autoFocusEnd?: boolean;
  /**
   * The height of the editor.
   * ⚠️ `Dragbar` is invalid when **`height`** parameter percentage.
   */
  height?: CSSProperties['height'];
  /**
   * Custom toolbar heigth
   * @default 29px
   *
   * @deprecated toolbar height adaptive: https://github.com/uiwjs/react-md-editor/issues/427
   *
   */
  toolbarHeight?: number;
  /**
   * Show drag and drop tool. Set the height of the editor.
   */
  visibleDragbar?: boolean;
  /**
   * @deprecated use {@link MDEditorProps.visibleDragbar}
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
   * Disable `fullscreen` setting body styles
   */
  overflow?: boolean;
  /**
   * Maximum drag height. `visibleDragbar=true`
   */
  maxHeight?: number;
  /**
   * Minimum drag height. `visibleDragbar=true`
   */
  minHeight?: number;
  /**
   * 配置 markdown 预览的选项，底层传递给 @uiw/react-markdown-preview
   *
   * ⚠️ 安全责任边界：
   *
   * 1. 默认安全行为：
   *    - 当未配置 rehypePlugins 时，会自动注入 rehype-sanitize 提供 XSS 保护
   *    - 使用 rehype-sanitize 的默认 schema（GitHub Flavored Markdown 安全策略）
   *
   * 2. 自定义 rehypePlugins 时的合并规则：
   *    - 规则 A：如果用户已显式配置 rehype-sanitize
   *      → 尊重用户配置，不重复添加，用户自行负责 sanitize 策略
   *    - 规则 B：如果用户配置了其他 rehype 插件但未包含 sanitize
   *      → 将默认 rehype-sanitize 添加到插件数组最前面
   *      → 确保 sanitize 在其他插件处理之前执行
   *
   * 3. 与 MDEditor.Markdown 的区别：
   *    - MDEditor 的 previewOptions 有自动 sanitize 注入机制
   *    - MDEditor.Markdown 静态组件没有此机制，需用户手动配置
   *
   * 4. 安全例外：
   *    - 使用 components.preview 自定义预览组件时，这些选项完全不生效
   *    - 自定义预览组件需自行处理 XSS 风险
   *
   * @example
   * // 使用自定义 sanitize schema（允许 span 标签的 className 属性）
   * import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
   *
   * <MDEditor
   *   previewOptions={{
   *     rehypePlugins: [
   *       [rehypeSanitize, {
   *         ...defaultSchema,
   *         attributes: {
   *           ...defaultSchema.attributes,
   *           span: [...(defaultSchema.attributes?.span || []), ['className']]
   *         }
   *       }]
   *     ]
   *   }}
   * />
   */
  previewOptions?: Omit<MarkdownPreviewProps, 'source'>;
  /**
   * Set the `textarea` related props.
   */
  textareaProps?: ITextAreaProps;
  /**
   * Use div to replace TextArea or re-render TextArea
   * @deprecated Please use {@link components}
   */
  renderTextarea?: ITextAreaProps['renderTextarea'];
  /**
   * 自定义渲染组件的配置
   *
   * ⚠️ 安全责任边界：
   * - 使用自定义组件时，安全责任从库转移到用户
   * - 特别是 components.preview，会绕过默认的 XSS 保护机制
   */
  components?: {
    /** Use div to replace TextArea or re-render TextArea */
    textarea?: ITextAreaProps['renderTextarea'];
    /**
     * Override the default command element
     * _`toolbar`_ < _`command[].render`_
     */
    toolbar?: ICommand['render'];
    /**
     * ⚠️ 安全风险边界：自定义 markdown 预览组件
     *
     * 当使用此选项时，以下安全机制将**完全失效**：
     * 1. previewOptions 中的 rehype-sanitize 自动注入
     * 2. 默认的 @uiw/react-markdown-preview 安全渲染流程
     *
     * 安全责任完全转移：
     * - 此函数接收的 source 是**原始 markdown 源码**
     * - 原始源码可能包含 <script>、javascript:、onerror 等危险内容
     * - 用户必须自行处理 XSS 风险
     *
     * 函数参数说明：
     * @param source - 原始 markdown 源码（未经任何处理）
     * @param state - 编辑器当前状态（ContextStore）
     * @param dispatch - 状态更新函数
     * @returns 自定义渲染的 React 元素
     *
     * ⚠️ 不安全的示例 ❌：
     * ```tsx
     * // 直接使用 dangerouslySetInnerHTML，没有任何 sanitize
     * <MDEditor
     *   components={{
     *     preview: (source) => (
     *       <div dangerouslySetInnerHTML={{ __html: markdownToHtml(source) }} />
     *     )
     *   }}
     * />
     * ```
     *
     * ✅ 安全的示例：
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
     *
     * 何时使用自定义 preview？
     * - 需要完全控制渲染流程（例如：嵌入自定义 React 组件）
     * - 需要支持默认 rehype-sanitize schema 不允许的 HTML 标签
     * - 渲染的内容完全受信任（例如：内部系统、静态内容）
     */
    preview?: (source: string, state: ContextStore, dispath: React.Dispatch<ContextStore>) => JSX.Element;
  };
  /** Theme configuration */
  'data-color-mode'?: 'light' | 'dark';
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
   * If `false`, the `tab` key inserts a tab character into the textarea. If `true`, the `tab` key executes default behavior e.g. focus shifts to next element.
   */
  defaultTabEnable?: boolean;
  /**
   * You can create your own commands or reuse existing commands.
   */
  commands?: ICommand[];
  /**
   * Filter or modify your commands.
   * https://github.com/uiwjs/react-md-editor/issues/296
   */
  commandsFilter?: (command: ICommand, isExtra: boolean) => false | ICommand;
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
  /** Toolbar on bottom */
  toolbarBottom?: boolean;
  /**
   * The **`direction`** property sets the direction of text, table columns, and horizontal overflow. Use `rtl` for languages written from right to left (like Hebrew or Arabic), and `ltr` for those written from left to right (like English and most other languages).
   *
   * https://github.com/uiwjs/react-md-editor/issues/462
   */
  direction?: CSSProperties['direction'];
}
