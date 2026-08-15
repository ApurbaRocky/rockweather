"use client";

import { Suspense } from "react";

import { LocationUrlSync } from "@/components/location-url-sync";
import { SearchBar } from "@/components/search-bar";
import { WeatherMap } from "@/components/weather-map";
import { useWeather } from "@/context/weather-context";
import { DEFAULT_LOCATION } from "@/lib/constants";

export function MapsView() {
  const { data, location, setLocation } = useWeather();

  const lat = data?.current.latitude ?? location?.latitude ?? DEFAULT_LOCATION.latitude;
  const lon = data?.current.longitude ?? location?.longitude ?? DEFAULT_LOCATION.longitude;
  const name = data?.current.location ?? location?.name ?? DEFAULT_LOCATION.name;

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <LocationUrlSync />
      </Suspense>
      <header className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Weather Maps
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Search a location and overlay live weather layers on the interactive map.
        </p>
      </header>

      <div className="mx-auto max-w-xl">
        <SearchBar onSelect={setLocation} />
      </div>

      <WeatherMap latitude={lat} longitude={lon} locationName={name} />
    </div>
  );
}
