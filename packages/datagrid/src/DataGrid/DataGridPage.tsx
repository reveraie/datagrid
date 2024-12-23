import { JSX, ReactNode, useMemo } from 'react';
import useVisible from './useVisible';
import { usePageContent } from './usePageContent';
import React from 'react';

export type LoadPageContentCallbackType = (
  startIndex: number,
  size: number,
  abortSignal: AbortSignal
) => Promise<ReactNode[]>;

export type LoadPageContentPlaceholderCallbackType = (
  startIndex: number,
  size: number
) => JSX.Element[];

interface GridPageProps {
  startIndex: number;
  size: number;
  loadRows: LoadPageContentCallbackType;
  placeholder?: LoadPageContentPlaceholderCallbackType;
  timeout?: number;
}

const debug_log: (...args: unknown[]) => void = (...args) => {
  console.log(...args);
};

function createLoadingContent(startIndex: number, size: number) {
  return Array.from({ length: size }, (_, index) => index + startIndex).map(
    (_, index) => (
      <div key={startIndex + index} className="dg-row dg-row-loading">
        Loading row {startIndex + index} ...
      </div>
    )
  );
}

function GridPage({
  startIndex,
  size,
  loadRows,
  placeholder,
  timeout,
}: GridPageProps) {
  const loadTimeout = timeout || 100;
  const { isVisible, ref } = useVisible(0, loadTimeout);
  debug_log(
    `GridPage reload: ${startIndex} is ${isVisible ? 'visible' : 'not visible'}`
  );

  const loadingContentPlaceholder = useMemo(() => {
    return placeholder
      ? placeholder(startIndex, size)
      : createLoadingContent(startIndex, size);
  }, [placeholder, startIndex, size]);

  const [content] = usePageContent(
    isVisible,
    startIndex,
    size,
    loadingContentPlaceholder,
    loadRows
  );

  return (
    <div ref={ref} className="dg-page">
      {content}
    </div>
  );
}

export default GridPage;
