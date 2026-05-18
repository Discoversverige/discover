"use client";

import { useEffect, useRef } from "react";
import type { Route } from "@/lib/routes";
import type { Lang } from "@/lib/i18n";

interface Props {
  route: Route;
  activeStop: number;
  onStopClick: (i: number) => void;
  lang: Lang;
}

export default function LeafletMap({ route, activeStop, onStopClick, lang }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polylineRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const stops = route.stops as any[];
      const center: [number, number] = [
        stops.reduce((s, p) => s + p.lat, 0) / stops.length,
        stops.reduce((s, p) => s + p.lng, 0) / stops.length,
      ];

      const map = L.map(containerRef.current!, { zoomControl: true, scrollWheelZoom: true });
      mapRef.current = map;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);

      map.setView(center, 14);

      const latlngs: [number, number][] = stops.map(s => [s.lat, s.lng]);
      polylineRef.current = L.polyline(latlngs, {
        color: "oklch(0.52 0.12 155)",
        weight: 3,
        opacity: 0.8,
        dashArray: "6 8",
      }).addTo(map);

      markersRef.current = stops.map((stop, i) => {
        const isActive = i === activeStop;
        const letter = String.fromCharCode(65 + i);
        const icon = L.divIcon({
          className: "",
          html: `<div style="
            width:32px;height:32px;border-radius:50%;
            background:${isActive ? "oklch(0.52 0.12 155)" : "#fff"};
            border:2.5px solid oklch(0.52 0.12 155);
            display:flex;align-items:center;justify-content:center;
            font-family:var(--font-inter-tight),-apple-system,sans-serif;font-size:12px;font-weight:600;
            color:${isActive ? "#fff" : "oklch(0.52 0.12 155)"};
            box-shadow:0 2px 8px rgba(0,0,0,0.15);
            cursor:pointer;
          ">${letter}</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([stop.lat, stop.lng], { icon })
          .addTo(map)
          .on("click", () => onStopClick(i));

        const name = stop.name[lang] || stop.name.en;
        const kind = stop.kind[lang] || stop.kind.en;
        marker.bindTooltip(`<strong>${name}</strong><br/><span style="font-size:11px;color:#888">${kind}</span>`, {
          direction: "top",
          offset: [0, -18],
        });

        return marker;
      });
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [route, lang]);

  useEffect(() => {
    if (!mapRef.current || markersRef.current.length === 0) return;
    const L_sync = require("leaflet");
    const stops = route.stops as any[];
    markersRef.current.forEach((marker, i) => {
      const isActive = i === activeStop;
      const letter = String.fromCharCode(65 + i);
      const icon = L_sync.divIcon({
        className: "",
        html: `<div style="
          width:32px;height:32px;border-radius:50%;
          background:${isActive ? "oklch(0.52 0.12 155)" : "#fff"};
          border:2.5px solid oklch(0.52 0.12 155);
          display:flex;align-items:center;justify-content:center;
          font-family:var(--font-inter-tight),-apple-system,sans-serif;font-size:12px;font-weight:600;
          color:${isActive ? "#fff" : "oklch(0.52 0.12 155)"};
          box-shadow:0 2px 8px rgba(0,0,0,0.15);
          cursor:pointer;
        ">${letter}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      marker.setIcon(icon);
    });
  }, [activeStop]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
