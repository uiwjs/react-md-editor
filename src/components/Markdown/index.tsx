import React, { Component } from 'react';
import classnames from 'classnames';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import ReactMarkdown, { ReactMarkdownProps } from 'react-markdown';
import allowNode from './allowNode';
import { IProps } from '../../Type';
import { loadLang } from './langs';

export interface IMarkdownPreviewProps extends IProps, Omit<ReactMarkdownProps, 'className'> { }

export interface IMarkdownPreviewState {
  value?: string;
}

export default class MarkdownPreview extends Component<IMarkdownPreviewProps, IMarkdownPreviewState> {
  public mdp = React.createRef<HTMLDivElement>();
  public loadedLang: string[] = ['markup'];
  public static defaultProps: IMarkdownPreviewProps = {
    renderers: {},
  }
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
  public async highlight() {
    const codes = this.mdp.current!.getElementsByTagName('code');
    for (const value of codes) {
      const tag = value.parentNode as HTMLElement;
      if (tag && tag.tagName === 'PRE' && /^language\-/.test(value.className.trim())) {
        const lang = value.className.trim().replace(/^language\-/, '');
        try {
          if (!this.loadedLang.includes(lang as never)) {
            this.loadedLang.push(lang);
            await loadLang(lang);
          }
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
          allowNode={allowNode}
          {...other}
          source={this.state.value}
        />
      </div>
    );
  }
}