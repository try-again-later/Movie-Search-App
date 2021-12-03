import { useState, useCallback, useEffect } from 'react';

type ErrorCallback = (error: Error) => void;

function getFromLocalStorage<T>(key: string, errorCallback?: ErrorCallback): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch (error) {
    if (errorCallback != undefined) {
      errorCallback(error as Error);
    } else {
      console.error(error);
    }
    return null;
  }
}

type SetItemType<T> = T | ((prevValue: T | null) => T);

function useLocalStorage<T>(
  key: string,
  initialValue: T,
  errorCallback?: ErrorCallback,
): [T | null, (value: SetItemType<T>) => void] {
  const [item, setItem] = useState<T | null>(
    getFromLocalStorage<T>(key, errorCallback) ?? initialValue,
  );

  const setStoredItem = useCallback(
    (value: SetItemType<T>) => {
      try {
        setItem((prevValue) => (value instanceof Function ? value(prevValue) : value ?? null));
      } catch (error) {
        if (errorCallback != undefined) {
          errorCallback(error as Error);
        } else {
          console.error(error);
        }
      }
    },
    [errorCallback],
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(item));
  }, [item, key]);

  return [item, setStoredItem];
}

export default useLocalStorage;
