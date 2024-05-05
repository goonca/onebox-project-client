import { useCallback, useState } from 'react';

export type UseLocalStorageResponse<T> = {
  storedValue: T | string | undefined;
  setInLocalStorage: (value: T) => void;
  removeFromLocalStorage: () => void;
};

export const useLocalStorage = <T>(
  key: string,
  initialValue?: T
): UseLocalStorageResponse<T> => {
  const initialise = (key: string) => {
    let storageValue = null;

    try {
      let value: T | string | undefined;

      storageValue = localStorage.getItem(key);

      if (storageValue) {
        value = JSON.parse(storageValue);
      } else {
        const valueAsString =
          typeof initialValue === 'object'
            ? JSON.stringify(initialValue)
            : String(initialValue);
        if (valueAsString !== 'undefined') {
          localStorage.setItem(key, valueAsString);
          value = initialValue;
        }
      }
      return value;
    } catch (error) {
      return storageValue || initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T | string | undefined>(
    initialise(key)
  );

  const setInLocalStorage = useCallback(
    (value: T) => {
      try {
        const valueToStore =
          typeof value === 'object' ? JSON.stringify(value) : String(value);

        if (valueToStore !== 'undefined') {
          localStorage.setItem(key, valueToStore);
          setStoredValue(value);
        }
      } catch (error) {
        // For security get all errors. Do not need to do anything
      }
    },
    [key]
  );

  const removeFromLocalStorage = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setStoredValue(undefined);
    } catch (error) {
      // For security get all errors. Do not need to do anything
    }
  }, [key]);

  return { storedValue, setInLocalStorage, removeFromLocalStorage };
};
