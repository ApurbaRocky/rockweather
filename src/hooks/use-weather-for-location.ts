"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { fetchBundle } from "@/lib/api";
import { getCached, setCached } from "@/lib/cache";
import type { FavoriteLocation, WeatherBundle } from "@/lib/types";

interface UseLocationWeatherResult {
  data: WeatherBundle | null;
  loading: boolean;
  error: string | null;
}

const TTL_MS = 5 * 60 * 1000;

export function useWeatherForLocation(
  location: FavoriteLocation
): UseLocationWeatherResult {
  const [data, setData] = useState<WeatherBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  const load = useCallback(async (lat: number, lon: number) => {
    const cacheKey = `bundle:${lat.toFixed(4)},${lon.toFixed(4)}`;
    const cached = getCached<WeatherBundle>(cacheKey, TTL_MS);
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const bundle = await fetchBundle(lat, lon);
      setCached(cacheKey, bundle);
      setData(bundle);
      setError(null);
    } catch {
      setError("Weather data is temporarily unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void load(location.latitude, location.longitude);
  }, [load, location.latitude, location.longitude]);

  return { data, loading, error };
}
