import { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import { mockIntersectionObserver } from '../../test/mockIntersectionObserver';
import DataGrid from '../DataGrid/DataGrid';
import { LoadPageDataCallbackType } from '../DataGrid/DataGrid';
import { DataGridRow } from '../DataGrid/DataGridModels';

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
      { name: 'col2', label: 'Column 2' },
    ];
    const rows = [{ values: { col1: 'Value 1', col2: 'Value 2' } }];
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
        resolve({
          rows: Array.from(
            { length: size },
            (_, index) => index + startIndex
          ).map((_, index) => ({
            type: 'row',
            values: { col1: `Row ${startIndex + index}` },
          })),
          totalCount: undefined,
        });
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

  it('reorder columns', async () => {
    const columns = [
      { name: 'col1', label: 'c1label', allowResize: false },
      { name: 'col2', label: 'c2label', allowResize: false },
    ];
    const rows = [{ values: { col1: 'Row 1 Value 1', col2: 'Row 1 Value 2' } }];
    const onColumnReorderMock = jest.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        onColumnReorder={onColumnReorderMock}
      />
    );
    expect(screen.getByText('Row 1 Value 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Column 1 drag handler')).toBeInTheDocument();

    const column1DragHandler = screen.getByLabelText('Column 1 drag handler');
    const column2DragHandler = screen.getByLabelText('Column 2 drag handler');

    let data = '';
    // Mock the dataTransfer object
    const dataTransfer = {
      setData: (_: unknown, index: string) => {
        data = index;
      },
      getData: () => data,
    };

    // Drag and drop column 1 to the right
    fireEvent.dragStart(column1DragHandler, { dataTransfer });
    fireEvent.dragEnter(column2DragHandler, { dataTransfer });
    fireEvent.dragOver(column2DragHandler, { dataTransfer });

    await waitFor(() => screen.getByLabelText('Right of column 2'));

    fireEvent.drop(column2DragHandler, { dataTransfer });
    fireEvent.dragEnd(column2DragHandler, { dataTransfer });

    await waitFor(() => expect(onColumnReorderMock).toHaveBeenCalledWith(0, 1));
  });

  it('resize columns', () => {
    const columns = [
      { name: 'col1', label: 'c1label', allowResize: true },
      { name: 'col2', label: 'c2label', allowResize: false },
    ];
    const rows = [{ values: { col1: 'Row 1 Value 1', col2: 'Row 1 Value 2' } }];
    render(<DataGrid columns={columns} rows={rows} />);
    expect(screen.getByText('Row 1 Value 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Column 1 drag handler')).toBeInTheDocument();

    expect(
      screen.queryByLabelText('Column 1 resize handler')
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText('Column 2 resize handler')
    ).not.toBeInTheDocument();
  });

  describe('Custom Renderers', () => {
    it('uses renderGridCell to customize cell content', () => {
      const renderGridCellMock = jest.fn((column, row, index) => {
        return `Custom cell: ${row.values[column.name]} at index ${index}`;
      });
      const columns = [{ name: 'col1' }, { name: 'col2' }];
      const rows = [{ values: { col1: 'Value 1', col2: 'Value 2' } }];

      render(
        <DataGrid
          columns={columns}
          rows={rows}
          renderComponents={{ renderGridCell: renderGridCellMock }}
        />
      );

      expect(renderGridCellMock).toHaveBeenCalledTimes(2);
      expect(screen.getByText('Custom cell: Value 1 at index 0')).toBeInTheDocument();
      expect(screen.getByText('Custom cell: Value 2 at index 1')).toBeInTheDocument();
    });

    it('uses renderGridHeaderCell to customize header cells', () => {
      const renderGridHeaderCellMock = jest.fn(({ column, index }) => {
        return `Custom header: ${column.label} at index ${index}`;
      });
      const columns = [
        { name: 'col1', label: 'Column 1' },
        { name: 'col2', label: 'Column 2' },
      ];
      const rows = [{ values: { col1: 'Value 1', col2: 'Value 2' } }];

      render(
        <DataGrid
          columns={columns}
          rows={rows}
          renderComponents={{ renderGridHeaderCell: renderGridHeaderCellMock }}
        />
      );

      expect(renderGridHeaderCellMock).toHaveBeenCalledTimes(2);
      expect(
        screen.getByText('Custom header: Column 1 at index 0')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Custom header: Column 2 at index 1')
      ).toBeInTheDocument();
    });

    it('uses renderGridRow to customize row rendering', () => {
      const renderGridRowMock = jest.fn((_columns, row, _value, key) => {
        return (
          <div key={key} data-testid={`custom-row-${key}`}>
            Custom row: {row.values['col1']}
          </div>
        );
      });
      const columns = [{ name: 'col1' }];
      const rows = [{ values: { col1: 'Value 1' } }];

      render(
        <DataGrid
          columns={columns}
          rows={rows}
          renderComponents={{ renderGridRow: renderGridRowMock }}
        />
      );

      // It's called for the header row (key = -1) and the data row (key = 0)
      expect(renderGridRowMock).toHaveBeenCalledTimes(2);
      expect(screen.getByTestId('custom-row-0')).toHaveTextContent(
        'Custom row: Value 1'
      );
    });

    it('uses renderGroupRow to customize group row rendering', () => {
      const renderGroupRowMock = jest.fn((row, key) => {
        return (
          <div key={key} data-testid={`custom-group-row-${key}`}>
            Custom group row: {row.values['groupName']}
          </div>
        );
      });
      const columns = [{ name: 'col1' }];
      const rows: DataGridRow[] = [
        { type: 'group', values: { groupName: 'Group 1' } },
        { type: 'row', values: { col1: 'Value 1' } },
      ];

      render(
        <DataGrid
          columns={columns}
          rows={rows}
          renderComponents={{ renderGroupRow: renderGroupRowMock }}
        />
      );

      expect(renderGroupRowMock).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('custom-group-row-0')).toHaveTextContent(
        'Custom group row: Group 1'
      );
      // Ensure the regular row is still rendered
      expect(screen.getByText('Value 1')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('renders correctly with no rows', () => {
      const columns = [
        { name: 'col1', label: 'Column 1' },
        { name: 'col2', label: 'Column 2' },
      ];
      const { container } = render(<DataGrid columns={columns} rows={[]} />);

      expect(screen.getByText('Column 1')).toBeInTheDocument();
      // The body should have a header div, but no other children.
      const body = container.querySelector('.dg-body');
      expect(body?.childElementCount).toBe(1); // Only header
      expect(body?.querySelector('.dg-header')).toBeInTheDocument();
      // The header has a .dg-row, but the body should not have any other data rows.
      const dataRows = container.querySelectorAll(
        '.dg-row[data-row-index]:not([data-row-index="-1"])'
      );
      expect(dataRows.length).toBe(0);
    });

    it('renders correctly with no columns', () => {
      const rows = [{ values: { col1: 'Value 1' } }];
      const { container } = render(<DataGrid columns={[]} rows={rows} />);
      const body = container.querySelector('.dg-body');
      // The body should have a header (which is empty) and one row, which is also empty.
      expect(body?.childElementCount).toBe(2);
      expect(
        container.querySelector('.dg-header')?.childElementCount
      ).toBe(1);
       expect(
        container.querySelector('.dg-row')?.childElementCount
      ).toBe(0);
    });

    it('uses custom rowId function to generate row IDs', () => {
      const columns = [{ name: 'col1' }];
      const rows = [
        { values: { id: 'first', col1: 'Value 1' } },
        { values: { id: 'second', col1: 'Value 2' } },
      ];
      const rowIdMock = jest.fn((row) => `custom-id-${row.values['id']}`);

      render(<DataGrid columns={columns} rows={rows} rowId={rowIdMock} />);

      // Called for the header row (-1) and two data rows (0, 1)
      expect(rowIdMock).toHaveBeenCalledTimes(3);
      expect(
        screen.getByText('Value 1').closest('.dg-row')
      ).toHaveAttribute('data-row-id', 'custom-id-first');
      expect(
        screen.getByText('Value 2').closest('.dg-row')
      ).toHaveAttribute('data-row-id', 'custom-id-second');
    });

    it('updates rendered rows when the rows prop changes', () => {
      const columns = [{ name: 'col1' }];
      const initialRows = [{ values: { col1: 'Initial Value' } }];
      const { rerender } = render(
        <DataGrid columns={columns} rows={initialRows} />
      );

      expect(screen.getByText('Initial Value')).toBeInTheDocument();

      const updatedRows = [{ values: { col1: 'Updated Value' } }];
      rerender(<DataGrid columns={columns} rows={updatedRows} />);

      expect(screen.queryByText('Initial Value')).not.toBeInTheDocument();
      expect(screen.getByText('Updated Value')).toBeInTheDocument();
    });

    it('handles cancellation of loadRows', async () => {
      mockIntersectionObserver([true]);
      const abortController = new AbortController();
      const loadRowsMock: LoadPageDataCallbackType = jest.fn(
        (_startIndex, _size, abortSignal) =>
          new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              resolve({ rows: [], totalCount: 0 });
            }, 500);
            abortSignal.addEventListener('abort', () => {
              clearTimeout(timeout);
              reject(new Error('aborted'));
            });
          })
      );

      render(
        <DataGrid
          columns={[{ name: 'col1' }]}
          rows={[]}
          totalRowCount={10}
          loadRows={loadRowsMock}
        />
      );

      // The placeholder is visible initially
      expect(screen.getByText('Loading row 0 ...')).toBeInTheDocument();

      act(() => {
        abortController.abort();
      });

      // The loadRows function should have been called
      await waitFor(() => expect(loadRowsMock).toHaveBeenCalled());

      // After aborting, the loading placeholder should disappear, and no new content should be rendered
      await waitFor(() => {
        expect(screen.queryByText('Loading row 0 ...')).not.toBeInTheDocument();
      });
    });
  });
});
