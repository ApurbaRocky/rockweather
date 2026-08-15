"use client";

import type { AirQualityData } from "@/lib/types";
import { aqiLabel } from "@/lib/format";

const BANDS = [
  { min: 1, label: "Good", color: "#10b981", text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500" },
  { min: 2, label: "Moderate", color: "#eab308", text: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-500" },
  { min: 3, label: "Unhealthy", color: "#f97316", text: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500" },
  { min: 4, label: "Very Unhealthy", color: "#ef4444", text: "text-red-600 dark:text-red-400", bg: "bg-red-500" },
  { min: 5, label: "Hazardous", color: "#a855f7", text: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500" },
];

const POLLUTANTS: Array<{ key: keyof Pick<AirQualityData, "pm25" | "pm10" | "co" | "no2" | "o3" | "so2">; label: string; unit: string }> = [
  { key: "pm25", label: "PM2.5", unit: "µg/m³" },
  { key: "pm10", label: "PM10", unit: "µg/m³" },
  { key: "co", label: "CO", unit: "µg/m³" },
  { key: "no2", label: "NO₂", unit: "µg/m³" },
  { key: "o3", label: "O₃", unit: "µg/m³" },
  { key: "so2", label: "SO₂", unit: "µg/m³" },
];

export function AirQualitySection({ airQuality }: { airQuality: AirQualityData | null }) {
  if (!airQuality) return null;

  const aqi = Math.min(5, Math.max(1, airQuality.aqi));
  const band = BANDS[aqi - 1];
  const label = aqiLabel(aqi);

  return (
    <section aria-label="Air quality index">
      <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Air Quality</h2>
      <div className="glass-card p-5">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span
              className="grid size-16 place-items-center rounded-2xl text-2xl font-extrabold text-white shadow-lg"
              style={{ backgroundColor: band.color }}
              aria-hidden="true"
            >
              {aqi}
            </span>
            <div>
              <p className={`text-lg font-bold ${band.text}`}>{label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Air Quality Index (1–5)
              </p>
            </div>
          </div>

          <div className="min-w-0 flex-1 sm:max-w-sm" role="img" aria-label={`Air quality level: ${label}`}>
            <div className="flex h-2.5 w-full overflow-hidden rounded-full">
              {BANDS.map((b) => (
                <div key={b.label} className="flex-1" style={{ backgroundColor: b.color }} />
              ))}
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] font-medium text-slate-400">
              <span>Good</span>
              <span>Hazardous</span>
            </div>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {POLLUTANTS.map((pollutant) => {
            const value = airQuality[pollutant.key];
            return (
              <div key={pollutant.key} className="rounded-xl bg-white/50 px-3 py-2.5 text-center dark:bg-white/5">
                <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {pollutant.label}
                </dt>
                <dd className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                  {value !== null ? (
                    <>
                      {value.toFixed(1)}
                      <span className="ml-0.5 text-[10px] font-medium text-slate-400">{pollutant.unit}</span>
                    </>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
