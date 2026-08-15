import type { Metadata } from "next";

import { MapsView } from "@/components/views/maps-view";

export const metadata: Metadata = {
  title: "Weather Maps",
  description:
    "Interactive weather map with live temperature, precipitation, clouds and wind overlays.",
};

export default function MapsPage() {
  return <MapsView />;
}
