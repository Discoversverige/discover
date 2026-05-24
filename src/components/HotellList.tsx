"use client";

import { useMemo, useState, useEffect } from "react";

type Lang = "sv" | "en" | "de";
type AreaKey = "all" | "centrum" | "vastra_hamnen" | "hyllie" | "ovrigt";

type Hotel = {
  id: string;
  hotelsComId: string;
  slug: string;
  name: string;
  area: string;
  areaKey: AreaKey;
  image: string;
  travelerType: "business" | "family" | "romantic" | "budget";
};

const AFFID = "IiZQkAy";
const deepLink = (h: Hotel) =>
  `https://sv.hotels.com/ho${h.hotelsComId}/${h.slug}/?affid=${AFFID}`;

// Hotel-bilder: hotlinkade från varje hotells officiella hemsida (og:image).
// Fallback: Unsplash-placeholder för 3 hotell där vi inte hittade officiell bild.
const UNSPLASH_FALLBACK = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop&auto=format";

// 35 riktiga Malmö-hotell från hotels.com (deep link per hotell via hotelsComId)
const HOTELS: Hotel[] = [
  { id: "elite-savoy", hotelsComId: "205920", slug: "elite-hotel-savoy-malmo-sverige", name: "Elite Hotel Savoy", area: "Centrum", areaKey: "centrum", image: "https://www.elite.se/globalassets/images/hotell/malmo/elite-hotel-savoy/mmaehs_hotell_4.jpg?mode=crop&scale=both&width=1200&height=630", travelerType: "business" },
  { id: "scandic-triangeln", hotelsComId: "205694", slug: "scandic-triangeln-malmo-sverige", name: "Scandic Triangeln", area: "Centrum", areaKey: "centrum", image: "https://images.scandichotels.com/publishedmedia/mwynt3je42mn7x1purl0/Scandic-Triangeln-exterior-facade-2.jpg", travelerType: "business" },
  { id: "mayfair-tunneln", hotelsComId: "231991", slug: "mayfair-hotel-tunneln-malmo-sverige", name: "Mayfair Hotel Tunneln", area: "Centrum", areaKey: "centrum", image: "https://www.mayfairtunneln.com/wp-content/uploads/2019/11/hotel-mayfair-tunneln.jpg", travelerType: "romantic" },
  { id: "clarion-malmo-live", hotelsComId: "498474", slug: "clarion-hotel-malmo-live-malmo-sverige", name: "Clarion Hotel Malmö Live", area: "Centrum", areaKey: "centrum", image: "https://images.ctfassets.net/nwbqij9m1jag/59sLDQsqR8VgKef2EYYoNH/2d9794c4bd4c09ed6bf6f9cd37a2b5b3/clarion_hotel_malmo_live_exterior_16_9?fm=webp&q=80&w=1920", travelerType: "business" },
  { id: "radisson-blu", hotelsComId: "118704", slug: "radisson-blu-hotel-malmo-malmo-sverige", name: "Radisson Blu Hotel, Malmö", area: "Centrum", areaKey: "centrum", image: UNSPLASH_FALLBACK, travelerType: "business" },
  { id: "scandic-st-jorgen", hotelsComId: "212439", slug: "scandic-st-jorgen-malmo-sverige", name: "Scandic St Jörgen", area: "Centrum", areaKey: "centrum", image: "https://images.scandichotels.com/publishedmedia/48exm2bmph1mf10fezjg/Scandic_StJorgen_restaurant__lunch.jpg", travelerType: "family" },
  { id: "scandic-kramer", hotelsComId: "181691", slug: "scandic-kramer-malmo-sverige", name: "Scandic Kramer", area: "Centrum", areaKey: "centrum", image: "https://images.scandichotels.com/publishedmedia/tpmx0o51rxi4rhf28rmp/scandic-kramer-exterior-01.jpg", travelerType: "business" },
  { id: "scandic-stortorget", hotelsComId: "112689", slug: "scandic-stortorget-malmo-sverige", name: "Scandic Stortorget", area: "Centrum", areaKey: "centrum", image: "https://images.scandichotels.com/publishedmedia/cio1p8111vqesh0dkgiu/Scandic-Stortorget-Exterior001.jpg", travelerType: "business" },
  { id: "elite-plaza", hotelsComId: "353186", slug: "elite-plaza-hotel-malmo-malmo-sverige", name: "Elite Plaza Hotel Malmö", area: "Centrum", areaKey: "centrum", image: "https://www.elite.se/globalassets/images/hotell/malmo/elite-plaza-hotel/mmaehp_hotell_9.jpg?mode=crop&scale=both&width=1200&height=630", travelerType: "romantic" },
  { id: "elite-esplanade", hotelsComId: "327070", slug: "elite-hotel-esplanade-malmo-sverige", name: "Elite Hotel Esplanade", area: "Centrum", areaKey: "centrum", image: "https://www.elite.se/globalassets/images/hotell/malmo/elite-hotel-esplanade/mmeha_hotell_4.jpg?mode=crop&scale=both&width=1200&height=630", travelerType: "business" },
  { id: "elite-residens-bishops-arms", hotelsComId: "189594", slug: "elite-hotel-residens-malmo-sverige", name: "Hotel Bishops Arms Malmö", area: "Centrum", areaKey: "centrum", image: "https://www.elite.se/globalassets/images/hotell/malmo/hotel-bishops-arms-malmo/2026/bishops-malmo03.jpg?mode=crop&scale=both&width=1200&height=630", travelerType: "romantic" },
  { id: "story-hotel", hotelsComId: "606691", slug: "story-hotel-studio-malmo-part-of-jdv-by-hyatt-malmo-sverige", name: "Story Hotel Studio Malmö", area: "Centrum", areaKey: "centrum", image: UNSPLASH_FALLBACK, travelerType: "romantic" },
  { id: "twentysix-duxiana", hotelsComId: "127762", slug: "the-duxiana-malmo-sverige", name: "TwentySix", area: "Centrum", areaKey: "centrum", image: "https://www.twentysix.se/gallery/FRONTPAGE-SUITE.jpg", travelerType: "romantic" },
  { id: "mjs", hotelsComId: "233674", slug: "mj-s-malmo-sverige", name: "MJ's", area: "Centrum", areaKey: "centrum", image: "https://mjs.life/wp-content/uploads/2023/06/OG-MJS.jpg", travelerType: "romantic" },
  { id: "noble-house", hotelsComId: "264077", slug: "best-western-plus-hotel-noble-house-malmo-sverige", name: "Best Western Plus Hotel Noble House", area: "Centrum", areaKey: "centrum", image: "https://www.bestwestern.se/images/c12ea843-38e4-4db3-89bd-d85472bb4502__bwimages__large__25969232.webp", travelerType: "business" },
  { id: "more-mazetti", hotelsComId: "222126", slug: "the-more-hotel-malmo-sverige", name: "The More Hotel Mazetti", area: "Centrum", areaKey: "centrum", image: "https://www.themorehotel.se/wp-content/uploads/2024/06/Fasad.jpeg", travelerType: "family" },
  { id: "teaterhotellet", hotelsComId: "116839", slug: "teaterhotellet-malmo-sverige", name: "Teaterhotellet", area: "Centrum", areaKey: "centrum", image: "https://teaterhotellet.se/wp-content/uploads/2018/11/hero.jpg", travelerType: "romantic" },
  { id: "temperance", hotelsComId: "115394", slug: "clarion-collection-hotel-temperance-malmo-sverige", name: "Home Hotel Temperance", area: "Centrum", areaKey: "centrum", image: "https://images.ctfassets.net/nwbqij9m1jag/63wx3yz9RW2doOAFynMKkX/5f3bef1ebaf3726b1190f32ae4fc9f79/Home_Hotel_Temperance_-_Exterior_-_Exterior_16_9?fm=webp&q=80&w=1920", travelerType: "business" },
  { id: "comfort-malmo", hotelsComId: "120768", slug: "comfort-hotel-malmo-malmo-sverige", name: "Comfort Hotel Malmö", area: "Centrum", areaKey: "centrum", image: "https://images.ctfassets.net/nwbqij9m1jag/75bslxELjXhOYsVQGjglDj/2b805dca99efe2335283ebbe0eb6dfd6/Comfort_Hotel_Malm__-_Exterior_-_Facade_16_9?fm=webp&q=80&w=1920", travelerType: "budget" },
  { id: "sky-scandic-city", hotelsComId: "309990", slug: "scandic-malmo-city-malmo-sverige", name: "Sky Hotel Malmö City", area: "Centrum", areaKey: "centrum", image: "https://media.vanderapartments.com/web/3033/conversions/Malm%C3%B6-illustration-medium.webp", travelerType: "business" },
  { id: "best-western-royal", hotelsComId: "231587", slug: "best-western-hotel-royal-malmo-sverige", name: "Best Western Hotel Royal", area: "Centrum", areaKey: "centrum", image: "https://www.bestwestern.se/images/c3adb6c0-89f6-48e4-a38b-8c396f4747fb__bwimages__large__25790472.webp", travelerType: "budget" },
  { id: "good-morning", hotelsComId: "194347", slug: "good-morning-malmo-malmo-sverige", name: "Good Morning+ Malmö", area: "Centrum", areaKey: "centrum", image: UNSPLASH_FALLBACK, travelerType: "budget" },
  { id: "moment-hotels", hotelsComId: "425604", slug: "moment-hotels-malmo-sverige", name: "Moment Hotels", area: "Centrum", areaKey: "centrum", image: "https://www.momenthotels.com/sv/media/95", travelerType: "business" },
  { id: "grand-circus", hotelsComId: "1190999264", slug: "grand-circus-hotel-malmo-sverige", name: "Grand Circus Hotel", area: "Centrum", areaKey: "centrum", image: "https://grandcircushotel.com/wp-content/uploads/2024/07/IMG_3550-scaled.jpg", travelerType: "romantic" },
  { id: "unity-malmo", hotelsComId: "2780600672", slug: "unity-malmo-malmo-sverige", name: "Unity Malmö - A Studio Hotel", area: "Centrum", areaKey: "centrum", image: "https://unity-living.com/wp-content/uploads/2026/03/Lounge-scaled.jpg", travelerType: "business" },
  { id: "n-hostel", hotelsComId: "2159079168", slug: "hotel-n-hostel-malmo-city-malmo-sverige", name: "Hotel N Hostel Malmö City", area: "Centrum", areaKey: "centrum", image: "https://impro.usercontent.one/appid/oneComWsb/domain/hotelnhostel.se/media/hotelnhostel.se/onewebmedia/Entren%20h%C3%B6rnan___serialized1.jpg", travelerType: "budget" },
  { id: "more-vastra-hamnen", hotelsComId: "2452001440", slug: "the-more-hotel-vastra-hamnen-malmo-sverige", name: "The More Hotel Västra Hamnen", area: "Västra hamnen", areaKey: "vastra_hamnen", image: "https://www.themorehotel.se/wp-content/uploads/2024/06/Fasad.jpeg", travelerType: "family" },
  { id: "havshotellet", hotelsComId: "555765", slug: "havshotellet-malmo-sverige", name: "Havshotellet", area: "Västra hamnen", areaKey: "vastra_hamnen", image: "https://havshotelletmalmo.com/system/KgeYwTBN7xeoJMSRk24q_E-quHlBJVsHQPnew4p_YNyzUZfpacBaskyYwzlGPodk7VQnnLwUDeJswfq1KW7Yzg/files/Slides/Designhotell.jpg", travelerType: "romantic" },
  { id: "quality-view", hotelsComId: "536287", slug: "quality-hotel-view-malmo-sverige", name: "Quality Hotel View", area: "Hyllie", areaKey: "hyllie", image: "https://images.ctfassets.net/nwbqij9m1jag/7nhpsq0YrLk5tLK6R50R5J/759ffbe7c9b6f111e3f21bd3963941f1/Quality_Hotel_View_-_exterior_-_er_16_9?fm=webp&q=80&w=1920", travelerType: "business" },
  { id: "bw-arena", hotelsComId: "490005", slug: "best-western-malmo-arena-hotel-malmo-sverige", name: "Best Western Malmö Arena Hotel", area: "Hyllie", areaKey: "hyllie", image: "https://malmoarenahotel.com/wp-content/uploads/2024/04/Praktisk-info-header--1024x726.jpg", travelerType: "business" },
  { id: "bw-plus-park-city", hotelsComId: "366298", slug: "park-inn-by-radisson-malmo-hotel-malmo-sverige", name: "Best Western Plus Park City Malmo", area: "Hyllie", areaKey: "hyllie", image: "https://www.bestwestern.se/images/9058495d-9e7f-4e2c-b38f-3570295d0a05__bwimages__large__28511835.webp", travelerType: "business" },
  { id: "scandic-segevang", hotelsComId: "212405", slug: "scandic-segevang-malmo-sverige", name: "Scandic Segevång", area: "Övrigt", areaKey: "ovrigt", image: "https://images.scandichotels.com/publishedmedia/npiz5l0zhqm1v7yqnzp4/scandic-segevang-standard-room_-2-.jpg", travelerType: "family" },
  { id: "quality-mill", hotelsComId: "141733", slug: "quality-hotel-the-mill-malmo-sverige", name: "Quality Hotel the Mill", area: "Övrigt", areaKey: "ovrigt", image: "https://images.ctfassets.net/nwbqij9m1jag/7CjzsDnnH8yHxVFaEq5KgN/cd64e488f2ec732a1267b493d96b0018/Quality_Hotel_The_Mill_-_Entrance_-_Facade_16_9?fm=webp&q=80&w=1920", travelerType: "business" },
  { id: "first-camp", hotelsComId: "368940", slug: "first-camp-malmo-malmo-sverige", name: "First Camp Malmö", area: "Övrigt", areaKey: "ovrigt", image: "https://firstcamp.fra1.digitaloceanspaces.com/cms-public/2022/05/7316214_1-328-16_photo_web.jpg", travelerType: "family" },
  { id: "foretagsbostader", hotelsComId: "1723456864", slug: "foretagsbostader-fregattgatan-malmo-sverige", name: "Företagsbostäder Fregattgatan", area: "Övrigt", areaKey: "ovrigt", image: "https://directus.foretagsbostader.se/assets/0d6410b4-ea7d-4849-a83f-2533e4669d02?format=png&width=1200&quality=75&height=630", travelerType: "business" },
];

// ─── Sök/norm ─────────────────────────────────────────────────────────────────
function norm(s: string) {
  return s.toLowerCase()
    .replace(/å/g, "a").replace(/ä/g, "a").replace(/ö/g, "o")
    .replace(/é|è/g, "e").replace(/ü/g, "u");
}
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) => [i]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}
function fuzzyMatch(text: string, q: string): boolean {
  if (text.includes(q)) return true;
  return text.split(/\s+/).some(w => w.length > 4 && q.length > 3 && levenshtein(w, q) <= 1);
}

// ─── Translations ─────────────────────────────────────────────────────────────
const T = {
  sv: {
    title: "Hitta", em: "ditt hotell",
    sub: (n: number) => `${n} hotell i Malmö — klicka för aktuellt pris och tillgänglighet på Hotels.com.`,
    search: "Sök hotell eller område…",
    area: "Område", allAreas: "Alla",
    traveler: "Resenärstyp", allTravelers: "Alla",
    filter: "Filter",
    showing: (a: number, b: number, t: number) => `Visar ${a}–${b} av ${t}`,
    empty: "Inga hotell matchar dina filter.",
    reset: "Rensa filter",
    prev: "Föregående", next: "Nästa",
    travelerBusiness: "Affärsresa", travelerFamily: "Familj",
    travelerRomantic: "Par", travelerBudget: "Budget",
    viewBtn: "Visa hotell",
    areaLabels: { centrum: "Centrum", vastra_hamnen: "Västra hamnen", hyllie: "Hyllie", ovrigt: "Övrigt" },
  },
  en: {
    title: "Find", em: "your hotel",
    sub: (n: number) => `${n} hotels in Malmö — click for current price and availability on Hotels.com.`,
    search: "Search hotel or area…",
    area: "Area", allAreas: "All",
    traveler: "Traveler type", allTravelers: "All",
    filter: "Filter",
    showing: (a: number, b: number, t: number) => `Showing ${a}–${b} of ${t}`,
    empty: "No hotels match your filters.",
    reset: "Clear filters",
    prev: "Previous", next: "Next",
    travelerBusiness: "Business", travelerFamily: "Family",
    travelerRomantic: "Couples", travelerBudget: "Budget",
    viewBtn: "View hotel",
    areaLabels: { centrum: "City Centre", vastra_hamnen: "Western Harbour", hyllie: "Hyllie", ovrigt: "Other" },
  },
  de: {
    title: "Finde", em: "dein Hotel",
    sub: (n: number) => `${n} Hotels in Malmö — klicken Sie für aktuellen Preis und Verfügbarkeit auf Hotels.com.`,
    search: "Hotel oder Lage suchen…",
    area: "Lage", allAreas: "Alle",
    traveler: "Reiseart", allTravelers: "Alle",
    filter: "Filter",
    showing: (a: number, b: number, t: number) => `Zeige ${a}–${b} von ${t}`,
    empty: "Keine Hotels gefunden.",
    reset: "Zurücksetzen",
    prev: "Zurück", next: "Weiter",
    travelerBusiness: "Geschäftsreise", travelerFamily: "Familie",
    travelerRomantic: "Paare", travelerBudget: "Budget",
    viewBtn: "Zum Hotel",
    areaLabels: { centrum: "Stadtzentrum", vastra_hamnen: "Westhafen", hyllie: "Hyllie", ovrigt: "Sonstige" },
  },
};

const PER_PAGE = 12;
const AREAS: AreaKey[] = ["centrum", "vastra_hamnen", "hyllie", "ovrigt"];

export default function HotellList() {
  const [lang, setLang] = useState<Lang>("sv");
  const [query, setQuery] = useState("");
  const [area, setArea] = useState<AreaKey | "all">("all");
  const [traveler, setTraveler] = useState("all");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const readLang = () => {
      try {
        const saved = localStorage.getItem("dm-lang") as Lang;
        if (saved && ["sv", "en", "de"].includes(saved)) setLang(saved);
      } catch {}
    };
    const onCustom = (e: Event) => {
      const l = (e as CustomEvent).detail as Lang;
      if (["sv", "en", "de"].includes(l)) setLang(l);
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

  const t = T[lang];

  const filtered = useMemo(() => {
    let list = HOTELS;
    if (area !== "all") list = list.filter(h => h.areaKey === area);
    if (traveler !== "all") list = list.filter(h => h.travelerType === traveler);
    if (query.trim()) {
      const terms = query.trim().split(/\s+/).map(norm);
      list = list.filter(h => {
        const fields = [norm(h.name), norm(h.area)].join(" ");
        return terms.every(term => fuzzyMatch(fields, term));
      });
    }
    return list;
  }, [area, traveler, query]);

  useEffect(() => { setPage(1); }, [area, traveler, query]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const resetFilters = () => {
    setArea("all"); setTraveler("all"); setQuery("");
  };

  function goToPage(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!mounted) return (
    <div className="upp-page hb-page">
      <header className="upp-header">
        <div className="upp-header-inner">
          <div className="skeleton h-20 w-40" style={{marginBottom: 12}} />
          <div className="skeleton h-16 w-80" style={{marginBottom: 8}} />
          <div className="skeleton" style={{height: 52, borderRadius: 999, marginTop: 16}} />
        </div>
      </header>
      <div className="hb-grid">
        {Array.from({length: 8}).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton skeleton-img" />
            <div className="skeleton-body">
              <div className="skeleton skeleton-line w-60" />
              <div className="skeleton skeleton-line w-100 h-16" />
              <div className="skeleton skeleton-line w-80" />
              <div className="skeleton skeleton-line w-40 h-16" style={{marginTop: 8}} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="upp-page hb-page">
      <header className="upp-header">
        <div className="upp-header-inner">
          <h1 className="upp-title">
            {t.title} <em>{t.em}</em>
          </h1>
          <p className="upp-sub">{t.sub(HOTELS.length)}</p>
          <div className="upp-search">
            <svg width="16" height="16" viewBox="0 0 16 16" className="upp-search-icon" aria-hidden="true">
              <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="11" y1="11" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="search"
              placeholder={t.search}
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label={t.search}
            />
          </div>
        </div>
      </header>

      <div className="upp-mob-bar">
        <button className="upp-filter-toggle-btn" onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {t.filter}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{flexShrink:0}}>
            <path d={filtersOpen ? "M2 8l4-4 4 4" : "M2 4l4 4 4-4"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <section className={`upp-filters hb-filters ht-filters${filtersOpen ? " mob-open" : ""}`} aria-label="Filter">
        <div className="upp-filter-group">
          <span className="upp-filter-label">{t.area}</span>
          <div className="upp-chips">
            <button className={`upp-chip${area === "all" ? " active" : ""}`} onClick={() => setArea("all")}>{t.allAreas}</button>
            {AREAS.map(a => (
              <button key={a} className={`upp-chip${area === a ? " active" : ""}`} onClick={() => setArea(a)}>
                {(t.areaLabels as Record<string, string>)[a]}
              </button>
            ))}
          </div>
        </div>

        <div className="upp-filter-group">
          <span className="upp-filter-label">{t.traveler}</span>
          <div className="upp-chips">
            <button className={`upp-chip${traveler === "all" ? " active" : ""}`} onClick={() => setTraveler("all")}>{t.allTravelers}</button>
            <button className={`upp-chip${traveler === "business" ? " active" : ""}`} onClick={() => setTraveler("business")}>{t.travelerBusiness}</button>
            <button className={`upp-chip${traveler === "family" ? " active" : ""}`} onClick={() => setTraveler("family")}>{t.travelerFamily}</button>
            <button className={`upp-chip${traveler === "romantic" ? " active" : ""}`} onClick={() => setTraveler("romantic")}>{t.travelerRomantic}</button>
            <button className={`upp-chip${traveler === "budget" ? " active" : ""}`} onClick={() => setTraveler("budget")}>{t.travelerBudget}</button>
          </div>
        </div>
      </section>

      <div className="upp-count-row">
        <p className="upp-count">{t.showing((page - 1) * PER_PAGE + 1, Math.min(page * PER_PAGE, filtered.length), filtered.length)}</p>
      </div>

      {filtered.length === 0 ? (
        <div className="upp-empty">
          <p>{t.empty}</p>
          <button className="upp-reset" onClick={resetFilters}>{t.reset}</button>
        </div>
      ) : (
        <>
          <section className="hb-grid">
            {paginated.map(h => (
              <a key={h.id} href={deepLink(h)} target="_blank" rel="noopener noreferrer sponsored" className="hb-card">
                <div className="hb-card-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={h.image} alt={h.name} className="hb-card-img" loading="lazy"
                    onError={e => { (e.target as HTMLImageElement).src = UNSPLASH_FALLBACK; }} />
                  <span className="hb-card-loc-tag city">{h.area}</span>
                </div>
                <div className="hb-card-body">
                  <h3 className="hb-card-title">{h.name}</h3>
                  <p className="hb-card-price-from">{lang === "sv" ? "Klicka för aktuellt pris" : lang === "de" ? "Für aktuellen Preis klicken" : "Click for current price"}</p>
                </div>
              </a>
            ))}
          </section>

          {totalPages > 1 && (
            <nav className="upp-pagination" aria-label="Sidnavigation">
              <button className="upp-page-btn" onClick={() => goToPage(page - 1)} disabled={page === 1} aria-label={t.prev}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
                const show = p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                const showDot = (p === 2 && page > 4) || (p === totalPages - 1 && page < totalPages - 3);
                if (!show && !showDot) return null;
                if (showDot && !show) return <span key={p} className="upp-page-dots">…</span>;
                return <button key={p} className={`upp-page-btn${page === p ? " active" : ""}`} onClick={() => goToPage(p)}>{p}</button>;
              })}
              <button className="upp-page-btn" onClick={() => goToPage(page + 1)} disabled={page === totalPages} aria-label={t.next}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </nav>
          )}
        </>
      )}

      <div className="hb-disclaimer">
        <p>Klicka på ett hotell för aktuellt pris och bokning på Hotels.com. Vi visar inte pris här eftersom de varierar dagligen.</p>
      </div>
    </div>
  );
}
