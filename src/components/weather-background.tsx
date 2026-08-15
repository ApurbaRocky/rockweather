"use client";

import { useMemo } from "react";

import { useSettings } from "@/context/settings-context";

type SceneGroup =
  | "thunderstorm"
  | "rain"
  | "snow"
  | "clear-day"
  | "clear-night"
  | "clouds"
  | "fog";

export function getSceneGroup(condition: string | undefined, isDay: boolean): SceneGroup {
  const c = (condition ?? "").toLowerCase();
  if (c.includes("thunder")) return "thunderstorm";
  if (c.includes("rain") || c.includes("drizzle")) return "rain";
  if (c.includes("snow") || c.includes("sleet")) return "snow";
  if (c.includes("clear")) return isDay ? "clear-day" : "clear-night";
  if (c.includes("fog") || c.includes("mist") || c.includes("haze") || c.includes("smoke") || c.includes("dust") || c.includes("sand") || c.includes("ash")) return "fog";
  return "clouds";
}

const GRADIENTS: Record<SceneGroup, { dark: string; light: string }> = {
  thunderstorm: {
    dark: "linear-gradient(180deg, #0a0f24 0%, #101d3d 45%, #0b1730 100%)",
    light: "linear-gradient(180deg, #5c6f8c 0%, #8294ad 60%, #9fadc0 100%)",
  },
  rain: {
    dark: "linear-gradient(180deg, #081120 0%, #0e2038 50%, #0a1830 100%)",
    light: "linear-gradient(180deg, #8fa6bf 0%, #b7c7da 60%, #cdd9e6 100%)",
  },
  snow: {
    dark: "linear-gradient(180deg, #0b1b30 0%, #16324d 55%, #1d3f5c 100%)",
    light: "linear-gradient(180deg, #c4d8ec 0%, #dde9f5 60%, #eef4fa 100%)",
  },
  "clear-day": {
    dark: "linear-gradient(180deg, #08214f 0%, #0d4d9c 45%, #0a2a63 100%)",
    light: "linear-gradient(180deg, #7db8ee 0%, #aed6f8 50%, #cfe7fb 100%)",
  },
  "clear-night": {
    dark: "linear-gradient(180deg, #04070f 0%, #0a1226 55%, #0d1b3a 100%)",
    light: "linear-gradient(180deg, #24304a 0%, #38486b 55%, #4c5f86 100%)",
  },
  clouds: {
    dark: "linear-gradient(180deg, #0a1428 0%, #13233f 50%, #0f1c36 100%)",
    light: "linear-gradient(180deg, #9db2c9 0%, #c4d3e2 55%, #dce6f0 100%)",
  },
  fog: {
    dark: "linear-gradient(180deg, #0d1420 0%, #16202f 55%, #101a2a 100%)",
    light: "linear-gradient(180deg, #aeb9c6 0%, #ccd5df 55%, #e2e8ef 100%)",
  },
};

function deterministicPositions(count: number, salt: number): Array<{ left: number; delay: number; duration: number }> {
  return Array.from({ length: count }, (_, i) => {
    const n = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
    const frac = n - Math.floor(n);
    const n2 = Math.sin(i * 39.346 + salt * 17.17) * 22468.123;
    const frac2 = n2 - Math.floor(n2);
    const n3 = Math.sin(i * 21.7 + salt * 91.3) * 31234.567;
    const frac3 = n3 - Math.floor(n3);
    return {
      left: frac * 100,
      delay: frac2 * 6,
      duration: 2 + frac3 * 4,
    };
  });
}

interface WeatherBackgroundProps {
  condition?: string;
  isDay?: boolean;
}

export function WeatherBackground({ condition, isDay = true }: WeatherBackgroundProps) {
  const { resolvedTheme } = useSettings();
  const group = useMemo(() => getSceneGroup(condition, isDay), [condition, isDay]);
  const gradient = resolvedTheme === "dark" ? GRADIENTS[group].dark : GRADIENTS[group].light;

  const rain = useMemo(() => deterministicPositions(26, 1), []);
  const snow = useMemo(() => deterministicPositions(22, 2), []);
  const stars = useMemo(() => deterministicPositions(46, 3), []);
  const clouds = useMemo(() => deterministicPositions(3, 4), []);

  const showRain = group === "rain" || group === "thunderstorm";
  const showSnow = group === "snow";
  const showStars = group === "clear-night";
  const showClouds = group === "clouds" || group === "fog" || group === "rain" || group === "snow";
  const showSun = group === "clear-day";
  const showLightning = group === "thunderstorm";

  return (
    <div className="bg-scene" aria-hidden="true">
      <div className="bg-gradient-layer" style={{ background: gradient }} />

      {showSun && <div className="sun-disc" style={{ top: "12%", right: "10%", width: 280, height: 280 }} />}

      {showStars &&
        stars.map((star, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${star.left}%`,
              top: `${(i % 5) * 12 + 4}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration + 2}s`,
            }}
          />
        ))}

      {showClouds &&
        clouds.map((c, i) => (
          <div
            key={i}
            className={`cloud cloud-${i + 1}`}
            style={{
              left: `${c.left}%`,
              animationDelay: `-${c.delay * 8}s`,
            }}
          />
        ))}

      <div className={`rain-layer ${showRain ? "visible" : ""}`}>
        {rain.map((drop, i) => (
          <div
            key={i}
            className="raindrop"
            style={{
              left: `${drop.left}%`,
              top: `${(i % 7) * 14}%`,
              height: `${8 + drop.duration * 4}px`,
              animationDelay: `${drop.delay}s`,
              animationDuration: `${0.8 + drop.duration * 0.3}s`,
            }}
          />
        ))}
      </div>

      <div className={`snow-layer ${showSnow ? "visible" : ""}`}>
        {snow.map((flake, i) => (
          <div
            key={i}
            className="snowflake"
            style={{
              left: `${flake.left}%`,
              top: `${(i % 9) * 11}%`,
              width: `${4 + (i % 4)}px`,
              height: `${4 + (i % 4)}px`,
              animationDelay: `${flake.delay}s`,
              animationDuration: `${5 + flake.duration * 2}s`,
            }}
          />
        ))}
      </div>

      {showLightning && <div className="lightning-flash" />}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 dark:to-black/30" />
    </div>
  );
}
