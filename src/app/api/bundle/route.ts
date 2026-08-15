import "server-only";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  getAirQuality,
  getCurrentWeather,
  getForecast,
  getOneCallExtras,
} from "@/lib/openweather";
import { handleRouteError, parseCoords } from "@/lib/route-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const coords = parseCoords(searchParams.get("lat"), searchParams.get("lon"));

  if (!coords) {
    return NextResponse.json(
      { error: { code: "invalid-location", message: "Missing or invalid coordinates." } },
      { status: 400 }
    );
  }

  try {
    const [current, forecast, airQuality, extras] = await Promise.all([
      getCurrentWeather(coords.lat, coords.lon),
      getForecast(coords.lat, coords.lon),
      getAirQuality(coords.lat, coords.lon),
      getOneCallExtras(coords.lat, coords.lon),
    ]);

    return NextResponse.json({
      current: {
        ...current,
        uvIndex: extras.uvIndex ?? current.uvIndex,
        dewPoint: extras.dewPoint ?? current.dewPoint,
      },
      forecast,
      airQuality,
      alerts: extras.alerts,
      extras,
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
