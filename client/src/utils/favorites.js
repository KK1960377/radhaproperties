import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "rp_favorite_properties";

function readFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Small pub-sub so every component using the hook stays in sync when a
// favorite is toggled from anywhere on the page (card grid, detail page, etc).
const listeners = new Set();
function broadcast(ids) {
  listeners.forEach((fn) => fn(ids));
}

export function useFavorites() {
  const [ids, setIds] = useState(readFavorites);

  useEffect(() => {
    listeners.add(setIds);
    return () => listeners.delete(setIds);
  }, []);

  const toggleFavorite = useCallback((propertyId) => {
    setIds((prev) => {
      const next = prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [...prev, propertyId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      broadcast(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback((propertyId) => ids.includes(propertyId), [ids]);

  return { favoriteIds: ids, isFavorite, toggleFavorite };
}
