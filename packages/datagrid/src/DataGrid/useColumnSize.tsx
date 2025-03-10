import { useCallback } from 'react';
import { DataGridColumn } from './DataGridModels';

function widthValue(size: string | number | undefined) {
  if (size === '*') {
    return `flex-grow: 1;`;
  }
  if (typeof size === 'number') {
    return `width: ${(size / 16).toFixed(2)}em;`;
  }
  if (typeof size === 'undefined') {
    return 'width: 6.25em;'; // 100 pixels
  }
  return size;
}

function styleContent(id: string, columns: DataGridColumn[]) {
  const styles = `.dg-grid-${id} {${columns
    .map(
      (column, index) =>
        `.dg-row .dg-cell:nth-child(${index + 1}) { ${widthValue(column.width)} }`
    )
    .join('\n')}}`;
  return styles;
}

function styleId(id: string) {
  return `dg-grid-style-${id}`;
}

function updateStyle(id: string, columns: DataGridColumn[]) {
  const styleElement = document.getElementById(styleId(id));
  if (!styleElement) return;
  const styles = styleContent(id, columns);
  styleElement.textContent = styles;
}

function useColumnSize(id: string, columns: DataGridColumn[]) {
  // Method to change the size of a specific column
  const changeSize = useCallback(
    (index: number, newSize: number | string | undefined) => {
      if (index >= 0 && index < columns.length) {
        columns[index].width = newSize;
        updateStyle(id, columns);
      }
    },
    [columns, id]
  );

  return {
    changeSize,
    styleElement: <style id={styleId(id)}>{styleContent(id, columns)}</style>,
  };
}

export default useColumnSize;
