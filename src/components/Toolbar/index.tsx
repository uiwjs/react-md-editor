import React from 'react';
import classnames from 'classnames';
import { IProps } from '../../utils';
import { ICommand } from '../../commands';
import './index.less';

export interface IToolbarProps<T> extends IProps {
  onCommand?: (command: ICommand<T>) => void;
  commands?: ICommand<T>[];
  active?: {
    [key: string]: any,
  },
}

export default function Toolbar<T>(props: IToolbarProps<T> = {}) {
  const { prefixCls, commands = [], active } = props;
  function handleClick(command: ICommand<T>) {
    const { onCommand } = props;
    onCommand && onCommand(command);
  }
  return (
    <div className={`${prefixCls}-toolbar`}>
      <ul>
        {commands.map((item, idx) => {
          if (item.keyCommand === 'divider') {
            return <li key={idx} {...item.liProps} className={`${prefixCls}-toolbar-divider`} />
          }
          const activeBtn = active && (item.value ? active[item.keyCommand] && active[item.keyCommand] === item.value : active[item.keyCommand]); 
          return (
            <li key={idx} {...item.liProps} className={classnames({ active: activeBtn })}>
              {!item.buttonProps && item.icon}
              {item.buttonProps && React.createElement('button', {
                type: 'button',
                disabled: active && active.preview && active.preview === 'preview' && !/(preview|fullscreen)/.test(item.keyCommand),
                "data-name": item.name, ...item.buttonProps,
                onClick: () =>  handleClick(item)
              }, item.icon)}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
