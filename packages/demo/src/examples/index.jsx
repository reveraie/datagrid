import { BasicExample } from './BasicExample';
import { GroupsExample } from './GroupsExample';
import { ComfortExample } from './ComfortExample';
import { TenThousandRowsExample } from './TenThousandRowsExample';
import { ComprehensiveExample } from './ComprehensiveExample';

export const examples = [
  {
    title: 'Basic Usage',
    component: <BasicExample />,
    description: 'Basic usage of the DataGrid component. Provide the columns and rows props.',
    code: `import { DataGrid } from "@reveraie/datagrid";
import "@reveraie/datagrid/dist/index.css";

export function BasicExample() {
  const columns = [
    {
      name: "status",
      width: 32,
      allowResize: false,
      render: (column, row, index) => {
        return (
          <div>
            {row.values[column.name] ? (
              <EnvelopeOpenIcon className="w-full h-full" />
            ) : (
              <EnvelopeIcon className="w-full h-full" />
            )}
          </div>
        );
      },
    },
    {
      name: "from",
      label: "From",
      width: 100,
    },
    {
      name: "favorite",
      width: 32,
      allowResize: false,
      render: (column, row, index) => {
        return (
          <div>
            {row.values[column.name] ? (
              <StarIconSolid className="w-full h-full" />
            ) : (
              <StarIcon className="w-full h-full" />
            )}
          </div>
        );
      },
    },
    {
      name: "subject",
      label: "Subject",
      width: "*",
    },
    {
      name: "attachments",
      width: 32,
      allowResize: false,
      render: (column, row, index) => {
        return (
          <div>
            {row.values[column.name] ? (
              <PaperClipIcon className="w-full h-full" />
            ) : null}
          </div>
        );
      },
    },
    {
      name: "date",
      label: "Date",
      width: 100,
    },
  ];
  const rows = [
    {
      values: {
        status: true,
        from: "Bob Wilson",
        favorite: true,
        subject: "Important announcement",
        attachments: 3,
        date: "2023-01-01",
      },
    },
    {
      values: {
        status: false,
        from: "John Doe",
        favorite: false,
        subject: "New feature request",
        attachments: 0,
        date: "2023-01-02",
      },
    },
    {
      values: {
        status: true,
        from: "Alice Smith",
        favorite: false,
        subject: "Sales update",
        attachments: 2,
        date: "2023-01-03",
      },
    },
    {
      values: {
        status: false,
        from: "Mike Johnson",
        favorite: true,
        subject: "Bug report",
        attachments: 1,
        date: "2023-01-04",
      },
    },
    {
      values: {
        status: true,
        from: "Emily Davis",
        favorite: false,
        subject: "Feature request",
        attachments: 0,
        date: "2023-01-05",
      },
    },
    {
      values: {
        status: false,
        from: "David Brown",
        favorite: true,
        subject: "Bug report",
        attachments: 2,
        date: "2023-01-06",
      },
    },
    {
      values: {
        status: true,
        from: "Sophia Wilson",
        favorite: false,
        subject: "Sales update",
        attachments: 1,
        date: "2023-01-07",
      },
    },
    {
      values: {
        status: false,
        from: "James Smith",
        favorite: true,
        subject: "Bug report",
        attachments: 0,
        date: "2023-01-08",
      },
    },
    {
      values: {
        status: true,
        from: "Olivia Johnson",
        favorite: false,
        subject: "Feature request",
        attachments: 2,
        date: "2023-01-09",
      },
    },
    {
      values: {
        status: false,
        from: "Liam Davis",
        favorite: true,
        subject: "Sales update",
        attachments: 1,
        date: "2023-01-10",
      },
    },
    {
      values: {
        status: true,
        from: "Emma Brown",
        favorite: false,
        subject: "Bug report",
        attachments: 0,
        date: "2023-01-11",
      },
    },
    {
      values: {
        status: false,
        from: "Noah Wilson",
        favorite: true,
        subject: "Feature request",
        attachments: 2,
        date: "2023-01-12",
      },
    },
  ];
  return <DataGrid className="max-h-64" columns={columns} rows={rows} />;
}
`,
  },
  {
    title: 'Comfort Spacing',
    component: <ComfortExample />,
    description: '"Compact" and "comfortable" spacing between columns is supported in-the-box. Since the DataGrid components has no third-party dependencies to styling libraries, all the styling is done in the DataGrid.css file. You can customize all aspects of the grid by importing your version of it.',
    code: `import { DataGrid } from "@reveraie/datagrid";
import "@reveraie/datagrid/dist/index.css";

export function ComfortExample() {
  // ...
  return (
    <DataGrid 
      className="dg-comfort" 
      columns={columns} 
      rows={rows} />
  );
}`,
  },
  {
    title: 'Group Rows',
    description: `The grid supports two types of rows - "group" and "row". The grid will render a group row when the "type" property of the row is "group". The grid will render a row when the "type" property of the row is "row".`,
    component: <GroupsExample />,
    code: `import { DataGrid } from "@reveraie/datagrid";
import "@reveraie/datagrid/dist/index.css";

export function GroupsExample() {
  const columns = [
    // ...
  ];
  const rows = [
    {
      type: "group",
      values: {
        Since: "Today",
      },
    },
    {
      values: {
        status: true,
        from: "Bob Wilson",
        favorite: true,
        subject: "Important announcement",
        attachments: 3,
        date: "2023-01-01",
      },
    },
    // ...
    {
      type: "group",
      values: {
        Since: "Yesterday",
      },
    },
    {
      values: {
        status: true,
        from: "Emily Davis",
        favorite: false,
        subject: "Feature request",
        attachments: 0,
        date: "2023-01-05",
      },
    },
    // ...
  ];
  return <DataGrid
    columns={columns} 
    rows={rows} />;
}
`,
  },
  {
    title: '10000 Rows',
    description: `The first rows displayed are the rows provided with the rows prop. The remaining rows are fetched on-demand by calling the loadRows callback. The "paging" tecnique of the grid is designed to handle up to 100,000 row. More than 100k rows may required optimizing the loading placeholders.`,
    component: <TenThousandRowsExample />,
    code: `import { DataGrid } from "@reveraie/datagrid";
import "@reveraie/datagrid/dist/index.css";

export function TenThousandRowsExample() {
  // DataGridColumn[]
  const columns = [
    // ...
  ];
  const rows = [
    // several rows. if left empty, all the rows will be loaded on-demand
  ];

  // (startIndex: number, size: number,  abortSignal: AbortSignal) => Promise<DataGridRow[]>;
  const loadRows = useCallback(async (startIndex, size) => {
    // simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    // generate some data on the fly
    const result = Array.from(
      { length: size },
      (_, index) => index + startIndex
    ).map((_, index) => ({
      type: "row",
      values: {
        status: false,
        from: \`Row: \${startIndex + index}\`,
        favorite: true,
        subject: \`Feature request \${startIndex + index}\`,
        attachments: 2,
        date: "2023-01-12",
      },
    }));
    return result;
  });

  const loadingPlaceholder = useCallback((startIndex, size) => {
    return Array.from({ length: size }, (_, index) => index + startIndex).map(
      (_, index) => (
        <div
          key={startIndex + index}
          className="dg-row dg-row-loading h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 full-width mb-4"
        ></div>
      )
    );
  });

  return (
    <DataGrid
      className="max-h-64"
      columns={columns}
      rows={rows} // the first "static" rows
      totalRowCount={10000} // provide the total rows count
      loadRows={loadRows} // load rows on demand
      placeholder={loadingPlaceholder} // what component to display as a placeholder
    />
  );
}
`,
  },
  {
    title: 'Edit Cells Example',
    component: <ComprehensiveExample />,
    description: 'This example shows dynaic row loading and cell editing. Edit the value of the Subject and Favorite columns.',
    code: `// ...
export function ComprehensiveExample() {
  const columns = [
    // ...
    {
      name: "favorite",
      width: 32,
      allowResize: false,
      render: (column, row, index) => {
        return (
          <div onClick={handleStartClick}>
            {row.values[column.name] ? (
              <StarIconSolid className="w-full h-full" />
            ) : (
              <StarIcon className="w-full h-full" />
            )}
          </div>
        );
      },
    },
    {
      name: "subject",
      label: "Subject",
      width: "*",
      render: (column, row, index) => {
        return (
          <SubjectEditor
            value={row.values[column.name]}
            onChange={handleSubjectEdit}
          />
        );
      },
    },
    // ...
  ];

  const handleSubjectEdit = useCallback((e) => {
    const row = e.target.closest(".dg-row");
    const rowIndex = row.attributes["data-row-id"].value;
    // call the backend to persist the value
    // the grid will call loadRows to read the actual value persisted
    rows[rowIndex].values.subject = e.target.value;
    setLoadedRows((prev) => [...prev]); // just cause prop change and reload of the DataGrid
  }, []);

  const loadRows = useCallback(
    // simulate on-demand loading form and array rows ...
    async (startIndex, size) => {
      // simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 100));
      return rows.slice(startIndex, startIndex + size);
    },
    []
  );

  return (
    <DataGrid
      columns={columns}
      rows={[]} // rows will be loaded on demand -- we provide an empty array here
      totalRowCount={rows.length} // optional, defaults to the rows.length if rows are provided
      pageSize={10} // optional, default is 100. we lower the value for demo purposes
      loadRows={loadRows} // required for on-demand loading
    />
  );
}
    `
  },
];