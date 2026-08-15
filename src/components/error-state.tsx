"use client";

import { CloudOff, RotateCcw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Weather data is temporarily unavailable",
  message = "Please try again in a moment.",
  onRetry,
}: ErrorStateProps) {
  return (
    <section
      role="alert"
      className="glass-card flex flex-col items-center justify-center gap-4 px-6 py-16 text-center"
    >
      <span className="grid size-16 place-items-center rounded-2xl bg-sky-500/10 text-sky-500 dark:text-sky-300">
        <CloudOff className="size-8" aria-hidden="true" />
      </span>
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-500/30 transition-all hover:from-sky-400 hover:to-cyan-400 active:scale-95"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Try again
        </button>
      )}
    </section>
  );
}
