"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import {
  TRAVEL_CITIES,
  REGION_CENTER,
  REGION_ZOOM,
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  type CitySlug,
  type CategorySlug,
  type TravelCity,
} from "@/lib/travel-data";
import { useLang, type Lang } from "@/lib/lang";

const HUB_STRINGS: Record<Lang, { back: string; choose: string; eyebrow: string }> = {
  sv: { back: "Tillbaka", choose: "Välj vad du vill boka", eyebrow: "Region · Öresund" },
  en: { back: "Back", choose: "Choose what to book", eyebrow: "Region · Øresund" },
  de: { back: "Zurück", choose: "Wählen Sie eine Kategorie", eyebrow: "Region · Øresund" },
};

const CATEGORY_ICON: Record<CategorySlug, string> = {
  boende: "◆",
  bil: "▲",
  transport: "●",
};

interface CategoryPinPosition {
  lat: number;
  lng: number;
}

function categoryOffset(city: TravelCity, category: CategorySlug): CategoryPinPosition {
  const offsets: Record<CategorySlug, [number, number]> = {
    boende: [0.0042, -0.0080],
    bil: [0.0042, 0.0080],
    transport: [-0.0048, 0.0000],
  };
  const [dLat, dLng] = offsets[category];
  return { lat: city.lat + dLat, lng: city.lng + dLng };
}

export default function TravelHubMap() {
  const lang = useLang();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const LRef = useRef<any>(null);
  const cityMarkersRef = useRef<Map<CitySlug, any>>(new Map());
  const categoryMarkersRef = useRef<any[]>([]);
  const [activeCity, setActiveCity] = useState<CitySlug | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const langRef = useRef(lang);

  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

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
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: false,
      });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: "© OpenStreetMap © CARTO",
        maxZoom: 19,
      }).addTo(map);
      map.setView(REGION_CENTER, REGION_ZOOM);
      mapRef.current = map;

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
      cityMarkersRef.current.clear();
      categoryMarkersRef.current = [];
    };
  }, []);

  // Render city pins
  useEffect(() => {
    if (!mapReady || !mapRef.current || !LRef.current) return;
    const L = LRef.current;
    const map = mapRef.current;

    cityMarkersRef.current.forEach((m) => map.removeLayer(m));
    cityMarkersRef.current.clear();

    for (const city of TRAVEL_CITIES) {
      const html = `
        <div class="hub-pin ${activeCity === city.slug ? "is-active" : ""}" data-slug="${city.slug}">
          <div class="hub-pin-dot"></div>
          <div class="hub-pin-stem"></div>
          <div class="hub-pin-label">
            <div class="hub-pin-name">${city.name[langRef.current]}</div>
            <div class="hub-pin-tag">${city.tag[langRef.current]}</div>
          </div>
        </div>
      `;
      const icon = L.divIcon({
        className: "hub-pin-wrap",
        html,
        iconSize: [180, 80],
        iconAnchor: [90, 80],
      });
      const marker = L.marker([city.lat, city.lng], { icon, riseOnHover: true }).addTo(map);
      marker.on("click", () => {
        setActiveCity((current) => (current === city.slug ? null : city.slug));
      });
      cityMarkersRef.current.set(city.slug, marker);
    }
  }, [mapReady, lang]);

  // Update active state classes on city pins
  useEffect(() => {
    cityMarkersRef.current.forEach((marker, slug) => {
      const el = marker.getElement() as HTMLElement | undefined;
      if (!el) return;
      const pin = el.querySelector(".hub-pin") as HTMLElement | null;
      if (!pin) return;
      if (slug === activeCity) pin.classList.add("is-active");
      else pin.classList.remove("is-active");
    });
  }, [activeCity]);

  // Fly to active city + render category pins
  useEffect(() => {
    if (!mapReady || !mapRef.current || !LRef.current) return;
    const L = LRef.current;
    const map = mapRef.current;

    // Clear existing category pins
    categoryMarkersRef.current.forEach((m) => map.removeLayer(m));
    categoryMarkersRef.current = [];

    if (activeCity) {
      const city = TRAVEL_CITIES.find((c) => c.slug === activeCity);
      if (!city) return;

      map.flyTo([city.lat, city.lng], city.zoom, { duration: 1.2, easeLinearity: 0.25 });

      // Drop category pins after fly animation
      const timeoutId = window.setTimeout(() => {
        if (!mapRef.current) return;
        CATEGORY_ORDER.forEach((cat, idx) => {
          const pos = categoryOffset(city, cat);
          const label = CATEGORY_LABELS[cat][langRef.current];
          const html = `
            <a href="/ta-dig-hit/${city.slug}/${cat}" class="cat-pin" style="--cat-delay:${idx * 90}ms" data-cat="${cat}">
              <span class="cat-pin-icon">${CATEGORY_ICON[cat]}</span>
              <span class="cat-pin-label">${label}</span>
            </a>
          `;
          const icon = L.divIcon({
            className: "cat-pin-wrap",
            html,
            iconSize: [128, 44],
            iconAnchor: [64, 22],
          });
          const marker = L.marker([pos.lat, pos.lng], { icon, riseOnHover: true }).addTo(map);
          categoryMarkersRef.current.push(marker);
        });
      }, 700);

      return () => window.clearTimeout(timeoutId);
    } else {
      map.flyTo(REGION_CENTER, REGION_ZOOM, { duration: 1.0, easeLinearity: 0.25 });
    }
  }, [activeCity, mapReady, lang]);

  const strings = HUB_STRINGS[lang];

  return (
    <div className="hub-map-wrap">
      <div ref={containerRef} className="hub-map-canvas" />
      <div className={`hub-overlay ${activeCity ? "hub-overlay-active" : ""}`}>
        <div className="hub-overlay-eyebrow">{strings.eyebrow}</div>
      </div>
      {activeCity && (
        <button
          type="button"
          className="hub-back-btn"
          onClick={() => setActiveCity(null)}
          aria-label={strings.back}
        >
          <span className="hub-back-arrow">←</span>
          <span>{strings.back}</span>
        </button>
      )}
    </div>
  );
}
