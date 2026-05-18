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

// Normalize away diacritics so "malmo" matches "Malmö" etc.
function norm(s: string): string {
  return s.toLowerCase()
    .replace(/å/g, "a").replace(/ä/g, "a").replace(/ö/g, "o")
    .replace(/é|è|ê/g, "e").replace(/ü/g, "u").replace(/ø/g, "o")
    .replace(/æ/g, "a");
}

// Levenshtein distance — used for single-word fuzzy matching
function lev(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[] = Array.from({length: n + 1}, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    let prev = i;
    for (let j = 1; j <= n; j++) {
      const curr = a[i-1] === b[j-1] ? dp[j-1] : 1 + Math.min(dp[j-1], dp[j], prev);
      dp[j-1] = prev;
      prev = curr;
    }
    dp[n] = prev;
  }
  return dp[n];
}

const SYNONYMS: Record<string, string[]> = {
  "spa":        ["wellness", "massage", "avslappning", "relaxation", "entspannung"],
  "mat":        ["food", "essen", "restaurang", "middag", "lunch", "dinner"],
  "dryck":      ["drink", "vin", "wine", "öl", "beer", "provning", "tasting"],
  "äventyr":    ["adventure", "abenteuer", "spänning"],
  "kultur":     ["culture", "museum", "konst", "art", "history", "historia"],
  "sport":      ["fitness", "träning", "workout", "idrott"],
  "sightseeing":["tur", "tour", "guidning", "guided", "stadstur"],
  "racing":     ["bil", "car", "köra", "drive", "sportbil", "ferrari", "porsche"],
  "flyg":       ["helikopter", "ballong", "luftballong", "helicopter"],
  "båt":        ["sailing", "segling", "kanal", "canal", "vatten"],
  "malmo":      ["malmö"],
  "skane":      ["skåne"],
  "sverige":    ["sweden", "schweden"],
};

function expandQuery(q: string): string[] {
  const terms = [q];
  for (const [key, vals] of Object.entries(SYNONYMS)) {
    if (q.includes(key) || vals.some(v => q.includes(norm(v)))) {
      terms.push(key, ...vals.map(norm));
    }
  }
  return [...new Set(terms)];
}

function fuzzyMatch(haystack: string, needle: string): boolean {
  const h = norm(haystack), n = norm(needle);
  if (h.includes(n)) return true;
  // Word-level fuzzy: allow 1 typo for words ≥5 chars, 2 typos for ≥8 chars
  const words = h.split(/\s+/);
  for (const word of words) {
    if (word.length < 3) continue;
    const maxDist = needle.length >= 8 ? 2 : needle.length >= 5 ? 1 : 0;
    if (maxDist > 0 && lev(word, n) <= maxDist) return true;
  }
  return false;
}

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
      const terms = expandQuery(norm(query.trim()));
      list = list.filter((e) => {
        const title = (lang === "en" ? e.title_en : lang === "de" ? e.title_de : undefined) ?? e.title;
        const desc = (lang === "en" ? e.shortDescription_en : lang === "de" ? e.shortDescription_de : undefined) ?? e.shortDescription;
        const haystack = [title, desc, e.descriptionHtml.replace(/<[^>]+>/g, ""), ...e.tags].join(" ");
        return terms.some(term => fuzzyMatch(haystack, term));
      });
    }
    const PRIORITY: Record<string, number> = { getyourguide: 0, viator: 1, liveit: 2, "happy-day": 3 };
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.priceFrom - b.priceFrom);
    else if (sort === "price-desc") sorted.sort((a, b) => b.priceFrom - a.priceFrom);
    else if (sort === "name") sorted.sort((a, b) => a.title.localeCompare(b.title, "sv"));
    else sorted.sort((a, b) => (PRIORITY[a.source ?? "happy-day"] ?? 99) - (PRIORITY[b.source ?? "happy-day"] ?? 99));
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

  if (!mounted) return (
    <div className="upp-page">
      <header className="upp-header">
        <div className="upp-header-inner">
          <div className="skeleton h-20 w-40" style={{marginBottom: 12}} />
          <div className="skeleton h-16 w-80" style={{marginBottom: 8}} />
          <div className="skeleton" style={{height: 52, borderRadius: 999, marginTop: 16}} />
        </div>
      </header>
      <div className="upp-grid" style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24, padding: "0 40px 80px"}}>
        {Array.from({length: 9}).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton" style={{width: "100%", aspectRatio: "4/3"}} />
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
          <div className="upp-sort-pill">
            <span>{T[lang][sort as keyof typeof T["sv"]] as string}</span>
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
