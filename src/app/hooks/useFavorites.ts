'use client';

import { useState, useEffect, useCallback } from 'react';

export type FavoriteItem = {
  id: string;
  type: 'cocktail' | 'meal';
  name: string;
  thumb: string;
};

const STORAGE_KEY = 'sip-and-savor-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const persist = (items: FavoriteItem[]) => {
    setFavorites(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  };

  const isFavorited = useCallback(
    (id: string) => favorites.some(f => f.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (item: FavoriteItem) => {
      const exists = favorites.some(f => f.id === item.id);
      persist(exists ? favorites.filter(f => f.id !== item.id) : [item, ...favorites]);
    },
    [favorites]
  );

  return { favorites, isFavorited, toggleFavorite };
}
