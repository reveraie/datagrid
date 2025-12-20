/**
 * DataGrid component which composes header,
 *   rows and lazy-loaded pages (GridPage)
 */
import { ReactNode, useCallback, useRef } from 'react';

import { DataGridColumn, DataGridRow } from './DataGridModels';
import GridPage, {
  LoadPageContentCallbackType,
  LoadPageContentPlaceholderCallbackType,
} from './DataGridPage';

// import './DataGrid.css';
import './DataGrid-Tailwind.css';
import useColumnSize from './useColumnSize';
import React from 'react';
import { ColumnHeaderProps } from './ColumnHeader';
import { useClick } from './useClick';
import ColumnHeaderResizable from './ColumnHeaderResizable';

// A no-op debug logger that can be enabled for local debugging without
// changing callsites. Intentionally left as an empty function in production.
const debug_log: (..._args: unknown[]) => void = () => {
  // console.log(...args);
};

/**
 * Callback used to request a page of rows from an external data source.
 * - startIndex: inclusive start index for rows to fetch
 * - size: number of rows requested
 * - abortSignal: signal to support cancellation of the fetch
 */
export type LoadPageDataCallbackType = (
  startIndex: number,
  size: number,
  abortSignal: AbortSignal
) => Promise<{ rows: DataGridRow[]; totalCount?: number }>;

/**
 * Optional renderers for specific grid elements. Use these to customize
 * rendering of group rows, grid rows, header cells and data cells.
 */
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
    columnHeaderProps: ColumnHeaderProps
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
  onColumnReorder?: (fromIndex: number, toIndex: number) => void;
};

type DataGridProps = {
  gridId?: string;
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

/** A simple placeholder row used when rendering the header row via renderGridRow. */
const EMPTY_ROW: DataGridRow = {
  type: 'row',
  values: {},
};

/**
 * Render a "group" row (a row that groups other rows visually).
 * Uses the first key in row.values as the display content.
 * Assumption: group rows store their label/value in the first property of values.
 */
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

/**
 * Render a standard data row by mapping columns to cells.
 * - Each cell gets data-cell-index and data-cell-name attributes used for
 *   click-resolution (getRowAndCol).
 */
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

// Small wrapper: header cell uses a resizable header implementation by default.
const gridHeaderCell = ({ ...props }: ColumnHeaderProps) => (
  <ColumnHeaderResizable {...props} />
);

/**
 * Resolve a cell's rendered content:
 * - If the column provides a custom renderer use that (allows rich content).
 * - Otherwise return the raw cell value stored in row.values.
 */
function gridCell(
  column: DataGridColumn,
  row: DataGridRow,
  index: number
): ReactNode | undefined {
  return column.render
    ? column.render(row.values[column.name], column, row, index)
    : (row.values[column.name] as ReactNode);
}

const testLoadRows: LoadPageDataCallbackType = async (
  startIndex,
  size,
  abortSignal
) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (abortSignal.aborted) throw new Error('aborted');
  return {
    rows: Array.from({ length: size }, (_, index) => index + startIndex).map(
      (_, index) => ({
        type: 'row',
        values: { col0: `Row ${startIndex + index}` },
      })
    ),
    totalCount: undefined,
  };
};

/**
 * Default function to derive a stable row id from a row object.
 * Looks for common identifiers ('row-id', 'id'), and falls back to "row-{index}".
 */
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
/** Simple id generator for grid instances to scope styles and state. */
function newId() {
  return `gid-${count++}`;
}

/**
 * Top-level DataGrid component:
 * - Renders a header row then the provided rows.
 * - Fills the remainder of totalRowCount with GridPage placeholders that lazy-load
 *   their contents via loadRows (or a test stub).
 * - Hooks column-resizing and click/double-click events to consumers via props.
 */
const DataGrid = React.forwardRef<HTMLDivElement, DataGridProps>(function (
  {
    gridId,
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
    onColumnReorder,
    onCellClick,
    onCellDoubleClick,
    renderComponents = DataGridDefaultProps.renderComponents,

    ...restProps
  }: DataGridProps,
  ref
) {
  debug_log(`reload DataGrid ...`);

  // Default renderers used if consumer hasn't provided custom renderers.
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

  // Attach click handlers that resolve which row/cell was clicked using
  // getRowAndCol (which relies on data attributes set on cells/rows).
  const { onClick, onDoubleClick } = useClick({
    onClick: (e) => onCellClick?.(e, getRowAndCol(e.target)),
    onDoubleClick: (e) => onCellDoubleClick?.(e, getRowAndCol(e.target)),
  });

  /**
   * Callback to load a page of rows and map them to React nodes using the
   * configured renderers.
   * - Throws if abortSignal is aborted to propagate cancellation.
   */
  const loadMoreRows = useCallback<LoadPageContentCallbackType>(
    async (startIndex, size, abortSignal) => {
      const moreRows = loadRows
        ? await loadRows(startIndex, size, abortSignal)
        : await testLoadRows(startIndex, size, abortSignal);
      if (abortSignal.aborted) throw new Error('aborted');
      return moreRows.rows.map((row, index) => {
        return row.type === 'group'
          ? renderGroupRow(row, startIndex + index)
          : renderGridRow(columns, row, renderGridCell, startIndex + index);
      });
    },
    [columns, loadRows, renderGridCell, renderGridRow, renderGroupRow]
  );

  // Build body using provided rows; group rows and regular rows are rendered
  // via their respective renderers.
  const body = rows.map((row, index) => {
    return row.type === 'group'
      ? renderGroupRow(row, index)
      : renderGridRow(columns, row, renderGridCell, index);
  });

  // Fill the remainder of the visible rows with GridPage placeholders that will
  // request their content asynchronously. This supports simple virtualization.
  const rowsCount = totalRowCount || rows.length;
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

  // Stable id for this grid instance (used by useColumnSize to scope styles).
  const id = useRef<string>(gridId || newId());

  // Hook that keeps an injected <style> element updated with column sizes.
  const { changeSize, styleElement } = useColumnSize(id.current, columns);

  // When consumer changes column size forward the change to both local hook
  // and the optional external onColumnSizeChange callback.
  const handleChangeSize = useCallback(
    (index: number, newSize: number | string | undefined) => {
      changeSize(index, newSize);
      onColumnSizeChange?.(index, newSize);
    },
    [changeSize, onColumnSizeChange]
  );

  // Render the header row using the renderGridRow path so it benefits from the
  // same layout as data rows; the key/index -1 denotes header context only.
  const header = renderGridRow(
    columns,
    EMPTY_ROW,
    (col, _row, index) =>
      renderGridHeaderCell({
        column: col,
        index,
        onChangeSize: handleChangeSize,
        onClick: onColumnHeaderClick,
        onReorder: onColumnReorder,
      }),
    -1
  );

  return (
    <div
      ref={ref}
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
});

// Utility that walks the DOM from the event target to determine which cell and
// row were the source of an event. Returns undefined if the required data
// attributes cannot be found.
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
