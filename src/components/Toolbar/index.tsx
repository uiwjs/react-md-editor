import React, { Component } from 'react';
import { ICommand, IProps } from '../../Type';
import './index.less';

export interface IToolbarProps extends IProps {
  onCommand?: (command: ICommand) => void;
  commands: ICommand[];
}

export default class Toolbar extends Component<IToolbarProps> {
  public static defaultProps: IToolbarProps = {
    commands: [],
  }
  handleClick = (command: ICommand) => {
    const { onCommand } = this.props;
    onCommand && onCommand(command);
  }
  render() {
    const { prefixCls, commands } = this.props;
    return (
      <div className={`${prefixCls}-toolbar`}>
        <ul>
          {commands.map((item, idx) => {
            if (item.keyCommand === 'divider') {
              return <li key={idx} className={`${prefixCls}-toolbar-divider`} />
            }
            return (
              <li key={idx}>
                {React.createElement('button', {
                  "data-name": item.name, ...item.buttonProps,
                  onClick: this.handleClick.bind(this, item)
                }, item.icon)}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}