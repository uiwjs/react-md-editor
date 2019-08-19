import React, { Component } from 'react';
import Prism from 'prismjs';
import classnames from 'classnames';
import 'prismjs/components/prism-markdown.min.js';
import { IProps } from '../../Type';
import './index.less';

export interface ITextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'shouldComponentUpdate'>, IProps {
  onChange?: (value?: string) => void;
  height?: React.CSSProperties['height'];
}

export interface ITextAreaState {
  value: ITextAreaProps['value'];
}

export default class TextArea extends Component<ITextAreaProps, ITextAreaState> {
  public preElm = React.createRef<HTMLPreElement>();
  public text = React.createRef<HTMLTextAreaElement>();
  public static defaultProps: ITextAreaProps = {
    autoFocus: true,
    spellCheck: false,
    height: 200,
  }
  public static state: ITextAreaState;
  public constructor(props: ITextAreaProps) {
    super(props);
    this.state = {
      value: props.value,
    };
  }
  private handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const { onChange } = this.props;
    this.setState({ value: e.target.value }, () => {
      this.highlight();
    });
    onChange && onChange(e.target.value);
  }
  public async componentDidMount() {
    this.highlight();
  }
  public UNSAFE_componentWillReceiveProps(nextProps: ITextAreaProps) {
    if (nextProps.value !== this.props.value) {
      this.highlight();
    }
  }
  public shouldComponentUpdate(nextProps: ITextAreaProps, nextState: ITextAreaState) {
    return nextState.value !== this.state.value || nextProps.height !== this.props.height;
  }
  private handleScroll(e: React.UIEvent<HTMLTextAreaElement>) {
    const scrollTop = (e.target as HTMLTextAreaElement).scrollTop;
    this.preElm.current!.scrollTop = scrollTop;
  }
  public async highlight() {
    const { value } = this.state;
    const pre = this.preElm.current;
    const html = Prism.highlight(value as string, Prism.languages.markdown, 'markdown');
    pre!.innerHTML = html;
  }
  render() {
    const { prefixCls, className, onChange, style, height, ...otherProps } = this.props;
    return (
      <div className={classnames(`${prefixCls}-text`, className)}>
        <pre
          ref={this.preElm}
          className={`${prefixCls}-text-pre`}
        />
        <textarea
          {...otherProps}
          ref={this.text}
          onScroll={this.handleScroll.bind(this)}
          style={{ ...style, height }}
          className={`${prefixCls}-text-input`}
          value={this.state.value}
          onChange={this.handleChange.bind(this)}
        />
      </div>
    );
  }
}