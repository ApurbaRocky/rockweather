"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Clock3, Heart, Loader2, RefreshCw } from "lucide-react";

import { WeatherIcon } from "@/components/weather-icon";
import { useFavorites } from "@/context/favorites-context";
import { useSettings } from "@/context/settings-context";
import { useToasts } from "@/context/toast-context";
import { useWeather } from "@/context/weather-context";
import { useLocalTime } from "@/hooks/use-time";
import { formatDate, formatRelativeTime, formatWeekday } from "@/lib/format";
import { formatTemp } from "@/lib/units";
import type { CurrentWeather } from "@/lib/types";

export function WeatherCard({ current }: { current: CurrentWeather }) {
  const { unit } = useSettings();
  const { notify } = useToasts();
  const { refresh, refreshing, lastUpdated } = useWeather();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  const localTime = useLocalTime(current.timezoneOffset ?? 0);
  const favorite = isFavorite(current.latitude, current.longitude);

  const handleToggleFavorite = () => {
    toggleFavorite({
      id: `${current.latitude.toFixed(4)},${current.longitude.toFixed(4)}`,
      name: current.location,
      country: current.country,
      countryCode: current.countryCode,
      state: current.region,
      latitude: current.latitude,
      longitude: current.longitude,
    });
    notify(
      favorite ? "info" : "success",
      favorite ? "Removed from favorites" : "Added to favorites",
      `${current.location} ${favorite ? "removed from" : "added to"} your favorite locations.`
    );
  };

  const handleRefresh = async () => {
    await refresh();
    notify("success", "Weather refreshed", "Latest weather data loaded.");
  };

  return (
    <section aria-label="Current weather" className="glass-card relative overflow-hidden p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-sky-400/10 blur-3xl" />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {current.location}
            </h1>
            {current.country && (
              <span className="rounded-full bg-sky-500/15 px-3 py-1 text-xs font-semibold text-sky-600 dark:text-sky-300">
                {current.country}
              </span>
            )}
            <button
              type="button"
              onClick={handleToggleFavorite}
              aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
              aria-pressed={favorite}
              className={`grid size-9 place-items-center rounded-full border transition-all active:scale-90 ${
                favorite
                  ? "border-rose-400/40 bg-rose-500/15 text-rose-500 dark:text-rose-400"
                  : "border-white/15 bg-white/40 text-slate-400 hover:text-rose-500 dark:bg-white/5 dark:hover:text-rose-400"
              }`}
            >
              <Heart className={`size-4 ${favorite ? "fill-current" : ""}`} aria-hidden="true" />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4" aria-hidden="true" />
              {formatWeekday(current.updatedAt / 1000, current.timezoneOffset)},{" "}
              {formatDate(current.updatedAt / 1000, current.timezoneOffset, { long: true })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock3 className="size-4" aria-hidden="true" />
              Local time {localTime}
            </span>
          </div>

          <div className="mt-6 flex items-end gap-3">
            <span className="text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-8xl">
              {formatTemp(current.temperature, unit)}
            </span>
            <span className="pb-2 text-lg font-semibold capitalize text-slate-500 dark:text-slate-300">
              {current.description}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-300">
            <span>
              Feels like{" "}
              <strong className="font-semibold">{formatTemp(current.feelsLike, unit)}</strong>
            </span>
            <span>
              H: <strong className="font-semibold">{formatTemp(current.high, unit)}</strong>
            </span>
            <span>
              L: <strong className="font-semibold">{formatTemp(current.low, unit)}</strong>
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1.5">
              <RefreshCw className="size-3.5" aria-hidden="true" />
              Updated {lastUpdated ? formatRelativeTime(lastUpdated, now) : "—"}
            </span>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1.5 font-semibold text-sky-600 transition-all hover:bg-sky-500/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:text-sky-300"
            >
              {refreshing ? (
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <RefreshCw className="size-3.5" aria-hidden="true" />
              )}
              Refresh
            </button>
          </div>
        </div>

        <div className="flex items-center gap-5 lg:flex-col lg:items-center">
          <div className="grid size-28 place-items-center rounded-full bg-gradient-to-br from-sky-400/20 to-cyan-400/10 shadow-inner sm:size-32">
            <WeatherIcon
              icon={current.icon}
              condition={current.condition}
              size={96}
              className="drop-shadow-lg"
              alt={`${current.description} icon`}
            />
          </div>
          {current.precipitationProbability !== null && current.precipitationProbability > 0 && (
            <span className="rounded-full bg-sky-500/15 px-3 py-1 text-xs font-semibold text-sky-600 dark:text-sky-300">
              Precipitation {current.precipitationProbability}%
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
