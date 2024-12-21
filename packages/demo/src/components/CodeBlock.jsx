import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

export function CodeBlock({ code, darkMode }) {
  return (
    <SyntaxHighlighter
      language="jsx"
      style={darkMode ? tomorrow : prism}
      customStyle={{
        margin: 0,
        borderRadius: '0.5rem',
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
}