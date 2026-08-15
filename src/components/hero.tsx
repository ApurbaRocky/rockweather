"use client";

import { SearchBar } from "@/components/search-bar";
import type { LocationResult } from "@/lib/types";

interface HeroProps {
  onSelect: (location: LocationResult) => void;
  onUseLocation: () => void;
}

export function Hero({ onSelect, onUseLocation }: HeroProps) {
  return (
    <section className="mx-auto max-w-3xl px-4 pt-10 text-center sm:pt-14">
      <h1 className="text-balance text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
        Know Your Weather.{" "}
        <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">
          Plan Your Day.
        </span>
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-slate-600 dark:text-slate-300 sm:text-lg">
        Get accurate live weather conditions and forecasts for any location around the world.
      </p>
      <div className="mt-8">
        <SearchBar onSelect={onSelect} onUseLocation={onUseLocation} variant="hero" />
      </div>
    </section>
  );
}
