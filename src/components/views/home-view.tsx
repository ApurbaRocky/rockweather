"use client";

import { Suspense } from "react";

import { Hero } from "@/components/hero";
import { LocationUrlSync } from "@/components/location-url-sync";
import { WeatherDashboard } from "@/components/weather-dashboard";
import { useWeather } from "@/context/weather-context";

export function HomeView() {
  const { setLocation, locateMe } = useWeather();

  return (
    <>
      <Suspense fallback={null}>
        <LocationUrlSync />
      </Suspense>
      <Hero onSelect={setLocation} onUseLocation={() => void locateMe()} />
      <div className="mt-10">
        <WeatherDashboard />
      </div>
    </>
  );
}
