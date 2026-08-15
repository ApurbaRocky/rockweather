"use client";

import { Suspense } from "react";

import { LocationUrlSync } from "@/components/location-url-sync";
import { WeatherDashboard } from "@/components/weather-dashboard";

export function WeatherView() {
  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <LocationUrlSync />
      </Suspense>
      <header className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Weather
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Current conditions and detailed forecasts for your selected location.
        </p>
      </header>
      <WeatherDashboard />
    </div>
  );
}
