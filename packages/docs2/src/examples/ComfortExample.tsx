"use client";

import React from "react";

import { EnvelopeIcon, EnvelopeOpenIcon } from "@heroicons/react/24/outline";

import { DataGrid, DataGridColumn, DataGridRow } from "@reveraie/datagrid";
import "@reveraie/datagrid/dist/index.css";

export default function ComfortExample() {
  const columns: DataGridColumn[] = [
    {
      name: "status",
      width: 32,
      allowResize: false,
      render: (value) => {
        return (
          <div>
            {value ? (
              <EnvelopeOpenIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            ) : (
              <EnvelopeIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
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
      name: "subject",
      label: "Subject",
      width: "*",
    },
    {
      name: "date",
      label: "Date",
      width: 100,
    },
  ];
  const rows: DataGridRow[] = [
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
  return (
    <DataGrid
      gridId="2"
      className="max-h-64 dg-comfort"
      columns={columns}
      rows={rows}
    />
  );
}
