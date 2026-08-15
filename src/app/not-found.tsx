import Link from "next/link";
import { CloudOff } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-4 text-center">
      <span className="grid size-20 place-items-center rounded-3xl bg-sky-500/10 text-sky-500 dark:text-sky-300">
        <CloudOff className="size-10" aria-hidden="true" />
      </span>
      <div className="space-y-2">
        <p className="text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">404</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Page not found
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-sky-500/30 transition-all hover:from-sky-400 hover:to-cyan-400 active:scale-95"
      >
        Back to RockWeather
      </Link>
    </div>
  );
}
