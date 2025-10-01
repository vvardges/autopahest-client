import { useEffect, useState } from "react";

/**
 * useDebounce - delays a value update until after a timeout
 * @param value - the changing value (e.g. search query)
 * @param delay - debounce delay in ms (default: 300)
 * @returns debounced value
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
