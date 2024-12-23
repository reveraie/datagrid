import React, { useCallback } from "react";

import {
  EnvelopeIcon,
  EnvelopeOpenIcon,
  StarIcon,
  PaperClipIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

import { DataGrid } from "@reveraie/datagrid";
import "@reveraie/datagrid/dist/index.css";

export function TenThousandRowsExample() {
  // DataGridColumn[]
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
        from: `Row: ${startIndex + index}`,
        favorite: true,
        subject: `Feature request ${startIndex + index}`,
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
