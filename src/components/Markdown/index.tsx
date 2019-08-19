import React, { Component } from 'react';
import classnames from 'classnames';
import ReactMarkdown from 'react-markdown';
import Code from './Code';
import allowNode from './allowNode';
import { IProps } from '../../Type';


export interface IMarkdownPreviewProps extends IProps, React.HTMLAttributes<HTMLDivElement> {
}

export interface IMarkdownPreviewState {
  value?: string;
}

export default class MarkdownPreview extends Component<IMarkdownPreviewProps, IMarkdownPreviewState> {
  public divElm = React.createRef<HTMLDivElement>();
  public constructor(props: IMarkdownPreviewProps) {
    super(props);
    this.state = {
      value: '',
    };
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