import { ReactNode } from 'react';
import { DataGridColumn } from './DataGridModels';

export function labelOf(column: DataGridColumn): ReactNode {
  const label = column.label;
  if (!label) return null;
  if (typeof label === 'function') {
    return label(column);
  }
  return label;
}
