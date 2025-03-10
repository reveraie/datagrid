import React, { useCallback, useMemo, useState } from 'react';
import { labelOf } from './utils';
import { ColumnHeaderProps } from './ColumnHeader';

type DragOver = 'NONE' | 'LEFT' | 'RIGHT';

let draggingColumnIndex: number | undefined = undefined;

function ColumnHeaderResizable({
  column,
  index,
  onClick,
  onChangeSize,
  onReorder,
}: ColumnHeaderProps) {
  const [width, setWidth] = useState<number | undefined>(
    typeof column.width === 'number' ? column.width : 100
  );
  const [isResizing, setIsResizing] = useState(false);
  const [isDragOver, setIsDragOver] = useState<DragOver>('NONE');

  const handleResize = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      // console.log("onMouseDown", event.clientX);
      event.stopPropagation();

      const startX = event.clientX;
      const startWidth = width || 0;

      const onMouseMove = (moveEvent: MouseEvent) => {
        // console.log("onMouseMove", moveEvent.clientX);
        setIsResizing(true);
        const newWidth = Math.max(startWidth + moveEvent.clientX - startX, 10);
        if (onChangeSize) onChangeSize(index || 0, newWidth);
        setWidth(newWidth);
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        setTimeout(() => setIsResizing(false), 10);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [width, index, onChangeSize]
  );

  const handleOnClick = useCallback(() => {
    if (!isResizing && onClick) onClick(column);
  }, [column, onClick, isResizing]);

  const handleDragStart = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData('text/plain', index.toString());
      draggingColumnIndex = index;
    },
    [index]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver('NONE');
      const fromIndex = event.dataTransfer.getData('text/plain');
      if (onReorder) onReorder(Number(fromIndex), index);
    },
    [index, onReorder]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (draggingColumnIndex === undefined) return;
      // console.log('draggingColumnIndex', draggingColumnIndex, 'index', index);
      if (draggingColumnIndex < index) {
        setIsDragOver('RIGHT');
      } else if (draggingColumnIndex > index) {
        setIsDragOver('LEFT');
      }
    },
    [index]
  );

  const handleDragLeave = useCallback(() => {
    setIsDragOver('NONE');
  }, []);

  const reoderArgs = useMemo(
    () =>
      onReorder
        ? {
            draggable: true,
            onDragStart: handleDragStart,
            onDrop: handleDrop,
            onDragOver: handleDragOver,
            onDragLeave: handleDragLeave,
          }
        : {},
    [onReorder, handleDragStart, handleDrop, handleDragOver, handleDragLeave]
  );

  return (
    <div aria-label={`Column ${index + 1}`}>
      <div
        aria-label={`Column ${index + 1} drag handler`}
        onClick={handleOnClick}
        {...reoderArgs}
      >
        {labelOf(column)}
      </div>
      <div
        aria-label={`Column ${index + 1} resize handler`}
        className="dg-resize-handler"
        onMouseDown={handleResize}
      />
      {isDragOver === 'LEFT' && <div className="dg-drop-left-indicator" />}
      {isDragOver === 'RIGHT' && <div className="dg-drop-right-indicator" />}
    </div>
  );
}

export default ColumnHeaderResizable;
