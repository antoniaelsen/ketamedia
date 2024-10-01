import { useState } from "react";

const useLocalStorage = <T>(
  key: string,
  defaultValue?: T
): [T, (value: T) => void] => {
  const getStoredValue = (): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      return defaultValue as T;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // pass
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
