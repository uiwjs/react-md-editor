import React from 'react';
import classnames from 'classnames';
import { IProps } from '../../utils';
import { ICommand, ICommandChildHandleParam } from '../../commands';
import Child from './Child';
import './index.less';

export interface IToolbarProps extends IProps {
  onCommand?: (command: ICommand<string>, groupName?: string) => void;
  commands?: ICommand<string>[];
  groupName?: string;
  commandHelp?: ICommandChildHandleParam;
  active?: {
    [key: string]: any,
  },
}

export default function Toolbar(props: IToolbarProps = {}) {
  const { prefixCls, commands = [], commandHelp = {}, active, groupName } = props;
  function handleClick(command: ICommand<string>, name?: string) {
    const { onCommand } = props;
    onCommand && onCommand(command, groupName || name);
  }
  return (
    <div className={`${prefixCls}-toolbar`}>
      <ul>
        {commands.map((item, idx) => {
          if (item.keyCommand === 'divider') {
            return <li key={idx} {...item.liProps} className={`${prefixCls}-toolbar-divider`} />
          }
          if (!item.keyCommand) return;
          const activeBtn = active && (item.value ? active[item.keyCommand] && active[item.keyCommand] === item.value : active[item.keyCommand]);

          const childNode = typeof item.children === 'function'
            ? item.children({
              close: () => handleClick({ }, item.groupName),
              execute: () => handleClick({ execute: item.execute }),
              ...commandHelp,
            })
            : undefined;
          return (
            <li key={idx} {...item.liProps} className={classnames({ active: activeBtn })}>
              {!item.buttonProps && item.icon}
              {item.buttonProps && React.createElement('button', {
                type: 'button',
                disabled: active && active.preview && active.preview === 'preview' && !/(preview|fullscreen)/.test(item.keyCommand),
                'data-name': item.name, ...item.buttonProps,
                onClick: (evn: any) => {
                  evn.stopPropagation()
                  handleClick(item, item.groupName);
                }
              }, item.icon)}
              {item.children && (
                <Child
                  active={active}
                  groupName={item.groupName}
                  prefixCls={prefixCls}
                  onCommand={props.onCommand}
                  children={childNode}
                  commands={Array.isArray(item.children) && typeof item.children !== 'function' ? item.children : undefined}
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
