"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

export function useDebouncedValue<T>(value: T, delayMs = 350): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

export function useNowSeconds(refreshMs = 60000): number {
  return useSyncExternalStore(
    (callback) => {
      const timer = setInterval(callback, refreshMs);
      return () => clearInterval(timer);
    },
    () => Date.now() / 1000,
    () => 0
  );
}

export function useLocalTime(timezoneOffsetSeconds: number, refreshMs = 30000): string {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), refreshMs);
    return () => clearInterval(timer);
  }, [refreshMs]);

  return useMemo(() => {
    const date = new Date((now / 1000 + timezoneOffsetSeconds) * 1000);
    let hours = date.getUTCHours() % 12;
    if (hours === 0) hours = 12;
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");
    const ampm = date.getUTCHours() >= 12 ? "PM" : "AM";
    return `${hours}:${minutes}:${seconds} ${ampm}`;
  }, [now, timezoneOffsetSeconds]);
}
