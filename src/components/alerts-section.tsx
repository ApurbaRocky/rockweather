"use client";

import { AlertTriangle, Info, ShieldAlert, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import { formatDate, formatTime } from "@/lib/format";
import type { AlertSeverity, WeatherAlert } from "@/lib/types";

const SEVERITY_STYLES: Record<AlertSeverity, {
  label: string;
  badge: string;
  border: string;
  icon: ReactNode;
}> = {
  informational: {
    label: "Informational",
    badge: "bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-400/30",
    border: "border-sky-400/30",
    icon: <Info className="size-5 text-sky-500 dark:text-sky-300" aria-hidden="true" />,
  },
  moderate: {
    label: "Moderate",
    badge: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-300 border-yellow-400/30",
    border: "border-yellow-400/30",
    icon: <AlertTriangle className="size-5 text-yellow-500 dark:text-yellow-300" aria-hidden="true" />,
  },
  severe: {
    label: "Severe",
    badge: "bg-orange-500/15 text-orange-600 dark:text-orange-300 border-orange-400/30",
    border: "border-orange-400/30",
    icon: <ShieldAlert className="size-5 text-orange-500 dark:text-orange-300" aria-hidden="true" />,
  },
  extreme: {
    label: "Extreme",
    badge: "bg-red-500/15 text-red-600 dark:text-red-300 border-red-400/30",
    border: "border-red-400/30",
    icon: <ShieldAlert className="size-5 text-red-500 dark:text-red-300" aria-hidden="true" />,
  },
  unknown: {
    label: "Alert",
    badge: "bg-slate-500/15 text-slate-600 dark:text-slate-300 border-slate-400/30",
    border: "border-slate-400/30",
    icon: <Info className="size-5 text-slate-500 dark:text-slate-300" aria-hidden="true" />,
  },
};

interface AlertsSectionProps {
  alerts: WeatherAlert[];
  available: boolean;
  timezoneOffset: number;
}

export function AlertsSection({ alerts, available, timezoneOffset }: AlertsSectionProps) {
  if (!available) return null;

  return (
    <section aria-label="Weather alerts">
      <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Weather Alerts</h2>
      {alerts.length === 0 ? (
        <div className="glass-card flex items-center gap-3 px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
          <ShieldCheck className="size-5 text-emerald-500" aria-hidden="true" />
          No active weather alerts for this location.
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert, index) => {
            const style = SEVERITY_STYLES[alert.severity];
            return (
              <article
                key={index}
                aria-label={`${style.label} weather alert: ${alert.title}`}
                className={`glass-card border-l-4 p-5 ${style.border}`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-white/50 dark:bg-white/5">
                    {style.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{alert.title}</h3>
                    {alert.sender && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">{alert.sender}</p>
                    )}
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${style.badge}`}>
                    {style.label}
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  {formatDate(alert.start, timezoneOffset)} at {formatTime(alert.start, timezoneOffset)}
                  {" – "}
                  {formatDate(alert.end, timezoneOffset)} at {formatTime(alert.end, timezoneOffset)}
                </p>

                {alert.description && (
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {alert.description}
                  </p>
                )}

                {alert.safetyRecommendation && (
                  <div className="mt-4 rounded-xl bg-sky-500/10 px-4 py-3 text-sm text-sky-700 dark:text-sky-200">
                    <strong className="font-semibold">Safety:</strong> {alert.safetyRecommendation}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
