"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Crosshair, Loader2, Menu, Search, X } from "lucide-react";

import { Logo } from "@/components/logo";
import { SearchBar } from "@/components/search-bar";
import { ThemeToggle } from "@/components/theme-toggle";
import { UnitToggle } from "@/components/unit-toggle";
import { useWeather } from "@/context/weather-context";
import { NAV_LINKS } from "@/lib/constants";
import type { LocationResult } from "@/lib/types";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { locateMe, locating } = useWeather();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSelect = (loc: LocationResult) => {
    setSearchOpen(false);
    setMobileOpen(false);
    router.push(
      `/weather?lat=${encodeURIComponent(loc.latitude)}&lon=${encodeURIComponent(loc.longitude)}`
    );
  };

  const handleLocate = () => {
    setMobileOpen(false);
    router.push("/weather");
    void locateMe();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-white/70 backdrop-blur-xl dark:bg-navy-950/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="RockWeather home" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-sky-500/15 text-sky-600 dark:text-sky-300"
                    : "text-slate-600 hover:bg-white/60 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search for a location"
              aria-expanded={searchOpen}
              className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/60 text-slate-600 shadow-sm backdrop-blur-md transition-colors hover:text-sky-500 dark:bg-white/5 dark:text-slate-200 dark:hover:text-sky-300"
            >
              <Search className="size-5" aria-hidden="true" />
            </button>
            {searchOpen && (
              <div className="absolute right-0 top-12 w-[min(92vw,380px)]">
                <SearchBar
                  variant="header"
                  onSelect={handleSelect}
                  id="header-location-search"
                  autoFocus
                />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleLocate}
            aria-label="Use my current location"
            title="Use my location"
            className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/60 text-slate-600 shadow-sm backdrop-blur-md transition-colors hover:text-sky-500 dark:bg-white/5 dark:text-slate-200 dark:hover:text-sky-300"
          >
            {locating ? (
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            ) : (
              <Crosshair className="size-5" aria-hidden="true" />
            )}
          </button>

          <UnitToggle className="hidden md:inline-flex" />
          <ThemeToggle className="hidden sm:grid" />

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/60 text-slate-600 shadow-sm backdrop-blur-md transition-colors hover:text-sky-500 dark:bg-white/5 dark:text-slate-200 dark:hover:text-sky-300 lg:hidden"
          >
            {mobileOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-white/90 backdrop-blur-xl dark:bg-navy-900/95 lg:hidden">
          <nav aria-label="Mobile navigation" className="mx-auto max-w-7xl space-y-1 px-4 py-3">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`block rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-sky-500/15 text-sky-600 dark:text-sky-300"
                      : "text-slate-700 hover:bg-white/60 dark:text-slate-200 dark:hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="flex items-center justify-between gap-3 px-2 pt-3">
              <UnitToggle />
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
