export function WeatherCardSkeleton() {
  return (
    <section aria-busy="true" aria-label="Loading current weather" className="glass-card p-6 sm:p-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="skeleton h-6 w-10" />
            <div className="skeleton h-6 w-32" />
          </div>
          <div className="mt-5 skeleton h-16 w-40" />
          <div className="mt-3 skeleton h-5 w-24" />
          <div className="mt-4 flex items-center gap-3">
            <div className="skeleton size-4" />
            <div className="skeleton h-4 w-28" />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="skeleton size-24 rounded-full" />
          <div className="space-y-2">
            <div className="skeleton h-4 w-20" />
            <div className="skeleton h-4 w-16" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function StatsGridSkeleton() {
  return (
    <section aria-busy="true" aria-label="Loading weather statistics">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="glass-card p-4">
            <div className="skeleton h-4 w-20" />
            <div className="mt-3 skeleton h-6 w-16" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function HourlyForecastSkeleton() {
  return (
    <section aria-busy="true" aria-label="Loading hourly forecast">
      <div className="skeleton mb-4 h-6 w-40" />
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="glass-card w-24 shrink-0 p-4">
            <div className="skeleton h-3 w-12" />
            <div className="mx-auto mt-4 skeleton size-10 rounded-full" />
            <div className="mt-4 skeleton h-5 w-12" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function DailyForecastSkeleton() {
  return (
    <section aria-busy="true" aria-label="Loading multi-day forecast">
      <div className="skeleton mb-4 h-6 w-40" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="glass-card flex items-center justify-between p-4">
            <div className="skeleton h-4 w-24" />
            <div className="skeleton size-10 rounded-full" />
            <div className="skeleton h-4 w-28" />
            <div className="skeleton h-4 w-16" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <WeatherCardSkeleton />
      <StatsGridSkeleton />
      <HourlyForecastSkeleton />
      <DailyForecastSkeleton />
    </div>
  );
}
