import React, { useContext, useMemo } from 'react';
import './Child.less';
import Toolbar, { IToolbarProps } from './';
import { EditorContext } from '../../Context';

export type ChildProps = IToolbarProps & {
  children?: JSX.Element;
  groupName?: string;
};

export default function Child(props: ChildProps) {
  const { prefixCls, groupName, commands, children } = props || {};
  const { barPopup = {} } = useContext(EditorContext);
  return useMemo(
    () => (
      <div
        className={`${prefixCls}-toolbar-child ${groupName && barPopup[groupName] ? 'active' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {Array.isArray(commands) ? <Toolbar commands={commands} {...props} /> : children}
      </div>
    ),
    [commands, barPopup, groupName, prefixCls],
  );
}
