import React, { useContext } from 'react';
import classnames from 'classnames';
import { IProps } from '../../utils';
import { EditorContext, PreviewType, ContextStore } from '../../Context';
import { ICommand } from '../../commands';
import Child from './Child';
import './index.less';

export interface IToolbarProps extends IProps {
  onCommand?: (command: ICommand<string>, groupName?: string) => void;
  commands?: ICommand<string>[];
  groupName?: string;
}

export default function Toolbar(props: IToolbarProps = {}) {
  const { prefixCls, groupName } = props;
  const { commands, fullscreen, preview, barPopup = {}, commandOrchestrator, dispatch } = useContext(EditorContext);
  function handleClick(command: ICommand<string>, name?: string) {
    if (!dispatch) return;
    const state: ContextStore = {};
    if (command.keyCommand === 'preview') {
      state.preview = command.value as PreviewType;
    }
    if (command.keyCommand === 'fullscreen') {
      state.fullscreen = !fullscreen;
      document.body.style.overflow = fullscreen ? 'initial' : 'hidden';
    }
    if (groupName && command.keyCommand !== 'group') {
      state.barPopup = { ...barPopup, [`${groupName}`]: false };
    }

    if (Object.keys(state).length) {
      dispatch({ ...state });
    }
    commandOrchestrator && commandOrchestrator.executeCommand(command);
  }
  return (
    <div className={`${prefixCls}-toolbar`}>
      <ul>
        {(props.commands || commands || []).map((item, idx) => {
          if (item.keyCommand === 'divider') {
            return <li key={idx} {...item.liProps} className={`${prefixCls}-toolbar-divider`} />;
          }
          if (!item.keyCommand) return;
          const activeBtn =
            (fullscreen && item.keyCommand === 'fullscreen') ||
            (item.keyCommand === 'preview' && preview === item.value);
          const childNode =
            typeof item.children === 'function'
              ? item.children({
                  close: () => handleClick({}, item.groupName),
                  execute: () => handleClick({ execute: item.execute }),
                })
              : undefined;
          const disabled =
            barPopup && preview && preview === 'preview' && !/(preview|fullscreen)/.test(item.keyCommand);
          return (
            <li key={idx} {...item.liProps} className={classnames({ active: activeBtn })}>
              {!item.buttonProps && item.icon}
              {item.buttonProps &&
                React.createElement(
                  'button',
                  {
                    type: 'button',
                    disabled,
                    'data-name': item.name,
                    ...item.buttonProps,
                    onClick: (evn: any) => {
                      evn.stopPropagation();
                      handleClick(item, item.groupName);
                    },
                  },
                  item.icon,
                )}
              {item.children && (
                <Child
                  groupName={item.groupName}
                  prefixCls={prefixCls}
                  children={childNode}
                  commands={
                    Array.isArray(item.children) && typeof item.children !== 'function' ? item.children : undefined
                  }
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
