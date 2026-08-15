"use client";

import { Droplets } from "lucide-react";

import { WeatherIcon } from "@/components/weather-icon";
import { useSettings } from "@/context/settings-context";
import { formatDate, formatWeekday, formatWeekdayShort } from "@/lib/format";
import { formatTemp } from "@/lib/units";
import type { DailyForecast } from "@/lib/types";

interface DailyForecastProps {
  daily: DailyForecast[];
  timezoneOffset: number;
}

export function DailyForecast({ daily, timezoneOffset }: DailyForecastProps) {
  const { unit } = useSettings();

  return (
    <section aria-label="Multi-day forecast">
      <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Multi-Day Forecast</h2>
      <div className="space-y-2">
        {daily.map((day) => {
          const today = day.isToday;
          return (
            <div
              key={day.date}
              className={`glass-card glass-card-hover flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5 ${
                today ? "border-sky-400/50 bg-sky-500/10 dark:bg-sky-500/10" : ""
              }`}
            >
              <div className="w-24 shrink-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {today ? "Today" : formatWeekdayShort(day.date, timezoneOffset)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatDate(day.date, timezoneOffset)}
                </p>
              </div>

              <div className="flex w-16 shrink-0 items-center justify-center">
                <WeatherIcon
                  icon={day.icon}
                  condition={day.condition}
                  size={40}
                  alt={`${day.description} on ${formatWeekday(day.date, timezoneOffset)}`}
                />
              </div>

              <p className="hidden min-w-0 flex-1 truncate text-sm capitalize text-slate-500 dark:text-slate-400 sm:block">
                {day.description}
              </p>

              <div className="flex items-center gap-2 text-sm">
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatTemp(day.high, unit)}
                </span>
                <span className="text-slate-400 dark:text-slate-500">
                  {formatTemp(day.low, unit)}
                </span>
              </div>

              {day.precipitationProbability !== null && day.precipitationProbability > 0 && (
                <span className="hidden w-16 shrink-0 items-center justify-end gap-1 text-xs font-medium text-sky-600 dark:text-sky-300 sm:flex">
                  <Droplets className="size-3" aria-hidden="true" />
                  {day.precipitationProbability}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
