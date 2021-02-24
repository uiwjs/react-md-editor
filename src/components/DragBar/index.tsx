import React, { useEffect, useMemo, useRef } from 'react';
import { IProps } from '../../utils';
import './index.less';

export interface IDragBarProps extends IProps {
  height: number;
  maxHeight: number;
  minHeight: number;
  onChange: (value: number) => void;
}

const DragBar: React.FC<IDragBarProps> = (props) => {
  const { prefixCls, onChange } = props || {};
  const dragRef = useRef<{ height: number; dragY: number }>();
  function handleMouseMove(event: MouseEvent) {
    if (dragRef.current) {
      const newHeight = dragRef.current.height + event.clientY - dragRef.current.dragY;
      if (newHeight >= props.minHeight && newHeight <= props.maxHeight) {
        onChange && onChange(dragRef.current.height + (event.clientY - dragRef.current.dragY));
      }
    }
  }
  function handleMouseUp() {
    dragRef.current = undefined;
  }
  function handleMouseDown(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    dragRef.current = {
      height: props.height,
      dragY: event.clientY,
    };
  }

  useEffect(() => {
    if (document) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      if (document) {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      }
    };
  }, []);
  const svg = useMemo(
    () => (
      <svg viewBox="0 0 512 512" height="100%">
        <path
          fill="currentColor"
          d="M304 256c0 26.5-21.5 48-48 48s-48-21.5-48-48 21.5-48 48-48 48 21.5 48 48zm120-48c-26.5 0-48 21.5-48 48s21.5 48 48 48 48-21.5 48-48-21.5-48-48-48zm-336 0c-26.5 0-48 21.5-48 48s21.5 48 48 48 48-21.5 48-48-21.5-48-48-48z"
        />
      </svg>
    ),
    [],
  );
  return (
    <div className={`${prefixCls}-bar`} onMouseDown={handleMouseDown}>
      {svg}
    </div>
  );
};

export default DragBar;
