import React, { Component } from 'react';
import classnames from 'classnames';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-bash';
import ReactMarkdown, { ReactMarkdownProps } from 'react-markdown';
import Code from './Code';
import allowNode from './allowNode';
import { IProps } from '../../Type';

export interface IMarkdownPreviewProps extends IProps, Omit<ReactMarkdownProps, 'className'> {}

export interface IMarkdownPreviewState {
  value?: string;
}

export default class MarkdownPreview extends Component<IMarkdownPreviewProps, IMarkdownPreviewState> {
  public mdp = React.createRef<HTMLDivElement>();
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
    this.setState({ value: mdStr }, () => {
      this.highlight();
    });
  }
  public highlight() {
    const codes = this.mdp.current!.getElementsByTagName('code');
    for (const value of codes) {
      const tag = value.parentNode as HTMLElement;
      if (tag && tag.tagName === 'PRE' && value.dataset.lang) {
        try {
          Prism.highlightElement(value);
        } catch (error) {}
      }
    }
  }
  render() {
    const { className, ...other } = this.props;
    return (
      <div ref={this.mdp} className={classnames(className, 'wmde-markdown', 'wmde-markdown-color')}>
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