import React, { Component } from 'react';
import { IProps} from '../../Type';
import './index.less';

export interface IDragBarProps extends IProps {
  height: number;
  maxHeight: number;
  minHeight: number;
  onChange: (value: number) => void;
}

export default class DragBar extends Component<IDragBarProps> {
  public drag?: { height: number, dragY: number };
  handleMouseMove = (event: MouseEvent) => {
    if (this.drag) {
      const newHeight = this.drag.height + event.clientY - this.drag.dragY;
      if (newHeight >= this.props.minHeight && newHeight <= this.props.maxHeight) {
        this.props.onChange(this.drag.height + (event.clientY - this.drag.dragY));
      }
    }
  }
  handleMouseUp = () => {
    this.drag = undefined;
  }
  handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.drag = {
      height: this.props.height,
      dragY: event.clientY
    };
  }
  componentDidMount() {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }
  render() {
    const { prefixCls } = this.props
    return (
      <div className={`${prefixCls}-bar`} onMouseDown={this.handleMouseDown}>
        <svg viewBox="0 0 512 512" height="100%">
          <path fill="currentColor" d="M304 256c0 26.5-21.5 48-48 48s-48-21.5-48-48 21.5-48 48-48 48 21.5 48 48zm120-48c-26.5 0-48 21.5-48 48s21.5 48 48 48 48-21.5 48-48-21.5-48-48-48zm-336 0c-26.5 0-48 21.5-48 48s21.5 48 48 48 48-21.5 48-48-21.5-48-48-48z" />
        </svg>
      </div>
    );
  }
}