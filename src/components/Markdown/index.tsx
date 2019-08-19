import React, { Component } from 'react';
import classnames from 'classnames';
import Prism from 'prismjs';
import MarkdownIt, { Options} from 'markdown-it';
import { IProps } from '../../Type';


export interface IMarkdownPreviewProps extends IProps, React.HTMLAttributes<HTMLDivElement> {
  mitOptions?: Options;
}

export default class MarkdownPreview extends Component<IMarkdownPreviewProps> {
  public divElm = React.createRef<HTMLDivElement>();
  public md: any;
  public componentDidMount() {
    const { mitOptions } = this.props;
    this.md = new MarkdownIt({
      html: true,
      typographer: false,
      ...mitOptions,
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
  }
  public renderHTML(mdStr?: string) {
    console.log('this.md:', this.md);
    const htmlStr = this.md.render(mdStr || '');
    this.divElm.current!.innerHTML = htmlStr;
  }
  render() {
    const { className, ...other } = this.props;
    return (
      <div ref={this.divElm} className={classnames(className, 'wmde-markdown', 'wmde-markdown-color')} {...other} />
    );
  }
}