"use client";

import { Monitor, Moon, Sun } from "lucide-react";

import { useSettings } from "@/context/settings-context";
import type { ThemePreference } from "@/lib/types";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, toggleTheme } = useSettings();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`grid size-10 place-items-center rounded-full border border-white/10 bg-white/60 text-slate-600 shadow-sm backdrop-blur-md transition-colors hover:text-sky-500 dark:bg-white/5 dark:text-slate-200 dark:hover:text-sky-300 ${className}`}
    >
      {isDark ? <Sun className="size-5" aria-hidden="true" /> : <Moon className="size-5" aria-hidden="true" />}
    </button>
  );
}

const THEME_OPTIONS: Array<{ value: ThemePreference; label: string; icon: typeof Sun }> = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function ThemeSelect({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useSettings();

  return (
    <div
      role="group"
      aria-label="Color theme"
      className={`inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/60 p-0.5 shadow-sm backdrop-blur-md dark:bg-white/5 ${className}`}
    >
      {THEME_OPTIONS.map((option) => {
        const Icon = option.icon;
        const active = theme === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => setTheme(option.value)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-all ${
              active
                ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md shadow-sky-500/30"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            }`}
          >
            <Icon className="size-4" aria-hidden="true" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
