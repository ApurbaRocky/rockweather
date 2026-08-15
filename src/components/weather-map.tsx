"use client";

import { useEffect, useRef, useState } from "react";
import { Layers, Loader2, LocateFixed } from "lucide-react";
import type * as Leaflet from "leaflet";

import { useSettings } from "@/context/settings-context";
import { TILE_PROXY } from "@/lib/constants";
import "leaflet/dist/leaflet.css";

interface WeatherMapProps {
  latitude: number;
  longitude: number;
  locationName?: string;
}

const BASE_DARK = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const BASE_LIGHT = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

const LAYERS = [
  { id: "none", label: "None" },
  { id: "temp_new", label: "Temperature" },
  { id: "precipitation_new", label: "Precipitation" },
  { id: "clouds_new", label: "Clouds" },
  { id: "wind_new", label: "Wind" },
] as const;

export function WeatherMap({ latitude, longitude, locationName }: WeatherMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<{
    map: Leaflet.Map;
    overlay: Leaflet.TileLayer | null;
    base: Leaflet.TileLayer;
    marker: Leaflet.Marker;
    L: typeof import("leaflet");
  } | null>(null);
  const initRef = useRef(false);
  const { resolvedTheme } = useSettings();
  const themeRef = useRef(resolvedTheme);
  const [activeLayer, setActiveLayer] = useState<string>("none");
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || initRef.current) return;
    initRef.current = true;

    let cancelled = false;
    let mapInstance: L.Map | null = null;

    void (async () => {
      const L = await import("leaflet");
      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        center: [latitude, longitude],
        zoom: 9,
        zoomControl: true,
        attributionControl: true,
      });
      mapInstance = map;

      const baseUrl = themeRef.current === "dark" ? BASE_DARK : BASE_LIGHT;
      const base = L.tileLayer(baseUrl, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      });
      base.addTo(map);

      const icon = L.divIcon({
        className: "",
        html: `<div class="leaflet-weather-pin"><svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path fill="#0ea5e9" stroke="#fff" stroke-width="1.5" d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z"/><circle cx="12" cy="9" r="2.8" fill="#fff"/></svg></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });
      const marker = L.marker([latitude, longitude], { icon }).addTo(map);
      if (locationName) {
        marker.bindPopup(`<b>${locationName}</b>`).openPopup();
      }

      mapRef.current = { map, overlay: null, base, marker, L };
      setMapReady(true);
    })();

    return () => {
      cancelled = true;
      mapInstance?.remove();
      mapRef.current = null;
      initRef.current = false;
      setMapReady(false);
    };
  }, [latitude, longitude, locationName]);

  useEffect(() => {
    const entry = mapRef.current;
    if (!entry) return;
    entry.map.setView([latitude, longitude], Math.max(entry.map.getZoom(), 8));
    if (locationName) {
      entry.marker.bindPopup(`<b>${locationName}</b>`).openPopup();
    }
  }, [latitude, longitude, locationName]);

  useEffect(() => {
    const entry = mapRef.current;
    if (!entry) return;
    themeRef.current = resolvedTheme;
    const L = entry.L;
    const baseUrl = resolvedTheme === "dark" ? BASE_DARK : BASE_LIGHT;
    const base = L.tileLayer(baseUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
    });
    entry.base.remove();
    entry.base = base;
    base.addTo(entry.map);
  }, [resolvedTheme]);

  const applyOverlay = (layerId: string) => {
    const entry = mapRef.current;
    if (!entry) return;
    if (entry.overlay) {
      entry.map.removeLayer(entry.overlay);
      entry.overlay = null;
    }
    setActiveLayer(layerId);
    if (layerId === "none") return;
    const overlay = entry.L.tileLayer(`${TILE_PROXY}/${layerId}/{z}/{x}/{y}`, {
      opacity: 0.65,
      maxZoom: 12,
      tms: false,
    });
    entry.overlay = overlay;
    overlay.addTo(entry.map);
  };

  const handleLocate = () => {
    mapRef.current?.map.flyTo([latitude, longitude], Math.max(mapRef.current.map.getZoom(), 9));
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <Layers className="size-4 text-sky-500" aria-hidden="true" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Weather Map</h2>
          {!mapReady && <Loader2 className="size-4 animate-spin text-slate-400" aria-hidden="true" />}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex flex-wrap gap-1">
            {LAYERS.map((layer) => (
              <button
                key={layer.id}
                type="button"
                onClick={() => applyOverlay(layer.id)}
                aria-pressed={activeLayer === layer.id}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeLayer === layer.id
                    ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md shadow-sky-500/30"
                    : "border border-white/10 bg-white/50 text-slate-600 hover:text-sky-600 dark:bg-white/5 dark:text-slate-300 dark:hover:text-sky-300"
                }`}
              >
                {layer.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleLocate}
            aria-label="Center map on location"
            className="grid size-8 place-items-center rounded-full border border-white/10 bg-white/50 text-slate-600 transition-colors hover:text-sky-500 dark:bg-white/5 dark:text-slate-300 dark:hover:text-sky-300"
          >
            <LocateFixed className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        role="application"
        aria-label={`Interactive weather map centered on ${locationName ?? "the selected location"}`}
        className="h-[420px] w-full sm:h-[480px]"
      />
      <p className="px-4 py-2 text-xs text-slate-400 dark:text-slate-500">
        {activeLayer === "none"
          ? "Select a layer above to overlay live weather data."
          : `Showing ${LAYERS.find((l) => l.id === activeLayer)?.label.toLowerCase()} overlay.`}
      </p>
    </div>
  );
}
