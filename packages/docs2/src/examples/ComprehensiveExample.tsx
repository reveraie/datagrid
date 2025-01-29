"use client";

import React, { useCallback, useState } from "react";

import {
  EnvelopeIcon,
  EnvelopeOpenIcon,
  StarIcon,
  PaperClipIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

import { DataGrid, DataGridColumn, DataGridRow } from "@reveraie/datagrid";
import "@reveraie/datagrid/dist/index.css";

function SubjectEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  const [editValue, setEditValue] = useState(value);
  return (
    <input
      className="w-full h-full"
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          (e.target as HTMLInputElement).blur();
          onChange(e);
        }
      }}
    />
  );
}

// simulate data from external source...
const rows = [
  ...Array.from({ length: 1000 }, (_, index) => index).map(
    (_, index) =>
      ({
        type: "row",
        values: {
          status: false,
          from: `Row: ${index}`,
          favorite: true,
          subject: `Feature request ${index}`,
          attachments: 2,
          date: "2023-01-12",
        },
      }) as DataGridRow
  ),
];

export default function ComprehensiveExample() {
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
      name: "favorite",
      width: 32,
      allowResize: false,
      render: (value) => {
        return (
          <div onClick={handleStartClick}>
            {value ? (
              <StarIconSolid className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            ) : (
              <StarIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            )}
          </div>
        );
      },
    },
    {
      name: "subject",
      label: "Subject",
      width: "*",
      render: (value) => {
        return (
          <SubjectEditor value={value as string} onChange={handleSubjectEdit} />
        );
      },
    },
    {
      name: "attachments",
      width: 32,
      allowResize: false,
      render: (value) => {
        return (
          <div>
            {value ? <PaperClipIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" /> : null}
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

  const [loadedRows, setLoadedRows] = useState([]);

  const handleStartClick = useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      const row = (e.target as HTMLInputElement).closest(".dg-row");
      const rowIndex = row?.getAttribute("data-row-index");
      if (!rowIndex) return;
      console.log(`Editing row ${rowIndex}`);
      const rowNumber = Number(rowIndex);
      rows[rowNumber].values.favorite = !rows[rowNumber].values.favorite;

      setLoadedRows((prev) => [...prev]); // just cause prop change and reload of the DataGrid
    },
    []
  );

  const handleSubjectEdit = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const row = (e.target as HTMLInputElement).closest(".dg-row");
      const value = (e.target as HTMLInputElement).value;
      const rowIndex = row?.getAttribute("data-row-index");
      if (!rowIndex) return;
      const rowNumber = Number(rowIndex);
      console.log(`Editing subject at row ${rowIndex}`, value);
      // call the backend to persist the value
      // the grid will call loadRows to read the actual value persisted
      rows[rowNumber].values.subject = value;
      setLoadedRows((prev) => [...prev]); // just cause prop change and reload of the DataGrid
    },
    []
  );

  const loadRows = useCallback(async (startIndex: number, size: number) => {
    console.log(`Loading rows from ${startIndex} to ${startIndex + size}`);
    // simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    return { rows: rows.slice(startIndex, startIndex + size) };
  }, []);

  return (
    <DataGrid
      gridId="comprehensive-example"
      className="max-h-64 dg-comfort"
      columns={columns}
      rows={loadedRows} // rows will be loaded on demand -- we provide an empty array here
      totalRowCount={rows.length} // optional, defaults to the rows.length if rows are provided
      pageSize={10} // optional, default is 100. we lower the value for demo purposes
      loadRows={loadRows} // required for on-demand loading
    />
  );
}
