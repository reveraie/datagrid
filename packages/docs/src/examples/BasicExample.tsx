"use client";

import {
  EnvelopeIcon,
  EnvelopeOpenIcon,
  StarIcon,
  PaperClipIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

import { DataGrid, DataGridColumn, DataGridRow } from "@reveraie/datagrid";
import "@reveraie/datagrid/dist/index.css";
import React, { useCallback, useState } from "react";

export default function BasicExample() {
  // DataGridColumn[]
  const columns: DataGridColumn[] = [
    {
      name: "status",
      width: 32,
      allowResize: false,
      render: (value) => {
        return (
          <div>
            {value ? (
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
      render: (value) => {
        return (
          <div onClick={handleStartClick}>
            {value ? (
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
      render: (value) => {
        return (
          <div>
            {value ? <PaperClipIcon className="w-full h-full" /> : null}
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
  const [rows, setRows] = useState<DataGridRow[]>([
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
  ]);

  const handleStartClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const row = (e.target as HTMLDivElement).closest(
        ".dg-row"
      ) as HTMLDivElement;
      if (!row) return;
      const rowIndex = Number(row.getAttribute("data-row-index"));
      setRows((prev) => {
        const updatedRows = [...prev];
        const row = updatedRows[rowIndex];
        updatedRows[rowIndex] = {
          ...row,
          values: {
            ...row.values,
            favorite: !row.values.favorite,
          },
        };
        return updatedRows;
      });
    },
    [rows]
  );

  return <DataGrid gridId="1" className="max-h-64" columns={columns} rows={rows} />;
}
