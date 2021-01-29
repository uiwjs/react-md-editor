import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import classnames from 'classnames';
import MarkdownPreview, { MarkdownPreviewProps, MarkdownPreviewRef } from '@uiw/react-markdown-preview';
import { IProps } from './utils';
import TextArea, { ITextAreaProps, TextAreaRef } from './components/TextArea';
import Toolbar from './components/Toolbar';
import DragBar from './components/DragBar';
import { getCommands, TextAreaCommandOrchestrator, ICommand } from './commands';
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

function setGroupPopFalse(data: Record<string, boolean>) {
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
    height: heightWarp = 200,
    visiableDragbar = true,
    preview: previewType = 'live',
    fullscreen: isfullscreen,
    previewOptions,
    textareaProps,
    maxHeight = 1200,
    minHeight = 100,
    autoFocus,
    tabSize = 2,
    onChange,
    hideToolbar,
    ...other
  } = props || {};
  const [value, setValue] = useState<string>(propsValue || '');
  const [preview, setPreview] = useState<PreviewType>(previewType);
  const [isFullscreen, setIsFullscreen] = useState(isfullscreen || false);
  const [groupPop, setGroupPop] = useState<Record<string, boolean>>({});

  const leftScroll = useRef(false);
  const previewRef = React.createRef<MarkdownPreviewRef>();

  const [height, setHeight] = useState(heightWarp);
  const textarea = React.createRef<TextAreaRef>();
  const commandOrchestrator = useRef<TextAreaCommandOrchestrator>();
  const selectionRange = useRef<{ count: number; scrollTop: number }>({ count: 0, scrollTop: 0 });

  const cls = classnames(className, prefixCls, {
    [`${prefixCls}-show-${preview}`]: preview,
    [`${prefixCls}-fullscreen`]: isFullscreen,
  });

  const commandOrchestratorHandle = () => {
    if (textarea.current && textarea.current.text) {
      commandOrchestrator.current = new TextAreaCommandOrchestrator(
        (textarea.current.text || null) as HTMLTextAreaElement,
      );
    }
    return commandOrchestrator.current;
  };

  useMemo(() => preview !== props.preview && props.preview && setPreview(props.preview!), [props.preview]);
  useMemo(() => value !== props.value && setValue(props.value!), [props.value]);
  useMemo(() => height !== props.height && setHeight(heightWarp!), [heightWarp]);
  function handleTextAreaMount(isMount: boolean) {
    if (textarea.current && textarea.current.text && textarea.current.warp && isMount) {
      textarea.current.text.blur();
      textarea.current.text.focus();
      textarea.current.text.selectionStart = selectionRange.current.count;
      textarea.current.text.selectionEnd = selectionRange.current.count;
      textarea.current.warp.scrollTo(0, selectionRange.current.scrollTop!);
    }
  }
  function modifySelectionRange() {
    if (textarea.current && textarea.current.text && textarea.current.warp) {
      selectionRange.current.count = textarea.current.text.selectionStart;
      selectionRange.current.scrollTop = textarea.current.warp.scrollTop;
    }
  }
  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    modifySelectionRange();
    setValue(event.target.value!);
    onChange && onChange(event.target.value || '');
  }
  function handleCommand(command: ICommand, groupName?: string) {
    commandOrchestratorHandle();
    modifySelectionRange();
    if (command.keyCommand === 'preview') {
      setPreview(command.value as PreviewType);
    }
    if (command.keyCommand === 'fullscreen') {
      setIsFullscreen(!isFullscreen);
      document.body.style.overflow = isFullscreen ? 'initial' : 'hidden';
    }
    if (command.keyCommand === 'group') {
      setGroupPop({ ...setGroupPopFalse(groupPop), [`${groupName}`]: true });
    }
    if (groupName && command.keyCommand !== 'group') {
      setGroupPop({ ...groupPop, [`${groupName}`]: false });
    }
    commandOrchestrator.current && commandOrchestrator.current!.executeCommand(command);
  }
  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    if (!textarea.current || !previewRef.current || !previewRef.current.mdp.current || !textarea.current.warp) {
      return;
    }
    const previewDom = previewRef.current.mdp.current;
    const textareaDom = textarea.current.warp;
    if (textareaDom && previewDom) {
      const scale =
        (textareaDom.scrollHeight - textareaDom.offsetHeight) / (previewDom.scrollHeight - previewDom.offsetHeight);
      if (e.target === textareaDom && leftScroll.current) {
        previewDom.scrollTop = textareaDom.scrollTop / scale;
      }
      if (e.target === previewDom && !leftScroll.current) {
        textareaDom.scrollTop = previewDom.scrollTop * scale;
      }
    }
  }
  const chestratorObj = useMemo(() => commandOrchestratorHandle(), [textarea.current, commandOrchestrator.current]);
  const mdProps = ({
    ...previewOptions,
    ref: previewRef,
    onScroll: handleScroll,
    source: value,
  } as unknown) as MarkdownPreviewProps;
  return (
    <Fragment>
      <div
        className={cls}
        onClick={() => setGroupPop({ ...setGroupPopFalse(groupPop) })}
        style={{ height: isFullscreen ? '100%' : hideToolbar ? Number(height) - 29 : height }}
        {...other}
      >
        {!hideToolbar && (
          <Toolbar
            active={{
              fullscreen: isFullscreen,
              preview: preview,
              ...groupPop,
            }}
            prefixCls={prefixCls}
            commands={commands}
            commandHelp={{
              getState: commandOrchestrator.current && commandOrchestrator.current!.getState,
              textApi: commandOrchestrator.current && commandOrchestrator.current!.textApi,
              ...chestratorObj,
            }}
            onCommand={handleCommand}
          />
        )}
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
              onMouseOver={() => (leftScroll.current = true)}
              onMouseLeave={() => (leftScroll.current = false)}
              onMount={handleTextAreaMount}
              onChange={handleChange}
            />
          )}
          {/(live|preview)/.test(preview as string) && (
            <MarkdownPreview {...mdProps} className={`${prefixCls}-preview`} />
          )}
        </div>
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
    </Fragment>
  );
};

const MDEditor = React.forwardRef<HTMLDivElement, MDEditorProps>(InternalMDEditor);

type MDEditor = typeof MDEditor & {
  Markdown: typeof MarkdownPreview;
};

(MDEditor as MDEditor).Markdown = MarkdownPreview;

export default MDEditor as MDEditor;
