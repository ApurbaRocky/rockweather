import type { Metadata } from "next";

import { WeatherView } from "@/components/views/weather-view";

export const metadata: Metadata = {
  title: "Weather Dashboard",
  description:
    "Live current weather, statistics, hourly and multi-day forecasts for your selected location.",
};

export default function WeatherPage() {
  return <WeatherView />;
}
