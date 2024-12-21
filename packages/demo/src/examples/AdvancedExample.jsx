import React from 'react';

export function AdvancedExample() {
  const handleClick = () => {
    alert('Event handled!');
  };

  return (
    <div className="p-4 border rounded">
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Click me!
      </button>
    </div>
  );
}