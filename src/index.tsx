import React from 'react';
import classnames from 'classnames';
import { IProps, ICommand, CommandOrchestrator } from './Type';
import TextArea, { ITextAreaProps} from './components/TextArea';
import Toolbar from './components/Toolbar';
import DragBar from './components/DragBar';
import MarkdownPreview from './components/Markdown';
import { getCommands, TextAreaCommandOrchestrator } from './commands';
import './index.less';
import './markdown.less';

export interface IMDEditorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>, IProps {
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
   * Maximum drag height. `visiableDragbar=true`
   */
  maxHeight?: number;
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
}

export default class MDEditor extends React.PureComponent<IMDEditorProps, IMDEditorState> {
  public static displayName = 'MDEditor';
  public preview = React.createRef<MarkdownPreview>();
  public textarea = React.createRef<TextArea>();
  public commandOrchestrator!: CommandOrchestrator;
  public static defaultProps: IMDEditorProps = {
    value: '',
    prefixCls: 'w-md-editor',
    minHeight: 100,
    maxHeight: 1200,
    visiableDragbar: true,
    commands: getCommands(),
  }
  public constructor(props: IMDEditorProps) {
    super(props);
    this.state = {
      height: props.height,
    };
  }
  public componentDidMount() {
    this.handleChange(this.props.value);
    this.commandOrchestrator = new TextAreaCommandOrchestrator(this.textarea.current!.text.current as HTMLTextAreaElement);
  }
  private handleChange(mdStr?: string) {
    const { onChange } = this.props;
    this.preview.current!.renderHTML(mdStr);
    onChange && onChange(mdStr || '');
  }
  handleCommand = (command: ICommand) => {
    this.commandOrchestrator.executeCommand(command);
  }
  public render() {
    const { prefixCls, className, value, commands, height, visiableDragbar, maxHeight, minHeight, autoFocus, onChange, ...other } = this.props;
    const cls = classnames(className, prefixCls, { });
    return (
      <div className={cls} {...other}>
        <Toolbar
          prefixCls={prefixCls} commands={commands}
          onCommand={this.handleCommand}
        />
        <div className={`${prefixCls}-content`}>
          <TextArea
            ref={this.textarea}
            className={`${prefixCls}-input`}
            prefixCls={prefixCls}
            height={this.state.height}
            value={value}
            autoFocus={autoFocus}
            onChange={this.handleChange.bind(this)}
          />
          <MarkdownPreview
            ref={this.preview}
            className={`${prefixCls}-preview`}
          />
          {visiableDragbar && (
            <DragBar
              prefixCls={prefixCls}
              height={this.state.height as number}
              maxHeight={maxHeight!}
              minHeight={minHeight!}
              onChange={(height) => {
                this.setState({ height });
              }}
            />
          )}
        </div>
      </div>
    )
  }
}