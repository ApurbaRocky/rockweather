import type { Metadata } from "next";

import { ForecastView } from "@/components/views/forecast-view";

export const metadata: Metadata = {
  title: "Forecast",
  description:
    "Hour-by-hour and multi-day weather forecast with high/low temperatures and precipitation probability.",
};

export default function ForecastPage() {
  return <ForecastView />;
}
