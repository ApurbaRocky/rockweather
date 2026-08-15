import "server-only";

import { NextResponse } from "next/server";
import { OpenWeatherError } from "./openweather";

export function parseCoords(
  latRaw: unknown,
  lonRaw: unknown
): { lat: number; lon: number } | null {
  const lat = Number(latRaw);
  const lon = Number(lonRaw);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;
  return { lat, lon };
}

export function handleRouteError(err: unknown): NextResponse {
  if (err instanceof OpenWeatherError) {
    return NextResponse.json(
      { error: { code: err.code, message: err.message } },
      { status: err.status === 0 ? 502 : err.status }
    );
  }
  return NextResponse.json(
    { error: { code: "server", message: "The weather service is temporarily unavailable." } },
    { status: 500 }
  );
}
