"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";

import { useToasts } from "@/context/toast-context";
import { ApiClientError, fetchBundle } from "@/lib/api";
import { DEFAULT_LOCATION, STORAGE_KEYS } from "@/lib/constants";
import type {
  ApiErrorCode,
  LocationResult,
  WeatherBundle,
} from "@/lib/types";

interface WeatherError {
  code: ApiErrorCode;
  message: string;
}

interface WeatherContextValue {
  location: LocationResult | null;
  data: WeatherBundle | null;
  loading: boolean;
  refreshing: boolean;
  locating: boolean;
  error: WeatherError | null;
  lastUpdated: number | null;
  setLocation: (loc: LocationResult) => void;
  refresh: () => Promise<void>;
  locateMe: () => Promise<void>;
}

const WeatherContext = createContext<WeatherContextValue | null>(null);

const DEFAULT_LOCATION_RESULT: LocationResult = {
  id: DEFAULT_LOCATION.id,
  name: DEFAULT_LOCATION.name,
  country: DEFAULT_LOCATION.country,
  countryCode: DEFAULT_LOCATION.countryCode,
  state: DEFAULT_LOCATION.state,
  latitude: DEFAULT_LOCATION.latitude,
  longitude: DEFAULT_LOCATION.longitude,
  displayName: `${DEFAULT_LOCATION.name}, ${DEFAULT_LOCATION.country}`,
};

export function toLocationResult(
  name: string,
  country: string,
  countryCode: string,
  state: string | undefined,
  lat: number,
  lon: number
): LocationResult {
  const displayName = state ? `${name}, ${state}, ${country}` : `${name}, ${country}`;
  return {
    id: `${lat.toFixed(4)},${lon.toFixed(4)}`,
    name,
    country,
    countryCode,
    state,
    latitude: lat,
    longitude: lon,
    displayName,
  };
}

function readStoredLocation(): LocationResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.lastLocation);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<LocationResult>;
    if (
      typeof parsed.latitude === "number" &&
      typeof parsed.longitude === "number" &&
      typeof parsed.name === "string"
    ) {
      return {
        id: parsed.id ?? `${parsed.latitude},${parsed.longitude}`,
        name: parsed.name,
        country: parsed.country ?? "",
        countryCode: parsed.countryCode ?? "",
        state: parsed.state,
        latitude: parsed.latitude,
        longitude: parsed.longitude,
        displayName: parsed.displayName ?? parsed.name,
      };
    }
    return null;
  } catch {
    return null;
  }
}

function geolocate(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      reject(new Error("geolocation-unavailable"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 600000,
    });
  });
}

export function WeatherProvider({ children }: { children: ReactNode }) {
  const { notify } = useToasts();
  const [location, setLocationState] = useState<LocationResult | null>(() =>
    readStoredLocation()
  );
  const [data, setData] = useState<WeatherBundle | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<WeatherError | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const loadingRef = useRef(false);

  const load = useCallback(
    async (lat: number, lon: number, opts: { background?: boolean } = {}) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const isBackground = opts.background === true;
      if (isBackground) setRefreshing(true);
      else setLoading(true);
      loadingRef.current = true;

      try {
        const bundle = await fetchBundle(lat, lon, controller.signal);
        setData(bundle);
        setError(null);
        setLastUpdated(Date.now());
        const resolved = toLocationResult(
          bundle.current.location,
          bundle.current.country,
          bundle.current.countryCode,
          bundle.current.region,
          bundle.current.latitude,
          bundle.current.longitude
        );
        setLocationState(resolved);
        try {
          window.localStorage.setItem(STORAGE_KEYS.lastLocation, JSON.stringify(resolved));
        } catch {
          // non-fatal
        }
        return bundle;
      } catch (err) {
        if (err instanceof ApiClientError && err.code === "timeout" && controller.signal.aborted) {
          return null;
        }
        if (controller.signal.aborted) return null;
        const message =
          err instanceof ApiClientError
            ? err.message
            : "Weather data is temporarily unavailable. Please try again.";
        const code = err instanceof ApiClientError ? err.code : "server";
        setError({ code, message });
        if (!data) {
          notify("error", "Couldn't load weather data", message);
        }
        return null;
      } finally {
        if (controller.signal.aborted && abortRef.current === controller) {
          abortRef.current = null;
        }
        loadingRef.current = false;
        setLoading(false);
        setRefreshing(false);
      }
    },
    [data, notify]
  );

  const setLocation = useCallback(
    (loc: LocationResult) => {
      setLocationState(loc);
      void load(loc.latitude, loc.longitude);
    },
    [load]
  );

  const refresh = useCallback(async () => {
    if (!location || loadingRef.current) return;
    await load(location.latitude, location.longitude, { background: true });
  }, [location, load]);

  const locateMe = useCallback(async () => {
    setLocating(true);
    try {
      const position = await geolocate();
      const { latitude, longitude } = position.coords;
      setLocationState({
        id: "current",
        name: "Your location",
        country: "",
        countryCode: "",
        latitude,
        longitude,
        displayName: "Your location",
      });
      const bundle = await load(latitude, longitude);
      if (bundle) {
        notify("success", "Location found", "Showing weather for your current location.");
      }
    } catch (err) {
      const message =
        err instanceof Error && err.message === "geolocation-unavailable"
          ? "Geolocation is not available in this browser."
          : "Location permission was denied. Allow location access to use this feature.";
      const code: ApiErrorCode =
        err instanceof Error && err.message === "geolocation-unavailable"
          ? "geolocation-unavailable"
          : "geolocation-denied";
      setError({ code, message });
      notify("error", "Couldn't use your location", message);
    } finally {
      setLocating(false);
    }
  }, [load, notify]);

  useEffect(() => {
    if (loadingRef.current || data || location) return;
    void (async () => {
      const stored = readStoredLocation();
      if (stored) {
        setLocationState(stored);
        await load(stored.latitude, stored.longitude);
        return;
      }
      try {
        const position = await geolocate();
        await load(position.coords.latitude, position.coords.longitude);
      } catch {
        setLocationState(DEFAULT_LOCATION_RESULT);
        await load(DEFAULT_LOCATION_RESULT.latitude, DEFAULT_LOCATION_RESULT.longitude);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!location || !data) return;
    const minutes = Number(process.env.NEXT_PUBLIC_WEATHER_REFRESH_MINUTES) || 10;
    const interval = setInterval(() => {
      void load(location.latitude, location.longitude, { background: true });
    }, minutes * 60 * 1000);
    return () => clearInterval(interval);
  }, [location, data, load]);

  const value = useMemo(
    () => ({
      location,
      data,
      loading,
      refreshing,
      locating,
      error,
      lastUpdated,
      setLocation,
      refresh,
      locateMe,
    }),
    [location, data, loading, refreshing, locating, error, lastUpdated, setLocation, refresh, locateMe]
  );

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
}

export function useWeather(): WeatherContextValue {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error("useWeather must be used within a WeatherProvider");
  return ctx;
}
