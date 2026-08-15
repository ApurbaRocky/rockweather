import Link from "next/link";

import { Logo } from "@/components/logo";
import { APP_TAGLINE, FOOTER_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-white/50 backdrop-blur-xl dark:bg-navy-950/50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <Link href="/" aria-label="RockWeather home">
              <Logo />
            </Link>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{APP_TAGLINE}</p>
            <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
              Weather data powered by OpenWeather
            </p>
          </div>

          <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-12 gap-y-2 sm:grid-cols-3">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-slate-600 transition-colors hover:text-sky-500 dark:text-slate-300 dark:hover:text-sky-300"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/about"
              className="text-sm text-slate-600 transition-colors hover:text-sky-500 dark:text-slate-300 dark:hover:text-sky-300"
            >
              Privacy
            </Link>
            <Link
              href="/about"
              className="text-sm text-slate-600 transition-colors hover:text-sky-500 dark:text-slate-300 dark:hover:text-sky-300"
            >
              Terms
            </Link>
          </nav>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} RockWeather. All rights reserved. Built with live data from
          OpenWeather.
        </div>
      </div>
    </footer>
  );
}
