"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { Loader2, MapPin, Search, Star, X } from "lucide-react";

import { useDebouncedValue } from "@/hooks/use-time";
import { fetchSearchResults } from "@/lib/api";
import { POPULAR_LOCATIONS, popularLocationToResult } from "@/lib/constants";
import { formatCoordinates } from "@/lib/format";
import type { LocationResult } from "@/lib/types";

interface SearchBarProps {
  onSelect: (location: LocationResult) => void;
  onUseLocation?: () => void;
  variant?: "hero" | "header";
  autoFocus?: boolean;
  id?: string;
}

export function SearchBar({
  onSelect,
  onUseLocation,
  variant = "hero",
  autoFocus = false,
  id,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationResult[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const debouncedQuery = useDebouncedValue(query, 350);
  const isHero = variant === "hero";

  const popular = useMemo(
    () => POPULAR_LOCATIONS.map(popularLocationToResult),
    []
  );

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed.length < 2) {
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    void (async () => {
      setStatus("loading");
      let items: LocationResult[];
      try {
        items = await fetchSearchResults(trimmed, controller.signal);
      } catch {
        if (!controller.signal.aborted) {
          setResults([]);
          setStatus("error");
        }
        return;
      }
      if (controller.signal.aborted) return;
      setResults(items);
      setStatus("done");
      setActiveIndex(items.length > 0 ? 0 : -1);
    })();
    return () => controller.abort();
  }, [debouncedQuery]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const selectResult = useCallback(
    (loc: LocationResult) => {
      setOpen(false);
      setQuery("");
      setResults([]);
      setStatus("idle");
      onSelect(loc);
    },
    [onSelect]
  );

  const submitQuery = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      const trimmed = query.trim();
      if (!trimmed) return;
      if (results.length > 0 && activeIndex >= 0 && activeIndex < results.length) {
        selectResult(results[activeIndex]);
        return;
      }
      if (results.length === 1) {
        selectResult(results[0]);
        return;
      }
      if (results.length === 0 && status === "done") {
        setStatus("error");
      }
    },
    [query, results, activeIndex, status, selectResult]
  );

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const max = Math.max(results.length, popular.length);
      setActiveIndex((prev) => (prev + 1) % max);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const max = Math.max(results.length, popular.length);
      setActiveIndex((prev) => (prev <= 0 ? max - 1 : prev - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      submitQuery();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showPopular = query.trim().length < 2;
  const displayList = showPopular ? popular : results;
  const emptyResults = status === "done" && results.length === 0 && !showPopular;

  return (
    <div ref={containerRef} className="relative w-full">
      <form
        role="search"
        onSubmit={submitQuery}
        className={`flex items-center gap-2 rounded-2xl border border-white/20 bg-white/70 shadow-lg shadow-black/10 backdrop-blur-xl transition-all focus-within:border-sky-400/70 focus-within:shadow-sky-500/20 dark:bg-slate-900/60 ${
          isHero ? "p-2" : "p-1.5"
        }`}
      >
        <Search
          className={`shrink-0 text-slate-400 ${isHero ? "ml-2 size-5" : "ml-1.5 size-4"}`}
          aria-hidden="true"
        />
        <label htmlFor={id ?? "location-search"} className="sr-only">
          Search city, country or location
        </label>
        <input
          ref={inputRef}
          id={id ?? "location-search"}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls="location-search-results"
          aria-autocomplete="list"
          autoComplete="off"
          spellCheck={false}
          placeholder={isHero ? "Search city, country or location..." : "Search city..."}
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            setOpen(true);
            setActiveIndex(-1);
            if (value.trim().length < 2) {
              abortRef.current?.abort();
              setResults([]);
              setStatus("idle");
            }
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className={`w-full min-w-0 bg-transparent text-slate-900 placeholder-slate-400 outline-none dark:text-white dark:placeholder-slate-500 ${
            isHero ? "px-2 py-2.5 text-base sm:text-lg" : "px-2 py-1.5 text-sm"
          }`}
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="grid size-8 shrink-0 place-items-center rounded-full text-slate-400 transition-colors hover:bg-white/20 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}
        <button
          type="submit"
          className={`shrink-0 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 font-semibold text-white shadow-md shadow-sky-500/30 transition-all hover:from-sky-400 hover:to-cyan-400 active:scale-95 ${
            isHero ? "px-5 py-2.5 text-sm sm:px-6" : "px-3 py-1.5 text-sm"
          }`}
        >
          Search
        </button>
        {isHero && onUseLocation && (
          <button
            type="button"
            onClick={onUseLocation}
            className="flex shrink-0 items-center gap-1.5 rounded-xl border border-sky-400/30 bg-sky-500/10 px-4 py-2.5 text-sm font-semibold text-sky-600 transition-all hover:bg-sky-500/20 active:scale-95 dark:text-sky-300 sm:px-5"
          >
            <MapPin className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Use My Location</span>
            <span className="sm:hidden">My Location</span>
          </button>
        )}
      </form>

      {open && (
        <div
          id="location-search-results"
          role="listbox"
          aria-label="Location suggestions"
          className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-white/20 bg-white/95 shadow-2xl shadow-black/20 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95"
        >
          {status === "loading" && (
            <div className="flex items-center gap-3 px-4 py-3 text-sm text-slate-500 dark:text-slate-300">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Searching locations...
            </div>
          )}

          {emptyResults && (
            <div className="px-4 py-3 text-sm text-slate-500 dark:text-slate-300">
              We couldn&apos;t find that location. Try searching with a different city or country.
            </div>
          )}

          {!showPopular && results.length > 0 && (
            <>
              <p className="px-4 pt-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Results
              </p>
              {results.map((loc, index) => (
                <button
                  key={loc.id}
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectResult(loc)}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
                    index === activeIndex ? "bg-sky-500/10" : "hover:bg-white/60 dark:hover:bg-white/5"
                  }`}
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-sky-500" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {loc.name}
                    </span>
                    <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                      {loc.displayName}
                    </span>
                    <span className="mt-0.5 block text-[10px] font-medium text-sky-500/80 dark:text-sky-400/70">
                      {formatCoordinates(loc.latitude, loc.longitude)}
                    </span>
                  </span>
                </button>
              ))}
            </>
          )}

          {showPopular && (
            <>
              <p className="flex items-center gap-1.5 px-4 pt-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Star className="size-3" aria-hidden="true" />
                Popular locations
              </p>
              <div className="grid gap-1 p-2 sm:grid-cols-2">
                {displayList.map((loc, index) => (
                  <button
                    key={loc.id}
                    type="button"
                    role="option"
                    aria-selected={index === activeIndex}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectResult(loc)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors ${
                      index === activeIndex ? "bg-sky-500/10" : "hover:bg-white/60 dark:hover:bg-white/5"
                    }`}
                  >
                    <MapPin className="size-4 shrink-0 text-sky-500" aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {loc.name}
                      </span>
                      <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                        {loc.country}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
