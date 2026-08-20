'use client';

import { useState, useEffect, useCallback } from 'react';
import { HistoryItem } from '@/types/generator';

const STORAGE_KEY = 'securepass_history_v1';

export function usePasswordHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      let stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        const legacyStored = localStorage.getItem('aether_cipher_history_v2');
        if (legacyStored) {
          stored = legacyStored;
          localStorage.setItem(STORAGE_KEY, legacyStored);
          localStorage.removeItem('aether_cipher_history_v2');
        }
      }
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load password history:', e);
    } finally {
      setLoaded(true);
    }
  }, []);

  const saveToStorage = useCallback((items: HistoryItem[]) => {
    setHistory(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save password history:', e);
    }
  }, []);

  const addToHistory = useCallback(
    (item: Omit<HistoryItem, 'id' | 'timestamp' | 'isFavorite'>) => {
      setHistory((prev) => {
        // Avoid duplicate consecutive adds
        if (prev.length > 0 && prev[0].value === item.value) {
          return prev;
        }
        const newItem: HistoryItem = {
          ...item,
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          timestamp: Date.now(),
          isFavorite: false,
        };
        const updated = [newItem, ...prev].slice(0, 50);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });
    },
    []
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      setHistory((prev) => {
        const updated = prev.map((item) =>
          item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
        );
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });
    },
    []
  );

  const toggleFavoriteByValue = useCallback(
    (value: string) => {
      setHistory((prev) => {
        const index = prev.findIndex((item) => item.value === value);
        if (index === -1) return prev;
        const updated = prev.map((item) =>
          item.value === value ? { ...item, isFavorite: !item.isFavorite } : item
        );
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });
    },
    []
  );

  const removeHistoryItem = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  }, []);

  const clearHistory = useCallback((keepFavorites = true) => {
    setHistory((prev) => {
      const updated = keepFavorites ? prev.filter((item) => item.isFavorite) : [];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  }, []);

  return {
    history,
    loaded,
    addToHistory,
    toggleFavorite,
    toggleFavoriteByValue,
    removeHistoryItem,
    clearHistory,
  };
}
