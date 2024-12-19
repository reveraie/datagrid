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
    const columns = [{ name: 'Column 1' }, { name: 'Column 2' }];
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
});
