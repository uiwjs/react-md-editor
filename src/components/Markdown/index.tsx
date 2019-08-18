import React, { Component } from 'react';
import classnames from 'classnames';
import Prism from 'prismjs';
import MarkdownIt from 'markdown-it';
import { IProps } from '../../Type';

const md = new MarkdownIt({
  typographer: false,
  highlight: (str: string, lang) => {
    switch (lang) {
      case 'jsx': lang = 'javascript'; break;
      default: break;
    }
    if (lang && Prism.languages[lang]) {
      try {
        return Prism.highlight(str, Prism.languages[lang], lang);
      } catch (_) { }
    }
    return '';
  }
});

export interface IMarkdownPreviewProps extends IProps, React.HTMLAttributes<HTMLDivElement> {

}

export default class MarkdownPreview extends Component<IMarkdownPreviewProps> {
  public divElm = React.createRef<HTMLDivElement>();
  public renderHTML(mdStr?: string) {
    const htmlStr = md.render(mdStr || '');
    console.log('~~~::');
    this.divElm.current!.innerHTML = htmlStr;
  }
  render() {
    const { className, ...other } = this.props;
    return (
      <div ref={this.divElm} className={classnames(className, 'wmde-markdown')} {...other} />
    );
  }
}