# RockWeather — Live Weather. Anywhere. Anytime.

A professional, real-time weather platform built with **Next.js**, **TypeScript** and **Tailwind CSS**, powered by the **OpenWeather API**.

- Live current weather, hourly forecast and multi-day forecast
- Global location search with autocomplete + popular locations
- Browser geolocation ("Use My Location") with graceful fallback to Dhaka
- Favorite locations (persisted in `localStorage`)
- Celsius / Fahrenheit toggle and dark / light / system theme (persisted)
- Weather alerts, air quality index, UV index and advanced details when the API plan provides them
- Interactive weather map with temperature / precipitation / clouds / wind layers (Leaflet)
- Weather-condition background effects (sun, clouds, rain, snow, thunderstorm, clear night)
- Skeleton loaders, toast notifications, smart caching and debounced search
- Fully responsive (320px → 1440px+), accessible, SEO-ready

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the API key

Copy the example environment file and add your OpenWeather API key.

```bash
copy .env.example .env.local
```

Edit `.env.local`:

```
OPENWEATHER_API_KEY=your_openweather_api_key
```

Get a key at [https://home.openweathermap.org/api_keys](https://home.openweathermap.org/api_keys).

> **Security:** the API key is only ever used server-side. Next.js Route Handlers
> (`src/app/api/*`) proxy all requests to OpenWeather — including map tiles — so the
> key never reaches the browser. `.env*` files are git-ignored.

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production build:

```bash
npm run build && npm run start
```

## Architecture

```
src/
  app/                  App Router pages + API proxies (/api/bundle, /api/search, /api/tiles)
  components/           UI components (cards, forecasts, alerts, map, backgrounds, skeletons)
  context/              Providers: weather, settings (theme/unit), favorites, toasts
  hooks/                Debounce, local time, per-location weather fetching
  lib/
    types.ts            Clean internal weather model
    openweather.ts      Server-only OpenWeather client + response normalization
    api.ts              Client fetch helpers (talks only to /api/*)
    units.ts, format.ts Unit conversion and formatting
    constants.ts        Brand, navigation, default location, storage keys
```

All live data flows: **OpenWeather → Route Handler proxy → normalized model → UI**.
No UI component reads the raw OpenWeather payload directly, and nothing is ever
fabricated — fields the API does not return are hidden or shown as "Not available".

## Environment variables

| Variable | Required | Notes |
| --- | --- | --- |
| `OPENWEATHER_API_KEY` | Yes | Server-side only. Never exposed to the browser. |
| `NEXT_PUBLIC_WEATHER_REFRESH_MINUTES` | No | Auto-refresh interval (default `10`). |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical URL for SEO metadata, sitemap, robots. |

## Pages

`/` Home + search hero · `/weather` Dashboard · `/forecast` Extended forecast ·
`/maps` Interactive weather map · `/favorites` Saved cities · `/about` ·
`/settings` Preferences · `/404` Custom error page

## Data source

Weather, forecast, air quality and map data: [OpenWeather](https://openweathermap.org/).

Advanced fields (weather alerts, UV index, air quality, dew point) appear only when
the configured OpenWeather plan returns them.
