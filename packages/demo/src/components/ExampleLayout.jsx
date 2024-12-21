import React, { useState, useRef, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { CodeBlock } from './CodeBlock';
import clsx from 'clsx';
import { ExampleSection } from './ExampleSection';

import './light-dark-simulation.css';

export function ExampleLayout({ examples }) {
  const [darkMode, setDarkMode] = useState(false);
  const mainContentRef = useRef(null);
  const exampleRefs = useRef([]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.setAttribute("data-theme", !darkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
  };

  const scrollToExample = (index) => {
    exampleRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={clsx(
      'min-h-screen',
      darkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'
    )}>
      <div className="flex">
        {/* Sidebar */}
        <div className={clsx(
          'w-64 h-screen fixed left-0 p-4 border-r overflow-y-auto',
          darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        )}>
          <h1 className="text-xl font-bold mb-6">Examples</h1>
          <nav className="space-y-2">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => scrollToExample(index)}
                className={clsx(
                  'w-full text-left px-4 py-2 rounded-lg transition-colors',
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                )}
              >
                {example.title}
              </button>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="ml-64 flex-1" ref={mainContentRef}>
          {/* Dark mode toggle */}
          <div className="fixed top-4 right-4 z-10">
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

          {/* Example sections */}
          <div className="p-8 space-y-16">
            {examples.map((example, index) => (
              <div
                key={index}
                ref={el => exampleRefs.current[index] = el}
                className="scroll-mt-8"
              >
                <ExampleSection
                  example={example}
                  darkMode={darkMode}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}