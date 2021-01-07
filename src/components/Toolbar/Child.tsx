import React from 'react';
import './Child.less';
import Toolbar, { IToolbarProps } from './';

export type ChildProps = IToolbarProps  & {
  children?: any;
}

export default function Child(props: ChildProps) {
  const { prefixCls, active = {}, groupName, commands, children } = props || {};
  return (
    <div className={`${prefixCls}-toolbar-child ${groupName && active[groupName] ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
      {Array.isArray(commands) ? (
        <Toolbar commands={commands} {...props} groupName={groupName} />
      ) : children}
    </div>
  )
}