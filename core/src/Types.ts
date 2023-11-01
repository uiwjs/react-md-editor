import type { CSSProperties } from 'react';
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
   * @deprecated use `visibleDragbar`
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
   * This is reset [react-markdown](https://github.com/rexxars/react-markdown) settings.
   */
  previewOptions?: Omit<MarkdownPreviewProps, 'source'>;
  /**
   * Set the `textarea` related props.
   */
  textareaProps?: ITextAreaProps;
  /**
   * Use div to replace TextArea or re-render TextArea
   * @deprecated Please use ~~`renderTextarea`~~ -> `components`
   */
  renderTextarea?: ITextAreaProps['renderTextarea'];
  /**
   * re-render element
   */
  components?: {
    /** Use div to replace TextArea or re-render TextArea */
    textarea?: ITextAreaProps['renderTextarea'];
    /**
     * Override the default command element
     * _`toolbar`_ < _`command[].render`_
     */
    toolbar?: ICommand['render'];
    /** Custom markdown preview */
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
