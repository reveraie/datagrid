# @reveraie/datagrid

[![NPM version](https://img.shields.io/npm/v/@reveraie/datagrid.svg)](https://www.npmjs.com/package/@reveraie/datagrid)
[![License](https://img.shields.io/npm/l/@reveraie/datagrid.svg)](https://github.com/reveraie/datagrid/blob/main/LICENSE)

A lightweight, performant, and zero-dependency datagrid component for React.

The Reveraie DataGrid is designed for efficiently displaying large datasets in a tabular format. It's built from the ground up for performance and simplicity, with no third-party dependencies.

[**Explore the Docs, Demos, and Examples »**](https://reveraie.github.io/datagrid/)

## Features

- **High Performance:** Handles thousands of rows with ease using row virtualization and on-demand data loading.
- **Zero Dependency:** No third-party libraries (besides React). Drop it into any project without worrying about bloat.
- **Fully Customizable:** Use custom components to render cells and editors.
- **Rich Interaction:** Supports column resizing, reordering, data grouping, and in-cell editing.
- **Lightweight:** With a minimal API and a focus on core grid functionality, it's easy to learn, use, and extend.

## Installation

```bash
npm install @reveraie/datagrid
```

## Quick Start

1.  Import the component and its stylesheet.
2.  Provide an array of `columns` and `rows`.

```jsx
import React from 'react';
import { DataGrid } from '@reveraie/datagrid';
import '@reveraie/datagrid/dist/index.css';

const App = () => {
  const columns = [
    { name: 'id', label: 'ID', width: 80 },
    { name: 'name', label: 'Name' },
    { name: 'age', label: 'Age', width: 100 },
  ];

  const rows = [
    { values: { id: 1, name: 'John Doe', age: 35 } },
    { values: { id: 2, name: 'Jane Smith', age: 28 } },
    { values: { id: 3, name: 'Alice Johnson', age: 42 } },
  ];

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid columns={columns} rows={rows} />
    </div>
  );
};

export default App;
```

For advanced usage, including on-demand loading, custom renderers, and grouping, please [**visit our documentation site**](https://reveraie.github.io/datagrid/).

## Contributing

Contributions are welcome! Help us improve the tests, the documentation, and the component itself. Please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.
