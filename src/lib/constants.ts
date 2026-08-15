import type { FavoriteLocation, LocationResult } from "./types";

export const APP_NAME = "RockWeather";
export const APP_TAGLINE = "Live Weather. Anywhere. Anytime.";

export const DEFAULT_LOCATION: FavoriteLocation = {
  id: "dhaka",
  name: "Dhaka",
  country: "Bangladesh",
  countryCode: "BD",
  state: "Dhaka Division",
  latitude: 23.8103,
  longitude: 90.4125,
};

export const POPULAR_LOCATIONS: FavoriteLocation[] = [
  DEFAULT_LOCATION,
  {
    id: "chattogram",
    name: "Chattogram",
    country: "Bangladesh",
    countryCode: "BD",
    state: "Chattogram Division",
    latitude: 22.3569,
    longitude: 91.7832,
  },
  {
    id: "london",
    name: "London",
    country: "United Kingdom",
    countryCode: "GB",
    latitude: 51.5072,
    longitude: -0.1276,
  },
  {
    id: "new-york",
    name: "New York",
    country: "United States",
    countryCode: "US",
    state: "New York",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    countryCode: "JP",
    latitude: 35.6762,
    longitude: 139.6503,
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    countryCode: "AE",
    latitude: 25.2048,
    longitude: 55.2708,
  },
];

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/weather", label: "Weather" },
  { href: "/forecast", label: "Forecast" },
  { href: "/maps", label: "Maps" },
  { href: "/favorites", label: "Favorites" },
  { href: "/about", label: "About" },
] as const;

export const FOOTER_LINKS = [
  { href: "/weather", label: "Weather" },
  { href: "/forecast", label: "Forecast" },
  { href: "/maps", label: "Maps" },
  { href: "/favorites", label: "Favorites" },
  { href: "/about", label: "About" },
  { href: "/settings", label: "Settings" },
] as const;

export const STORAGE_KEYS = {
  theme: "rockweather.theme",
  unit: "rockweather.unit",
  favorites: "rockweather.favorites",
  lastLocation: "rockweather.last-location",
} as const;

export const TILE_PROXY = "/api/tiles";

export function popularLocationToResult(loc: FavoriteLocation): LocationResult {
  return {
    id: loc.id,
    name: loc.name,
    country: loc.country,
    countryCode: loc.countryCode,
    state: loc.state,
    latitude: loc.latitude,
    longitude: loc.longitude,
    displayName: loc.state
      ? `${loc.name}, ${loc.state}, ${loc.country}`
      : `${loc.name}, ${loc.country}`,
  };
}
