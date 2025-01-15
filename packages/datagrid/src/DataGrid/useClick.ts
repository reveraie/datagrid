import { useRef } from 'react';

interface UseClickOptions {
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  onDoubleClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  delay?: number; // Delay to distinguish single and double clicks (default: 250ms)
}

export const useClick = ({
  onClick,
  onDoubleClick,
  delay = 250,
}: UseClickOptions) => {
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    } else {
      clickTimeoutRef.current = setTimeout(() => {
        onClick(event); // Trigger single click handler
        clickTimeoutRef.current = null;
      }, delay);
    }
  };

  const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }
    onDoubleClick(event); // Trigger double click handler
  };

  return {
    onClick: handleClick,
    onDoubleClick: handleDoubleClick,
  };
};
