import React, { useEffect, useImperativeHandle, useMemo, useState } from 'react';
import classnames from 'classnames';
import Prism from 'prismjs';
import 'prismjs/components/prism-markdown.js';
import { IProps } from '../../utils';
import { getKeys, getKeyboardCode } from '../../utils/hotkey';
import hotkeys, { IHotkeyOptions } from './hotkeys';
import { ICommand, getAllCommands } from '../../commands';
import './index.less';

export interface ITextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange' | 'onScroll'>,
    IProps {
  onCommand?: (command: ICommand<string>, groupName?: string) => void;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onMount?: (isMount: boolean) => void;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  value?: string;
  tabSize?: number;
  commands?: ICommand<string>[];
}
export type OnKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;

export type TextAreaRef = {
  text?: HTMLTextAreaElement;
  warp?: HTMLDivElement;
};

export default React.forwardRef<TextAreaRef, ITextAreaProps>((props, ref) => {
  const { prefixCls, className, onChange, onCommand, onMount, onScroll, tabSize, style, commands, ...otherProps } =
    props || {};
  const warp = React.createRef<HTMLDivElement>();
  const preElm = React.createRef<HTMLPreElement>();
  const textElm = React.createRef<HTMLTextAreaElement>();
  useImperativeHandle<TextAreaRef, {}>(ref, () => ({ text: textElm.current, warp: warp.current }), [
    warp.current,
    textElm.current,
  ]);
  const [value, setValue] = useState(props.value);
  const [shortCutsKeyList, setShortCutsKeyList] = useState([[]]);
  const [allCommandList, setAllCommandList] = useState(getAllCommands());
  const highlight = () => {
    const pre = preElm.current;
    const html = Prism.highlight(value as string, Prism.languages.markdown, 'markdown');
    pre!.innerHTML = `${html}<br />`;
  };
  useEffect(() => {
    const commandList = getAllCommands();
    commands &&
      commands.length > 0 &&
      commands.forEach((item) => {
        if (item.shortCuts && item.execute) {
          commandList.unshift(item);
        }
        item.children &&
          Array.isArray(item.children) &&
          item.children.length > 0 &&
          item.children.forEach((child) => {
            if (child.shortCuts && child.execute) {
              commandList.unshift(child);
            }
          });
      });
    if (commandList && commandList.length > 0) {
      const keyList: any = commandList.map((item) => (item.shortCuts ? getKeys(item.shortCuts) : []));
      setShortCutsKeyList(keyList);
      setAllCommandList(commandList);
    }
    onMount && onMount(true);
    return () => {
      onMount && onMount(false);
    };
  }, []);
  useEffect(() => {
    if (props.value !== value) {
      setValue(props.value);
    }
  }, [props.value]);

  useEffect(() => highlight(), [value]);
  useEffect(() => {
    if (props.autoFocus && textElm.current) {
      textElm.current.focus();
    }
  }, [props.autoFocus]);

  const onKeyDown: OnKeyDown = (e) => {
    const isMatch = hotkeys({ tabSize } as IHotkeyOptions, e);
    if (isMatch && shortCutsKeyList.length > 0) {
      const onKeyDownCode = getKeyboardCode(e);
      for (let i = 0; i < shortCutsKeyList.length; i++) {
        if (shortCutsKeyList[i] && shortCutsKeyList[i].length > 0) {
          for (let j = 0; j < shortCutsKeyList[i].length; j++) {
            if (onKeyDownCode.sort().join('') === shortCutsKeyList[i][j]) {
              props.onCommand && props.onCommand(allCommandList[i]);
              return;
            }
          }
        }
      }
    }
  };

  return (
    <div ref={warp} className={classnames(`${prefixCls}-aree`, className)} onScroll={onScroll}>
      <div className={classnames(`${prefixCls}-text`)}>
        <pre ref={preElm} className={classnames(`${prefixCls}-text-pre`, 'wmde-markdown-color')} />
        <textarea
          {...otherProps}
          ref={textElm}
          onKeyDown={onKeyDown}
          className={`${prefixCls}-text-input`}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onChange && onChange(e);
          }}
        />
      </div>
    </div>
  );
});
