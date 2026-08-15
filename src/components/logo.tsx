import { CloudSun } from "lucide-react";

import { APP_NAME } from "@/lib/constants";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="relative grid size-9 place-items-center rounded-xl bg-gradient-to-br from-sky-400 to-cyan-500 shadow-[0_4px_16px_rgba(56,189,248,0.45)]">
        <CloudSun className="size-5 text-white" aria-hidden="true" />
      </span>
      {!compact && (
        <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          {APP_NAME}
        </span>
      )}
    </span>
  );
}
