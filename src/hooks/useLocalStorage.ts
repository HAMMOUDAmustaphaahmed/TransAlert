import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    // Vérifier si nous sommes côté client
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(key);
        if (item !== null) {
          const parsedValue = JSON.parse(item);
          
          // Ne mettre à jour que si la valeur est différente
          if (JSON.stringify(parsedValue) !== JSON.stringify(storedValue)) {
            setStoredValue(parsedValue);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [key, storedValue]); // Ajout de storedValue comme dépendance

  useEffect(() => {
    // Sauvegarder dans localStorage côté client uniquement
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.error(error);
      }
    }
  }, [key, storedValue]); // Sauvegarder quand storedValue change

  return [storedValue, setStoredValue];
}