"use client";

import { useMemo, useState, useEffect } from "react";
import type { Campsite, CampingCategory, CampingRegion } from "@/lib/camping";
import { CAMPING_CATEGORIES, CAMPING_REGIONS } from "@/lib/camping";

type SortKey = "popular" | "price-asc" | "price-desc" | "name";
type Lang = "sv" | "en" | "de";

const PER_PAGE = 16;

const T = {
  sv: {
    title: <>Hitta <em>din nästa</em> camping</>,
    sub: (n: number) => `${n} campingplatser i Skåne, Småland och Blekinge — via Campcation`,
    all: "Alla", filter: "Filter",
    category: "Typ", region: "Region", sort: "Sortera",
    popular: "Populärast", priceAsc: "Lägsta pris", priceDesc: "Högsta pris", name: "Namn (A–Ö)",
    from: "Från", per_night: "/ natt",
    showing: (a: number, b: number, t: number) => `Visar ${a}–${b} av ${t}`,
    search: "Sök camping, plats eller typ…",
    empty: "Inga campingplatser matchar dina filter.", reset: "Rensa filter",
    prev: "Föregående", next: "Nästa",
    book: "Boka via Campcation",
    reviews: "recensioner",
  },
  en: {
    title: <>Find <em>your next</em> campsite</>,
    sub: (n: number) => `${n} campsites in Skåne, Småland and Blekinge — via Campcation`,
    all: "All", filter: "Filter",
    category: "Type", region: "Region", sort: "Sort",
    popular: "Most popular", priceAsc: "Lowest price", priceDesc: "Highest price", name: "Name (A–Z)",
    from: "From", per_night: "/ night",
    showing: (a: number, b: number, t: number) => `Showing ${a}–${b} of ${t}`,
    search: "Search campsite, location or type…",
    empty: "No campsites match your filters.", reset: "Clear filters",
    prev: "Previous", next: "Next",
    book: "Book via Campcation",
    reviews: "reviews",
  },
  de: {
    title: <>Finde <em>deinen nächsten</em> Campingplatz</>,
    sub: (n: number) => `${n} Campingplätze in Skåne, Småland und Blekinge — über Campcation`,
    all: "Alle", filter: "Filter",
    category: "Typ", region: "Region", sort: "Sortieren",
    popular: "Beliebteste", priceAsc: "Niedrigster Preis", priceDesc: "Höchster Preis", name: "Name (A–Z)",
    from: "Ab", per_night: "/ Nacht",
    showing: (a: number, b: number, t: number) => `Zeige ${a}–${b} von ${t}`,
    search: "Campingplatz, Ort oder Typ suchen…",
    empty: "Keine Campingplätze entsprechen Ihren Filtern.", reset: "Filter zurücksetzen",
    prev: "Vorherige", next: "Nächste",
    book: "Über Campcation buchen",
    reviews: "Bewertungen",
  },
};

const CAT_LABELS: Record<CampingCategory, Record<Lang, string>> = {
  Familj:  { sv: "Familj",   en: "Family",    de: "Familie" },
  Natur:   { sv: "Natur",    en: "Nature",    de: "Natur" },
  Strand:  { sv: "Strand",   en: "Beach",     de: "Strand" },
  Sjö:     { sv: "Sjö",      en: "Lake",      de: "See" },
  Stad:    { sv: "Stad",     en: "City",      de: "Stadt" },
  Äventyr: { sv: "Äventyr",  en: "Adventure", de: "Abenteuer" },
};

interface Props { campsites: Campsite[]; }

export default function CampingList({ campsites }: Props) {
  const [category, setCategory] = useState<CampingCategory | "all">("all");
  const [region, setRegion] = useState<CampingRegion | "all">("all");
  const [sort, setSort] = useState<SortKey>("popular");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [lang, setLang] = useState<Lang>("sv");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const readLang = () => {
      try {
        const saved = localStorage.getItem("dm-lang") as Lang;
        if (saved && ["sv","en","de"].includes(saved)) setLang(saved);
      } catch {}
    };
    const onCustom = (e: Event) => {
      const l = (e as CustomEvent).detail as Lang;
      if (["sv","en","de"].includes(l)) setLang(l);
    };
    readLang();
    window.addEventListener("storage", readLang);
    window.addEventListener("dm-lang-change", onCustom);
    setMounted(true);
    return () => {
      window.removeEventListener("storage", readLang);
      window.removeEventListener("dm-lang-change", onCustom);
    };
  }, []);

  const filtered = useMemo(() => {
    let list = campsites;
    if (category !== "all") list = list.filter((c) => c.category === category);
    if (region !== "all") list = list.filter((c) => c.region === region);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.municipality.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.amenities.some((a) => a.toLowerCase().includes(q))
      );
    }
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.priceFrom - b.priceFrom);
    else if (sort === "price-desc") sorted.sort((a, b) => b.priceFrom - a.priceFrom);
    else if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name, "sv"));
    else sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [campsites, category, region, sort, query]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  useEffect(() => { setPage(1); }, [category, region, sort, query]);

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const t = T[lang];

  if (!mounted) return (
    <div className="upp-page">
      <header className="upp-header">
        <div className="upp-header-inner">
          <div className="skeleton h-20 w-40" style={{marginBottom: 12}} />
          <div className="skeleton h-16 w-80" style={{marginBottom: 8}} />
          <div className="skeleton" style={{height: 52, borderRadius: 999, marginTop: 16}} />
        </div>
      </header>
      <div className="pc-grid" style={{padding:"0 40px 80px"}}>
        {Array.from({length: 8}).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton" style={{width:"100%",aspectRatio:"4/3"}} />
            <div className="skeleton-body">
              <div className="skeleton skeleton-line w-40" />
              <div className="skeleton skeleton-line w-100 h-16" />
              <div className="skeleton skeleton-line w-60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="upp-page">
      <header className="upp-header">
        <div className="upp-header-inner">
          <h1 className="upp-title">{t.title}</h1>
          <p className="upp-sub">{t.sub(campsites.length)}</p>
          <div className="upp-search">
            <svg width="16" height="16" viewBox="0 0 16 16" className="upp-search-icon" aria-hidden="true">
              <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="11" y1="11" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="search"
              placeholder={t.search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={t.search}
            />
          </div>
        </div>
      </header>

      <div className="upp-mob-bar">
        <button className="upp-filter-toggle-btn" onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          {t.filter}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{flexShrink:0}}><path d={filtersOpen ? "M2 8l4-4 4 4" : "M2 4l4 4 4-4"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div className="upp-sort-pill">
          <span>{t.sort}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label={t.sort}>
            <option value="popular">{t.popular}</option>
            <option value="price-asc">{t.priceAsc}</option>
            <option value="price-desc">{t.priceDesc}</option>
            <option value="name">{t.name}</option>
          </select>
        </div>
      </div>

      <section className={`upp-filters${filtersOpen ? " mob-open" : ""}`} aria-label="Filter">
        <div className="upp-filter-group">
          <span className="upp-filter-label">{t.category}</span>
          <div className="upp-chips">
            <button className={`upp-chip${category === "all" ? " active" : ""}`} onClick={() => setCategory("all")}>{t.all}</button>
            {CAMPING_CATEGORIES.map((c) => (
              <button key={c} className={`upp-chip${category === c ? " active" : ""}`} onClick={() => setCategory(c)}>{CAT_LABELS[c][lang]}</button>
            ))}
          </div>
        </div>

        <div className="upp-filter-group">
          <span className="upp-filter-label">{t.region}</span>
          <div className="upp-chips">
            <button className={`upp-chip${region === "all" ? " active" : ""}`} onClick={() => setRegion("all")}>{t.all}</button>
            {CAMPING_REGIONS.map((r) => (
              <button key={r} className={`upp-chip${region === r ? " active" : ""}`} onClick={() => setRegion(r)}>{r}</button>
            ))}
          </div>
        </div>

        <div className="upp-filter-group upp-sort">
          <span className="upp-filter-label">{t.sort}</span>
          <div className="upp-sort-pill">
            <span>{sort === "popular" ? t.popular : sort === "price-asc" ? t.priceAsc : sort === "price-desc" ? t.priceDesc : t.name}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label={t.sort}>
              <option value="popular">{t.popular}</option>
              <option value="price-asc">{t.priceAsc}</option>
              <option value="price-desc">{t.priceDesc}</option>
              <option value="name">{t.name}</option>
            </select>
          </div>
        </div>
      </section>

      <div className="upp-count-row">
        <p className="upp-count">{t.showing((page - 1) * PER_PAGE + 1, Math.min(page * PER_PAGE, filtered.length), filtered.length)}</p>
      </div>

      {filtered.length === 0 ? (
        <div className="upp-empty">
          <p>{t.empty}</p>
          <button className="upp-reset" onClick={() => { setCategory("all"); setRegion("all"); setQuery(""); }}>
            {t.reset}
          </button>
        </div>
      ) : (
        <>
          <section className="pc-grid">
            {paginated.map((c) => (
              <a key={c.id} href={c.sourceUrl} target="_blank" rel="noopener noreferrer" className="pc-card">
                <div className="pc-img-wrap">
                  <img src={c.image} alt={c.name} className="pc-img" loading="lazy" />
                  <span className="pc-badge">{CAT_LABELS[c.category][lang]}</span>
                </div>
                <div className="pc-info">
                  <div className="pc-meta-row">
                    <span className="pc-rating">{c.rating}</span>
                    <span className="pc-reviews">({c.reviews} {t.reviews})</span>
                  </div>
                  <p className="pc-name">{c.name}</p>
                  <p className="pc-sub">{c.region} · {c.municipality}</p>
                  <p className="pc-price"><span className="pc-price-from">{t.from}</span> {c.priceFrom} kr{t.per_night}</p>
                </div>
              </a>
            ))}
          </section>

          {totalPages > 1 && (
            <nav className="upp-pagination" aria-label="Sidnavigation">
              <button className="upp-page-btn" onClick={() => goToPage(page - 1)} disabled={page === 1}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const show = p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                const showDot = (p === 2 && page > 4) || (p === totalPages - 1 && page < totalPages - 3);
                if (!show && !showDot) return null;
                if (showDot && !show) return <span key={p} className="upp-page-dots">…</span>;
                return (
                  <button key={p} className={`upp-page-btn${page === p ? " active" : ""}`} onClick={() => goToPage(p)}>
                    {p}
                  </button>
                );
              })}
              <button className="upp-page-btn" onClick={() => goToPage(page + 1)} disabled={page === totalPages}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
