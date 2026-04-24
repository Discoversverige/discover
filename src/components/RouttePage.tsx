"use client";

import { useState, useEffect } from "react";
import { ROUTES, type RouteKey } from "@/lib/routes";
import { I18N, type Lang } from "@/lib/i18n";
import LeafletMap from "./LeafletMap";

const getInitialLang = (): Lang => {
  try {
    const saved = localStorage.getItem("dm-lang") as Lang;
    if (saved && I18N[saved]) return saved;
  } catch {}
  return "sv";
};

export default function RouttePage({ routeKey }: { routeKey: string }) {
  const [lang, setLang] = useState<Lang>("sv");
  const [activeStop, setActiveStop] = useState(0);
  const [panelOpen, setPanelOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLang(getInitialLang());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const key = routeKey as RouteKey;
  const route = ROUTES[key] || ROUTES.default;
  const t = I18N[lang];

  return (
    <div className="app view-map" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="map-view" style={{ flex: 1 }}>
        <div className="map-canvas">
          <LeafletMap route={route} activeStop={activeStop} onStopClick={setActiveStop} lang={lang} />
        </div>

        <aside className={`route-panel ${panelOpen ? "open" : "closed"}`}>
          <a className="panel-back" href="/">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M13 7H1M6 2L1 7l5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t.map.back}
          </a>

          <p className="panel-eyebrow">{t.map.title}</p>
          <h1 className="panel-title">{route.title[lang] || route.title.sv}</h1>

          <div className="stats">
            <div><span className="stat-label">{t.map.duration}</span><span className="stat-val">{route.duration[lang] || route.duration.sv}</span></div>
            <div><span className="stat-label">{t.map.distance}</span><span className="stat-val">{route.distance}</span></div>
            <div><span className="stat-label">{t.map.stops}</span><span className="stat-val">{route.stops.length}</span></div>
          </div>

          <ol className="stop-list">
            {route.stops.map((s, i) => (
              <li key={i} className={activeStop === i ? "active" : ""} onClick={() => setActiveStop(i)}>
                <span className="stop-letter">{String.fromCharCode(65 + i)}</span>
                <span className="stop-body">
                  <span className="stop-name-text">{s.name[lang] || s.name.sv}</span>
                  <span className="stop-kind-text">{s.kind[lang] || s.kind.sv}</span>
                </span>
                <svg width="10" height="10" viewBox="0 0 10 10" className="stop-chev" aria-hidden="true">
                  <path d="M3 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </li>
            ))}
          </ol>

          <p className="tip">{t.map.tip}</p>

          <div className="panel-actions">
            <button className="btn primary">{t.map.start}</button>
            <button className="btn ghost">{t.map.save}</button>
            <button className="btn ghost">{t.map.share}</button>
          </div>
        </aside>

        <button className="panel-toggle" onClick={() => setPanelOpen(o => !o)} aria-label="Växla panel">
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path d={panelOpen ? "M6 7l4 4 4-4" : "M6 13l4-4 4 4"} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
