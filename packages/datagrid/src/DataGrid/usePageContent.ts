import { JSX, ReactNode, useEffect, useRef, useState } from 'react';
import { LoadPageContentCallbackType } from './DataGridPage';

const debug_log: (...args: unknown[]) => void = (..._args) => {
  // console.log(...args);
};

export function usePageContent(
  isVisible: boolean,
  startIndex: number,
  size: number,
  loadingContentPlaceholder: JSX.Element[],
  loadRows: LoadPageContentCallbackType
) {
  const [content, setContent] = useState<ReactNode[]>(
    loadingContentPlaceholder
  );
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!isVisible) {
      debug_log('page no longer visible', startIndex);
      setContent(loadingContentPlaceholder);
      if (abortControllerRef.current) {
        debug_log('loading aborted -- no longer visible', startIndex, size);
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      return;
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    debug_log('loading started', startIndex, size);
    loadRows(startIndex, size, abortController.signal)
      .then((result) => {
        if (!abortController.signal.aborted) {
          debug_log('loading completed', startIndex, size, result);
          setContent(result);
        }
      })
      .catch((error) => {
        console.error(`Page ${startIndex} failed to load:`, error);
      })
      .finally(() => {
        if (abortControllerRef.current === abortController) {
          abortControllerRef.current = null;
        }
      });

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [isVisible, startIndex, size, loadRows, loadingContentPlaceholder]);

  return [content];
}
