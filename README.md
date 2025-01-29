# Reveraie DataGrid

## Overview

The Reveraie DataGrid is a dynamic React component designed for efficiently displaying and managing large datasets in a tabular format. It supports virtualization and dynamic data loading to handle extensive data volumes with ease.

The component has zero dependencies on third-party libraries (except for React). This makes it easy to simply copy/paste the component into your codebase and start customizing it right away.

## Features

- **Virtualization**: Render only the visible rows (divided by pages) for improved performance with large data sets.
- **Customizable**: Easily customizable styles and behaviors to suit your application's needs.
- **Grouping**: Group rows provided with the data.
- **Zero dependency**: No third-party dependency.

## Installation

To install the Reveraie DataGrid component, use npm or yarn:

```bash
npm install @reveraie/datagrid
```

or

```bash
yarn add @reveraie/datagrid
```

or just copy the `packages/datagrid/src/DataGrid` folder in your project.

## How to use it

Here's a basic example of how to use the DataGrid component in a React application:

```jsx
import React from "react";

import DataGrid from "@reveraie/datagrid";
// import the styles
import "@reveraie/datagrid/dist/index.css";

const App = () => {
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
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
};

export default App;
```

For dynamic loading, provide the loadRows and placeholder props:

```jsx
import React from "react";

import DataGrid from "@reveraie/datagrid";
// import the styles
import "@reveraie/datagrid/dist/index.css";

const App = () => {
  const columns = [
    { name: "id", label: "ID", width: 70 },
    { name: "name", label: "Name", width: 130 },
    { name: "age", label: "Age", width: 90 },
  ];

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
        id: startIndex + index,
        name: `Row: ${startIndex + index}`,
        age: 100
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
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        columns={columns}
        rows={[]} // all rows are loaded on-demand
        totalRowCount={10000} // provide the total rows count
        loadRows={loadRows} // load rows on demand
        placeholder={loadingPlaceholder} // what to display as a placeholder
      />
    </div>
  );
};

export default App;
```

## Documentation and examples

[Demo and Examples](https://reveraie.github.io/datagrid/)

## Background and design philosophy

This project is part of the Reveraie CRM ecosystem. It will remain in active development until the release of Reveraie CRM version 1.0.0. While there are several grid components available, most of them offer an extensive range of features that may not be necessary for every use case. To address this, we have developed a lightweight component that focuses on the core functionalities of data loading and virtualized rendering, enabling users to tailor additional features as needed.

## Contributing

Contributions are welcome!

Help us improve the tests, the documentation and the component!

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/reveraie/datagrid/blob/main/LICENSE) file for more details.
