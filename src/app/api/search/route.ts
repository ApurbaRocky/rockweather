import "server-only";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { searchLocation } from "@/lib/openweather";
import { handleRouteError } from "@/lib/route-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchLocation(query);
    return NextResponse.json({ results });
  } catch (err) {
    return handleRouteError(err);
  }
}
