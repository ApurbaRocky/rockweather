"use client";

import type { ReactNode } from "react";

import { FavoritesProvider } from "@/context/favorites-context";
import { SettingsProvider } from "@/context/settings-context";
import { ToastProvider } from "@/context/toast-context";
import { WeatherProvider } from "@/context/weather-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <SettingsProvider>
        <FavoritesProvider>
          <WeatherProvider>{children}</WeatherProvider>
        </FavoritesProvider>
      </SettingsProvider>
    </ToastProvider>
  );
}
