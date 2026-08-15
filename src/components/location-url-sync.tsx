"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useWeather } from "@/context/weather-context";

export function LocationUrlSync() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { location, setLocation } = useWeather();
  const applied = useRef(false);

  useEffect(() => {
    if (applied.current) return;
    const rawLat = searchParams.get("lat");
    const rawLon = searchParams.get("lon");
    const lat = Number(rawLat);
    const lon = Number(rawLon);
    if (!rawLat || !rawLon || !Number.isFinite(lat) || !Number.isFinite(lon)) return;

    applied.current = true;
    const name = searchParams.get("q");
    const country = searchParams.get("country") ?? "";
    setLocation({
      id: `${lat.toFixed(4)},${lon.toFixed(4)}`,
      name: name ?? "Location",
      country,
      countryCode: "",
      latitude: lat,
      longitude: lon,
      displayName: name ?? "Location",
    });
  }, [searchParams, setLocation]);

  useEffect(() => {
    if (!location || applied.current) return;
    if (!searchParams.get("lat")) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("lat", String(location.latitude));
      params.set("lon", String(location.longitude));
      if (location.name && location.name !== "Your location") params.set("q", location.name);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [location, pathname, router, searchParams]);

  return null;
}
