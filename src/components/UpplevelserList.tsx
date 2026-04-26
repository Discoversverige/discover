"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import type { Experience } from "@/lib/experiences";
import { CATEGORIES, formatPrice } from "@/lib/experiences";

type SourceKey = "all" | "happy-day" | "getyourguide" | "liveit" | "viator";

type SortKey = "popular" | "price-asc" | "price-desc" | "name";
type PriceBucket = "all" | "0-500" | "500-1500" | "1500+";
type Lang = "sv" | "en" | "de";

const PER_PAGE = 16;

const T = {
  sv: {
    all: "Alla", allPrices: "Alla",
    filter: "Filter",
    category: "Kategori", source: "Källa", price: "Pris", sort: "Sortera",
    popular: "Populärast", priceAsc: "Lägsta pris", priceDesc: "Högsta pris", name: "Namn (A–Ö)",
    p1: "≤ 500 kr", p2: "500–1 500 kr", p3: "1 500+ kr",
    from: "Från", showing: (a: number, b: number, t: number) => `Visar ${a}–${b} av ${t}`,
    search: "Sök upplevelse, tagg eller kategori…",
    empty: "Inga upplevelser matchar dina filter.", reset: "Rensa filter",
    prev: "Föregående", next: "Nästa",
  },
  en: {
    all: "All", allPrices: "All",
    filter: "Filter",
    category: "Category", source: "Source", price: "Price", sort: "Sort",
    popular: "Most popular", priceAsc: "Lowest price", priceDesc: "Highest price", name: "Name (A–Z)",
    p1: "≤ 500 kr", p2: "500–1 500 kr", p3: "1 500+ kr",
    from: "From", showing: (a: number, b: number, t: number) => `Showing ${a}–${b} of ${t}`,
    search: "Search experience, tag or category…",
    empty: "No experiences match your filters.", reset: "Clear filters",
    prev: "Previous", next: "Next",
  },
  de: {
    all: "Alle", allPrices: "Alle",
    filter: "Filter",
    category: "Kategorie", source: "Quelle", price: "Preis", sort: "Sortieren",
    popular: "Beliebteste", priceAsc: "Niedrigster Preis", priceDesc: "Höchster Preis", name: "Name (A–Z)",
    p1: "≤ 500 kr", p2: "500–1 500 kr", p3: "1 500+ kr",
    from: "Ab", showing: (a: number, b: number, t: number) => `Zeige ${a}–${b} von ${t}`,
    search: "Erlebnis, Tag oder Kategorie suchen…",
    empty: "Keine Erlebnisse entsprechen Ihren Filtern.", reset: "Filter zurücksetzen",
    prev: "Vorherige", next: "Nächste",
  },
};

const CAT_LABELS: Record<string, Record<Lang, string>> = {
  "Kreativt":   { sv: "Kreativt",   en: "Creative",   de: "Kreativ" },
  "Kultur":     { sv: "Kultur",     en: "Culture",    de: "Kultur" },
  "Mat & dryck":{ sv: "Mat & dryck",en: "Food & drink",de: "Essen & Trinken" },
  "Sightseeing":{ sv: "Sightseeing",en: "Sightseeing", de: "Sightseeing" },
  "Sport":      { sv: "Sport",      en: "Sport",      de: "Sport" },
  "Välmående":  { sv: "Välmående",  en: "Wellness",   de: "Wellness" },
  "Äventyr":    { sv: "Äventyr",    en: "Adventure",  de: "Abenteuer" },
  "Övrigt":     { sv: "Övrigt",     en: "Other",      de: "Sonstiges" },
};

const SOURCE_LABELS: Record<string, Record<Lang, string>> = {
  "happy-day":    { sv: "Happy Day",    en: "Happy Day",    de: "Happy Day" },
  "getyourguide": { sv: "GetYourGuide", en: "GetYourGuide", de: "GetYourGuide" },
  "liveit":       { sv: "LiveIt",       en: "LiveIt",       de: "LiveIt" },
  "viator":       { sv: "Viator",       en: "Viator",       de: "Viator" },
};

interface Props {
  experiences: Experience[];
}

export default function UpplevelserList({ experiences }: Props) {
  const [category, setCategory] = useState<string>("all");
  const [source, setSource] = useState<SourceKey>("all");
  const [price, setPrice] = useState<PriceBucket>("all");
  const [sort, setSort] = useState<SortKey>("popular");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [lang, setLang] = useState<Lang>("sv");
  const [filtersOpen, setFiltersOpen] = useState(false);

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
    return () => {
      window.removeEventListener("storage", readLang);
      window.removeEventListener("dm-lang-change", onCustom);
    };
  }, []);

  const filtered = useMemo(() => {
    let list = experiences;
    if (category !== "all") list = list.filter((e) => e.category === category);
    if (source !== "all") list = list.filter((e) => (e.source ?? "happy-day") === source);
    if (price !== "all") {
      list = list.filter((e) => {
        if (price === "0-500") return e.priceFrom <= 500;
        if (price === "500-1500") return e.priceFrom > 500 && e.priceFrom <= 1500;
        if (price === "1500+") return e.priceFrom > 1500;
        return true;
      });
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (e) =>
          ((lang === "en" ? e.title_en : lang === "de" ? e.title_de : undefined) ?? e.title).toLowerCase().includes(q) ||
          ((lang === "en" ? e.shortDescription_en : lang === "de" ? e.shortDescription_de : undefined) ?? e.shortDescription).toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.priceFrom - b.priceFrom);
    if (sort === "price-desc") sorted.sort((a, b) => b.priceFrom - a.priceFrom);
    if (sort === "name") sorted.sort((a, b) => a.title.localeCompare(b.title, "sv"));
    return sorted;
  }, [experiences, category, source, price, sort, query]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const resetPage = () => setPage(1);

  useEffect(() => { setPage(1); }, [category, source, price, sort, query]);

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const t = T[lang];

  return (
    <div className="upp-page">
      <header className="upp-header">
        <div className="upp-header-inner">
          <p className="upp-eyebrow">Upplevelser i Malmö och Skåne</p>
          <h1 className="upp-title">
            {lang === "sv" ? <>Hitta <em>din nästa</em> upplevelse</> :
             lang === "de" ? <>Finde <em>dein nächstes</em> Erlebnis</> :
             <>Find <em>your next</em> experience</>}
          </h1>
          <p className="upp-sub">
            {lang === "sv" ? `${experiences.length} upplevelser — från ölprovning och spa till racing och luftballong.` :
             lang === "de" ? `${experiences.length} Erlebnisse — von Bierverkostung und Spa bis Racing und Heißluftballon.` :
             `${experiences.length} experiences — from beer tasting and spa to racing and hot air balloon.`}
          </p>
          <div className="upp-search">
            <svg width="16" height="16" viewBox="0 0 16 16" className="upp-search-icon" aria-hidden="true">
              <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="11" y1="11" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="search"
              placeholder={t.search}
              value={query}
              onChange={(e) => { setQuery(e.target.value); resetPage(); }}
              aria-label={t.search}
            />
          </div>
        </div>
      </header>

      <div className="upp-mob-bar">
        <button className="upp-filter-toggle-btn" onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen}>
          {t.filter}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{flexShrink:0}}><path d={filtersOpen ? "M2 8l4-4 4 4" : "M2 4l4 4 4-4"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <select className="upp-sort-select" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label={t.sort}>
          <option value="popular">{t.popular}</option>
          <option value="price-asc">{t.priceAsc}</option>
          <option value="price-desc">{t.priceDesc}</option>
          <option value="name">{t.name}</option>
        </select>
      </div>

      <section className={`upp-filters${filtersOpen ? " mob-open" : ""}`} aria-label="Filter">
        <div className="upp-filter-group">
          <span className="upp-filter-label">{t.category}</span>
          <div className="upp-chips">
            <button className={`upp-chip${category === "all" ? " active" : ""}`} onClick={() => setCategory("all")}>{t.all}</button>
            {CATEGORIES.map((c) => (
              <button key={c} className={`upp-chip${category === c ? " active" : ""}`} onClick={() => setCategory(c)}>{CAT_LABELS[c]?.[lang] ?? c}</button>
            ))}
          </div>
        </div>

        <div className="upp-filter-group">
          <span className="upp-filter-label">{t.source}</span>
          <div className="upp-chips">
            <button className={`upp-chip${source === "all" ? " active" : ""}`} onClick={() => setSource("all")}>{t.all}</button>
            {(["happy-day","getyourguide","liveit","viator"] as SourceKey[]).map((s) => (
              <button key={s} className={`upp-chip${source === s ? " active" : ""}`} onClick={() => setSource(s)}>{SOURCE_LABELS[s]?.[lang] ?? s}</button>
            ))}
          </div>
        </div>

        <div className="upp-filter-group">
          <span className="upp-filter-label">{t.price}</span>
          <div className="upp-chips">
            {([["all", t.allPrices],["0-500", t.p1],["500-1500", t.p2],["1500+", t.p3]] as [PriceBucket,string][]).map(([key,label]) => (
              <button key={key} className={`upp-chip${price === key ? " active" : ""}`} onClick={() => setPrice(key)}>{label}</button>
            ))}
          </div>
        </div>

        <div className="upp-filter-group upp-sort">
          <span className="upp-filter-label">{t.sort}</span>
          <div className="upp-chips">
            {([["popular", t.popular], ["price-asc", t.priceAsc], ["price-desc", t.priceDesc], ["name", t.name]] as [SortKey, string][]).map(([key, label]) => (
              <button key={key} className={`upp-chip${sort === key ? " active" : ""}`} onClick={() => setSort(key)}>{label}</button>
            ))}
          </div>
        </div>
        {/* Mobil: sortera visas i mob-bar istället, dölj här */}
      </section>

      <div className="upp-count-row">
        <p className="upp-count">{t.showing((page - 1) * PER_PAGE + 1, Math.min(page * PER_PAGE, filtered.length), filtered.length)}</p>
      </div>

      {filtered.length === 0 ? (
        <div className="upp-empty">
          <p>{t.empty}</p>
          <button className="upp-reset" onClick={() => { setCategory("all"); setSource("all"); setPrice("all"); setQuery(""); }}>
            {t.reset}
          </button>
        </div>
      ) : (
        <>
          <section className="upp-grid">
            {paginated.map((e) => (
              <Link key={e.id} href={`/upplevelser/${e.slug}`} className="upp-card">
                <div className="upp-card-img-wrap">
                  {e.images.main ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={e.images.main} alt={e.images.alt} className="upp-card-img" loading="lazy" />
                  ) : (
                    <div className="upp-card-img upp-card-img-placeholder" aria-hidden="true" />
                  )}
                  {e.priceCompareAt && e.priceCompareAt > e.priceFrom && (
                    <span className="upp-card-badge">−{Math.round((1 - e.priceFrom / e.priceCompareAt) * 100)}%</span>
                  )}
                </div>
                <div className="upp-card-body">
                  <div className="upp-card-meta">
                    <span className="upp-card-cat">{CAT_LABELS[e.category]?.[lang] ?? e.category}</span>
                    <span className="upp-card-region">{e.region}</span>
                  </div>
                  <h3 className="upp-card-title">{(lang === "en" ? e.title_en : lang === "de" ? e.title_de : undefined) ?? e.title}</h3>
                  {e.duration && <p className="upp-card-duration">⏱ {e.duration}</p>}
                  <div className="upp-card-price-row">
                    <span className="upp-card-price">Från {formatPrice(e.priceFrom)}</span>
                    {e.priceCompareAt && e.priceCompareAt > e.priceFrom && (
                      <span className="upp-card-price-compare">{formatPrice(e.priceCompareAt)}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </section>

          {totalPages > 1 && (
            <nav className="upp-pagination" aria-label="Sidnavigation">
              <button className="upp-page-btn" onClick={() => goToPage(page - 1)} disabled={page === 1} aria-label="Föregående sida">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const show = p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                const showDot = (p === 2 && page > 4) || (p === totalPages - 1 && page < totalPages - 3);
                if (!show && !showDot) return null;
                if (showDot && !show) return <span key={p} className="upp-page-dots">…</span>;
                return (
                  <button key={p} className={`upp-page-btn${page === p ? " active" : ""}`} onClick={() => goToPage(p)} aria-label={`Sida ${p}`} aria-current={page === p ? "page" : undefined}>
                    {p}
                  </button>
                );
              })}

              <button className="upp-page-btn" onClick={() => goToPage(page + 1)} disabled={page === totalPages} aria-label="Nästa sida">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
