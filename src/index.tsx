import React from 'react';
import classnames from 'classnames';
import { IProps, ICommand, CommandOrchestrator } from './Type';
import TextArea, { ITextAreaProps} from './components/TextArea';
import Toolbar from './components/Toolbar'
import MarkdownPreview from './components/Markdown';
import { getCommands, TextAreaCommandOrchestrator } from './commands';
import './index.less';
import './markdown.less';

export interface IMDEditorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'visble'>, IProps {
  /**
   * The Markdown value.
   */
  value?: string;
  visble?: boolean;
  /**
   * Can be used to make `Markdown Editor` focus itself on initialization. Defaults to on.
   * it will be set to true when either the source `textarea` is focused,
   * or it has an `autofocus` attribute and no other element is focused.
   */
  autoFocus?: ITextAreaProps['autoFocus'];
  height?: React.CSSProperties['height'];
  /**
   * You can create your own commands or reuse existing commands.
   */
  commands?: ICommand[];
}

export default class MDEditor extends React.PureComponent<IMDEditorProps, {}> {
  public preview = React.createRef<MarkdownPreview>();
  public textarea = React.createRef<TextArea>();
  public commandOrchestrator!: CommandOrchestrator;
  public static displayName = 'MDEditor';
  public static defaultProps: IMDEditorProps = {
    value: '',
    prefixCls: 'w-md-editor',
    commands: getCommands(),
  }
  public componentDidMount() {
    this.handleChange(this.props.value);
    this.commandOrchestrator = new TextAreaCommandOrchestrator(this.textarea.current!.text.current as HTMLTextAreaElement);
  }
  private handleChange(mdStr?: string) {
    this.preview.current!.renderHTML(mdStr);
  }
  handleCommand = (command: ICommand) => {
    this.commandOrchestrator.executeCommand(command);
  }
  public render() {
    const { prefixCls, className, value, visble, commands, height, autoFocus, ...other } = this.props;
    const cls = classnames(className, prefixCls, { });
    return (
      <div className={cls} {...other}>
        <Toolbar prefixCls={prefixCls} commands={commands} onCommand={this.handleCommand} />
        <div className={`${prefixCls}-content`}>
          <TextArea
            ref={this.textarea}
            className={`${prefixCls}-input`}
            prefixCls={prefixCls}
            height={height}
            value={value}
            autoFocus={autoFocus}
            onChange={this.handleChange.bind(this)}
          />
          <MarkdownPreview
            ref={this.preview}
            className={`${prefixCls}-preview`}
          />
        </div>
      </div>
    )
  }
}