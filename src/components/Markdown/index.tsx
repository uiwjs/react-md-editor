import React, { Component } from 'react';
import classnames from 'classnames';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import ReactMarkdown, { ReactMarkdownProps } from 'react-markdown';
import allowNode from './allowNode';
import { IProps } from '../../Type';
import { loadLang } from './langs';

export interface IMarkdownPreviewProps extends IProps, Omit<ReactMarkdownProps, 'className'> {
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  onMouseOver?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

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
  componentDidMount() {
    this.highlight();
  }
  UNSAFE_componentWillReceiveProps(nextProps: IMarkdownPreviewProps) {
    if (nextProps.source !== this.props.source) {
      this.setState({ value: nextProps.source }, () => {
        this.highlight();
      });
    }
  }
  public shouldComponentUpdate(nextProps: IMarkdownPreviewProps, nextState: IMarkdownPreviewState) {
    return nextProps.source !== this.props.source
      || nextState.value !== this.state.value;
  }
  public renderHTML(mdStr?: string) {
    this.setState({ value: mdStr }, () => {
      this.highlight();
    });
  }
  public async highlight() {
    if (!this.mdp.current) return;
    const codes = this.mdp.current.getElementsByTagName('code') as unknown as HTMLElement[];
    for (const value of codes) {
      const tag = value.parentNode as HTMLElement;
      if (tag && tag.tagName === 'PRE' && /^language\-/.test(value.className.trim())) {
        const lang = value.className.trim().replace(/^language\-/, '');
        try {
          if (!this.loadedLang.includes(lang as never)) {
            this.loadedLang.push(lang);
            await loadLang(lang);
          }
          await Prism.highlightElement(value);
        } catch (error) { }
      }
    }
  }
  render() {
    const { className, onScroll, onMouseOver, ...other } = this.props;
    const cls = classnames(className, 'wmde-markdown', 'wmde-markdown-color');
    return (
      <div ref={this.mdp} onScroll={onScroll} onMouseOver={onMouseOver} className={cls} >
        <ReactMarkdown escapeHtml={false} allowNode={allowNode} {...other} source={this.state.value} />
      </div>
    );
  }
}