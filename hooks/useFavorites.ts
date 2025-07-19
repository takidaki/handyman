
import { useState, useEffect, useCallback } from 'react';
import { Tip } from '../types';

const STORAGE_KEY = 'diy_pro_assistant_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Tip[]>([]);

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(STORAGE_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Could not load favorites from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Could not save favorites to localStorage", error);
    }
  }, [favorites]);

  const addFavorite = useCallback((tip: Tip) => {
    setFavorites((prev) => {
      if (prev.some(f => f.id === tip.id)) {
        return prev;
      }
      return [...prev, tip];
    });
  }, []);

  const removeFavorite = useCallback((tipId: string) => {
    setFavorites((prev) => prev.filter((tip) => tip.id !== tipId));
  }, []);

  const isFavorite = useCallback((tipId: string): boolean => {
    return favorites.some((tip) => tip.id === tipId);
  }, [favorites]);

  return { favorites, addFavorite, removeFavorite, isFavorite };
};
