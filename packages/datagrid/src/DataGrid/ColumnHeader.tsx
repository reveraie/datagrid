import React, { useCallback, useState } from 'react';
import { DataGridColumn } from './DataGridModels';
import { labelOf } from './utils';

interface ColumnHeaderProps {
  column: DataGridColumn;
  index: number;
  onClick?: (column: DataGridColumn) => void;
  onChangeSize?: (index: number, newSize: number | string | undefined) => void;
}

function ColumnHeader({
  column,
  index,
  onClick,
  onChangeSize,
}: ColumnHeaderProps) {
  const [width, setWidth] = useState<number | undefined>(
    typeof column.width === 'number' ? column.width : 100
  );
  const [isResizing, setIsResizing] = useState(false);

  const handleResize = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();

      const startX = event.clientX;
      const startWidth = width || 0;

      // console.log('onMouseDown', event.clientX);

      const onMouseMove = (moveEvent: MouseEvent) => {
        // console.log('onMouseMove', moveEvent.clientX);
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

  return (
    <div aria-label={`Column ${index + 1}`} onClick={handleOnClick}>
      {labelOf(column)}
      <div
        aria-label={`Column ${index + 1} resize handler`}
        style={{
          display: 'inline-block',
          width: '10px',
          cursor: 'col-resize',
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
        }}
        onMouseDown={handleResize}
      />
    </div>
  );
}

export default ColumnHeader;
