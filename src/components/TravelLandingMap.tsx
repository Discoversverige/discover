"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/lang";
import type { TravelCity, TravelOffer, PinMode } from "@/lib/travel-data";

interface Props {
  city: TravelCity;
  offers: TravelOffer[];
  mode: PinMode;
  activeId: string | null;
  onSelect: (offer: TravelOffer) => void;
  ctaLabel: string;
  lang: Lang;
}

function escape(html: string): string {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function popupHtml(offer: TravelOffer, lang: Lang, ctaLabel: string): string {
  return `
    <div class="land-popup">
      <div class="land-popup-img" style="background-image:url(${escape(offer.image)})"></div>
      <div class="land-popup-body">
        <div class="land-popup-name">${escape(offer.name)}</div>
        <div class="land-popup-blurb">${escape(offer.blurb[lang])}</div>
        <div class="land-popup-foot">
          <span class="land-popup-price">${escape(offer.price[lang])}</span>
          <a class="land-popup-cta" href="${escape(offer.url)}" target="_blank" rel="noopener noreferrer sponsored">
            ${escape(ctaLabel)}<span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </div>
  `;
}

export default function TravelLandingMap({ city, offers, mode, activeId, onSelect, ctaLabel, lang }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const LRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const onSelectRef = useRef(onSelect);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);

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
        attributionControl: false,
      });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: "© OpenStreetMap © CARTO",
        maxZoom: 19,
      }).addTo(map);
      map.setView([city.lat, city.lng], city.zoom);
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
      markersRef.current.clear();
    };
  }, [city.slug]);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !LRef.current) return;
    const L = LRef.current;
    const map = mapRef.current;

    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current.clear();

    offers.forEach((offer, idx) => {
      const html = `
        <div class="land-pin" data-id="${escape(offer.id)}" style="--pin-delay:${idx * 100}ms">
          <div class="land-pin-price">${escape(offer.price[lang])}</div>
          <div class="land-pin-tail"></div>
        </div>
      `;
      const icon = L.divIcon({
        className: "land-pin-wrap",
        html,
        iconSize: [120, 44],
        iconAnchor: [60, 44],
      });
      const marker = L.marker([offer.lat, offer.lng], { icon, riseOnHover: true }).addTo(map);

      if (mode === "popup") {
        marker.bindPopup(popupHtml(offer, lang, ctaLabel), {
          className: "land-popup-wrap",
          maxWidth: 320,
          minWidth: 280,
          closeButton: true,
          autoClose: true,
          closeOnClick: false,
          closeOnEscapeKey: true,
          autoPan: true,
        });
        // Highlight via Leaflet's own popup lifecycle so the popup-open
        // and active-state stay in sync without competing with bindPopup's
        // built-in toggle handler.
        marker.on("popupopen", () => onSelectRef.current(offer));
      } else {
        marker.on("click", () => onSelectRef.current(offer));
      }

      markersRef.current.set(offer.id, marker);
    });
  }, [mapReady, offers, mode, lang, ctaLabel]);

  // Highlight active pin
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const el = marker.getElement() as HTMLElement | undefined;
      if (!el) return;
      const pin = el.querySelector(".land-pin") as HTMLElement | null;
      if (!pin) return;
      if (id === activeId) pin.classList.add("is-active");
      else pin.classList.remove("is-active");
    });
  }, [activeId]);

  return (
    <div className="land-map-wrap">
      <div ref={containerRef} className="land-map-canvas" />
    </div>
  );
}
