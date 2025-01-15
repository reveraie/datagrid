import { ReactNode, useCallback, useRef } from 'react';

import { DataGridColumn, DataGridRow } from './DataGridModels';
import GridPage, {
  LoadPageContentCallbackType,
  LoadPageContentPlaceholderCallbackType,
} from './DataGridPage';

// import './DataGrid.css';
import './DataGrid-Tailwind.css';
import ColumnHeader from './ColumnHeader';
import useColumnSize from './useColumnSize';
import React from 'react';
import ColumnHeaderFixed from './ColumnHeaderFixed';
import { useClick } from './useClick';

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

type DataGridEventHandler = (
  e: React.MouseEvent<HTMLDivElement>,
  target:
    | { row: number; col: number; rowId: unknown; colName: unknown }
    | undefined
) => void;

type DataGridEvents = {
  onColumnHeaderClick?: (column: DataGridColumn) => void;
  onColumnSizeChange?: (
    index: number,
    newSize: number | string | undefined
  ) => void;
  onCellClick?: DataGridEventHandler;
  onCellDoubleClick?: DataGridEventHandler;
};

type DataGridProps = {
  className?: string;
  style?: React.CSSProperties;
  columns: DataGridColumn[];
  rows?: DataGridRow[];
  totalRowCount?: number;
  pageSize?: number;
  loadRows?: LoadPageDataCallbackType;
  rowId?: (row: DataGridRow, index: number) => string;
  placeholder?: LoadPageContentPlaceholderCallbackType;
  renderComponents?: DataGridRenderComponents;
} & DataGridEvents &
  React.HTMLAttributes<HTMLDivElement>;

const EMPTY_ROW: DataGridRow = {
  type: 'row',
  values: {},
};

const groupRow = (
  row: DataGridRow,
  key: number,
  rowId?: (row: DataGridRow, index: number) => string
) => {
  return (
    <div
      key={key}
      className="dg-group-row"
      data-row-index={key}
      data-row-id={rowId ? rowId(row, key) : defaultRowId(row, key)}
    >
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
  key: number = 0,
  rowId?: (row: DataGridRow, index: number) => string
) => {
  return (
    <div
      key={key}
      className="dg-row"
      data-row-index={key}
      data-row-id={rowId ? rowId(row, key) : defaultRowId(row, key)}
    >
      {columns.map((col, index) => (
        <div
          key={index}
          data-cell-index={index}
          data-cell-name={col.name}
          className={`dg-cell dg-cell-${index + 1}`}
        >
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
    <ColumnHeaderFixed column={column} index={index} onClick={onClick} />
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
    : (row.values[column.name] as ReactNode);
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

const defaultRowId: (row: DataGridRow, index: number) => string = (
  row,
  index
) => {
  return `${row.values['row-id'] || row.values['id'] || `row-${index}`}`;
};

const DataGridDefaultProps = {
  columns: [],
  rows: [],
  totalRowCount: 0,
  pageSize: 10,
  renderComponents: {},
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
  rowId,
  placeholder,
  onColumnHeaderClick,
  onColumnSizeChange,
  onCellClick,
  onCellDoubleClick,
  renderComponents = DataGridDefaultProps.renderComponents,
  ...restProps
}: DataGridProps) {
  debug_log(`reload DataGrid ...`);

  const defaultRenderGridRow = useCallback(
    (
      columns: DataGridColumn[],
      row: DataGridRow,
      value: (
        col: DataGridColumn,
        row: DataGridRow,
        index: number
      ) => ReactNode | undefined,
      key?: number
    ) => {
      return gridRow(columns, row, value, key, rowId);
    },
    [rowId]
  );

  const defaultRenderGroupRow = useCallback(
    (row: DataGridRow, key: number) => {
      return groupRow(row, key, rowId);
    },
    [rowId]
  );

  const renderGridRow = renderComponents.renderGridRow || defaultRenderGridRow;
  const renderGroupRow =
    renderComponents.renderGroupRow || defaultRenderGroupRow;
  const renderGridHeaderCell =
    renderComponents.renderGridHeaderCell || gridHeaderCell;
  const renderGridCell = renderComponents.renderGridCell || gridCell;

  const rowsCount = totalRowCount || rows.length;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { onClick, onDoubleClick } = useClick({
    onClick: (e) => onCellClick?.(e, getRowAndCol(e.target)),
    onDoubleClick: (e) => onCellDoubleClick?.(e, getRowAndCol(e.target)),
  });

  //TODO: Why?!?
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

  const header = renderGridRow(
    columns,
    EMPTY_ROW,
    (col, _row, index) =>
      renderGridHeaderCell(col, index, handleChangeSize, onColumnHeaderClick),
    -1
  );

  return (
    <div
      className={`dg-grid dg-grid-${id.current} ${className}`}
      style={style}
      aria-label="Data grid"
      onClick={onClick}
      onDoubleClick={onDoubleClick}
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

function getRowAndCol(
  target: EventTarget | null
): { row: number; col: number; rowId: unknown; colName: unknown } | undefined {
  if (!target) return;
  const e = target as HTMLElement;

  const cell = e.closest('.dg-cell');
  const row = e.closest('.dg-row') || e.closest('.dg-group-row');

  const cell_index = Number(cell?.getAttribute('data-cell-index'));
  const cell_name = cell?.getAttribute('data-cell-name');
  const row_index = Number(row?.getAttribute('data-row-index'));
  const row_id = row?.getAttribute('data-row-id');

  return { row: row_index, col: cell_index, rowId: row_id, colName: cell_name };
}

export default DataGrid;
