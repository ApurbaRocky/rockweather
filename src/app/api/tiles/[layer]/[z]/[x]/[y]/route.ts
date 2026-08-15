import "server-only";

import { NextResponse } from "next/server";

const ALLOWED_LAYERS = new Set([
  "temp_new",
  "precipitation_new",
  "clouds_new",
  "wind_new",
  "pressure_new",
]);

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/tiles/[layer]/[z]/[x]/[y]">
) {
  const { layer, z, x, y } = await ctx.params;

  if (!ALLOWED_LAYERS.has(layer)) {
    return new NextResponse("Layer not found", { status: 404 });
  }

  const zi = Number(z);
  const xi = Number(x);
  const yi = Number(y);
  if (!Number.isInteger(zi) || !Number.isInteger(xi) || !Number.isInteger(yi)) {
    return new NextResponse("Invalid tile coordinates", { status: 400 });
  }
  if (zi < 0 || zi > 19 || xi < 0 || yi < 0) {
    return new NextResponse("Invalid tile coordinates", { status: 400 });
  }

  const key = process.env.OPENWEATHER_API_KEY;
  if (!key || key === "your_api_key_here") {
    return new NextResponse("Weather map tiles are not configured.", { status: 500 });
  }

  const url = `https://tile.openweathermap.org/map/${layer}/${zi}/${xi}/${yi}.png?appid=${key}`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 9000);
    const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
    clearTimeout(timer);

    if (!res.ok) {
      return new NextResponse("Tile unavailable", { status: res.status });
    }

    const body = await res.arrayBuffer();
    const headers = new Headers();
    headers.set("Content-Type", res.headers.get("content-type") ?? "image/png");
    headers.set("Cache-Control", "public, max-age=600, stale-while-revalidate=3600");
    return new Response(body, { headers });
  } catch {
    return new NextResponse("Tile unavailable", { status: 502 });
  }
}
