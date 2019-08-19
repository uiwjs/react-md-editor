import React, { Component } from 'react';
import classnames from 'classnames';
import { ICommand, IProps } from '../../Type';
import './index.less';

export interface IToolbarProps extends IProps {
  onCommand?: (command: ICommand) => void;
  commands: ICommand[];
  active?: {
    [key: string]: any,
  },
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
    const { prefixCls, commands, active } = this.props;
    return (
      <div className={`${prefixCls}-toolbar`}>
        <ul>
          {commands.map((item, idx) => {
            if (item.keyCommand === 'divider') {
              return <li key={idx} className={`${prefixCls}-toolbar-divider`} />
            }
            return (
              <li key={idx} className={classnames({ active: active && active[item.keyCommand] })}>
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