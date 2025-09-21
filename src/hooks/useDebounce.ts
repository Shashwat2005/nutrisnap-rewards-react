// src/hooks/useDebounce.ts
import { useEffect, useState } from "react";

export default function useDebounce<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
