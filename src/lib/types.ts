export type TemperatureUnit = "celsius" | "fahrenheit";

export type ThemePreference = "dark" | "light" | "system";

export interface LocationResult {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  state?: string;
  latitude: number;
  longitude: number;
  displayName: string;
}

export interface FavoriteLocation {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  state?: string;
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  location: string;
  country: string;
  countryCode: string;
  region?: string;
  latitude: number;
  longitude: number;
  timezoneOffset: number;
  timezoneName?: string;
  temperature: number | null;
  feelsLike: number | null;
  condition: string;
  description: string;
  icon: string;
  humidity: number | null;
  pressure: number | null;
  visibility: number | null;
  windSpeed: number | null;
  windGust: number | null;
  windDirection: number | null;
  clouds: number | null;
  sunrise: number | null;
  sunset: number | null;
  high: number | null;
  low: number | null;
  dewPoint: number | null;
  uvIndex: number | null;
  rain: number | null;
  snow: number | null;
  precipitationProbability: number | null;
  updatedAt: number;
}

export interface HourlyForecast {
  time: number;
  temperature: number;
  feelsLike: number | null;
  condition: string;
  description: string;
  icon: string;
  precipitationProbability: number | null;
  humidity: number | null;
  windSpeed: number | null;
  pressure: number | null;
}

export interface DailyForecast {
  date: number;
  condition: string;
  description: string;
  icon: string;
  high: number;
  low: number;
  precipitationProbability: number | null;
  precipitation: number | null;
  humidity: number | null;
  windSpeed: number | null;
  sunrise: number | null;
  sunset: number | null;
  isToday: boolean;
}

export interface ForecastData {
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export interface AirQualityData {
  aqi: number;
  pm25: number | null;
  pm10: number | null;
  co: number | null;
  no2: number | null;
  o3: number | null;
  so2: number | null;
  updatedAt: number;
}

export type AlertSeverity =
  | "informational"
  | "moderate"
  | "severe"
  | "extreme"
  | "unknown";

export interface WeatherAlert {
  sender: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  start: number;
  end: number;
  safetyRecommendation?: string;
}

export interface AlertsResponse {
  available: boolean;
  alerts: WeatherAlert[];
}

export interface WeatherBundle {
  current: CurrentWeather;
  forecast: ForecastData;
  airQuality: AirQualityData | null;
  alerts: AlertsResponse;
  extras: {
    uvIndex: number | null;
    dewPoint: number | null;
  };
}

export type ApiErrorCode =
  | "invalid-key"
  | "rate-limit"
  | "network"
  | "invalid-location"
  | "timeout"
  | "missing-data"
  | "server"
  | "geolocation-denied"
  | "geolocation-unavailable";

export interface ApiErrorPayload {
  error: {
    code: ApiErrorCode;
    message: string;
  };
}

export function isApiErrorPayload(value: unknown): value is ApiErrorPayload {
  return (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof (value as ApiErrorPayload).error?.code === "string"
  );
}

export interface AqiBand {
  label: string;
  description: string;
  color: string;
}
