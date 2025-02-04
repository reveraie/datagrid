import { useCallback, useRef } from 'react';

function widthValue(size: string | number | undefined) {
  if (size === '*') {
    return `flex-grow: 1;`;
  }
  if (typeof size === 'number') {
    return `width: ${(size / 16).toFixed(2)}em;`;
  }
  if (typeof size === 'undefined') {
    return 'width: 6.25em;'; // 100 pixels
  }
  return size;
}

function styleContent(id: string, widths: (string | number | undefined)[]) {
  const styles = `.dg-grid-${id} {${widths
    .map(
      (size, index) =>
        `.dg-row .dg-cell:nth-child(${index + 1}) { ${widthValue(size)} }`
    )
    .join('\n')}}`;
  return styles;
}

function styleId(id: string) {
  return `dg-grid-style-${id}`;
}

function updateStyle(id: string, widths: (string | number | undefined)[]) {
  const styleElement = document.getElementById(styleId(id));
  if (!styleElement) return;
  const styles = styleContent(id, widths);
  styleElement.textContent = styles;
}

function useColumnSize(
  id: string,
  initialWidths: (string | number | undefined)[]
) {
  const widths = useRef([...initialWidths]); // Keep track of current widths

  // Method to change the size of a specific column
  const changeSize = useCallback(
    (index: number, newSize: number | string | undefined) => {
      if (index >= 0 && index < widths.current.length) {
        widths.current[index] = newSize;
        updateStyle(id, widths.current);
      }
    },
    [id]
  );

  return {
    changeSize,
    styleElement: (
      <style id={styleId(id)}>{styleContent(id, widths.current)}</style>
    ),
  };
}

export default useColumnSize;
