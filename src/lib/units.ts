import type { TemperatureUnit } from "./types";

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function convertTemp(celsius: number | null | undefined, unit: TemperatureUnit): number | null {
  if (celsius === null || celsius === undefined || Number.isNaN(celsius)) return null;
  if (unit === "fahrenheit") return celsiusToFahrenheit(celsius);
  return celsius;
}

export function formatTemp(
  celsius: number | null | undefined,
  unit: TemperatureUnit,
  opts: { decimals?: boolean; sign?: boolean } = {}
): string {
  const value = convertTemp(celsius, unit);
  if (value === null) return "—";
  const digits = opts.decimals ? 1 : 0;
  const rounded = Math.round(value * (opts.decimals ? 10 : 1)) / (opts.decimals ? 10 : 1);
  const sign = opts.sign && rounded > 0 ? "+" : "";
  return `${sign}${rounded.toFixed(digits)}°`;
}

export function formatSpeed(metersPerSecond: number | null | undefined): string {
  if (metersPerSecond === null || metersPerSecond === undefined) return "—";
  const kmh = metersPerSecond * 3.6;
  return `${Math.round(kmh)} km/h`;
}

export function formatVisibility(meters: number | null | undefined): string {
  if (meters === null || meters === undefined) return "—";
  if (meters >= 1000) return `${(meters / 1000).toFixed(meters % 1000 === 0 ? 0 : 1)} km`;
  return `${meters} m`;
}

export function windDirectionLabel(degrees: number | null | undefined): string {
  if (degrees === null || degrees === undefined) return "—";
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export function windDirectionDegrees(degrees: number | null | undefined): string {
  if (degrees === null || degrees === undefined) return "—";
  return `${Math.round(degrees)}°`;
}

export function formatPressure(hpa: number | null | undefined): string {
  if (hpa === null || hpa === undefined) return "—";
  return `${Math.round(hpa)} hPa`;
}
