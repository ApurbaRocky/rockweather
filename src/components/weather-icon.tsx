/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Moon,
  Sun,
} from "lucide-react";

type FallbackGroup =
  | "thunder"
  | "drizzle"
  | "rain"
  | "snow"
  | "clear"
  | "cloud"
  | "fog";

function fallbackGroup(condition: string, icon: string): FallbackGroup {
  const isNight = icon.endsWith("n");
  const c = condition.toLowerCase();
  if (c.includes("thunder")) return "thunder";
  if (c.includes("drizzle")) return "drizzle";
  if (c.includes("rain")) return "rain";
  if (c.includes("snow")) return "snow";
  if (c.includes("clear")) return "clear";
  if (
    c.includes("fog") ||
    c.includes("mist") ||
    c.includes("haze") ||
    c.includes("smoke") ||
    c.includes("dust") ||
    c.includes("sand") ||
    c.includes("ash") ||
    c.includes("squall") ||
    c.includes("tornado")
  ) {
    return "fog";
  }
  if (c.includes("cloud")) return "cloud";
  return isNight ? "clear" : "cloud";
}

function FallbackWeatherIcon({
  group,
  className,
  size,
  isNight,
}: {
  group: FallbackGroup;
  className: string;
  size: number;
  isNight: boolean;
}) {
  const common = {
    className,
    style: { width: size, height: size },
    strokeWidth: 1.4,
    "aria-hidden": true as const,
  };
  switch (group) {
    case "thunder":
      return <CloudLightning {...common} />;
    case "drizzle":
      return <CloudDrizzle {...common} />;
    case "rain":
      return <CloudRain {...common} />;
    case "snow":
      return <CloudSnow {...common} />;
    case "clear":
      return isNight ? <Moon {...common} /> : <Sun {...common} />;
    case "fog":
      return <CloudFog {...common} />;
    default:
      return <Cloud {...common} />;
  }
}

interface WeatherIconProps {
  icon: string;
  condition: string;
  className?: string;
  imgClassName?: string;
  alt?: string;
  size?: number;
}

export function WeatherIcon({
  icon,
  condition,
  className = "",
  imgClassName = "",
  alt,
  size = 64,
}: WeatherIconProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !icon) {
    return (
      <FallbackWeatherIcon
        group={fallbackGroup(condition, icon ?? "01d")}
        className={className}
        size={size}
        isNight={(icon ?? "01d").endsWith("n")}
      />
    );
  }

  return (
    <img
      src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
      alt={alt ?? condition}
      width={size}
      height={size}
      loading="lazy"
      className={`${imgClassName} select-none`}
      onError={() => setFailed(true)}
      draggable={false}
    />
  );
}
