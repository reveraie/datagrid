import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import DataGrid from '../DataGrid/DataGrid';

describe('DataGrid Component', () => {
  it('renders correctly', () => {
    const columns = [{ name: 'Column 1' }, { name: 'Column 2' }];
    const rows = [{ values: { 'Column 1': 'Value 1', 'Column 2': 'Value 2' } }];
    render(<DataGrid columns={columns} rows={rows} />);
    expect(screen.getByText('Value 1')).toBeInTheDocument();
  });

  it('calls the onHeaderClick handler when header is clicked', () => {
    const onClickMock = jest.fn();
    const columns = [
      { name: 'col1', label: 'Column 1' }, 
      { name: 'col1', label: 'Column 2' }
    ];
    const rows = [{ values: { 'Column 1': 'Value 1', 'Column 2': 'Value 2' } }];
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        onColumnHeaderClick={onClickMock}
      />
    );

    fireEvent.click(screen.getByText('Column 1'));
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('rows should have data-row-index attribute', () => {
    const columns = [{ name: 'Column 1' }, { name: 'Column 2' }];
    const rows = [
      { values: { 'Column 1': 'Row 1 value 1', 'Column 2': 'Value 2' } },
      { values: { 'Column 1': 'Row 2 value 2', 'Column 2': 'Value 2' } },
      { values: { 'Column 1': 'Row 3 value 3', 'Column 2': 'Value 2' } },
    ];
    render(<DataGrid columns={columns} rows={rows} />);
    expect(screen.getByText('Row 1 value 1').closest('.dg-row')).toHaveAttribute('data-row-id', '0');
    expect(screen.getByText('Row 2 value 2').closest('.dg-row')).toHaveAttribute('data-row-id', '1');
    expect(screen.getByText('Row 3 value 3').closest('.dg-row')).toHaveAttribute('data-row-id', '2');
  });
});
