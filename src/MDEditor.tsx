import React from 'react';
import classnames from 'classnames';
import { ReactMarkdownProps } from 'react-markdown';
import { IProps } from './Type';
import TextArea, { ITextAreaProps } from './components/TextArea';
import Toolbar from './components/Toolbar';
import DragBar from './components/DragBar';
import MarkdownPreview from './components/Markdown';
import { getCommands, TextAreaCommandOrchestrator, ICommand, CommandOrchestrator } from './commands';
import './index.less';
import './markdowncolor.less';
import './markdown.less';

export interface MDEditorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>, IProps {
  /**
   * The Markdown value.
   */
  value?: string;
  /**
   * Event handler for the `onChange` event.
   */
  onChange?: (value: string) => void;
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
  preview?: 'live' | 'edit' | 'preview';
  fullscreen?: boolean;
  /**
   * Maximum drag height. `visiableDragbar=true`
   */
  maxHeight?: number;
  previewOptions?: ReactMarkdownProps;
  /**
   * Minimum drag height. `visiableDragbar=true`
   */
  minHeight?: number;
  /**
   * You can create your own commands or reuse existing commands.
   */
  commands?: ICommand[];
}

export interface IMDEditorState {
  height: React.CSSProperties['height'];
  preview?: MDEditorProps['preview'];
  fullscreen?: boolean;
  value?: string;
}

export class MDEditor extends React.PureComponent<MDEditorProps, IMDEditorState> {
  static Markdown = MarkdownPreview;
  public static displayName = 'MDEditor';
  public preview = React.createRef<MarkdownPreview>();
  public textarea = React.createRef<TextArea>();
  public commandOrchestrator!: CommandOrchestrator;
  public static defaultProps: MDEditorProps = {
    value: '',
    prefixCls: 'w-md-editor',
    height: 200,
    minHeight: 100,
    maxHeight: 1200,
    visiableDragbar: true,
    preview: 'live',
    fullscreen: false,
    commands: getCommands(),
  }
  public constructor(props: MDEditorProps) {
    super(props);
    this.state = {
      height: props.height,
      preview: props.preview,
      fullscreen: props.fullscreen,
      value: props.value,
    };
  }
  public componentDidMount() {
    this.handleChange(this.state.value);
    this.commandOrchestrator = new TextAreaCommandOrchestrator(this.textarea.current!.text.current as HTMLTextAreaElement);
  }
  public UNSAFE_componentWillReceiveProps(nextProps: MDEditorProps) {
    if (nextProps.preview !== this.props.preview) {
      this.setState({ preview: nextProps.preview });
    }
    if (nextProps.fullscreen !== this.props.fullscreen) {
      this.setState({ fullscreen: nextProps.fullscreen });
    }
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value }, () => {
        this.handleChange(nextProps.value);
      });
    }
  }
  private handleChange(mdStr?: string) {
    const { onChange } = this.props;
    this.preview.current!.renderHTML(mdStr);
    onChange && onChange(mdStr || '');
  }
  public handleCommand = (command: ICommand) => {
    if (command.keyCommand === 'preview') {
      this.setState({ preview: command.value as IMDEditorState['preview'] });
    }
    if (command.keyCommand === 'fullscreen') {
      this.setState({ fullscreen: !this.state.fullscreen });
      document.body.style.overflow = this.state.fullscreen ? 'initial' : 'hidden';
    }
    this.commandOrchestrator.executeCommand(command);
  }
  public render() {
    const { prefixCls, className, value, commands, height, visiableDragbar, preview, fullscreen, previewOptions, maxHeight, minHeight, autoFocus, onChange, ...other } = this.props;
    const cls = classnames(className, prefixCls, {
      [`${prefixCls}-show-${this.state.preview}`]: this.state.preview,
      [`${prefixCls}-fullscreen`]: this.state.fullscreen,
    });
    return (
      <div className={cls} style={{ height: this.state.fullscreen ? '100%' : this.state.height }} {...other}>
        <Toolbar
          active={{
            fullscreen: this.state.fullscreen,
            preview: this.state.preview,
          }}
          prefixCls={prefixCls} commands={commands}
          onCommand={this.handleCommand}
        />
        <div
          className={`${prefixCls}-content`}
          style={{ height: this.state.fullscreen ? 'calc(100% - 29px)' : (this.state.height as number) - 29 }}
        >
          <TextArea
            ref={this.textarea}
            className={`${prefixCls}-input`}
            prefixCls={prefixCls}
            value={this.state.value}
            autoFocus={autoFocus}
            onChange={this.handleChange.bind(this)}
          />
          <MarkdownPreview
            {...previewOptions}
            ref={this.preview}
            className={`${prefixCls}-preview`}
          />
          {visiableDragbar && !this.state.fullscreen && (
            <DragBar
              prefixCls={prefixCls}
              height={this.state.height as number}
              maxHeight={maxHeight!}
              minHeight={minHeight!}
              onChange={(newHeight) => {
                this.setState({ height: newHeight });
              }}
            />
          )}
        </div>
      </div>
    )
  }
}
