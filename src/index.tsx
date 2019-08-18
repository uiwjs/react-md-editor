import React from 'react';
import classnames from 'classnames';
import { IProps, ICommand } from './Type';
import TextArea, { ITextAreaProps} from './components/TextArea';
import Toolbar from './components/Toolbar'
import MarkdownPreview from './components/Markdown';
import { getCommands } from './commands';
import './index.less';
import './markdown.less';

export interface IMDEditorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'visble'>, IProps {
  /**
   * The Markdown value.
   */
  value?: string;
  visble?: boolean;
  autoFocus?: ITextAreaProps['autoFocus'];
  height?: React.CSSProperties['height'];
  commands?: ICommand[];
}

export default class MDEditor extends React.PureComponent<IMDEditorProps, {}> {
  public preview = React.createRef<MarkdownPreview>();
  public static displayName = 'MDEditor';
  public static defaultProps: IMDEditorProps = {
    value: '',
    prefixCls: 'w-md-editor',
    commands: getCommands(),
  }
  public componentDidMount() {
    this.handleChange(this.props.value);
  }
  private handleChange(mdStr?: string) {
    this.preview.current!.renderHTML(mdStr);
  }
  public render() {
    const { prefixCls, className, value, visble, commands, height, autoFocus, ...other } = this.props;
    const cls = classnames(className, prefixCls, { });
    return (
      <div className={cls} {...other}>
        <Toolbar prefixCls={prefixCls} commands={commands} />
        <div className={`${prefixCls}-content`}>
          <TextArea
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