import type { Metadata } from "next";

import { SettingsView } from "@/components/views/settings-view";

export const metadata: Metadata = {
  title: "Settings",
  description: "Configure your RockWeather temperature unit, theme and preferences.",
};

export default function SettingsPage() {
  return <SettingsView />;
}
