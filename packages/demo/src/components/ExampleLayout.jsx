import React, { useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { CodeBlock } from './CodeBlock';
import clsx from 'clsx';

export function ExampleLayout({ examples }) {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedExample, setSelectedExample] = useState(0);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={clsx(
      'min-h-screen',
      darkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'
    )}>
      <div className="flex">
        {/* Sidebar */}
        <div className={clsx(
          'w-64 h-screen fixed left-0 p-4 border-r',
          darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        )}>
          <h1 className="text-xl font-bold mb-6">Examples</h1>
          <nav className="space-y-2">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => setSelectedExample(index)}
                className={clsx(
                  'w-full text-left px-4 py-2 rounded-lg transition-colors',
                  selectedExample === index
                    ? (darkMode ? 'bg-gray-700' : 'bg-gray-200')
                    : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
                )}
              >
                {example.title}
              </button>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="ml-64 flex-1">
          {/* Dark mode toggle */}
          <div className="fixed top-4 right-4">
            <button
              onClick={toggleDarkMode}
              className={clsx(
                'p-2 rounded-lg',
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              )}
            >
              {darkMode ? (
                <SunIcon className="w-6 h-6" />
              ) : (
                <MoonIcon className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Example content */}
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">{examples[selectedExample].title}</h2>
            <div className="grid grid-cols-2 gap-8">
              <div className={clsx(
                'p-6 rounded-lg',
                darkMode ? 'bg-gray-800' : 'bg-gray-50'
              )}>
                <h3 className="text-lg font-semibold mb-4">Code</h3>
                <CodeBlock code={examples[selectedExample].code} darkMode={darkMode} />
              </div>
              <div className={clsx(
                'p-6 rounded-lg',
                darkMode ? 'bg-gray-800' : 'bg-gray-50'
              )}>
                <h3 className="text-lg font-semibold mb-4">Result</h3>
                <div className="p-4 rounded-lg bg-white dark:bg-gray-700">
                  {examples[selectedExample].component}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}