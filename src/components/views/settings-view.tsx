"use client";

import { Gauge, MoonStar, RefreshCw, Thermometer } from "lucide-react";

import { ThemeSelect } from "@/components/theme-toggle";
import { UnitToggle } from "@/components/unit-toggle";

const REFRESH_MINUTES = Number(process.env.NEXT_PUBLIC_WEATHER_REFRESH_MINUTES) || 10;

export function SettingsView() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Personalize how RockWeather looks and reports temperatures.
        </p>
      </header>

      <section aria-labelledby="settings-unit" className="glass-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sky-500/15 text-sky-500 dark:text-sky-300">
            <Thermometer className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id="settings-unit" className="text-base font-bold text-slate-900 dark:text-white">
              Temperature Unit
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Applied to current weather and all forecasts. Defaults to Celsius.
            </p>
          </div>
        </div>
        <UnitToggle />
      </section>

      <section aria-labelledby="settings-theme" className="glass-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-500/15 text-violet-500 dark:text-violet-300">
            <MoonStar className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id="settings-theme" className="text-base font-bold text-slate-900 dark:text-white">
              Appearance
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Choose dark, light, or follow your system preference.
            </p>
          </div>
        </div>
        <ThemeSelect />
      </section>

      <section aria-labelledby="settings-refresh" className="glass-card flex items-start gap-3 p-5">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-500/15 text-emerald-500 dark:text-emerald-300">
          <RefreshCw className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 id="settings-refresh" className="text-base font-bold text-slate-900 dark:text-white">
            Automatic Refresh
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Weather data refreshes automatically every {REFRESH_MINUTES} minutes to stay within
            API rate limits. Use the <strong className="font-semibold">Refresh</strong> button on
            the weather card to update manually at any time.
          </p>
        </div>
      </section>

      <section aria-labelledby="settings-data" className="glass-card flex items-start gap-3 p-5">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-500/15 text-amber-500 dark:text-amber-300">
          <Gauge className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 id="settings-data" className="text-base font-bold text-slate-900 dark:text-white">
            Data Source
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            All live weather, forecast, air quality and map data is provided by OpenWeather. Some
            advanced fields (UV index, alerts, air quality) appear only when your OpenWeather plan
            returns them. RockWeather never fabricates weather data.
          </p>
        </div>
      </section>
    </div>
  );
}
