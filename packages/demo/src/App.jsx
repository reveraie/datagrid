import React from 'react';
import { ExampleLayout } from './components/ExampleLayout';
import { examples } from './examples/index';

function App() {
  return (
    <ExampleLayout examples={examples} />
  );
}

export default App;