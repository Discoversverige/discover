"use client";

import { useState, useMemo } from "react";
import { ROUTES, type RouteKey } from "@/lib/routes";
import { I18N, type Lang } from "@/lib/i18n";

const CATEGORIES = ["food", "culture", "nature", "family", "architecture", "shopping"] as const;

const AREA_MAP: Record<RouteKey, string> = {
  default: "centrum",
  food: "centrum",
  architecture: "västra hamnen",
  family: "centrum",
  culture: "centrum",
  nature: "hyllie",
  shopping: "centrum",
};

const DURATION_MINUTES: Record<RouteKey, number> = {
  default: 240,
  food: 120,
  architecture: 180,
  family: 240,
  culture: 360,
  nature: 120,
  shopping: 180,
};

const POPULARITY: Record<RouteKey, number> = {
  default: 5,
  food: 4,
  architecture: 3,
  family: 4,
  culture: 3,
  nature: 2,
  shopping: 2,
};

type SortKey = "popular" | "shortest" | "longest";
type AreaFilter = "alla" | "centrum" | "västra hamnen" | "hyllie";
type DurFilter = "alla" | "kort" | "medel" | "lång";

const SORT_LABELS: Record<SortKey, Record<Lang, string>> = {
  popular:  { sv: "Popularitet", en: "Popularity",  de: "Beliebtheit" },
  shortest: { sv: "Kortast",     en: "Shortest",     de: "Kürzeste" },
  longest:  { sv: "Längst",      en: "Longest",      de: "Längste" },
};

const AREA_LABELS: Record<Lang, Record<AreaFilter, string>> = {
  sv: { alla: "Alla områden", centrum: "Centrum", "västra hamnen": "Västra hamnen", hyllie: "Södra Malmö" },
  en: { alla: "All areas",    centrum: "City centre","västra hamnen": "Western Harbour", hyllie: "Southern Malmö" },
  de: { alla: "Alle Gebiete", centrum: "Zentrum",  "västra hamnen": "Westhafen",      hyllie: "Süd-Malmö" },
};

const DUR_LABELS: Record<Lang, Record<DurFilter, string>> = {
  sv: { alla: "All tid", kort: "< 2 tim", medel: "2–4 tim", lång: "4+ tim" },
  en: { alla: "Any duration", kort: "< 2 hrs", medel: "2–4 hrs", lång: "4+ hrs" },
  de: { alla: "Beliebige Dauer", kort: "< 2 Std", medel: "2–4 Std", lång: "4+ Std" },
};

const CategoryIcon = ({ cat, size = 14 }: { cat: string; size?: number }) => {
  const paths: Record<string, React.ReactNode> = {
    food: <path d="M4 2v8m4-8v8m4-4a4 4 0 01-4 4V2a4 4 0 014 4z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />,
    culture: <path d="M2 12h12M4 12V6l4-3 4 3v6M6 12V9m4 3V9" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round" />,
    nature: <path d="M2 13c2-2 4-2 6 0s4 2 6 0M3 9c1.5-1 3-1 4.5 0s3 1 4.5 0M4 5c1-0.5 2-0.5 3 0s2 0.5 3 0" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />,
    family: <g stroke="currentColor" strokeWidth="1.3" fill="none"><circle cx="5" cy="5" r="2" /><circle cx="11" cy="6" r="1.5" /><path d="M2 13c0-2 1.5-3.5 3-3.5s3 1.5 3 3.5M8.5 13c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5" /></g>,
    architecture: <path d="M2 14V7l6-4 6 4v7M6 14V10h4v4" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round" />,
    shopping: <path d="M4 5h8l-1 8H5zM6 5V3a2 2 0 014 0v2" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true">
      {paths[cat] || paths.culture}
    </svg>
  );
};

const StarRating = ({ count }: { count: number }) => (
  <span className="exp-stars" aria-label={`${count} av 5`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
        <polygon
          points="6,1 7.5,4.5 11,4.8 8.5,7 9.3,11 6,9 2.7,11 3.5,7 1,4.8 4.5,4.5"
          fill={i < count ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
    ))}
  </span>
);

export default function UpplevelsePage() {
  const [lang, setLang] = useState<Lang>("sv");
  const [activeCat, setActiveCat] = useState<string>("alla");
  const [activeArea, setActiveArea] = useState<AreaFilter>("alla");
  const [activeDur, setActiveDur] = useState<DurFilter>("alla");
  const [sort, setSort] = useState<SortKey>("popular");
  const [sortOpen, setSortOpen] = useState(false);

  const t = I18N[lang];

  const results = useMemo(() => {
    let entries = Object.entries(ROUTES) as [RouteKey, typeof ROUTES[RouteKey]][];

    if (activeCat !== "alla") {
      entries = entries.filter(([key]) => key === activeCat);
    }
    if (activeArea !== "alla") {
      entries = entries.filter(([key]) => AREA_MAP[key] === activeArea);
    }
    if (activeDur !== "alla") {
      entries = entries.filter(([key]) => {
        const m = DURATION_MINUTES[key];
        if (activeDur === "kort") return m < 120;
        if (activeDur === "medel") return m >= 120 && m <= 240;
        if (activeDur === "lång") return m > 240;
        return true;
      });
    }

    entries.sort(([a], [b]) => {
      if (sort === "popular") return POPULARITY[b] - POPULARITY[a];
      if (sort === "shortest") return DURATION_MINUTES[a] - DURATION_MINUTES[b];
      if (sort === "longest") return DURATION_MINUTES[b] - DURATION_MINUTES[a];
      return 0;
    });

    return entries;
  }, [activeCat, activeArea, activeDur, sort]);

  const countLabel =
    lang === "sv" ? `${results.length} upplevelse${results.length !== 1 ? "r" : ""}` :
    lang === "de" ? `${results.length} Erlebnis${results.length !== 1 ? "se" : ""}` :
    `${results.length} experience${results.length !== 1 ? "s" : ""}`;

  return (
    <div className="app exp-page">
      {/* Topbar */}
      <header className="topbar">
        <div className="logo">
          <img src="/logo-transparent.png" alt="Discover Malmö" className="logo-img-brand" />
        </div>
        <nav className="nav">
          <a href="/">{t.nav.discover}</a>
          <a href="/upplevelser" className="nav-active">{t.nav.experiences}</a>
          <a href="#">{t.nav.plan}</a>
          <a href="#">{t.nav.about}</a>
        </nav>
        <div className="lang-switch" role="tablist">
          {(["sv", "en", "de"] as Lang[]).map(c => (
            <button key={c} role="tab" aria-selected={lang === c} className={lang === c ? "active" : ""} onClick={() => setLang(c)}>
              {c.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      {/* Page header */}
      <div className="exp-header">
        <p className="eyebrow" style={{ opacity: 1, animation: "none" }}>
          {lang === "sv" ? "Upplev Malmö" : lang === "de" ? "Erlebe Malmö" : "Experience Malmö"}
        </p>
        <h1 className="exp-title">
          {lang === "sv" ? "Upplevelser" : lang === "de" ? "Erlebnisse" : "Experiences"}
        </h1>
        <p className="exp-sub">
          {lang === "sv"
            ? "Hitta din perfekta rutt — filtrera efter kategori, område och tid."
            : lang === "de"
            ? "Finde dein perfektes Erlebnis — nach Kategorie, Gebiet und Dauer filtern."
            : "Find your perfect experience — filter by category, area and duration."}
        </p>
      </div>

      {/* Filter + sort bar */}
      <div className="exp-bar">
        <div className="exp-filters">
          {/* Category */}
          <div className="filter-group">
            <span className="filter-label">
              {lang === "sv" ? "Kategori" : lang === "de" ? "Kategorie" : "Category"}
            </span>
            <div className="filter-chips">
              <button
                className={`cat-chip${activeCat === "alla" ? " active" : ""}`}
                onClick={() => setActiveCat("alla")}
              >
                <span className="dot" />
                {lang === "sv" ? "Alla" : lang === "de" ? "Alle" : "All"}
              </button>
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  className={`cat-chip${activeCat === c ? " active" : ""}`}
                  onClick={() => setActiveCat(c)}
                >
                  <CategoryIcon cat={c} />
                  {t.hero.category[c]}
                </button>
              ))}
            </div>
          </div>

          {/* Area */}
          <div className="filter-group">
            <span className="filter-label">
              {lang === "sv" ? "Område" : lang === "de" ? "Gebiet" : "Area"}
            </span>
            <div className="filter-chips">
              {(["alla", "centrum", "västra hamnen", "hyllie"] as AreaFilter[]).map(a => (
                <button
                  key={a}
                  className={`cat-chip${activeArea === a ? " active" : ""}`}
                  onClick={() => setActiveArea(a)}
                >
                  {AREA_LABELS[lang][a]}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="filter-group">
            <span className="filter-label">
              {lang === "sv" ? "Tid" : lang === "de" ? "Dauer" : "Duration"}
            </span>
            <div className="filter-chips">
              {(["alla", "kort", "medel", "lång"] as DurFilter[]).map(d => (
                <button
                  key={d}
                  className={`cat-chip${activeDur === d ? " active" : ""}`}
                  onClick={() => setActiveDur(d)}
                >
                  {DUR_LABELS[lang][d]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sort button */}
        <div className="sort-wrap">
          <button className="sort-btn" onClick={() => setSortOpen(o => !o)} aria-expanded={sortOpen}>
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>
              {lang === "sv" ? "Sortera" : lang === "de" ? "Sortieren" : "Sort"}
              <span className="sort-current">: {SORT_LABELS[sort][lang]}</span>
            </span>
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" className={sortOpen ? "rotated" : ""}>
              <path d="M2 3l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {sortOpen && (
            <div className="sort-dropdown" role="listbox">
              {(["popular", "shortest", "longest"] as SortKey[]).map(s => (
                <button
                  key={s}
                  role="option"
                  aria-selected={sort === s}
                  className={`sort-option${sort === s ? " active" : ""}`}
                  onClick={() => { setSort(s); setSortOpen(false); }}
                >
                  {SORT_LABELS[s][lang]}
                  {sort === s && (
                    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                      <path d="M2 6l3 3 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Result count */}
      <div className="exp-count">
        <span className="filter-label">{countLabel}</span>
      </div>

      {/* Result grid */}
      <main className="exp-grid">
        {results.length === 0 ? (
          <div className="exp-empty">
            <p>
              {lang === "sv" ? "Inga upplevelser matchar dina filter." :
               lang === "de" ? "Keine Erlebnisse passen zu deinen Filtern." :
               "No experiences match your filters."}
            </p>
            <button className="btn ghost" style={{ marginTop: 12 }} onClick={() => {
              setActiveCat("alla"); setActiveArea("alla"); setActiveDur("alla");
            }}>
              {lang === "sv" ? "Rensa filter" : lang === "de" ? "Filter zurücksetzen" : "Clear filters"}
            </button>
          </div>
        ) : (
          results.map(([key, route]) => (
            <a key={key} href={`/?route=${key}`} className="exp-card">
              <div className="exp-card-top">
                <span className="exp-cat-badge">
                  <CategoryIcon cat={key === "default" ? "culture" : key} size={13} />
                  {key === "default"
                    ? (lang === "sv" ? "Halvdag" : lang === "de" ? "Halbtag" : "Half day")
                    : t.hero.category[key as keyof typeof t.hero.category] ?? key}
                </span>
                <span className="exp-area-badge">{AREA_LABELS[lang][AREA_MAP[key] as AreaFilter]}</span>
              </div>

              <h2 className="exp-card-title">{route.title[lang] || route.title.en}</h2>

              <div className="exp-card-meta">
                <span className="exp-meta-item">
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                    <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M6 3v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  {route.duration[lang] || route.duration.en}
                </span>
                <span className="exp-meta-item">
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M2 10L6 2l4 8" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3.5 7h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  {route.distance}
                </span>
                <span className="exp-meta-item">
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                    <circle cx="6" cy="4" r="2" fill="none" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M2 10c0-2 1.8-3.5 4-3.5s4 1.5 4 3.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  {route.stops.length} {lang === "sv" ? "stopp" : lang === "de" ? "Stopps" : "stops"}
                </span>
              </div>

              <div className="exp-card-stops">
                {route.stops.slice(0, 3).map((s, i) => (
                  <span key={i} className="exp-stop-pill">
                    <span className="exp-stop-letter">{String.fromCharCode(65 + i)}</span>
                    {s.name[lang] || s.name.en}
                  </span>
                ))}
                {route.stops.length > 3 && (
                  <span className="exp-stop-pill exp-stop-more">+{route.stops.length - 3}</span>
                )}
              </div>

              <div className="exp-card-footer">
                <StarRating count={POPULARITY[key]} />
                <span className="exp-cta">
                  {lang === "sv" ? "Visa rutt" : lang === "de" ? "Route anzeigen" : "View route"}
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M2 6h8M7 2l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </a>
          ))
        )}
      </main>

      <footer className="foot">
        <span>{t.footer}</span>
        <span className="coords">55°36′N · 13°00′E</span>
      </footer>
    </div>
  );
}
