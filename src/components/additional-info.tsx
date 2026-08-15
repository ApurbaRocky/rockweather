"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { useSettings } from "@/context/settings-context";
import {
  formatCoordinates,
  formatTime,
  formatUtcOffset,
} from "@/lib/format";
import {
  formatPressure,
  formatSpeed,
  formatTemp,
  formatVisibility,
  windDirectionDegrees,
  windDirectionLabel,
} from "@/lib/units";
import type { CurrentWeather } from "@/lib/types";

export function AdditionalInfo({ current }: { current: CurrentWeather }) {
  const { unit } = useSettings();
  const [open, setOpen] = useState(false);

  const rows: Array<{ label: string; value: string }> = [];

  if (current.dewPoint !== null)
    rows.push({ label: "Dew Point", value: formatTemp(current.dewPoint, unit) });
  if (current.windGust !== null)
    rows.push({ label: "Wind Gust", value: formatSpeed(current.windGust) });
  if (current.windDirection !== null)
    rows.push({
      label: "Wind Direction",
      value: `${windDirectionLabel(current.windDirection)} (${windDirectionDegrees(current.windDirection)})`,
    });
  if (current.clouds !== null)
    rows.push({ label: "Cloud Coverage", value: `${current.clouds}%` });
  if (current.visibility !== null)
    rows.push({ label: "Visibility", value: formatVisibility(current.visibility) });
  if (current.pressure !== null)
    rows.push({ label: "Pressure", value: formatPressure(current.pressure) });
  if (current.high !== null && current.low !== null)
    rows.push({
      label: "Min / Max Temperature",
      value: `${formatTemp(current.low, unit)} / ${formatTemp(current.high, unit)}`,
    });
  rows.push({ label: "Coordinates", value: formatCoordinates(current.latitude, current.longitude) });
  rows.push({
    label: "Timezone",
    value: `${formatUtcOffset(current.timezoneOffset)}${current.timezoneName ? ` (${current.timezoneName})` : ""}`,
  });
  if (current.sunrise !== null)
    rows.push({ label: "Sunrise", value: formatTime(current.sunrise, current.timezoneOffset) });
  if (current.sunset !== null)
    rows.push({ label: "Sunset", value: formatTime(current.sunset, current.timezoneOffset) });
  if (current.rain !== null && current.rain > 0)
    rows.push({ label: "Rain (last 1h)", value: `${current.rain.toFixed(1)} mm` });
  if (current.snow !== null && current.snow > 0)
    rows.push({ label: "Snow (last 1h)", value: `${current.snow.toFixed(1)} mm` });

  if (rows.length === 0) return null;

  return (
    <section aria-label="Additional weather information">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 py-1 text-left"
      >
        <span className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
          Additional Information
        </span>
        <ChevronDown
          className={`size-5 text-slate-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {rows.map((row) => (
            <div
              key={row.label}
              className="glass-card flex flex-col justify-between gap-1 p-4"
            >
              <dt className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {row.label}
              </dt>
              <dd className="text-sm font-bold text-slate-900 dark:text-white">{row.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
