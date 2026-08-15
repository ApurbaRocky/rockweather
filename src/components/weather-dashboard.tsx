"use client";

import { AlertTriangle } from "lucide-react";

import { AdditionalInfo } from "@/components/additional-info";
import { AirQualitySection } from "@/components/air-quality";
import { AlertsSection } from "@/components/alerts-section";
import { DailyForecast } from "@/components/daily-forecast";
import { ErrorState } from "@/components/error-state";
import { HourlyForecast } from "@/components/hourly-forecast";
import { StatsGrid } from "@/components/stats-grid";
import { WeatherCard } from "@/components/weather-card";
import { DashboardSkeleton } from "@/components/skeletons";
import { useWeather } from "@/context/weather-context";

export function WeatherDashboard() {
  const { data, loading, error, refresh } = useWeather();

  if (loading && !data) {
    return <DashboardSkeleton />;
  }

  if (error && !data) {
    return (
      <ErrorState
        message={error.message}
        onRetry={() => void refresh()}
      />
    );
  }

  if (!data) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-2xl border border-orange-400/30 bg-orange-500/10 px-4 py-3 text-sm text-orange-700 dark:text-orange-300"
        >
          <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
          <span className="flex-1">Couldn&apos;t refresh the latest data. Showing the last available weather.</span>
          <button
            type="button"
            onClick={() => void refresh()}
            className="font-semibold underline-offset-2 hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      <WeatherCard current={data.current} />
      <HourlyForecast hourly={data.forecast.hourly} timezoneOffset={data.current.timezoneOffset} />
      <StatsGrid current={data.current} />
      <DailyForecast daily={data.forecast.daily} timezoneOffset={data.current.timezoneOffset} />
      <AlertsSection
        alerts={data.alerts.alerts}
        available={data.alerts.available}
        timezoneOffset={data.current.timezoneOffset}
      />
      <AirQualitySection airQuality={data.airQuality} />
      <AdditionalInfo current={data.current} />
      <p className="sr-only" role="status">
        Weather data loaded for {data.current.location}.
      </p>
    </div>
  );
}
