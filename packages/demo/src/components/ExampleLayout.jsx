import React, { useState, useRef, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { ExampleSection } from './ExampleSection';

import './light-dark-simulation.css';

export function ExampleLayout({ examples }) {
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    const systemPrefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    setDarkMode(systemPrefersDark);
    document.documentElement.setAttribute("data-theme", systemPrefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', systemPrefersDark);
  }, []);

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
          'w-60 h-screen fixed left-0 p-4 border-r overflow-y-auto',
          darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        )}>
          <h1 className="text-xl font-bold mb-6">Reveraie DataGrid</h1>
          <nav className="space-y-2">
            <a href="https://github.com/reveraie/datagrid" target="_blank" rel="noreferrer" className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.01-1.021-.014-1.852-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.621.069-.608.069-.608 1.004.07 1.533 1.032 1.533 1.032.892 1.528 2.341 1.087 2.91.831.091-.647.35-1.087.637-1.337-2.221-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.8c.85.004 1.705.116 2.505.34 1.91-1.294 2.75-1.025 2.75-1.025.545 1.378.202 2.397.1 2.65.64.7 1.028 1.592 1.028 2.683 0 3.841-2.337 4.687-4.565 4.936.359.31.679.923.679 1.86 0 1.343-.012 2.425-.012 2.753 0 .267.18.579.688.481C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">View on Github</span>
            </a>
          </nav>
          <h1 className="text-xl font-bold mb-6 pt-8">Examples</h1>
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