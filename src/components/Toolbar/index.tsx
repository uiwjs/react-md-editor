import React, { Fragment, useContext, useEffect } from 'react';
import { IProps } from '../../utils';
import { EditorContext, PreviewType, ContextStore } from '../../Context';
import { ICommand } from '../../commands';
import Child from './Child';
import './index.less';

export interface IToolbarProps extends IProps {
  height?: React.CSSProperties['height'];
  onCommand?: (command: ICommand<string>, groupName?: string) => void;
  commands?: ICommand<string>[];
  isChild?: boolean;
}

export function ToolbarItems(props: IToolbarProps) {
  const { prefixCls } = props;
  const { fullscreen, preview, barPopup = {}, commandOrchestrator, dispatch } = useContext(EditorContext);
  function handleClick(command: ICommand<string>, name?: string) {
    if (!dispatch) return;
    const state: ContextStore = { barPopup: { ...barPopup } };
    if (command.keyCommand === 'preview') {
      state.preview = command.value as PreviewType;
    }
    if (command.keyCommand === 'fullscreen') {
      state.fullscreen = !fullscreen;
    }
    if (props.commands && command.keyCommand === 'group') {
      props.commands.forEach((item) => {
        if (name === item.groupName) {
          state.barPopup![name!] = true;
        } else if (item.keyCommand) {
          state.barPopup![item.groupName!] = false;
        }
      });
    } else if (name || command.parent) {
      Object.keys(state.barPopup || {}).forEach((keyName) => {
        state.barPopup![keyName] = false;
      });
    }

    if (Object.keys(state).length) {
      dispatch({ ...state });
    }
    commandOrchestrator && commandOrchestrator.executeCommand(command);
  }

  useEffect(() => {
    if (document) {
      document.body.style.overflow = !fullscreen ? 'initial' : 'hidden';
    }
  }, [fullscreen]);

  return (
    <ul>
      {(props.commands || []).map((item, idx) => {
        if (item.keyCommand === 'divider') {
          return <li key={idx} {...item.liProps} className={`${prefixCls}-toolbar-divider`} />;
        }
        if (!item.keyCommand) return <Fragment />;
        const activeBtn =
          (fullscreen && item.keyCommand === 'fullscreen') || (item.keyCommand === 'preview' && preview === item.value);
        const childNode =
          item.children && typeof item.children === 'function'
            ? item.children({
                getState: () => commandOrchestrator!.getState(),
                textApi: commandOrchestrator ? commandOrchestrator!.textApi : undefined,
                close: () => handleClick({}, item.groupName),
                execute: () => handleClick({ execute: item.execute }),
              })
            : undefined;
        const disabled = barPopup && preview && preview === 'preview' && !/(preview|fullscreen)/.test(item.keyCommand);
        return (
          <li key={idx} {...item.liProps} className={activeBtn ? `active` : ''}>
            {!item.buttonProps && item.icon}
            {item.buttonProps &&
              React.createElement(
                'button',
                {
                  type: 'button',
                  disabled,
                  'data-name': item.name,
                  ...item.buttonProps,
                  onClick: (evn: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
                commands={Array.isArray(item.children) ? item.children : undefined}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function Toolbar(props: IToolbarProps = {}) {
  const { prefixCls, height = 29, isChild } = props;
  const { commands, extraCommands } = useContext(EditorContext);
  return (
    <div className={`${prefixCls}-toolbar`} style={{ height }}>
      <ToolbarItems {...props} commands={props.commands || commands || []} />
      {!isChild && <ToolbarItems {...props} commands={extraCommands || []} />}
    </div>
  );
}
