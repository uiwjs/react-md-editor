import React, { Component } from 'react';
import { ICommand, IProps } from '../../Type';
import './index.less';

export interface IToolbarProps extends IProps {
  commands: ICommand[];
}

export default class Toolbar extends Component<IToolbarProps> {
  public static defaultProps: IToolbarProps = {
    commands: [],
  }
  render() {
    const { prefixCls, commands } = this.props;
    return (
      <div className={`${prefixCls}-toolbar`}>
        <ul>
          {commands.map((item, idx) => {
            return (
              <li key={idx}>
                {React.createElement('button', {
                  "data-name": item.name,
                })}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}