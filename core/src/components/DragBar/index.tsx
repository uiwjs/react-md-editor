import React, { useEffect, useMemo, useRef } from 'react';
import { IProps } from '../../Types';
import './index.less';

export interface IDragBarProps extends IProps {
  height: number;
  maxHeight: number;
  minHeight: number;
  onChange: (value: number) => void;
}

const DragBar: React.FC<IDragBarProps> = (props) => {
  const { prefixCls, onChange } = props || {};
  const $dom = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ height: number; dragY: number }>();
  const heightRef = useRef(props.height);

  useEffect(() => {
    if (heightRef.current !== props.height) {
      heightRef.current = props.height;
    }
  }, [props.height]);

  function handleMouseMove(event: Event) {
    if (dragRef.current) {
      const clientY =
        (event as unknown as MouseEvent).clientY || (event as unknown as TouchEvent).changedTouches[0]?.clientY;
      const newHeight = dragRef.current.height + clientY - dragRef.current.dragY;
      if (newHeight >= props.minHeight && newHeight <= props.maxHeight) {
        onChange && onChange(dragRef.current.height + (clientY - dragRef.current.dragY));
      }
    }
  }
  function handleMouseUp() {
    dragRef.current = undefined;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    $dom.current?.removeEventListener('touchmove', handleMouseMove);
    $dom.current?.removeEventListener('touchend', handleMouseUp);
  }
  function handleMouseDown(event: Event) {
    event.preventDefault();
    const clientY =
      (event as unknown as MouseEvent).clientY || (event as unknown as TouchEvent).changedTouches[0]?.clientY;
    dragRef.current = {
      height: heightRef.current,
      dragY: clientY,
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    $dom.current?.addEventListener('touchmove', handleMouseMove, { passive: false });
    $dom.current?.addEventListener('touchend', handleMouseUp, { passive: false });
  }

  useEffect(() => {
    if (document) {
      $dom.current?.addEventListener('touchstart', handleMouseDown, { passive: false });
      $dom.current?.addEventListener('mousedown', handleMouseDown);
    }
    return () => {
      if (document) {
        $dom.current?.removeEventListener('touchstart', handleMouseDown);
        document.removeEventListener('mousemove', handleMouseMove);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className={`${prefixCls}-bar`} ref={$dom}>
      {svg}
    </div>
  );
};

export default DragBar;
