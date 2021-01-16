import React, { Component } from 'react';
import classnames from 'classnames';
import Prism from 'prismjs';
import 'prismjs/components/prism-markdown.js';
import { IProps } from '../../utils';
import hotkeys, { IHotkeyOptions } from './hotkeys';
import './index.less';

export interface ITextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange' | 'onScroll'>, IProps {
  onChange?: (value?: string) => void;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  value?: string;
  tabSize?: number;
}

export interface ITextAreaState {
  value?: string;
}

export default class TextArea extends Component<ITextAreaProps, ITextAreaState> {
  public preElm = React.createRef<HTMLPreElement>();
  public warp = React.createRef<HTMLDivElement>();
  public text = React.createRef<HTMLTextAreaElement>();
  public static defaultProps: ITextAreaProps = {
    tabSize: 2,
    autoFocus: true,
    spellCheck: false,
  }
  public static state: ITextAreaState;
  public constructor(props: ITextAreaProps) {
    super(props);
    this.state = {
      value: props.value || '',
    };
  }
  private handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const { onChange } = this.props;
    this.setState({ value: e.target.value }, () => {
      onChange && onChange(this.state.value);
      this.highlight();
    });
  }
  public componentDidMount() {
    if (this.props.autoFocus && this.text.current) {
      this.text.current.focus();
    }
    this.highlight();
  }
  componentDidUpdate(prevProps: ITextAreaProps) {
    if (this.props.value !== prevProps.value) {
      this.setState({ value: this.props.value }, this.highlight);
    }
  }
  public shouldComponentUpdate(nextProps: ITextAreaProps, nextState: ITextAreaState) {
    return nextProps.value !== this.props.value || nextState.value !== this.state.value;
  }
  public async highlight() {
    const { value } = this.state;
    const pre = this.preElm.current;
    const html = Prism.highlight(value as string, Prism.languages.markdown, 'markdown');
    pre!.innerHTML = `${html}<br />`;
  }
  render() {
    const { prefixCls, className, onChange, onScroll, tabSize, style, ...otherProps } = this.props;
    return (
      <div ref={this.warp} className={classnames(`${prefixCls}-aree`, className)} onScroll={onScroll}>
        <div className={classnames(`${prefixCls}-text`)}>
          <pre
            ref={this.preElm}
            className={classnames(`${prefixCls}-text-pre`, 'wmde-markdown-color')}
          />
          <textarea
            {...otherProps}
            ref={this.text}
            onKeyDown={hotkeys.bind(this, { tabSize } as IHotkeyOptions)}
            className={`${prefixCls}-text-input`}
            value={this.state.value}
            onChange={this.handleChange.bind(this)}
          />
        </div>
      </div>
    );
  }
}