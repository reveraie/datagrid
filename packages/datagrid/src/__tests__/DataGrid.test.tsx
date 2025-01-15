import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import { mockIntersectionObserver } from '../../test/mockIntersectionObserver';
import DataGrid from '../DataGrid/DataGrid';
import { LoadPageDataCallbackType } from '../DataGrid/DataGrid';

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
      { name: 'col1', label: 'Column 2' },
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

  it('calls the onCellClick handler when cell is clicked', async () => {
    const onCellClickMock = jest.fn();
    const onCellDoubleClickMock = jest.fn();
    const columns = [
      { name: 'col1', label: 'Column 1' },
      { name: 'col2', label: 'Column 2' },
    ];
    const rows = [
      { values: { col1: 'Row 1, col 1', col2: 'Row 1, col 2' } },
      { values: { col1: 'Row 2, col 1', col2: 'Row 2, col 2' } },
    ];
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        onCellClick={onCellClickMock}
        onCellDoubleClick={onCellDoubleClickMock}
      />
    );

    const cell = screen.getByText('Row 2, col 1');

    // Simulate a click
    fireEvent.click(cell);
    await waitFor(() => expect(onCellClickMock).toHaveBeenCalledTimes(1));
    expect(onCellClickMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'click' }), // Event object
      expect.objectContaining({
        row: 1,
        col: 0,
      })
    );

    // Simulate a double-click
    fireEvent.click(cell);
    fireEvent.dblClick(cell);

    // Wait for any asynchronous actions triggered by the double-click
    await waitFor(() => expect(onCellDoubleClickMock).toHaveBeenCalledTimes(1));
    expect(onCellDoubleClickMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'dblclick' }), // Event object
      expect.objectContaining({
        row: 1,
        col: 0,
      })
    );
  });

  it('rows should have data-row-index attribute', () => {
    const columns = [{ name: 'Column 1' }, { name: 'Column 2' }];
    const rows = [
      { values: { 'Column 1': 'Row 1 value 1', 'Column 2': 'Value 2' } },
      { values: { 'Column 1': 'Row 2 value 2', 'Column 2': 'Value 2' } },
      { values: { 'Column 1': 'Row 3 value 3', 'Column 2': 'Value 2' } },
    ];
    render(<DataGrid columns={columns} rows={rows} />);
    expect(
      screen.getByText('Row 1 value 1').closest('.dg-row')
    ).toHaveAttribute('data-row-id', 'row-0');
    expect(
      screen.getByText('Row 2 value 2').closest('.dg-row')
    ).toHaveAttribute('data-row-id', 'row-1');
    expect(
      screen.getByText('Row 3 value 3').closest('.dg-row')
    ).toHaveAttribute('data-row-id', 'row-2');
  });

  it('loadRows:1', async () => {
    const [intersectionObserver] = mockIntersectionObserver([true]);

    const columns = [{ name: 'col1' }];
    const rows = [{ values: { col1: 'Row 1' } }, { values: { col1: 'Row 2' } }];

    const loadRows: LoadPageDataCallbackType = (startIndex, size) => {
      return new Promise((resolve) => {
        resolve(
          Array.from({ length: size }, (_, index) => index + startIndex).map(
            (_, index) => ({
              type: 'row',
              values: { col1: `Row ${startIndex + index}` },
            })
          )
        );
      });
    };

    await act(() => {
      render(
        <DataGrid
          style={{ width: 200, height: 200 }}
          columns={columns}
          rows={rows}
          totalRowCount={10}
          loadRows={loadRows}
        />
      );
    });
    // provided with rows props
    expect(screen.getByText('Row 1')).toBeInTheDocument();
    expect(screen.getByText('Row 2')).toBeInTheDocument();
    expect(screen.getByText('Loading row 2 ...')).toBeInTheDocument();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(intersectionObserver.observe).toHaveBeenCalledTimes(1);

    // provided by loadRows
    expect(screen.getByText('Row 3')).toBeInTheDocument();
    expect(screen.getByText('Row 4')).toBeInTheDocument();
  });
});
