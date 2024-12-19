import { useEffect, useState, useRef } from 'react';

// Define the return type of the custom hook
type UseVisibleReturnType = {
  isVisible: boolean;
  ref: React.RefObject<HTMLDivElement | null>;
};

const useVisible = (
  threshold: number = 0.1,
  delay: number = 0
): UseVisibleReturnType => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null); // To store the timeout ID

  useEffect(() => {
    const current = ref.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Start the delay timer
          timeoutRef.current = setTimeout(() => {
            // After the delay, check if the div is still visible
            if (ref.current && observer) {
              setIsVisible(true);
              // observer.unobserve(ref.current); // Stop observing once visible
            }
          }, delay);
        } else {
          // If the div is no longer visible, clear the timeout
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          setIsVisible(false);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold,
      }
    );

    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
      // Clean up the timeout on unmount
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [threshold, delay]);

  return { isVisible, ref };
};

export default useVisible;
