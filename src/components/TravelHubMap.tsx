"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import {
  TRAVEL_CITIES,
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  type CitySlug,
  type CategorySlug,
  type TravelCity,
} from "@/lib/travel-data";
import { useLang, type Lang } from "@/lib/lang";

const REGION_BOUNDS_LATLNG: [[number, number], [number, number]] = (() => {
  const lats = TRAVEL_CITIES.map((c) => c.lat);
  const lngs = TRAVEL_CITIES.map((c) => c.lng);
  return [
    [Math.min(...lats), Math.min(...lngs)],
    [Math.max(...lats), Math.max(...lngs)],
  ];
})();

function regionPadding(): { paddingTopLeft: [number, number]; paddingBottomRight: [number, number] } {
  if (typeof window === "undefined") {
    return { paddingTopLeft: [120, 80], paddingBottomRight: [120, 80] };
  }
  const isMobile = window.innerWidth < 700;
  return isMobile
    ? { paddingTopLeft: [100, 70], paddingBottomRight: [100, 60] }
    : { paddingTopLeft: [140, 90], paddingBottomRight: [140, 90] };
}

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

interface Particle {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

const PARTICLE_COUNT = 38;

export default function TravelHubMap() {
  const lang = useLang();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const LRef = useRef<any>(null);
  const cityMarkersRef = useRef<Map<CitySlug, any>>(new Map());
  const categoryMarkersRef = useRef<any[]>([]);
  const [activeCity, setActiveCity] = useState<CitySlug | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
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
        scrollWheelZoom: true,
        attributionControl: false,
      });
      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: "© OpenStreetMap © CARTO",
        maxZoom: 19,
      }).addTo(map);
      map.fitBounds(REGION_BOUNDS_LATLNG, regionPadding());
      mapRef.current = map;

      requestAnimationFrame(() => {
        if (!cancelled && mapRef.current) {
          mapRef.current.invalidateSize();
          mapRef.current.fitBounds(REGION_BOUNDS_LATLNG, regionPadding());
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

  // Update active state classes on city pins. Also disable pointer events
  // on the active marker so its 180x80 icon-area stops swallowing clicks
  // intended for the category pins beneath it.
  useEffect(() => {
    cityMarkersRef.current.forEach((marker, slug) => {
      const el = marker.getElement() as HTMLElement | undefined;
      if (!el) return;
      if (slug === activeCity) {
        el.classList.add("is-active-wrap");
      } else {
        el.classList.remove("is-active-wrap");
      }
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
      map.flyToBounds(REGION_BOUNDS_LATLNG, { ...regionPadding(), duration: 1.0, easeLinearity: 0.25 });
    }
  }, [activeCity, mapReady, lang]);

  // Re-fit bounds on viewport resize when no city is active
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const onResize = () => {
      if (!mapRef.current) return;
      mapRef.current.invalidateSize();
      if (!activeCity) {
        mapRef.current.fitBounds(REGION_BOUNDS_LATLNG, regionPadding());
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mapReady, activeCity]);

  // Particle burst when a city becomes active — label dissolves and drifts
  // up to the top-right corner where the active-city tag re-forms.
  useEffect(() => {
    console.log("[hub-particle] effect run", { activeCity, mapReady });
    if (!activeCity || !containerRef.current || !mapReady) {
      setParticles([]);
      return;
    }
    const marker = cityMarkersRef.current.get(activeCity);
    console.log("[hub-particle] marker", marker);
    if (!marker) return;
    const markerEl = marker.getElement() as HTMLElement | null;
    const labelEl = markerEl?.querySelector(".hub-pin-label") as HTMLElement | null;
    const wrap = containerRef.current.parentElement;
    console.log("[hub-particle] dom", { markerEl: !!markerEl, labelEl: !!labelEl, wrap: !!wrap });
    if (!labelEl || !wrap) return;

    const labelRect = labelEl.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();
    console.log("[hub-particle] rects", { labelRect, wrapRect });

    // Target = active-city tag at top-right of map
    const isMobile = window.innerWidth < 700;
    const targetX = wrapRect.width - (isMobile ? 60 : 80);
    const targetY = isMobile ? 36 : 44;

    const next: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const startX = labelRect.left - wrapRect.left + Math.random() * labelRect.width;
      const startY = labelRect.top - wrapRect.top + Math.random() * labelRect.height;
      next.push({
        id: `${activeCity}-${i}-${Date.now()}`,
        startX,
        startY,
        endX: targetX + (Math.random() - 0.5) * 30,
        endY: targetY + (Math.random() - 0.5) * 18,
        size: 4 + Math.random() * 4,
        delay: Math.random() * 200,
        duration: 700 + Math.random() * 380,
        opacity: 0.7 + Math.random() * 0.3,
      });
    }
    console.log("[hub-particle] generated", next.length, "particles. first:", next[0]);
    setParticles(next);
    const cleanup = window.setTimeout(() => setParticles([]), 1500);
    return () => window.clearTimeout(cleanup);
  }, [activeCity, mapReady]);

  const strings = HUB_STRINGS[lang];

  const activeCityData = activeCity ? TRAVEL_CITIES.find((c) => c.slug === activeCity) : null;

  return (
    <div className="hub-map-wrap">
      <div ref={containerRef} className="hub-map-canvas" />
      <div className={`hub-overlay ${activeCity ? "hub-overlay-active" : ""}`}>
        <div className="hub-overlay-eyebrow">{strings.eyebrow}</div>
      </div>
      {activeCityData && (
        <div className="hub-active-tag" key={activeCityData.slug} aria-live="polite">
          <div className="hub-active-tag-name">{activeCityData.name[lang]}</div>
          <div className="hub-active-tag-tag">{activeCityData.tag[lang]}</div>
        </div>
      )}
      {particles.length > 0 && (
        <div className="hub-particles" aria-hidden="true">
          {particles.map((p) => (
            <span
              key={p.id}
              className="hub-particle"
              style={{
                left: `${p.startX}px`,
                top: `${p.startY}px`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                ['--p-end-x' as any]: `${p.endX - p.startX}px`,
                ['--p-end-y' as any]: `${p.endY - p.startY}px`,
                ['--p-delay' as any]: `${p.delay}ms`,
                ['--p-duration' as any]: `${p.duration}ms`,
                ['--p-opacity' as any]: `${p.opacity}`,
              }}
            />
          ))}
        </div>
      )}
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
