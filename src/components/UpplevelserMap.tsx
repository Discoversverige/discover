"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type { Experience } from "@/lib/experiences";
import { getExperienceCoords, formatPrice } from "@/lib/experiences";

interface Props {
  experiences: Experience[];
  activeSlug: string | null;
  onMarkerHover?: (slug: string | null) => void;
}

export default function UpplevelserMap({ experiences, activeSlug, onMarkerHover }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const LRef = useRef<any>(null);
  const markersRef = useRef<globalThis.Map<string, any>>(new globalThis.Map());
  const onHoverRef = useRef(onMarkerHover);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    onHoverRef.current = onMarkerHover;
  }, [onMarkerHover]);

  // Init map once
  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current) return;
      LRef.current = L;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      const map = L.map(containerRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
      });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: "© OpenStreetMap © CARTO",
        maxZoom: 19,
      }).addTo(map);
      map.setView([55.605, 12.998], 13);
      mapRef.current = map;

      // Small delay to ensure container has final size
      requestAnimationFrame(() => {
        if (!cancelled && mapRef.current) {
          mapRef.current.invalidateSize();
          setMapReady(true);
        }
      });
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current.clear();
    };
  }, []);

  // Add/remove markers whenever experiences or mapReady changes
  useEffect(() => {
    if (!mapReady || !mapRef.current || !LRef.current) return;
    const L = LRef.current;
    const map = mapRef.current;

    // Clear existing markers
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current.clear();

    for (const exp of experiences) {
      const coords = getExperienceCoords(exp);
      if (!coords) continue;

      const icon = L.divIcon({
        className: "upp-pin-wrap",
        html: `<div class="upp-pin" data-slug="${exp.slug}">${formatPrice(exp.priceFrom)}</div>`,
        iconSize: [80, 28],
        iconAnchor: [40, 14],
      });

      const marker = L.marker(coords, { icon })
        .addTo(map)
        .bindTooltip(exp.title, { direction: "top", offset: [0, -10], opacity: 0.95 });

      marker.on("mouseover", () => onHoverRef.current?.(exp.slug));
      marker.on("mouseout", () => onHoverRef.current?.(null));
      marker.on("click", () => {
        window.location.href = `/upplevelser/${exp.slug}`;
      });

      markersRef.current.set(exp.slug, marker);
    }
  }, [experiences, mapReady]);

  // Highlight active pin
  useEffect(() => {
    markersRef.current.forEach((marker, slug) => {
      const el = marker.getElement() as HTMLElement | undefined;
      if (!el) return;
      const pin = el.querySelector(".upp-pin") as HTMLElement | null;
      if (!pin) return;
      if (slug === activeSlug) pin.classList.add("active");
      else pin.classList.remove("active");
    });
  }, [activeSlug]);

  const outsideCount = experiences.filter((e) => e.region !== "Malmö").length;

  return (
    <div className="upp-map-wrap">
      <div ref={containerRef} className="upp-map-canvas" />
      {outsideCount > 0 && (
        <div className="upp-map-outside-badge" title={`${outsideCount} upplevelser utanför Malmö`}>
          +{outsideCount}
          <span className="upp-map-outside-label">utanför Malmö</span>
        </div>
      )}
    </div>
  );
}
