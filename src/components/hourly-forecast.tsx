"use client";

import { Droplets } from "lucide-react";

import { WeatherIcon } from "@/components/weather-icon";
import { useSettings } from "@/context/settings-context";
import { useNowSeconds } from "@/hooks/use-time";
import { formatTime } from "@/lib/format";
import { formatTemp } from "@/lib/units";
import type { HourlyForecast } from "@/lib/types";

interface HourlyForecastProps {
  hourly: HourlyForecast[];
  timezoneOffset: number;
}

export function HourlyForecast({ hourly, timezoneOffset }: HourlyForecastProps) {
  const { unit } = useSettings();
  const nowSeconds = useNowSeconds();

  return (
    <section aria-label="Hourly forecast">
      <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Hourly Forecast</h2>
      <div className="scroll-slim -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {hourly.map((item) => {
          const isNow =
            item.time <= nowSeconds && nowSeconds - item.time < 3.5 * 3600;
          const label = isNow
            ? "Now"
            : formatTime(item.time, timezoneOffset, { hour12: true });
          return (
            <div
              key={item.time}
              className={`glass-card flex w-24 shrink-0 snap-start flex-col items-center gap-2 p-4 transition-all ${
                isNow
                  ? "border-sky-400/60 bg-sky-500/15 shadow-glow dark:bg-sky-500/15"
                  : "glass-card-hover"
              }`}
            >
              <span
                className={`text-xs font-semibold ${
                  isNow
                    ? "text-sky-600 dark:text-sky-300"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {label}
              </span>
              <WeatherIcon
                icon={item.icon}
                condition={item.condition}
                size={44}
                alt={`${item.description} at ${label}`}
              />
              <span className="text-base font-bold text-slate-900 dark:text-white">
                {formatTemp(item.temperature, unit)}
              </span>
              {item.precipitationProbability !== null && item.precipitationProbability > 0 && (
                <span className="flex items-center gap-0.5 text-xs font-medium text-sky-600 dark:text-sky-300">
                  <Droplets className="size-3" aria-hidden="true" />
                  {item.precipitationProbability}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
