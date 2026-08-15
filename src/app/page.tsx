import type { Metadata } from "next";

import { HomeView } from "@/components/views/home-view";

export const metadata: Metadata = {
  title: {
    absolute: "RockWeather — Live Weather Forecast",
  },
  description:
    "Get live weather conditions, hourly forecasts and multi-day weather forecasts for locations around the world with RockWeather.",
};

export default function HomePage() {
  return <HomeView />;
}
