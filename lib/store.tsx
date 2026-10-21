"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { MenuItem, NewMenuItem } from "./types";
import { SEED_ITEMS } from "./seed";

const MENU_KEY = "nocturne.menu.v1";
const FAVORITES_KEY = "nocturne.favorites.v1";

interface MenuContextValue {
  items: MenuItem[];
  loading: boolean;
  addItem: (input: NewMenuItem) => MenuItem;
  updateItem: (id: string, patch: Partial<MenuItem>) => void;
  deleteItem: (id: string) => void;
  toggleAvailability: (id: string) => void;
  resetMenu: () => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  clearFavorites: () => void;
}

const MenuContext = createContext<MenuContextValue | null>(null);

function readStorage<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be unavailable (private mode) — the in-memory state still works.
  }
}

export function MenuProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage (seed data only when nothing was ever stored).
  useEffect(() => {
    const stored = readStorage<MenuItem[]>(MENU_KEY);
    setItems(Array.isArray(stored) ? stored : SEED_ITEMS);
    setFavorites(readStorage<string[]>(FAVORITES_KEY) ?? []);
    setHydrated(true);
    setLoading(false);
  }, []);

  // Persist changes and keep other tabs (e.g. admin preview vs. menu) in sync.
  // Gated on the `hydrated` state so the initial empty render can never
  // clobber previously saved edits (state updates batch into the next render,
  // after which items already holds the loaded value).
  useEffect(() => {
    if (hydrated) writeStorage(MENU_KEY, items);
  }, [items, hydrated]);

  useEffect(() => {
    if (hydrated) writeStorage(FAVORITES_KEY, favorites);
  }, [favorites, hydrated]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === MENU_KEY && event.newValue) {
        try {
          setItems(JSON.parse(event.newValue) as MenuItem[]);
        } catch {
          /* ignore malformed payloads */
        }
      }
      if (event.key === FAVORITES_KEY && event.newValue) {
        try {
          setFavorites(JSON.parse(event.newValue) as string[]);
        } catch {
          /* ignore malformed payloads */
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addItem = useCallback((input: NewMenuItem) => {
    const item: MenuItem = {
      ...input,
      id: `dish-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: Date.now(),
    };
    setItems((prev) => [item, ...prev]);
    return item;
  }, []);

  const updateItem = useCallback((id: string, patch: Partial<MenuItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setFavorites((prev) => prev.filter((fav) => fav !== id));
  }, []);

  const toggleAvailability = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, available: !item.available } : item)),
    );
  }, []);

  const resetMenu = useCallback(() => setItems(SEED_ITEMS), []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  }, []);

  const clearFavorites = useCallback(() => setFavorites([]), []);

  const value = useMemo<MenuContextValue>(
    () => ({
      items,
      loading,
      addItem,
      updateItem,
      deleteItem,
      toggleAvailability,
      resetMenu,
      favorites,
      toggleFavorite,
      clearFavorites,
    }),
    [
      items,
      loading,
      addItem,
      updateItem,
      deleteItem,
      toggleAvailability,
      resetMenu,
      favorites,
      toggleFavorite,
      clearFavorites,
    ],
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu must be used inside <MenuProvider>");
  return ctx;
}
