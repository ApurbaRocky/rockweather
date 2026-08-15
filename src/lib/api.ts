import type { ApiErrorCode, LocationResult, WeatherBundle } from "./types";

export class ApiClientError extends Error {
  code: ApiErrorCode;
  status: number;

  constructor(code: ApiErrorCode, message: string, status = 0) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
    this.status = status;
  }
}

async function getJSON<T>(url: string, signal?: AbortSignal): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      signal,
      headers: { accept: "application/json" },
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiClientError("timeout", "The weather service took too long to respond.");
    }
    throw new ApiClientError("network", "Network error. Check your connection and try again.");
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const code = (data as { error?: { code?: ApiErrorCode; message?: string } } | null)
      ?.error?.code;
    const message = (data as { error?: { code?: ApiErrorCode; message?: string } } | null)
      ?.error?.message;
    throw new ApiClientError(code ?? "server", message ?? "Weather data is temporarily unavailable. Please try again.", res.status);
  }
  return data as T;
}

export function fetchBundle(
  lat: number,
  lon: number,
  signal?: AbortSignal
): Promise<WeatherBundle> {
  return getJSON<WeatherBundle>(`/api/bundle?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`, signal);
}

export function fetchSearchResults(query: string, signal?: AbortSignal): Promise<LocationResult[]> {
  return getJSON<{ results: LocationResult[] }>(`/api/search?q=${encodeURIComponent(query)}`, signal).then(
    (data) => data.results
  );
}
