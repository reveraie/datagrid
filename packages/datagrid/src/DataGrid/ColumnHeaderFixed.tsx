import React, { useCallback } from 'react';
import { DataGridColumn } from './DataGridModels';
import { labelOf } from './utils';

interface ColumnHeaderProps {
  column: DataGridColumn;
  index: number;
  onClick?: (column: DataGridColumn) => void;
  onChangeSize?: (index: number, newSize: number | string | undefined) => void;
}

function ColumnHeaderFixed({
  column,
  index,
  onClick,
}: ColumnHeaderProps) {

  const handleOnClick = useCallback(() => {
    if (onClick) onClick(column);
  }, [column, onClick]);

  return (
    <div
      aria-label={`Column ${index + 1}`}
      onClick={handleOnClick}
    >
      {labelOf(column)}
    </div>
  );
}

export default ColumnHeaderFixed;
