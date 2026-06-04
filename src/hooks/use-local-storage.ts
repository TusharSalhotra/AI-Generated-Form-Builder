'use client';

import { useState, useCallback, useSyncExternalStore } from 'react';

function getServerSnapshot<T>(initialValue: T): T {
  return initialValue;
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

/**
 * Custom hook for persisting state in localStorage
 * Uses useSyncExternalStore for safe hydration
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const getSnapshot = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  }, [key, initialValue]);

  const storedValue = useSyncExternalStore(subscribe, getSnapshot, () =>
    getServerSnapshot(initialValue)
  );

  const [localValue, setLocalValue] = useState<T>(storedValue);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(localValue) : value;
        setLocalValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          window.dispatchEvent(new Event('storage'));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, localValue]
  );

  return [localValue, setValue];
}
