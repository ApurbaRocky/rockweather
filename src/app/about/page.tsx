import type { Metadata } from "next";
import {
  Activity,
  CloudSun,
  Compass,
  Database,
  Map,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about RockWeather — live weather, forecasts and air quality in a clean, premium interface powered by OpenWeather.",
};

const FEATURES = [
  {
    icon: CloudSun,
    title: "Live Conditions",
    description:
      "Real-time temperature, humidity, wind, pressure, visibility, cloudiness, sunrise and sunset for any location.",
  },
  {
    icon: Activity,
    title: "Hourly & Multi-Day Forecasts",
    description:
      "Hour-by-hour outlook and multi-day forecasts with high/low temperatures and precipitation probability.",
  },
  {
    icon: Map,
    title: "Weather Maps",
    description:
      "Interactive maps with temperature, precipitation, clouds and wind overlays centered on your location.",
  },
  {
    icon: Compass,
    title: "Global Location Search",
    description:
      "Search any city or country, or use your current location, with saved favorites for quick access.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable Data",
    description:
      "All numbers come directly from OpenWeather. Nothing is estimated, invented, or placeholder data.",
  },
  {
    icon: Zap,
    title: "Fast & Responsive",
    description:
      "Smart caching, debounced search, skeleton loaders and a responsive design that works from 320px to ultra-wide screens.",
  },
];

const TECH = [
  "Next.js App Router (React 19)",
  "TypeScript with a typed weather data model",
  "Tailwind CSS design system",
  "Server-side API proxy (API key never reaches the browser)",
  "Leaflet interactive maps",
  "Lucide icons",
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-12">
      <header className="text-center">
        <h1 className="text-balance text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Weather Intelligence,{" "}
          <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">
            Simplified.
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-slate-600 dark:text-slate-300 sm:text-lg">
          {APP_NAME} provides a clean, premium interface for viewing live weather information and
          forecasts. {APP_TAGLINE}
        </p>
      </header>

      <section aria-labelledby="mission-heading" className="glass-card p-6 sm:p-8">
        <h2 id="mission-heading" className="text-2xl font-bold text-slate-900 dark:text-white">
          Our Mission
        </h2>
        <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
          Weather should be effortless to understand. {APP_NAME} turns raw meteorological data
          into a clear, beautiful and dependable experience — helping you plan your day, your
          travel and your safety with confidence. We believe accuracy and honesty come first:
          every reading you see is real, live data from a trusted provider.
        </p>
      </section>

      <section aria-labelledby="features-heading">
        <h2 id="features-heading" className="mb-5 text-2xl font-bold text-slate-900 dark:text-white">
          Features
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="glass-card glass-card-hover flex flex-col gap-3 p-5">
              <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-sky-500/20 to-cyan-500/20 text-sky-500 dark:text-sky-300">
                <feature.icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="tech-heading" className="glass-card p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <Database className="size-5 text-sky-500" aria-hidden="true" />
          <h2 id="tech-heading" className="text-2xl font-bold text-slate-900 dark:text-white">
            Technology
          </h2>
        </div>
        <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
          {APP_NAME} is engineered for performance, accessibility and security.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {TECH.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <span className="size-1.5 rounded-full bg-sky-400" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="data-heading" className="glass-card p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <CloudSun className="size-5 text-sky-500" aria-hidden="true" />
          <h2 id="data-heading" className="text-2xl font-bold text-slate-900 dark:text-white">
            Data Source
          </h2>
        </div>
        <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
          All weather data, forecasts, air quality readings and map overlays on {APP_NAME} are
          powered by the{" "}
          <a
            href="https://openweathermap.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-sky-600 underline-offset-2 hover:underline dark:text-sky-300"
          >
            OpenWeather
          </a>{" "}
          API. OpenWeather provides high-resolution, real-time meteorological data collected from
          thousands of global observation stations. Some advanced fields — including UV index,
          weather alerts and the air quality index — are shown only when the configured OpenWeather
          plan supplies them.
        </p>
      </section>
    </div>
  );
}
