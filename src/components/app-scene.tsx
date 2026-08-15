"use client";

import type { ReactNode } from "react";

import { useWeather } from "@/context/weather-context";
import { WeatherBackground } from "@/components/weather-background";
import type { CurrentWeather } from "@/lib/types";

function computeIsDay(current: CurrentWeather | undefined): boolean {
  if (!current) return true;
  const nowSeconds = Date.now() / 1000;
  if (current.sunrise !== null && current.sunset !== null) {
    return nowSeconds >= current.sunrise && nowSeconds <= current.sunset;
  }
  return current.icon.endsWith("d");
}

export function AppScene({ children }: { children: ReactNode }) {
  const { data } = useWeather();
  const current = data?.current;

  return (
    <>
      <WeatherBackground condition={current?.condition ?? "Clouds"} isDay={computeIsDay(current)} />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {children}
      </main>
    </>
  );
}
