import "server-only";

import type {
  AirQualityData,
  AlertsResponse,
  ApiErrorCode,
  CurrentWeather,
  DailyForecast,
  ForecastData,
  HourlyForecast,
  LocationResult,
  WeatherAlert,
  AlertSeverity,
} from "./types";

const BASE = "https://api.openweathermap.org";
const GEO = `${BASE}/geo/1.0`;
const DATA_2_5 = `${BASE}/data/2.5`;
const DATA_3_0 = `${BASE}/data/3.0`;

const REQUEST_TIMEOUT_MS = 9000;

class OpenWeatherError extends Error {
  code: ApiErrorCode;
  status: number;
  constructor(code: ApiErrorCode, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

function getApiKey(): string {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key || key === "your_api_key_here" || key.trim() === "") {
    throw new OpenWeatherError(
      "invalid-key",
      "The weather API key is not configured on the server.",
      500
    );
  }
  return key;
}

async function fetchJson(url: string): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { accept: "application/json" },
      signal: controller.signal,
      cache: "no-store",
    });
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof Error && err.name === "AbortError") {
      throw new OpenWeatherError("timeout", "The weather service took too long to respond.", 504);
    }
    throw new OpenWeatherError("network", "Could not reach the weather service.", 0);
  }
  clearTimeout(timer);

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw mapOpenWeatherError(res.status, data);
  }
  return data;
}

function mapOpenWeatherError(status: number, body: unknown): OpenWeatherError {
  const rawMessage =
    typeof body === "object" &&
    body !== null &&
    "message" in body &&
    typeof (body as { message?: unknown }).message === "string"
      ? ((body as { message: string }).message as string)
      : "";
  const lower = rawMessage.toLowerCase();
  if (status === 401) {
    return new OpenWeatherError("invalid-key", "The weather API key is invalid or unauthorized.", status);
  }
  if (status === 404 || lower.includes("not found") || lower.includes("not found")) {
    return new OpenWeatherError("invalid-location", "We couldn't find that location.", status);
  }
  if (status === 429 || lower.includes("rate limit")) {
    return new OpenWeatherError("rate-limit", "Too many requests. Please try again later.", status);
  }
  if (status >= 500) {
    return new OpenWeatherError("server", "The weather service is temporarily unavailable.", status);
  }
  return new OpenWeatherError("server", "The weather service returned an unexpected response.", status);
}

interface RawCoord {
  lat: number;
  lon: number;
}

interface RawWeatherEntry {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface RawWeather {
  coord: RawCoord;
  weather: RawWeatherEntry[];
  base?: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
    dew_point?: number;
  };
  visibility?: number;
  wind: { speed: number; deg?: number; gust?: number };
  clouds: { all: number };
  rain?: { "1h"?: number; "3h"?: number };
  snow?: { "1h"?: number; "3h"?: number };
  dt: number;
  sys: { country?: string; sunrise?: number; sunset?: number };
  timezone: number;
  id?: number;
  name: string;
  cod?: number;
}

interface RawForecastList {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: RawWeatherEntry[];
  clouds: { all: number };
  wind: { speed: number; deg?: number; gust?: number };
  visibility?: number;
  pop: number;
  rain?: { "3h"?: number };
  snow?: { "3h"?: number };
  dt_txt: string;
}

interface RawForecast {
  cod: string;
  message?: number;
  city: {
    id?: number;
    name: string;
    coord: RawCoord;
    country?: string;
    timezone: number;
    sunrise?: number;
    sunset?: number;
  };
  list: RawForecastList[];
}

interface RawGeoResult {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country?: string;
  state?: string;
}

interface RawAirQuality {
  list: Array<{
    main: { aqi: number };
    components: {
      co?: number;
      no2?: number;
      o3?: number;
      so2?: number;
      pm2_5?: number;
      pm10?: number;
    };
    dt: number;
  }>;
}

interface RawOneCall {
  current?: {
    uvi?: number;
    dew_point?: number;
    weather?: RawWeatherEntry[];
  };
  alerts?: Array<{
    sender_name?: string;
    event: string;
    description?: string;
    start: number;
    end: number;
    tags?: string[];
  }>;
}

function firstWeather(entry: { weather?: RawWeatherEntry[] }): RawWeatherEntry | undefined {
  return entry.weather?.[0];
}

export async function getCurrentWeather(lat: number, lon: number): Promise<CurrentWeather> {
  const key = getApiKey();
  const url = `${DATA_2_5}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`;
  const raw = (await fetchJson(url)) as RawWeather;

  const entry = firstWeather(raw);
  const condition = entry?.main ?? "Unknown";
  const description = entry?.description ?? condition;
  const icon = entry?.icon ?? "01d";

  let name = raw.name || "";
  let region: string | undefined;
  if (!name) {
    const reverse = (await getReverseGeocode(lat, lon))[0];
    if (reverse) {
      name = reverse.name;
      region = reverse.state;
    }
  }

  const rain = raw.rain?.["1h"] ?? raw.rain?.["3h"] ?? null;
  const snow = raw.snow?.["1h"] ?? raw.snow?.["3h"] ?? null;

  return {
    location: name || "Unknown location",
    country: raw.sys.country ?? "",
    countryCode: raw.sys.country ?? "",
    region,
    latitude: raw.coord.lat,
    longitude: raw.coord.lon,
    timezoneOffset: raw.timezone ?? 0,
    temperature: raw.main.temp ?? null,
    feelsLike: raw.main.feels_like ?? null,
    condition,
    description,
    icon,
    humidity: raw.main.humidity ?? null,
    pressure: raw.main.pressure ?? null,
    visibility: typeof raw.visibility === "number" ? raw.visibility : null,
    windSpeed: raw.wind.speed ?? null,
    windGust: raw.wind.gust ?? null,
    windDirection: raw.wind.deg ?? null,
    clouds: raw.clouds.all ?? null,
    sunrise: raw.sys.sunrise ?? null,
    sunset: raw.sys.sunset ?? null,
    high: raw.main.temp_max ?? null,
    low: raw.main.temp_min ?? null,
    dewPoint: raw.main.dew_point ?? null,
    uvIndex: null,
    rain: rain === undefined ? null : rain,
    snow: snow === undefined ? null : snow,
    precipitationProbability: null,
    updatedAt: Date.now(),
  };
}

export async function getForecast(lat: number, lon: number): Promise<ForecastData> {
  const key = getApiKey();
  const url = `${DATA_2_5}/forecast?lat=${lat}&lon=${lon}&units=metric&cnt=40&appid=${key}`;
  const raw = (await fetchJson(url)) as RawForecast;

  const timezoneOffset = raw.city?.timezone ?? 0;

  const hourly: HourlyForecast[] = raw.list.slice(0, 24).map((item) => {
    const entry = firstWeather(item);
    return {
      time: item.dt,
      temperature: item.main.temp,
      feelsLike: item.main.feels_like ?? null,
      condition: entry?.main ?? "Unknown",
      description: entry?.description ?? "Unknown",
      icon: entry?.icon ?? "01d",
      precipitationProbability: typeof item.pop === "number" ? Math.round(item.pop * 100) : null,
      humidity: item.main.humidity ?? null,
      windSpeed: item.wind.speed ?? null,
      pressure: item.main.pressure ?? null,
    };
  });

  const daily = buildDailyForecast(raw.list, timezoneOffset);

  return { hourly, daily };
}

function buildDailyForecast(list: RawForecastList[], timezoneOffset: number): DailyForecast[] {
  const byDay = new Map<string, RawForecastList[]>();
  for (const item of list) {
    const local = new Date((item.dt + timezoneOffset) * 1000);
    const dayKey = `${local.getUTCFullYear()}-${local.getUTCMonth()}-${local.getUTCDate()}`;
    const group = byDay.get(dayKey);
    if (group) group.push(item);
    else byDay.set(dayKey, [item]);
  }

  const nowUtcSeconds = Date.now() / 1000;
  const todayLocal = new Date((nowUtcSeconds + timezoneOffset) * 1000);
  const todayKey = `${todayLocal.getUTCFullYear()}-${todayLocal.getUTCMonth()}-${todayLocal.getUTCDate()}`;

  const days = [...byDay.entries()];
  days.sort((a, b) => a[1][0].dt - b[1][0].dt);

  return days.slice(0, 7).map(([, items]) => {
    items.sort((a, b) => a.dt - b.dt);
    const highs = items.map((i) => i.main.temp_max);
    const lows = items.map((i) => i.main.temp_min);
    const dayKey = `${new Date((items[0].dt + timezoneOffset) * 1000).getUTCFullYear()}-${new Date((items[0].dt + timezoneOffset) * 1000).getUTCMonth()}-${new Date((items[0].dt + timezoneOffset) * 1000).getUTCDate()}`;
    const midday = items[Math.floor(items.length / 2)] ?? items[0];
    const entry = firstWeather(midday);
    const pops = items.map((i) => i.pop).filter((p): p is number => typeof p === "number");
    const rainAmounts = items
      .map((i) => i.rain?.["3h"])
      .filter((v): v is number => typeof v === "number");
    return {
      date: items[0].dt,
      condition: entry?.main ?? "Unknown",
      description: entry?.description ?? "Unknown",
      icon: entry?.icon ?? "01d",
      high: Math.max(...highs),
      low: Math.min(...lows),
      precipitationProbability: pops.length ? Math.round((Math.max(...pops) * 100)) : null,
      precipitation: rainAmounts.length ? rainAmounts.reduce((a, b) => a + b, 0) : null,
      humidity: items[0].main.humidity ?? null,
      windSpeed: items[0].wind.speed ?? null,
      sunrise: null,
      sunset: null,
      isToday: dayKey === todayKey,
    };
  });
}

export async function searchLocation(query: string): Promise<LocationResult[]> {
  const key = getApiKey();
  const encoded = encodeURIComponent(query);
  const url = `${GEO}/direct?q=${encoded}&limit=5&appid=${key}`;
  const raw = (await fetchJson(url)) as RawGeoResult[];

  return raw.map((item) => {
    const displayName = item.state
      ? `${item.name}, ${item.state}, ${item.country ?? ""}`
      : `${item.name}, ${item.country ?? ""}`;
    return {
      id: `${item.lat.toFixed(4)},${item.lon.toFixed(4)}`,
      name: item.name,
      country: item.country ?? "Unknown",
      countryCode: item.country ?? "",
      state: item.state,
      latitude: item.lat,
      longitude: item.lon,
      displayName,
    };
  });
}

export async function getReverseGeocode(lat: number, lon: number): Promise<LocationResult[]> {
  const key = getApiKey();
  const url = `${GEO}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${key}`;
  const raw = (await fetchJson(url)) as RawGeoResult[];

  return raw.map((item) => ({
    id: `${item.lat.toFixed(4)},${item.lon.toFixed(4)}`,
    name: item.name,
    country: item.country ?? "",
    countryCode: item.country ?? "",
    state: item.state,
    latitude: item.lat,
    longitude: item.lon,
    displayName: item.state
      ? `${item.name}, ${item.state}, ${item.country ?? ""}`
      : `${item.name}, ${item.country ?? ""}`,
  }));
}

export async function getAirQuality(lat: number, lon: number): Promise<AirQualityData | null> {
  try {
    const key = getApiKey();
    const url = `${DATA_2_5}/air_pollution?lat=${lat}&lon=${lon}&appid=${key}`;
    const raw = (await fetchJson(url)) as RawAirQuality;
    const item = raw.list?.[0];
    if (!item) return null;
    return {
      aqi: item.main.aqi,
      pm25: item.components.pm2_5 ?? null,
      pm10: item.components.pm10 ?? null,
      co: item.components.co ?? null,
      no2: item.components.no2 ?? null,
      o3: item.components.o3 ?? null,
      so2: item.components.so2 ?? null,
      updatedAt: Date.now(),
    };
  } catch {
    return null;
  }
}

function mapSeverity(tags: string[] | undefined, event: string): AlertSeverity {
  const text = `${(tags ?? []).join(" ")} ${event}`.toLowerCase();
  if (/extreme|red|catastrophic|bomb/.test(text)) return "extreme";
  if (/severe|warning|red|danger|tornado|hurricane|flash flood/.test(text)) return "severe";
  if (/moderate|advisory|watch|yellow/.test(text)) return "moderate";
  if (/informational|info|statement/.test(text)) return "informational";
  return "moderate";
}

function safetyRecommendation(severity: AlertSeverity, event: string): string {
  const e = event.toLowerCase();
  if (/storm|thunder/.test(e)) {
    return "Seek shelter indoors and avoid open areas, tall trees and water until the storm passes.";
  }
  if (/flood/.test(e)) {
    return "Move to higher ground, avoid flooded roads and do not attempt to cross flowing water.";
  }
  if (/heat/.test(e)) {
    return "Stay hydrated, limit strenuous outdoor activity and check on vulnerable people.";
  }
  if (/cold|freez|snow/.test(e)) {
    return "Dress warmly, limit time outdoors and be cautious of icy surfaces.";
  }
  if (/wind/.test(e)) {
    return "Secure loose outdoor objects and stay away from windows and unsecured structures.";
  }
  if (severity === "extreme" || severity === "severe") {
    return "Follow official guidance and emergency instructions for your area.";
  }
  return "Stay informed and monitor local official sources for updates.";
}

export async function getOneCallExtras(lat: number, lon: number): Promise<{
  uvIndex: number | null;
  dewPoint: number | null;
  alerts: AlertsResponse;
}> {
  try {
    const key = getApiKey();
    const url = `${DATA_3_0}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily&units=metric&appid=${key}`;
    const raw = (await fetchJson(url)) as RawOneCall;

    const alerts: WeatherAlert[] = (raw.alerts ?? []).map((alert) => {
      const severity = mapSeverity(alert.tags, alert.event);
      return {
        sender: alert.sender_name ?? "",
        title: alert.event,
        description: alert.description ?? "",
        severity,
        start: alert.start,
        end: alert.end,
        safetyRecommendation: safetyRecommendation(severity, alert.event),
      };
    });

    return {
      uvIndex: raw.current?.uvi ?? null,
      dewPoint: raw.current?.dew_point ?? null,
      alerts: { available: true, alerts },
    };
  } catch {
    return { uvIndex: null, dewPoint: null, alerts: { available: false, alerts: [] } };
  }
}

export { OpenWeatherError };
