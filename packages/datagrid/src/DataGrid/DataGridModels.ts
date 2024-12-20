export interface DataGridColumn {
  name: string;
  label?: string;
  width?: number;
  render?: (
    column: DataGridColumn,
    row: DataGridRow,
    index: number
  ) => React.ReactNode;
}

export interface DataGridRow {
  type?: 'row' | 'group';
  values: Record<string, unknown>;
}
