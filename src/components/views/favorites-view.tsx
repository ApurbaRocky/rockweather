"use client";

import Link from "next/link";
import { Heart, MapPin, Star, Trash2 } from "lucide-react";

import { WeatherIcon } from "@/components/weather-icon";
import { useFavorites } from "@/context/favorites-context";
import { useSettings } from "@/context/settings-context";
import { useToasts } from "@/context/toast-context";
import { useWeatherForLocation } from "@/hooks/use-weather-for-location";
import { formatTemp } from "@/lib/units";
import type { FavoriteLocation } from "@/lib/types";

function FavoriteCard({
  favorite,
  onRemove,
}: {
  favorite: FavoriteLocation;
  onRemove: () => void;
}) {
  const { unit } = useSettings();
  const { data, loading, error } = useWeatherForLocation(favorite);

  const current = data?.current;

  return (
    <Link
      href={`/weather?lat=${encodeURIComponent(favorite.latitude)}&lon=${encodeURIComponent(favorite.longitude)}`}
      className="glass-card glass-card-hover group relative flex flex-col gap-4 p-5 focus-visible:outline-2"
      aria-label={`View weather for ${favorite.name}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 truncate font-bold text-slate-900 dark:text-white">
            <MapPin className="size-4 shrink-0 text-sky-500" aria-hidden="true" />
            {favorite.name}
          </p>
          <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
            {favorite.state ? `${favorite.state}, ` : ""}
            {favorite.country}
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onRemove();
          }}
          aria-label={`Remove ${favorite.name} from favorites`}
          className="grid size-8 shrink-0 place-items-center rounded-full border border-white/10 bg-white/40 text-slate-400 opacity-100 transition-all hover:text-rose-500 dark:bg-white/5 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-center justify-between gap-2">
        {loading && (
          <div className="flex-1">
            <div className="skeleton h-9 w-20" />
            <div className="mt-2 skeleton h-4 w-24" />
          </div>
        )}
        {error && (
          <p className="text-sm text-slate-500 dark:text-slate-400">Weather unavailable</p>
        )}
        {current && !loading && (
          <>
            <div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {formatTemp(current.temperature, unit)}
              </p>
              <p className="mt-0.5 text-xs capitalize text-slate-500 dark:text-slate-400">
                {current.description}
              </p>
            </div>
            <WeatherIcon
              icon={current.icon}
              condition={current.condition}
              size={48}
              alt={`${current.description} in ${favorite.name}`}
            />
          </>
        )}
      </div>
    </Link>
  );
}

export function FavoritesView() {
  const { favorites, removeFavorite } = useFavorites();
  const { notify } = useToasts();

  const handleRemove = (id: string, name: string) => {
    removeFavorite(id);
    notify("info", "Favorite removed", `${name} removed from your favorite locations.`);
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          <Star className="size-7 text-amber-400" aria-hidden="true" />
          Favorite Locations
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Quick access to live weather for the places you care about. Tap a card to open its
          dashboard.
        </p>
      </header>

      {favorites.length === 0 ? (
        <div className="glass-card flex flex-col items-center gap-3 px-6 py-16 text-center">
          <span className="grid size-16 place-items-center rounded-2xl bg-sky-500/10 text-sky-500 dark:text-sky-300">
            <Heart className="size-8" aria-hidden="true" />
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            No favorites yet
          </h2>
          <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
            Search for any city and tap the heart on the weather card to save it here.
          </p>
          <Link
            href="/weather"
            className="mt-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-500/30 transition-all hover:from-sky-400 hover:to-cyan-400 active:scale-95"
          >
            Find a location
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((favorite) => (
            <FavoriteCard
              key={favorite.id}
              favorite={favorite}
              onRemove={() => handleRemove(favorite.id, favorite.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
