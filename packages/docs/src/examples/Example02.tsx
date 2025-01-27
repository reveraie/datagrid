"use client";

import { DataGrid } from "@reveraie/datagrid";

import "@reveraie/datagrid/dist/index.css";

export default function Example02() {
  const columns = [
    { name: "id", label: "ID", width: 70 },
    { name: "name", label: "Name", width: 130 },
    { name: "age", label: "Age", width: 90 },
  ];

  const rows = [
    { type: "group", values: { display: "Group 1" } },
    { values: { id: 1, name: "John Doe", age: 35 } },
    { type: "group", values: { display: "Group 2" } },
    { values: { id: 2, name: "Jane Smith", age: 28 } },
    { values: { id: 3, name: "Alice Johnson", age: 42 } },
  ];

  return (
    <div>
      <DataGrid gridId="e3" className="max-h-[650px]" columns={columns} rows={rows} />
    </div>
  );
}
