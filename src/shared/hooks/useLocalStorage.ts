
export type UseLocalStorageResponse<T> = {
  setLocalStorage: (value: T) => void;
  getLocalStorage: () => T | string | undefined | null;
  removeLocalStorage: () => void;
  initialise: (key: string) => void;
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

  initialise(key);

  const getLocalStorage = () => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : item;
  };
  const setLocalStorage = (value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
  };
  const removeLocalStorage = () => {
    localStorage.removeItem(key);
  };

  return { setLocalStorage, getLocalStorage, removeLocalStorage, initialise };
};
