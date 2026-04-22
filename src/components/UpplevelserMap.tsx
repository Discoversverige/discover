"use client";

import { useEffect, useRef } from "react";
import type { Experience } from "@/lib/experiences";
import { getExperienceCoords, formatPrice } from "@/lib/experiences";

interface Props {
  experiences: Experience[];
  activeSlug: string | null;
  onMarkerHover?: (slug: string | null) => void;
}

/**
 * Leaflet-karta över Malmö-upplevelser.
 * - Varje Malmö-upplevelse får en pin med pris från.
 * - Upplevelser utanför Malmö visas som en samlad badge i kartans övre högra hörn.
 */
export default function UpplevelserMap({ experiences, activeSlug, onMarkerHover }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const activeSlugRef = useRef<string | null>(activeSlug);
  const onHoverRef = useRef(onMarkerHover);

  useEffect(() => {
    activeSlugRef.current = activeSlug;
  }, [activeSlug]);
  useEffect(() => {
    onHoverRef.current = onMarkerHover;
  }, [onMarkerHover]);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;

    const init = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !containerRef.current) return;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      const map = L.map(containerRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
      });
      mapRef.current = map;
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: "© OpenStreetMap © CARTO",
        maxZoom: 19,
      }).addTo(map);
      map.setView([55.605, 12.998], 13);
    };

    init();
    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current.clear();
    };
  }, []);

  // Update markers when experiences change
  useEffect(() => {
    let cancelled = false;
    const update = async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapRef.current) return;
      const map = mapRef.current;

      // Clear existing markers
      markersRef.current.forEach((m) => map.removeLayer(m));
      markersRef.current.clear();

      // Add Malmö pins
      for (const exp of experiences) {
        const coords = getExperienceCoords(exp);
        if (!coords) continue;

        const icon = L.divIcon({
          className: "upp-pin-wrap",
          html: `<div class="upp-pin" data-slug="${exp.slug}">${formatPrice(exp.priceFrom)}</div>`,
          iconSize: [70, 28],
          iconAnchor: [35, 14],
        });

        const marker = L.marker(coords, { icon })
          .addTo(map)
          .bindTooltip(exp.title, { direction: "top", offset: [0, -8], opacity: 0.95 });

        marker.on("mouseover", () => onHoverRef.current?.(exp.slug));
        marker.on("mouseout", () => onHoverRef.current?.(null));
        marker.on("click", () => {
          window.location.href = `/upplevelser/${exp.slug}`;
        });

        markersRef.current.set(exp.slug, marker);
      }
    };
    update();
    return () => {
      cancelled = true;
    };
  }, [experiences]);

  // Highlight active pin
  useEffect(() => {
    markersRef.current.forEach((marker, slug) => {
      const el = marker.getElement() as HTMLElement | undefined;
      if (!el) return;
      const pin = el.querySelector(".upp-pin") as HTMLElement | null;
      if (!pin) return;
      if (slug === activeSlug) {
        pin.classList.add("active");
      } else {
        pin.classList.remove("active");
      }
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
