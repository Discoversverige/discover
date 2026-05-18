"use client";

import { useMemo, useState, useEffect } from "react";

type Lang = "sv" | "en" | "de";
type AreaKey = "all" | "centrum" | "gamla_stan" | "vastra_hamnen" | "hyllie";
type SortKey = "popular" | "price-asc" | "price-desc" | "rating";

type Hotel = {
  id: string;
  name: string;
  area: string;
  areaKey: AreaKey;
  stars: number;
  guestRating: number;
  ratingLabel: string;
  reviewCount: number;
  pricePerNight: number;
  image: string;
  tags: string[];
  travelerType: "business" | "family" | "romantic" | "budget";
};

const AFFILIATE = "https://www.hotels.com/affiliate/IiZQkAy";

const HOTELS: Hotel[] = [
  { id: "elite-savoy", name: "Elite Hotel Savoy", area: "Centrum", areaKey: "centrum", stars: 4, guestRating: 8.8, ratingLabel: "Fantastiskt", reviewCount: 1243, pricePerNight: 1390, image: "https://images.trvl-media.com/lodging/1000000/30000/29700/29605/8e8b7f5f.jpg", tags: ["Frukost", "Restaurang", "Bar", "Gym"], travelerType: "business" },
  { id: "scandic-triangeln", name: "Scandic Triangeln", area: "Centrum", areaKey: "centrum", stars: 4, guestRating: 8.4, ratingLabel: "Mycket bra", reviewCount: 2187, pricePerNight: 1190, image: "https://images.trvl-media.com/lodging/1000000/20000/19300/19290/7d5d1e2d.jpg", tags: ["Frukost", "Restaurang", "Gym", "Parkering"], travelerType: "business" },
  { id: "mayfair-tunneln", name: "Mayfair Hotel Tunneln", area: "Gamla stan", areaKey: "gamla_stan", stars: 4, guestRating: 9.0, ratingLabel: "Underbart", reviewCount: 876, pricePerNight: 1590, image: "https://images.trvl-media.com/lodging/2000000/1820000/1817700/1817618/3b5e5a5e.jpg", tags: ["Frukost", "Historisk", "Bar", "Restaurang"], travelerType: "romantic" },
  { id: "clarion-temperance", name: "Clarion Collection Hotel Temperance", area: "Centrum", areaKey: "centrum", stars: 4, guestRating: 8.6, ratingLabel: "Fantastiskt", reviewCount: 1456, pricePerNight: 1250, image: "https://images.trvl-media.com/lodging/1000000/20000/19600/19548/79db3c59.jpg", tags: ["Frukost ingår", "Gym", "Restaurang"], travelerType: "business" },
  { id: "radisson-blu", name: "Radisson Blu Hotel Malmö", area: "Centrum", areaKey: "centrum", stars: 4, guestRating: 8.3, ratingLabel: "Mycket bra", reviewCount: 3021, pricePerNight: 1350, image: "https://images.trvl-media.com/lodging/1000000/30000/29700/29693/fe6573ec.jpg", tags: ["Pool", "Gym", "Spa", "Restaurang", "Bar"], travelerType: "business" },
  { id: "story-hotel", name: "Story Hotel Malmö", area: "Centrum", areaKey: "centrum", stars: 4, guestRating: 8.7, ratingLabel: "Fantastiskt", reviewCount: 654, pricePerNight: 1450, image: "https://images.trvl-media.com/lodging/66000000/65100000/65098200/65098187/8b5b7e17.jpg", tags: ["Bar", "Restaurang", "Design"], travelerType: "romantic" },
  { id: "best-western", name: "Best Western Hotel Malmö", area: "Centrum", areaKey: "centrum", stars: 3, guestRating: 8.0, ratingLabel: "Mycket bra", reviewCount: 987, pricePerNight: 890, image: "https://images.trvl-media.com/lodging/1000000/20000/19700/19650/e1c4b9a8.jpg", tags: ["Frukost", "Gym", "Parkering"], travelerType: "budget" },
  { id: "ibis-styles", name: "ibis Styles Malmö", area: "Centrum", areaKey: "centrum", stars: 3, guestRating: 8.2, ratingLabel: "Mycket bra", reviewCount: 1102, pricePerNight: 790, image: "https://images.trvl-media.com/lodging/30000000/29430000/29427200/29427131/7c0e7eaf.jpg", tags: ["Frukost ingår", "Gym"], travelerType: "budget" },
  { id: "hotel-hipp", name: "Hotel Hipp", area: "Gamla stan", areaKey: "gamla_stan", stars: 3, guestRating: 8.5, ratingLabel: "Fantastiskt", reviewCount: 534, pricePerNight: 1050, image: "https://images.trvl-media.com/lodging/8000000/7060000/7059000/7058913/1cc70e46.jpg", tags: ["Frukost", "Historisk", "Design"], travelerType: "romantic" },
  { id: "elite-marina-plaza", name: "Elite Hotel Marina Plaza", area: "Västra hamnen", areaKey: "vastra_hamnen", stars: 4, guestRating: 8.5, ratingLabel: "Fantastiskt", reviewCount: 1789, pricePerNight: 1480, image: "https://images.trvl-media.com/lodging/1000000/30000/29700/29606/8a1d9c2b.jpg", tags: ["Havsutsikt", "Restaurang", "Bar", "Gym", "Spa"], travelerType: "romantic" },
  { id: "comfort-hotel", name: "Comfort Hotel Malmö", area: "Centrum", areaKey: "centrum", stars: 3, guestRating: 7.8, ratingLabel: "Bra", reviewCount: 2341, pricePerNight: 750, image: "https://images.trvl-media.com/lodging/1000000/20000/19800/19750/5b2a3c4d.jpg", tags: ["Frukost", "Gym"], travelerType: "budget" },
  { id: "scandic-city", name: "Scandic Malmö City", area: "Centrum", areaKey: "centrum", stars: 4, guestRating: 8.3, ratingLabel: "Mycket bra", reviewCount: 1654, pricePerNight: 1150, image: "https://images.trvl-media.com/lodging/1000000/20000/19300/19267/4c3e1b9a.jpg", tags: ["Frukost", "Restaurang", "Gym", "Familj"], travelerType: "family" },
  { id: "hotel-noble-house", name: "Hotel Noble House", area: "Centrum", areaKey: "centrum", stars: 4, guestRating: 8.6, ratingLabel: "Fantastiskt", reviewCount: 723, pricePerNight: 1320, image: "https://images.trvl-media.com/lodging/1000000/20000/19900/19890/2d4f6e8a.jpg", tags: ["Frukost", "Bar", "Restaurang", "Design"], travelerType: "romantic" },
  { id: "renaissance", name: "Renaissance Malmö Hotel", area: "Centrum", areaKey: "centrum", stars: 5, guestRating: 9.1, ratingLabel: "Underbart", reviewCount: 892, pricePerNight: 1890, image: "https://images.trvl-media.com/lodging/67000000/66100000/66094900/66094863/9e1c3f5a.jpg", tags: ["Pool", "Spa", "Gym", "Restaurang", "Bar"], travelerType: "romantic" },
  { id: "ac-hotel-marriott", name: "AC Hotel by Marriott Malmö", area: "Hyllie", areaKey: "hyllie", stars: 4, guestRating: 8.7, ratingLabel: "Fantastiskt", reviewCount: 1123, pricePerNight: 1280, image: "https://images.trvl-media.com/lodging/40000000/39200000/39193300/39193229/2a8b4c6e.jpg", tags: ["Gym", "Bar", "Restaurang", "Parkering"], travelerType: "business" },
  { id: "elite-carolina", name: "Elite Hotel Carolina Tower", area: "Hyllie", areaKey: "hyllie", stars: 4, guestRating: 8.4, ratingLabel: "Mycket bra", reviewCount: 967, pricePerNight: 1100, image: "https://images.trvl-media.com/lodging/10000000/9050000/9049900/9049883/6f4b2c8e.jpg", tags: ["Gym", "Restaurang", "Parkering", "Frukost"], travelerType: "business" },
  { id: "park-inn", name: "Park Inn by Radisson Malmö", area: "Hyllie", areaKey: "hyllie", stars: 4, guestRating: 8.1, ratingLabel: "Mycket bra", reviewCount: 1432, pricePerNight: 1020, image: "https://images.trvl-media.com/lodging/1000000/980000/975200/975112/5e7d9f2a.jpg", tags: ["Gym", "Restaurang", "Bar", "Parkering"], travelerType: "business" },
  { id: "motel-l", name: "Motel L Malmö", area: "Västra hamnen", areaKey: "vastra_hamnen", stars: 3, guestRating: 8.3, ratingLabel: "Mycket bra", reviewCount: 445, pricePerNight: 980, image: "https://images.trvl-media.com/lodging/50000000/49900000/49894700/49894695/3a7c5e9f.jpg", tags: ["Design", "Gym", "Bar"], travelerType: "romantic" },
  { id: "stay-apartments", name: "STAY Malmö Apartments", area: "Centrum", areaKey: "centrum", stars: 3, guestRating: 8.6, ratingLabel: "Fantastiskt", reviewCount: 312, pricePerNight: 870, image: "https://images.trvl-media.com/lodging/55000000/54100000/54098800/54098777/7b3e1d4f.jpg", tags: ["Lägenhet", "Kök", "Familj"], travelerType: "family" },
  { id: "connect-hotel", name: "Connect Hotel Malmö", area: "Centrum", areaKey: "centrum", stars: 3, guestRating: 7.9, ratingLabel: "Bra", reviewCount: 876, pricePerNight: 720, image: "https://images.trvl-media.com/lodging/1000000/20000/19200/19178/4d8f2e6b.jpg", tags: ["Frukost", "Parkering"], travelerType: "budget" },
  { id: "hotel-baltzar", name: "Hotel Baltzar", area: "Gamla stan", areaKey: "gamla_stan", stars: 3, guestRating: 8.4, ratingLabel: "Mycket bra", reviewCount: 654, pricePerNight: 1120, image: "https://images.trvl-media.com/lodging/1000000/990000/989900/989876/5e2c7a3f.jpg", tags: ["Frukost", "Historisk", "Design"], travelerType: "romantic" },
  { id: "hotel-duxiana", name: "Hotel Duxiana", area: "Centrum", areaKey: "centrum", stars: 4, guestRating: 8.9, ratingLabel: "Underbart", reviewCount: 432, pricePerNight: 1680, image: "https://images.trvl-media.com/lodging/8000000/7060000/7059300/7059241/6e4a2b8c.jpg", tags: ["Frukost", "Spa", "Design", "Lyx"], travelerType: "romantic" },
  { id: "meininger", name: "MEININGER Hotel Malmö", area: "Centrum", areaKey: "centrum", stars: 2, guestRating: 8.0, ratingLabel: "Mycket bra", reviewCount: 1876, pricePerNight: 420, image: "https://images.trvl-media.com/lodging/50000000/49600000/49592900/49592820/2f5c8e1a.jpg", tags: ["Frukost", "Budget"], travelerType: "budget" },
  { id: "scandic-st-jorgen", name: "Scandic St Jörgen", area: "Centrum", areaKey: "centrum", stars: 4, guestRating: 8.2, ratingLabel: "Mycket bra", reviewCount: 1543, pricePerNight: 1080, image: "https://images.trvl-media.com/lodging/1000000/20000/19300/19291/3c6e9a2f.jpg", tags: ["Pool", "Gym", "Spa", "Restaurang", "Familj"], travelerType: "family" },
  { id: "hotel-mortensen", name: "Hotel Mortensen", area: "Gamla stan", areaKey: "gamla_stan", stars: 3, guestRating: 8.7, ratingLabel: "Fantastiskt", reviewCount: 287, pricePerNight: 1090, image: "https://images.trvl-media.com/lodging/9000000/8010000/8003200/8003121/1a4d7f3e.jpg", tags: ["Frukost", "Historisk", "Design"], travelerType: "romantic" },
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

const SEARCH_TAGS: [string, string[]][] = [
  ["centrum",       ["centrum", "center", "city", "central", "innerstaden", "stan", "mitte", "downtown", "stadtzentrum"]],
  ["gamla_stan",    ["gamla stan", "gamlastan", "historisk", "old town", "altstadt", "history", "historic"]],
  ["vastra_hamnen", ["vastra hamnen", "hamnen", "harbour", "harbor", "hafen", "turning torso", "turning", "waterfront"]],
  ["hyllie",        ["hyllie", "arena", "malmo arena", "congress", "mässan"]],
  ["pool",          ["pool", "simning", "swim", "schwimmbad", "simbassang"]],
  ["spa",           ["spa", "wellness", "avkoppling", "relax", "massage"]],
  ["frukost",       ["frukost", "frukostingas", "breakfast", "fruhstuck", "mat ingas"]],
  ["gym",           ["gym", "fitness", "traning", "fitnesscenter"]],
  ["parkering",     ["parkering", "parkera", "parking", "parken"]],
  ["restaurang",    ["restaurang", "restaurant", "mat", "middag", "dinner", "essen"]],
  ["bar",           ["bar", "cocktail", "drink", "dryck"]],
  ["familj",        ["familj", "barn", "family", "kids", "kinder", "barnvanlig"]],
  ["romantik",      ["romantik", "romantisk", "par", "romantic", "romantisch", "parresa"]],
  ["business",      ["business", "affar", "konferens", "mote", "geschaft", "affärsresenär"]],
  ["budget",        ["budget", "billig", "cheap", "gunstig", "prisvard", "spara"]],
  ["lyx",           ["lyx", "lyxig", "luxury", "luxus", "exklusiv", "premium", "fin"]],
  ["design",        ["design", "modern", "trendig", "hip", "boutique", "stilren"]],
  ["historisk",     ["historisk", "history", "historic", "gammalt", "historisch", "charm"]],
  ["lagenhet",      ["lagenhet", "apartment", "studio", "kok", "kitchen", "kuchenette"]],
  ["stars5",        ["5 stjarnor", "5 stjärnor", "5 stars", "5 sterne", "lyxhotell"]],
  ["stars4",        ["4 stjarnor", "4 stjärnor", "4 stars", "4 sterne"]],
  ["stars3",        ["3 stjarnor", "3 stjärnor", "3 stars", "3 sterne"]],
  ["stars2",        ["2 stjarnor", "2 stjärnor", "2 stars", "vandrarhem", "hostel"]],
];
const TERM_TO_KEY: Record<string, string> = {};
for (const [key, terms] of SEARCH_TAGS)
  for (const t of terms) TERM_TO_KEY[norm(t)] = key;

function hotelKeys(h: Hotel): string[] {
  const keys = new Set<string>();
  keys.add(h.areaKey);
  keys.add(`stars${h.stars}`);
  if (h.travelerType === "family")   { keys.add("familj"); }
  if (h.travelerType === "romantic") { keys.add("romantik"); keys.add("lyx"); }
  if (h.travelerType === "business") { keys.add("business"); }
  if (h.travelerType === "budget")   { keys.add("budget"); }
  for (const tag of h.tags) {
    const n = norm(tag);
    if (n.includes("pool"))       keys.add("pool");
    if (n.includes("spa"))        keys.add("spa");
    if (n.includes("frukost"))    keys.add("frukost");
    if (n.includes("gym"))        keys.add("gym");
    if (n.includes("parkering"))  keys.add("parkering");
    if (n.includes("restaurang")) keys.add("restaurang");
    if (n.includes("bar"))        keys.add("bar");
    if (n.includes("familj"))     keys.add("familj");
    if (n.includes("lyx"))        keys.add("lyx");
    if (n.includes("design"))     keys.add("design");
    if (n.includes("historisk"))  keys.add("historisk");
    if (n.includes("lagenhet") || n.includes("kok")) keys.add("lagenhet");
    if (n.includes("budget"))     keys.add("budget");
  }
  return [...keys];
}

// ─── Translations ─────────────────────────────────────────────────────────────
const T = {
  sv: {
    title: "Hitta", em: "ditt hotell",
    sub: (n: number) => `${n} hotell i Malmö — jämför pris, stjärnor och gästrecensioner.`,
    search: "Sök hotell, område eller faciliteter…",
    area: "Område", allAreas: "Alla",
    stars: "Stjärnor", allStars: "Alla",
    rating: "Gästbetyg", allRatings: "Alla betyg",
    r9: "9+", r85: "8.5+", r8: "8+",
    traveler: "Resenärstyp", allTravelers: "Alla",
    sort: "Sortera", popular: "Populärast", priceAsc: "Lägsta pris", priceDesc: "Högsta pris", ratingSort: "Bäst betyg",
    filter: "Filter",
    showing: (a: number, b: number, t: number) => `Visar ${a}–${b} av ${t}`,
    perNight: "/ natt",
    empty: "Inga hotell matchar dina filter.",
    reset: "Rensa filter",
    prev: "Föregående", next: "Nästa",
    travelerBusiness: "Affärsresa", travelerFamily: "Familj",
    travelerRomantic: "Par", travelerBudget: "Budget",
    reviews: (n: number) => `${n} recensioner`,
    areaLabels: { centrum: "Centrum", gamla_stan: "Gamla stan", vastra_hamnen: "Västra hamnen", hyllie: "Hyllie" },
  },
  en: {
    title: "Find", em: "your hotel",
    sub: (n: number) => `${n} hotels in Malmö — compare price, stars and guest reviews.`,
    search: "Search hotel, area or facilities…",
    area: "Area", allAreas: "All",
    stars: "Stars", allStars: "All",
    rating: "Guest rating", allRatings: "All ratings",
    r9: "9+", r85: "8.5+", r8: "8+",
    traveler: "Traveler type", allTravelers: "All",
    sort: "Sort", popular: "Most popular", priceAsc: "Lowest price", priceDesc: "Highest price", ratingSort: "Best rated",
    filter: "Filter",
    showing: (a: number, b: number, t: number) => `Showing ${a}–${b} of ${t}`,
    perNight: "/ night",
    empty: "No hotels match your filters.",
    reset: "Clear filters",
    prev: "Previous", next: "Next",
    travelerBusiness: "Business", travelerFamily: "Family",
    travelerRomantic: "Couples", travelerBudget: "Budget",
    reviews: (n: number) => `${n} reviews`,
    areaLabels: { centrum: "City Centre", gamla_stan: "Old Town", vastra_hamnen: "Western Harbour", hyllie: "Hyllie" },
  },
  de: {
    title: "Finde", em: "dein Hotel",
    sub: (n: number) => `${n} Hotels in Malmö — Preise, Sterne und Gästebewertungen vergleichen.`,
    search: "Hotel, Lage oder Ausstattung suchen…",
    area: "Lage", allAreas: "Alle",
    stars: "Sterne", allStars: "Alle",
    rating: "Gästebewertung", allRatings: "Alle",
    r9: "9+", r85: "8.5+", r8: "8+",
    traveler: "Reiseart", allTravelers: "Alle",
    sort: "Sortieren", popular: "Beliebteste", priceAsc: "Günstigste", priceDesc: "Teuerste", ratingSort: "Beste Bewertung",
    filter: "Filter",
    showing: (a: number, b: number, t: number) => `Zeige ${a}–${b} von ${t}`,
    perNight: "/ Nacht",
    empty: "Keine Hotels gefunden.",
    reset: "Zurücksetzen",
    prev: "Zurück", next: "Weiter",
    travelerBusiness: "Geschäftsreise", travelerFamily: "Familie",
    travelerRomantic: "Paare", travelerBudget: "Budget",
    reviews: (n: number) => `${n} Bewertungen`,
    areaLabels: { centrum: "Stadtzentrum", gamla_stan: "Altstadt", vastra_hamnen: "Westhafen", hyllie: "Hyllie" },
  },
};

const PER_PAGE = 12;
const AREAS: AreaKey[] = ["centrum", "gamla_stan", "vastra_hamnen", "hyllie"];

export default function HotellList() {
  const [lang, setLang] = useState<Lang>("sv");
  const [query, setQuery] = useState("");
  const [area, setArea] = useState<AreaKey | "all">("all");
  const [minStars, setMinStars] = useState("all");
  const [minRating, setMinRating] = useState("all");
  const [traveler, setTraveler] = useState("all");
  const [sort, setSort] = useState<SortKey>("popular");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

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
    return () => {
      window.removeEventListener("storage", readLang);
      window.removeEventListener("dm-lang-change", onCustom);
    };
  }, []);

  const t = T[lang];

  const filtered = useMemo(() => {
    let list = HOTELS;
    if (area !== "all") list = list.filter(h => h.areaKey === area);
    if (minStars !== "all") list = list.filter(h => h.stars >= parseInt(minStars));
    if (minRating !== "all") list = list.filter(h => h.guestRating >= parseFloat(minRating));
    if (traveler !== "all") list = list.filter(h => h.travelerType === traveler);
    if (query.trim()) {
      const terms = query.trim().split(/\s+/).map(norm);
      list = list.filter(h => {
        const keys = hotelKeys(h);
        const fields = [norm(h.name), norm(h.area), ...h.tags.map(norm)].join(" ");
        return terms.every(term => {
          const key = TERM_TO_KEY[term];
          if (key && keys.includes(key)) return true;
          return fuzzyMatch(fields, term);
        });
      });
    }
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.pricePerNight - b.pricePerNight);
    else if (sort === "price-desc") sorted.sort((a, b) => b.pricePerNight - a.pricePerNight);
    else if (sort === "rating") sorted.sort((a, b) => b.guestRating - a.guestRating);
    else sorted.sort((a, b) => b.guestRating - a.guestRating);
    return sorted;
  }, [area, minStars, minRating, traveler, sort, query]);

  useEffect(() => { setPage(1); }, [area, minStars, minRating, traveler, sort, query]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const resetFilters = () => {
    setArea("all"); setMinStars("all"); setMinRating("all");
    setTraveler("all"); setSort("popular"); setQuery("");
  };

  function goToPage(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

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
        <div className="upp-sort-pill">
          <span>{sort === "popular" ? t.popular : sort === "price-asc" ? t.priceAsc : sort === "price-desc" ? t.priceDesc : t.ratingSort}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <select value={sort} onChange={e => setSort(e.target.value as SortKey)} aria-label={t.sort}>
            <option value="popular">{t.popular}</option>
            <option value="price-asc">{t.priceAsc}</option>
            <option value="price-desc">{t.priceDesc}</option>
            <option value="rating">{t.ratingSort}</option>
          </select>
        </div>
      </div>

      <section className={`upp-filters hb-filters${filtersOpen ? " mob-open" : ""}`} aria-label="Filter">
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
          <span className="upp-filter-label">{t.rating}</span>
          <div className="upp-chips">
            {([["all", t.allRatings], ["9", t.r9], ["8.5", t.r85], ["8", t.r8]] as [string, string][]).map(([key, label]) => (
              <button key={key} className={`upp-chip${minRating === key ? " active" : ""}`} onClick={() => setMinRating(key)}>{label}</button>
            ))}
          </div>
        </div>

        <div className="upp-filter-group">
          <span className="upp-filter-label">{t.stars}</span>
          <div className="upp-chips">
            <button className={`upp-chip${minStars === "all" ? " active" : ""}`} onClick={() => setMinStars("all")}>{t.allStars}</button>
            {["5", "4", "3", "2"].map(s => (
              <button key={s} className={`upp-chip${minStars === s ? " active" : ""}`} onClick={() => setMinStars(s)}>{s}★</button>
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

        <div className="upp-filter-group upp-sort">
          <span className="upp-filter-label">{t.sort}</span>
          <div className="upp-sort-pill">
            <span>{sort === "popular" ? t.popular : sort === "price-asc" ? t.priceAsc : sort === "price-desc" ? t.priceDesc : t.ratingSort}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <select value={sort} onChange={e => setSort(e.target.value as SortKey)} aria-label={t.sort}>
              <option value="popular">{t.popular}</option>
              <option value="price-asc">{t.priceAsc}</option>
              <option value="price-desc">{t.priceDesc}</option>
              <option value="rating">{t.ratingSort}</option>
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
          <button className="upp-reset" onClick={resetFilters}>{t.reset}</button>
        </div>
      ) : (
        <>
          <section className="hb-grid">
            {paginated.map(h => (
              <a key={h.id} href={AFFILIATE} target="_blank" rel="noopener noreferrer sponsored" className="hb-card">
                <div className="hb-card-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={h.image} alt={h.name} className="hb-card-img" loading="lazy"
                    onError={e => { (e.target as HTMLImageElement).src = "https://images.trvl-media.com/lodging/1000000/20000/19300/19290/7d5d1e2d.jpg"; }} />
                  <span className="hb-card-rating-badge">
                    {h.guestRating.toFixed(1)} <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d="M6 1l1.39 2.82L10.5 4.27l-2.25 2.19.53 3.1L6 8l-2.78 1.56.53-3.1L1.5 4.27l3.11-.45z"/></svg>
                  </span>
                  <span className="hb-card-loc-tag city">🏨 {h.area}</span>
                </div>
                <div className="hb-card-body">
                  <div className="hb-card-meta">
                    <span className="hb-card-category">{"★".repeat(h.stars)}</span>
                    <span className="hb-card-supplier">{h.ratingLabel}</span>
                  </div>
                  <h3 className="hb-card-title">{h.name}</h3>
                  <div className="hb-card-specs">
                    {h.tags.slice(0, 3).map(tag => <span key={tag}>{tag}</span>)}
                  </div>
                  <div className="hb-card-footer">
                    <div className="hb-card-price-wrap">
                      <span className="hb-card-price">{h.pricePerNight.toLocaleString("sv-SE")} kr</span>
                      <span className="hb-card-price-unit">{t.perNight}</span>
                    </div>
                    <span className="hb-book-btn">Visa</span>
                  </div>
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
        <p>Priser och hotell hämtade från Hotels.com. Klicka för aktuellt pris och bokning.</p>
      </div>
    </div>
  );
}
