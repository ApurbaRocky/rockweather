"use client";

import type { ReactNode } from "react";
import { Cloud, Droplets, Eye, Gauge, Sunrise, Sunset, Wind } from "lucide-react";

import { formatTime } from "@/lib/format";
import { formatPressure, formatSpeed, formatVisibility, windDirectionLabel } from "@/lib/units";
import type { CurrentWeather } from "@/lib/types";

interface StatsGridProps {
  current: CurrentWeather;
}

export function StatsGrid({ current }: StatsGridProps) {
  const stats: Array<{
    label: string;
    value: string;
    icon: ReactNode;
    iconClass: string;
  }> = [
    {
      label: "Humidity",
      value: current.humidity !== null ? `${current.humidity}%` : "Not available",
      icon: <Droplets className="size-5" aria-hidden="true" />,
      iconClass: "bg-sky-500/15 text-sky-500 dark:text-sky-300",
    },
    {
      label: "Wind",
      value: `${formatSpeed(current.windSpeed)}${current.windDirection !== null ? ` ${windDirectionLabel(current.windDirection)}` : ""}`,
      icon: (
        <span className="grid place-items-center">
          <Wind className="size-5" aria-hidden="true" />
        </span>
      ),
      iconClass: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300",
    },
    {
      label: "Pressure",
      value: formatPressure(current.pressure),
      icon: <Gauge className="size-5" aria-hidden="true" />,
      iconClass: "bg-violet-500/15 text-violet-600 dark:text-violet-300",
    },
    {
      label: "Visibility",
      value: formatVisibility(current.visibility),
      icon: <Eye className="size-5" aria-hidden="true" />,
      iconClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
    },
    {
      label: "Cloudiness",
      value: current.clouds !== null ? `${current.clouds}%` : "Not available",
      icon: <Cloud className="size-5" aria-hidden="true" />,
      iconClass: "bg-slate-500/15 text-slate-600 dark:text-slate-300",
    },
    {
      label: "Sunrise",
      value: formatTime(current.sunrise, current.timezoneOffset),
      icon: <Sunrise className="size-5" aria-hidden="true" />,
      iconClass: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
    },
    {
      label: "Sunset",
      value: formatTime(current.sunset, current.timezoneOffset),
      icon: <Sunset className="size-5" aria-hidden="true" />,
      iconClass: "bg-orange-500/15 text-orange-600 dark:text-orange-300",
    },
    {
      label: "UV Index",
      value:
        current.uvIndex !== null
          ? `${current.uvIndex.toFixed(1)}`
          : "Not available",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      ),
      iconClass: "bg-rose-500/15 text-rose-600 dark:text-rose-300",
    },
  ];

  return (
    <section aria-label="Weather statistics">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card glass-card-hover flex items-start gap-3 p-4">
            <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${stat.iconClass}`}>
              {stat.icon}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
              <p className="mt-1 truncate text-sm font-bold text-slate-900 dark:text-white" title={stat.value}>
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>
      {current.windDirection !== null && (
        <p className="sr-only">Wind direction {windDirectionLabel(current.windDirection)}, {current.windDirection} degrees.</p>
      )}
    </section>
  );
}
