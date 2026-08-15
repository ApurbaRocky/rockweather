"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

import { STORAGE_KEYS } from "@/lib/constants";
import type { FavoriteLocation } from "@/lib/types";

interface FavoritesContextValue {
  favorites: FavoriteLocation[];
  isFavorite: (lat: number, lon: number) => boolean;
  addFavorite: (location: FavoriteLocation) => boolean;
  removeFavorite: (id: string) => void;
  toggleFavorite: (location: FavoriteLocation) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function isFavoriteLocation(value: unknown): value is FavoriteLocation {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.name === "string" &&
    typeof v.latitude === "number" &&
    typeof v.longitude === "number"
  );
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.favorites);
      if (!raw) return [];
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(isFavoriteLocation).slice(0, 30);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
    } catch {
      // storage unavailable — non-fatal
    }
  }, [favorites]);

  const isFavorite = useCallback(
    (lat: number, lon: number) =>
      favorites.some(
        (f) => Math.abs(f.latitude - lat) < 1e-3 && Math.abs(f.longitude - lon) < 1e-3
      ),
    [favorites]
  );

  const addFavorite = useCallback(
    (location: FavoriteLocation) => {
      let added = false;
      setFavorites((prev) => {
        if (
          prev.some(
            (f) =>
              Math.abs(f.latitude - location.latitude) < 1e-3 &&
              Math.abs(f.longitude - location.longitude) < 1e-3
          )
        ) {
          return prev;
        }
        added = true;
        return [...prev, location].slice(0, 30);
      });
      return added;
    },
    []
  );

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const toggleFavorite = useCallback(
    (location: FavoriteLocation) => {
      setFavorites((prev) => {
        const exists = prev.some(
          (f) => Math.abs(f.latitude - location.latitude) < 1e-3 && Math.abs(f.longitude - location.longitude) < 1e-3
        );
        if (exists) {
          return prev.filter(
            (f) =>
              !(
                Math.abs(f.latitude - location.latitude) < 1e-3 &&
                Math.abs(f.longitude - location.longitude) < 1e-3
              )
          );
        }
        return [...prev, location].slice(0, 30);
      });
    },
    []
  );

  const value = useMemo(
    () => ({ favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite }),
    [favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within a FavoritesProvider");
  return ctx;
}
