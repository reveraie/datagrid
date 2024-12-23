import { ReactNode, useCallback, useRef } from 'react';

import { DataGridColumn, DataGridRow } from './DataGridModels';
import GridPage, {
  LoadPageContentCallbackType,
  LoadPageContentPlaceholderCallbackType,
} from './DataGridPage';

import './DataGrid.css';
import ColumnHeader from './ColumnHeader';
import useColumnSize from './useColumnSize';
import React from 'react';
import ColumnHeaderFixed from './ColumnHeaderFixed';

const debug_log: (..._args: unknown[]) => void = () => {
  // console.log(...args);
};

export type LoadPageDataCallbackType = (
  startIndex: number,
  size: number,
  abortSignal: AbortSignal
) => Promise<DataGridRow[]>;

interface DataGridRenderComponents {
  renderGroupRow?: (row: DataGridRow, key: number) => ReactNode | undefined;
  renderGridRow?: (
    columns: DataGridColumn[],
    row: DataGridRow,
    value: (
      col: DataGridColumn,
      row: DataGridRow,
      index: number
    ) => ReactNode | undefined,
    key?: number
  ) => ReactNode;
  renderGridHeaderCell?: (
    column: DataGridColumn,
    index: number,
    changeSize?: (index: number, newSize: number | string | undefined) => void,
    onClick?: (column: DataGridColumn) => void
  ) => ReactNode | undefined;
  renderGridCell?: (
    column: DataGridColumn,
    row: DataGridRow,
    index: number
  ) => ReactNode | undefined;
}

type DataGridProps = {
  className?: string;
  style?: React.CSSProperties;
  columns: DataGridColumn[];
  rows?: DataGridRow[];
  totalRowCount?: number;
  pageSize?: number;
  loadRows?: LoadPageDataCallbackType;
  placeholder?: LoadPageContentPlaceholderCallbackType;
  renderComponents?: DataGridRenderComponents;
  onColumnHeaderClick?: (column: DataGridColumn) => void;
  onColumnSizeChange?: (
    index: number,
    newSize: number | string | undefined
  ) => void;
} & React.HTMLAttributes<HTMLDivElement>;

const EMPTY_ROW: DataGridRow = {
  type: 'row',
  values: {},
};

const groupRow = (row: DataGridRow, key: number = 0) => {
  return (
    <div key={key} className="dg-group-row">
      {row.values[Object.keys(row.values)[0]] as ReactNode}
    </div>
  );
};

const gridRow = (
  columns: DataGridColumn[],
  row: DataGridRow,
  value: (
    col: DataGridColumn,
    row: DataGridRow,
    index: number
  ) => ReactNode | undefined,
  key: number = 0
) => {
  return (
    <div key={key} className="dg-row" data-row-id={key}>
      {columns.map((col, index) => (
        <div key={index} className={`dg-cell dg-cell-${index + 1}`}>
          {value(col, row, index)}
        </div>
      ))}
    </div>
  );
};

const gridHeaderCell = (
  column: DataGridColumn,
  index: number,
  changeSize?: (index: number, newSize: number | string | undefined) => void,
  onClick?: (column: DataGridColumn) => void
) =>
  column.allowResize === false ? (
    <ColumnHeaderFixed
      column={column}
      index={index}
      onClick={onClick}
    />
  ) : (
    <ColumnHeader
      column={column}
      index={index}
      onClick={onClick}
      onChangeSize={changeSize}
    />
  );

function gridCell(
  column: DataGridColumn,
  row: DataGridRow,
  index: number
): ReactNode | undefined {
  return column.render
    ? column.render(column, row, index)
    : row.values[column.name] as ReactNode;
}

const testLoadRows: LoadPageDataCallbackType = async (
  startIndex,
  size,
  abortSignal
) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (abortSignal.aborted) throw new Error('aborted');
  return Array.from({ length: size }, (_, index) => index + startIndex).map(
    (_, index) => ({
      type: 'row',
      values: { col0: `Row ${startIndex + index}` },
    })
  );
};

const DataGridDefaultProps = {
  columns: [],
  rows: [],
  totalRowCount: 0,
  pageSize: 1000,
  renderComponents: {
    renderGroupRow: groupRow,
    renderGridRow: gridRow,
    renderGridHeaderCell: gridHeaderCell,
    renderGridCell: gridCell,
  },
};

let count = 0;
function newId() {
  return `gid-${count++}`;
}

function DataGrid({
  className,
  style,
  columns = [],
  rows = [],
  totalRowCount,
  pageSize = 100,
  loadRows,
  placeholder,
  onColumnHeaderClick,
  onColumnSizeChange,
  renderComponents = DataGridDefaultProps.renderComponents,
  ...restProps
}: DataGridProps) {
  debug_log(`reload DataGrid ...`);

  const {
    renderGridRow = gridRow,
    renderGroupRow = groupRow,
    renderGridHeaderCell = gridHeaderCell,
    renderGridCell = gridCell,
  } = renderComponents;

  const rowsCount = totalRowCount || rows.length;

  //TODO: Why?
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const loadMoreRows = useCallback<LoadPageContentCallbackType>(
    async (startIndex, size, abortSignal) => {
      const moreRows = loadRows
        ? await loadRows(startIndex, size, abortSignal)
        : await testLoadRows(startIndex, size, abortSignal);
      if (abortSignal.aborted) throw new Error('aborted');
      return moreRows.map((row, index) => {
        return row.type === 'group'
          ? renderGroupRow(row, startIndex + index)
          : renderGridRow(columns, row, renderGridCell, startIndex + index);
      });
    },
    [columns, loadRows, renderGridCell, renderGridRow, renderGroupRow]
  );

  const body = rows.map((row, index) => {
    return row.type === 'group'
      ? renderGroupRow(row, index)
      : renderGridRow(columns, row, renderGridCell, index);
  });

  // the rest of the rows are loading pages
  let i = body.length;
  while (i < rowsCount) {
    const size = Math.min(pageSize, rowsCount - i);
    body.push(
      <GridPage
        key={`page-${i}`}
        startIndex={i}
        size={size}
        placeholder={placeholder}
        loadRows={loadMoreRows}
      />
    );
    i += size;
  }

  const id = useRef<string>(newId());

  const { changeSize, styleElement } = useColumnSize(
    id.current,
    columns.map((c) => c.width)
  );

  const handleChangeSize = useCallback(
    (index: number, newSize: number | string | undefined) => {
      changeSize(index, newSize);
      onColumnSizeChange?.(index, newSize);
    },
    [changeSize, onColumnSizeChange]
  );

  const header = renderGridRow(columns, EMPTY_ROW, (col, _row, index) =>
    renderGridHeaderCell(col, index, handleChangeSize, onColumnHeaderClick)
  );

  return (
    <div
      className={`dg-grid dg-grid-${id.current} ${className}`}
      style={style}
      aria-label="Data grid"
      {...restProps}
    >
      {styleElement}
      <div className="dg-body">
        <div className="dg-header">{header}</div>
        {body}
      </div>
    </div>
  );
}

export default DataGrid;
