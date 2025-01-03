import React, { useRef, useEffect, useState } from 'react';
import { CodeBlock } from './CodeBlock';
import clsx from 'clsx';

export function ExampleSection({ example, darkMode }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div ref={sectionRef}>
      <h2 className="text-2xl font-bold mb-6">{example.title}</h2>
      <div className='mb-6' >{example.description}</div>
      <div className="grid grid-cols-2 gap-8">
        <div className={clsx(
          'max-h-64 overflow-y-auto',
          'rounded-lg',
          darkMode ? 'bg-gray-800' : 'bg-gray-50'
        )}>
          <CodeBlock code={example.code} darkMode={darkMode} />
        </div>
        <div className={clsx(
          'rounded-lg',
          darkMode ? 'bg-gray-800' : 'bg-gray-50'
        )}>
          <div className="rounded-lg bg-white dark:bg-gray-700">
            {isVisible && example.component}
          </div>
        </div>
      </div>
    </div>
  );
}