import { ReactNode } from "react";

export interface DataGridColumn {
  name: string;
  label?: ReactNode | ((col: DataGridColumn) => ReactNode);
  width?: number | string;
  allowResize?: boolean;
  autoSize?: boolean;
  render?: (
    column: DataGridColumn,
    row: DataGridRow,
    index: number
  ) => ReactNode;
}

export interface DataGridRow {
  type?: 'row' | 'group';
  values: Record<string, unknown>;
}
