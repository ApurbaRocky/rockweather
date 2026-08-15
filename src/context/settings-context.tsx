"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";

import { STORAGE_KEYS } from "@/lib/constants";
import type { TemperatureUnit, ThemePreference } from "@/lib/types";

interface SettingsContextValue {
  theme: ThemePreference;
  unit: TemperatureUnit;
  resolvedTheme: "dark" | "light";
  setTheme: (theme: ThemePreference) => void;
  setUnit: (unit: TemperatureUnit) => void;
  toggleTheme: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function isThemePreference(value: unknown): value is ThemePreference {
  return value === "dark" || value === "light" || value === "system";
}

function isUnit(value: unknown): value is TemperatureUnit {
  return value === "celsius" || value === "fahrenheit";
}

function subscribeSystemDark(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSystemDarkSnapshot(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyThemeClass(theme: ThemePreference, systemDark: boolean) {
  if (typeof document === "undefined") return;
  const dark = theme === "dark" || (theme === "system" && systemDark);
  document.documentElement.classList.toggle("dark", dark);
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const systemDark = useSyncExternalStore(subscribeSystemDark, getSystemDarkSnapshot, () => false);
  const [theme, setThemeState] = useState<ThemePreference>(() => {
    if (typeof window === "undefined") return "dark";
    const stored = window.localStorage.getItem(STORAGE_KEYS.theme);
    return isThemePreference(stored) ? stored : "dark";
  });
  const [unit, setUnitState] = useState<TemperatureUnit>(() => {
    if (typeof window === "undefined") return "celsius";
    const stored = window.localStorage.getItem(STORAGE_KEYS.unit);
    return isUnit(stored) ? stored : "celsius";
  });

  const resolvedTheme: "dark" | "light" =
    theme === "system" ? (systemDark ? "dark" : "light") : theme;

  useEffect(() => {
    applyThemeClass(theme, systemDark);
    window.localStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme, systemDark]);

  const setTheme = useCallback((next: ThemePreference) => {
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      if (prev === "dark") return "light";
      if (prev === "light") return "dark";
      return getSystemDarkSnapshot() ? "light" : "dark";
    });
  }, []);

  const setUnit = useCallback((next: TemperatureUnit) => {
    setUnitState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEYS.unit, next);
    }
  }, []);

  const value = useMemo(
    () => ({ theme, unit, resolvedTheme, setTheme, setUnit, toggleTheme }),
    [theme, unit, resolvedTheme, setTheme, setUnit, toggleTheme]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within a SettingsProvider");
  return ctx;
}
