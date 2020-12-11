import React, { useEffect, useMemo, useRef, useState } from 'react';
import classnames from 'classnames';
import MarkdownPreview, {MarkdownPreviewProps, MarkdownPreviewRef } from '@uiw/react-markdown-preview';
import { IProps } from './utils';
import TextArea, { ITextAreaProps } from './components/TextArea';
import Toolbar from './components/Toolbar';
import DragBar from './components/DragBar';
import { getCommands, TextAreaCommandOrchestrator, ICommand, CommandOrchestrator } from './commands';
import './index.less';

export type PreviewType = 'live' | 'edit' | 'preview';

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
  height?: React.CSSProperties['height'];
  /**
   * Show drag and drop tool. Set the height of the editor.
   */
  visiableDragbar?: boolean;
  /**
   * Show markdown preview.
   */
  preview?: PreviewType;
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

const InternalMDEditor = (props: MDEditorProps, 
  ref?:
    | ((instance: HTMLDivElement) => void)
    | React.RefObject<HTMLDivElement | null>
    | null
  ) => {
  const { prefixCls = 'w-md-editor', className, value: propsValue, commands = getCommands(), height: heightWarp = 200, visiableDragbar = true, preview: previewType = 'live', fullscreen: isfullscreen, previewOptions, textareaProps, maxHeight = 1200, minHeight = 100, autoFocus, tabSize = 2, onChange, hideToolbar, ...other } = props || {};
  const [value, setValue] = useState<string>(propsValue || '')
  const [preview, setPreview] = useState<PreviewType>(previewType);
  const [isFullscreen, setIsFullscreen] = useState(isfullscreen || false);
  
  const leftScroll = useRef(false);
  const previewRef = React.createRef<MarkdownPreviewRef>()

  const [height, setHeight] = useState(heightWarp);
  const textarea = React.createRef<TextArea>();
  const commandOrchestrator = useRef<TextAreaCommandOrchestrator>()
  const cls = classnames(className, prefixCls, {
    [`${prefixCls}-show-${preview}`]: preview,
    [`${prefixCls}-fullscreen`]: isFullscreen,
  });

  useEffect(() => {
    commandOrchestrator.current = new TextAreaCommandOrchestrator((textarea.current!.text.current || null) as HTMLTextAreaElement);
  }, []);

  useMemo(() => preview !== props.preview && props.preview && setPreview(props.preview!), [props.preview]);
  useMemo(() => value !== props.value && setValue(props.value!), [props.value]);
  useMemo(() => height !== props.height && setHeight(heightWarp!), [heightWarp]);

  function handleChange(mdStr?: string) {
    setValue(mdStr!);
    onChange && onChange(mdStr || '');
  }
  function handleCommand(command: ICommand) {
    if (command.keyCommand === 'preview') {
      setPreview(command.value as PreviewType);
    }
    if (command.keyCommand === 'fullscreen') {
      setIsFullscreen(!isFullscreen);
      document.body.style.overflow = isFullscreen ? 'initial' : 'hidden';
    }
    commandOrchestrator.current!.executeCommand(command);
  }
  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    if (!textarea.current || !previewRef.current || !previewRef.current.mdp.current || !textarea.current.warp) {
      return;
    }
    const previewDom = previewRef.current.mdp.current! as HTMLDivElement;
    const textareaDom = textarea.current.warp.current! as HTMLDivElement;
    if (textareaDom && previewDom) {
      const scale = (textareaDom.scrollHeight - textareaDom.offsetHeight) / (previewDom.scrollHeight - previewDom.offsetHeight);
      if (e.target === textareaDom && leftScroll.current) {
        previewDom.scrollTop = textareaDom.scrollTop / scale;
      }
      if (e.target === previewDom && !leftScroll.current) {
        textareaDom.scrollTop = previewDom.scrollTop * scale;
      }
    }
  }
  const mdProps = {
    ...previewOptions,
    ref: previewRef,
    onScroll: handleScroll,
    source: value,
  } as unknown as MarkdownPreviewProps;
  return (
    <div className={cls} style={{ height: isFullscreen ? '100%' : hideToolbar ? Number(height) - 29 : height }} {...other}>
      {!hideToolbar && <Toolbar
        active={{
          fullscreen: isFullscreen,
          preview: preview,
        }}
        prefixCls={prefixCls}
        commands={commands}
        onCommand={handleCommand}
      />}
      <div
        className={`${prefixCls}-content`}
        style={{ height: isFullscreen ? 'calc(100% - 29px)' : Number(height) - 29 }}
      >
        {/(edit|live)/.test(preview as string) && (
          <TextArea
            ref={textarea}
            tabSize={tabSize}
            className={`${prefixCls}-input`}
            prefixCls={prefixCls}
            value={value}
            autoFocus={autoFocus}
            {...textareaProps}
            onScroll={handleScroll}
            onMouseOver={() => leftScroll.current = true}
            onMouseLeave={() => leftScroll.current = false}
            onChange={handleChange}
          />
        )}
        {/(live|preview)/.test(preview as string) && (
          <MarkdownPreview {...mdProps} className={`${prefixCls}-preview`}/>
        )}
        {visiableDragbar && !isFullscreen && (
          <DragBar
            prefixCls={prefixCls}
            height={height as number}
            maxHeight={maxHeight!}
            minHeight={minHeight!}
            onChange={(newHeight) => {
              setHeight(newHeight);
            }}
          />
        )}
      </div>
    </div>
  )
}

const MDEditor = React.forwardRef<HTMLDivElement, MDEditorProps>(InternalMDEditor);

type MDEditor = typeof MDEditor & {
  Markdown: typeof MarkdownPreview;
};

(MDEditor as MDEditor).Markdown = MarkdownPreview;

export default MDEditor as MDEditor;
