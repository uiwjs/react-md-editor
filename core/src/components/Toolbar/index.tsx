import React, { Fragment, useContext, useEffect, useRef } from 'react';
import { IProps } from '../../Types';
import { EditorContext, PreviewType, ContextStore } from '../../Context';
import { ICommand } from '../../commands/';
import Child from './Child';
import './index.less';

export interface IToolbarProps extends IProps {
  overflow?: boolean;
  onCommand?: (command: ICommand<string>, groupName?: string) => void;
  commands?: ICommand<string>[];
  isChild?: boolean;
}

export function ToolbarItems(props: IToolbarProps) {
  const { prefixCls, overflow } = props;
  const { fullscreen, preview, barPopup = {}, components, commandOrchestrator, dispatch } = useContext(EditorContext);
  const originalOverflow = useRef('');

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
    if (document && overflow) {
      if (fullscreen) {
        // prevent scroll on fullscreen
        document.body.style.overflow = 'hidden';
      } else {
        // get the original overflow only the first time
        if (!originalOverflow.current) {
          originalOverflow.current = window.getComputedStyle(document.body, null).overflow;
        }
        // reset to the original overflow
        document.body.style.overflow = originalOverflow.current;
      }
    }
  }, [fullscreen, originalOverflow, overflow]);

  return (
    <ul>
      {(props.commands || []).map((item, idx) => {
        if (item.keyCommand === 'divider') {
          return <li key={idx} {...item.liProps} className={`${prefixCls}-toolbar-divider`} />;
        }
        if (!item.keyCommand) return <Fragment key={idx} />;
        const activeBtn =
          (fullscreen && item.keyCommand === 'fullscreen') || (item.keyCommand === 'preview' && preview === item.value);
        const childNode =
          item.children && typeof item.children === 'function'
            ? item.children({
                getState: () => commandOrchestrator!.getState(),
                textApi: commandOrchestrator ? commandOrchestrator!.textApi : undefined,
                close: () => handleClick({}, item.groupName),
                execute: () => handleClick({ execute: item.execute }),
                dispatch,
              })
            : undefined;
        const disabled = barPopup && preview && preview === 'preview' && !/(preview|fullscreen)/.test(item.keyCommand);
        const render = components?.toolbar || item.render;
        const com = (
          render && typeof render === 'function' ? render(item, !!disabled, handleClick, idx) : null
        ) as React.ReactElement;
        return (
          <li key={idx} {...item.liProps} className={activeBtn ? `active` : ''}>
            {com && React.isValidElement(com) && com}
            {!com && !item.buttonProps && item.icon}
            {!com &&
              item.buttonProps &&
              React.createElement(
                'button',
                {
                  type: 'button',
                  key: idx,
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
                overflow={overflow}
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
  const { prefixCls, isChild, className } = props;
  const { commands, extraCommands } = useContext(EditorContext);
  return (
    <div className={`${prefixCls}-toolbar ${className}`}>
      <ToolbarItems {...props} commands={props.commands || commands || []} />
      {!isChild && <ToolbarItems {...props} commands={extraCommands || []} />}
    </div>
  );
}

interface ToolbarVisibilityProps {
  hideToolbar?: boolean;
  toolbarBottom: boolean;
  placement: 'bottom' | 'top';
  overflow: boolean;
  prefixCls: string;
}

export function ToolbarVisibility(props: ToolbarVisibilityProps) {
  const { hideToolbar, toolbarBottom, placement, overflow, prefixCls } = props;
  if (hideToolbar || (placement === 'bottom' && !toolbarBottom) || (placement === 'top' && toolbarBottom)) {
    return null;
  }
  const cls = toolbarBottom ? 'bottom' : '';
  return <Toolbar prefixCls={prefixCls} overflow={overflow} className={cls} />;
}
