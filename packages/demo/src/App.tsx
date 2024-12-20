import { ReactNode, useState } from 'react';
import './App.css';
import Example1 from './examples/Example1';
import Example2 from './examples/Example2';

const examples: Record<string, ReactNode> = {
  'Example 1': <Example1 />,
  'Example 2': <Example2 />,
};

function App() {
  const [currentExample, setCurrentExample] = useState('Example 1');

  return (
    <>
      <h1>Reveraie React DataGrid</h1>

      <section>
        {Object.keys(examples).map((key) => {
          return (
            <div key={key} onClick={() => setCurrentExample(key)}>
              <h2>{key}</h2>
            </div>
          );
        })}
      </section>
      <div className="card">
        {examples[currentExample]}
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </>
  );
}

export default App;
