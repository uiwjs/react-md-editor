import React, { Component } from 'react';
import classnames from 'classnames';
import ReactMarkdown, { ReactMarkdownProps } from 'react-markdown';
import Code from './Code';
import allowNode from './allowNode';
import { IProps } from '../../Type';


export interface IMarkdownPreviewProps extends IProps, Omit<ReactMarkdownProps, 'className'> {}

export interface IMarkdownPreviewState {
  value?: string;
}

export default class MarkdownPreview extends Component<IMarkdownPreviewProps, IMarkdownPreviewState> {
  public divElm = React.createRef<HTMLDivElement>();
  public constructor(props: IMarkdownPreviewProps) {
    super(props);
    this.state = {
      value: '' || props.source,
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps: IMarkdownPreviewProps) {
    if (nextProps.source !== this.props.source) {
      this.setState({ value: nextProps.source });
    }
  }
  public renderHTML(mdStr?: string) {
    this.setState({ value: mdStr });
  }
  render() {
    const { className, ...other } = this.props;
    return (
      <div className={classnames(className, 'wmde-markdown', 'wmde-markdown-color')}>
        <ReactMarkdown
          escapeHtml={false}
          {...other}
          allowNode={allowNode}
          renderers={{
            code: Code,
          }}
          source={this.state.value}
        />
      </div>
    );
  }
}