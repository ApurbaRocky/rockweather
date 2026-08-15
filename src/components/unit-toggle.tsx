"use client";

import { useSettings } from "@/context/settings-context";
import { useToasts } from "@/context/toast-context";
import type { TemperatureUnit } from "@/lib/types";

const OPTIONS: Array<{ value: TemperatureUnit; label: string }> = [
  { value: "celsius", label: "°C" },
  { value: "fahrenheit", label: "°F" },
];

export function UnitToggle({ className = "" }: { className?: string }) {
  const { unit, setUnit } = useSettings();
  const { notify } = useToasts();

  return (
    <div
      role="group"
      aria-label="Temperature unit"
      className={`inline-flex items-center rounded-full border border-white/10 bg-white/60 p-0.5 shadow-sm backdrop-blur-md dark:bg-white/5 ${className}`}
    >
      {OPTIONS.map((option) => {
        const active = unit === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => {
              if (!active) {
                setUnit(option.value);
                notify("info", "Temperature unit changed", option.value === "celsius" ? "Showing temperatures in Celsius." : "Showing temperatures in Fahrenheit.");
              }
            }}
            className={`rounded-full px-3 py-1 text-sm font-semibold transition-all ${
              active
                ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md shadow-sky-500/30"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
