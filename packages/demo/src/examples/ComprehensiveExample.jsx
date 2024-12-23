import React, { useCallback, useState } from "react";

import {
  EnvelopeIcon,
  EnvelopeOpenIcon,
  StarIcon,
  PaperClipIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

import { DataGrid } from "@reveraie/datagrid";
import "@reveraie/datagrid/dist/index.css";

function SubjectEditor({ value, onChange }) {
  const [editValue, setEditValue] = useState(value);
  return (
    <input
      className="w-full h-full"
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.target.blur();
          onChange(e);
        }
      }}
    />
  );
}

// simulate data from external source...
const rows = [
  ...Array.from({ length: 1000 }, (_, index) => index).map((_, index) => ({
    type: "row",
    values: {
      status: false,
      from: `Row: ${index}`,
      favorite: true,
      subject: `Feature request ${index}`,
      attachments: 2,
      date: "2023-01-12",
    },
  })),
];

export function ComprehensiveExample() {
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

  const [loadedRows, setLoadedRows] = useState([]);

  const handleStartClick = useCallback((e) => {
    const row = e.target.closest(".dg-row");
    const rowIndex = row.attributes["data-row-id"].value;
    console.log(`Editing row ${rowIndex}`);
    rows[rowIndex].values.favorite = !rows[rowIndex].values.favorite;

    setLoadedRows((prev) => [...prev]); // just cause prop change and reload of the DataGrid
  }, []);

  const handleSubjectEdit = useCallback((e) => {
    const row = e.target.closest(".dg-row");
    const rowIndex = row.attributes["data-row-id"].value;
    console.log(`Editing subject at row ${rowIndex}`, e.target.value);
    // call the backend to persist the value
    // the grid will call loadRows to read the actual value persisted
    rows[rowIndex].values.subject = e.target.value;
    setLoadedRows((prev) => [...prev]); // just cause prop change and reload of the DataGrid
  }, []);

  const loadRows = useCallback(
    async (startIndex, size) => {
      console.log(`Loading rows from ${startIndex} to ${startIndex + size}`);
      // simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 100));
      return rows.slice(startIndex, startIndex + size);
    },
    []
  );

  return (
    <DataGrid
      className="max-h-64 dg-comfort"
      columns={columns}
      rows={loadedRows} // rows will be loaded on demand -- we provide an empty array here
      totalRowCount={rows.length} // optional, defaults to the rows.length if rows are provided
      pageSize={10} // optional, default is 100. we lower the value for demo purposes
      loadRows={loadRows} // required for on-demand loading
    />
  );
}
