import { ReactNode } from 'react';

export type DataGridColumnRender = (
  value: unknown,
  column: DataGridColumn,
  row: DataGridRow,
  index: number
) => ReactNode;

export interface DataGridColumn {
  name: string;
  label?: ReactNode | ((col: DataGridColumn) => ReactNode);
  width?: number | string;
  allowResize?: boolean;
  autoSize?: boolean;
  render?: DataGridColumnRender;
}

export interface DataGridRow {
  type?: 'row' | 'group';
  values: Record<string, unknown>;
}
