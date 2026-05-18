"use client";

import { useMemo, useState, useEffect } from "react";

type Lang = "sv" | "en" | "de";

// ─── Hotelldata ───────────────────────────────────────────────────────────────
type Hotel = {
  id: string;
  name: string;
  area: string;          // Gamla stan, Centrum, Hyllie, etc.
  stars: number;         // 1–5
  guestRating: number;   // 1–10
  ratingLabel: string;   // "Fantastiskt", "Mycket bra" etc
  reviewCount: number;
  pricePerNight: number; // SEK
  image: string;
  tags: string[];        // "pool", "spa", "frukost", "parkering" etc
  travelerType: string;  // "business" | "family" | "romantic" | "budget"
};

const AFFILIATE = "https://www.hotels.com/affiliate/IiZQkAy";

const HOTELS: Hotel[] = [
  {
    id: "elite-hotel-savoy",
    name: "Elite Hotel Savoy",
    area: "Centrum",
    stars: 4,
    guestRating: 8.8,
    ratingLabel: "Fantastiskt",
    reviewCount: 1243,
    pricePerNight: 1390,
    image: "https://images.trvl-media.com/lodging/1000000/30000/29700/29605/8e8b7f5f.jpg",
    tags: ["frukost", "restaurang", "bar", "gym"],
    travelerType: "business",
  },
  {
    id: "scandic-triangeln",
    name: "Scandic Triangeln",
    area: "Centrum",
    stars: 4,
    guestRating: 8.4,
    ratingLabel: "Mycket bra",
    reviewCount: 2187,
    pricePerNight: 1190,
    image: "https://images.trvl-media.com/lodging/1000000/20000/19300/19290/7d5d1e2d.jpg",
    tags: ["frukost", "restaurang", "gym", "parkering"],
    travelerType: "business",
  },
  {
    id: "hotel-milling-angsjo",
    name: "Mayfair Hotel Tunneln",
    area: "Gamla stan",
    stars: 4,
    guestRating: 9.0,
    ratingLabel: "Underbart",
    reviewCount: 876,
    pricePerNight: 1590,
    image: "https://images.trvl-media.com/lodging/2000000/1820000/1817700/1817618/3b5e5a5e.jpg",
    tags: ["frukost", "historisk", "bar", "restaurang"],
    travelerType: "romantic",
  },
  {
    id: "clarion-collection-hotel-temperance",
    name: "Clarion Collection Hotel Temperance",
    area: "Centrum",
    stars: 4,
    guestRating: 8.6,
    ratingLabel: "Fantastiskt",
    reviewCount: 1456,
    pricePerNight: 1250,
    image: "https://images.trvl-media.com/lodging/1000000/20000/19600/19548/79db3c59.jpg",
    tags: ["frukost ingår", "gym", "restaurang"],
    travelerType: "business",
  },
  {
    id: "radisson-blu-malmo",
    name: "Radisson Blu Hotel, Malmö",
    area: "Centrum",
    stars: 4,
    guestRating: 8.3,
    ratingLabel: "Mycket bra",
    reviewCount: 3021,
    pricePerNight: 1350,
    image: "https://images.trvl-media.com/lodging/1000000/30000/29700/29693/fe6573ec.jpg",
    tags: ["pool", "gym", "spa", "restaurang", "bar", "parkering"],
    travelerType: "business",
  },
  {
    id: "story-hotel-malmö",
    name: "Story Hotel Malmö",
    area: "Centrum",
    stars: 4,
    guestRating: 8.7,
    ratingLabel: "Fantastiskt",
    reviewCount: 654,
    pricePerNight: 1450,
    image: "https://images.trvl-media.com/lodging/66000000/65100000/65098200/65098187/8b5b7e17.jpg",
    tags: ["bar", "restaurang", "design"],
    travelerType: "romantic",
  },
  {
    id: "best-western-hotel-malmo",
    name: "Best Western Hotel Malmö",
    area: "Centrum",
    stars: 3,
    guestRating: 8.0,
    ratingLabel: "Mycket bra",
    reviewCount: 987,
    pricePerNight: 890,
    image: "https://images.trvl-media.com/lodging/1000000/20000/19700/19650/e1c4b9a8.jpg",
    tags: ["frukost", "gym", "parkering"],
    travelerType: "budget",
  },
  {
    id: "ibis-styles-malmo",
    name: "ibis Styles Malmö",
    area: "Centrum",
    stars: 3,
    guestRating: 8.2,
    ratingLabel: "Mycket bra",
    reviewCount: 1102,
    pricePerNight: 790,
    image: "https://images.trvl-media.com/lodging/30000000/29430000/29427200/29427131/7c0e7eaf.jpg",
    tags: ["frukost ingår", "gym"],
    travelerType: "budget",
  },
  {
    id: "hotel-hipp",
    name: "Hotel Hipp",
    area: "Gamla stan",
    stars: 3,
    guestRating: 8.5,
    ratingLabel: "Fantastiskt",
    reviewCount: 534,
    pricePerNight: 1050,
    image: "https://images.trvl-media.com/lodging/8000000/7060000/7059000/7058913/1cc70e46.jpg",
    tags: ["frukost", "historisk", "design"],
    travelerType: "romantic",
  },
  {
    id: "elite-hotel-marina-plaza",
    name: "Elite Hotel Marina Plaza",
    area: "Västra hamnen",
    stars: 4,
    guestRating: 8.5,
    ratingLabel: "Fantastiskt",
    reviewCount: 1789,
    pricePerNight: 1480,
    image: "https://images.trvl-media.com/lodging/1000000/30000/29700/29606/8a1d9c2b.jpg",
    tags: ["havsutsikt", "restaurang", "bar", "gym", "spa"],
    travelerType: "romantic",
  },
  {
    id: "comfort-hotel-malmo",
    name: "Comfort Hotel Malmö",
    area: "Centrum",
    stars: 3,
    guestRating: 7.8,
    ratingLabel: "Bra",
    reviewCount: 2341,
    pricePerNight: 750,
    image: "https://images.trvl-media.com/lodging/1000000/20000/19800/19750/5b2a3c4d.jpg",
    tags: ["frukost", "gym"],
    travelerType: "budget",
  },
  {
    id: "scandic-malmo-city",
    name: "Scandic Malmö City",
    area: "Centrum",
    stars: 4,
    guestRating: 8.3,
    ratingLabel: "Mycket bra",
    reviewCount: 1654,
    pricePerNight: 1150,
    image: "https://images.trvl-media.com/lodging/1000000/20000/19300/19267/4c3e1b9a.jpg",
    tags: ["frukost", "restaurang", "gym", "parkering"],
    travelerType: "family",
  },
  {
    id: "hotel-noble-house",
    name: "Hotel Noble House",
    area: "Centrum",
    stars: 4,
    guestRating: 8.6,
    ratingLabel: "Fantastiskt",
    reviewCount: 723,
    pricePerNight: 1320,
    image: "https://images.trvl-media.com/lodging/1000000/20000/19900/19890/2d4f6e8a.jpg",
    tags: ["frukost", "bar", "restaurang", "design"],
    travelerType: "romantic",
  },
  {
    id: "renaissance-malmo-hotel",
    name: "Renaissance Malmö Hotel",
    area: "Centrum",
    stars: 5,
    guestRating: 9.1,
    ratingLabel: "Underbart",
    reviewCount: 892,
    pricePerNight: 1890,
    image: "https://images.trvl-media.com/lodging/67000000/66100000/66094900/66094863/9e1c3f5a.jpg",
    tags: ["pool", "spa", "gym", "restaurang", "bar", "frukost"],
    travelerType: "romantic",
  },
  {
    id: "ac-hotel-malmo",
    name: "AC Hotel by Marriott Malmö",
    area: "Hyllie",
    stars: 4,
    guestRating: 8.7,
    ratingLabel: "Fantastiskt",
    reviewCount: 1123,
    pricePerNight: 1280,
    image: "https://images.trvl-media.com/lodging/40000000/39200000/39193300/39193229/2a8b4c6e.jpg",
    tags: ["gym", "bar", "restaurang", "parkering"],
    travelerType: "business",
  },
  {
    id: "elite-hotel-carolina-malmo",
    name: "Elite Hotel Carolina Tower",
    area: "Hyllie",
    stars: 4,
    guestRating: 8.4,
    ratingLabel: "Mycket bra",
    reviewCount: 967,
    pricePerNight: 1100,
    image: "https://images.trvl-media.com/lodging/10000000/9050000/9049900/9049883/6f4b2c8e.jpg",
    tags: ["gym", "restaurang", "parkering", "frukost"],
    travelerType: "business",
  },
  {
    id: "park-inn-malmo",
    name: "Park Inn by Radisson Malmö",
    area: "Hyllie",
    stars: 4,
    guestRating: 8.1,
    ratingLabel: "Mycket bra",
    reviewCount: 1432,
    pricePerNight: 1020,
    image: "https://images.trvl-media.com/lodging/1000000/980000/975200/975112/5e7d9f2a.jpg",
    tags: ["gym", "restaurang", "bar", "parkering"],
    travelerType: "business",
  },
  {
    id: "motel-l-malmo",
    name: "Motel L Malmö",
    area: "Västra hamnen",
    stars: 3,
    guestRating: 8.3,
    ratingLabel: "Mycket bra",
    reviewCount: 445,
    pricePerNight: 980,
    image: "https://images.trvl-media.com/lodging/50000000/49900000/49894700/49894695/3a7c5e9f.jpg",
    tags: ["design", "gym", "bar"],
    travelerType: "romantic",
  },
  {
    id: "stay-malmo-apartments",
    name: "STAY Malmö Apartments",
    area: "Centrum",
    stars: 3,
    guestRating: 8.6,
    ratingLabel: "Fantastiskt",
    reviewCount: 312,
    pricePerNight: 870,
    image: "https://images.trvl-media.com/lodging/55000000/54100000/54098800/54098777/7b3e1d4f.jpg",
    tags: ["lägenhet", "kök", "familj"],
    travelerType: "family",
  },
  {
    id: "connect-hotel-malmo",
    name: "Connect Hotel Malmö",
    area: "Centrum",
    stars: 3,
    guestRating: 7.9,
    ratingLabel: "Bra",
    reviewCount: 876,
    pricePerNight: 720,
    image: "https://images.trvl-media.com/lodging/1000000/20000/19200/19178/4d8f2e6b.jpg",
    tags: ["frukost", "parkering"],
    travelerType: "budget",
  },
  {
    id: "hotel-baltzar",
    name: "Hotel Baltzar",
    area: "Gamla stan",
    stars: 3,
    guestRating: 8.4,
    ratingLabel: "Mycket bra",
    reviewCount: 654,
    pricePerNight: 1120,
    image: "https://images.trvl-media.com/lodging/1000000/990000/989900/989876/5e2c7a3f.jpg",
    tags: ["frukost", "historisk", "design"],
    travelerType: "romantic",
  },
  {
    id: "hotel-duxiana",
    name: "Hotel Duxiana",
    area: "Centrum",
    stars: 4,
    guestRating: 8.9,
    ratingLabel: "Underbart",
    reviewCount: 432,
    pricePerNight: 1680,
    image: "https://images.trvl-media.com/lodging/8000000/7060000/7059300/7059241/6e4a2b8c.jpg",
    tags: ["frukost", "spa", "design", "lyx"],
    travelerType: "romantic",
  },
  {
    id: "meininger-malmo",
    name: "MEININGER Hotel Malmö",
    area: "Centrum",
    stars: 2,
    guestRating: 8.0,
    ratingLabel: "Mycket bra",
    reviewCount: 1876,
    pricePerNight: 420,
    image: "https://images.trvl-media.com/lodging/50000000/49600000/49592900/49592820/2f5c8e1a.jpg",
    tags: ["frukost", "budget", "vandrarhem"],
    travelerType: "budget",
  },
  {
    id: "scandic-st-jorgen",
    name: "Scandic St Jörgen",
    area: "Centrum",
    stars: 4,
    guestRating: 8.2,
    ratingLabel: "Mycket bra",
    reviewCount: 1543,
    pricePerNight: 1080,
    image: "https://images.trvl-media.com/lodging/1000000/20000/19300/19291/3c6e9a2f.jpg",
    tags: ["pool", "gym", "spa", "restaurang", "parkering", "familj"],
    travelerType: "family",
  },
  {
    id: "hotel-mortensen",
    name: "Hotel Mortensen",
    area: "Gamla stan",
    stars: 3,
    guestRating: 8.7,
    ratingLabel: "Fantastiskt",
    reviewCount: 287,
    pricePerNight: 1090,
    image: "https://images.trvl-media.com/lodging/9000000/8010000/8003200/8003121/1a4d7f3e.jpg",
    tags: ["frukost", "historisk", "design"],
    travelerType: "romantic",
  },
];

// ─── Norm + fuzzy ─────────────────────────────────────────────────────────────
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
  ["centrum", ["centrum", "center", "city", "central", "innerstaden", "stan", "mitte", "downtown"]],
  ["gamla_stan", ["gamla stan", "gamlastan", "historisk", "old town", "altstadt"]],
  ["vastra_hamnen", ["vastra hamnen", "västra hamnen", "hamnen", "harbour", "harbor", "hafen", "turning torso", "turning"]],
  ["hyllie", ["hyllie", "arena", "malmo arena", "congress"]],
  ["pool", ["pool", "simning", "swim", "schwimmbad", "simbassang"]],
  ["spa", ["spa", "wellness", "avkoppling", "relax", "massage", "wellnes"]],
  ["frukost", ["frukost", "frukostingår", "breakfast", "fruhstuck", "mat ingår", "halfpension"]],
  ["gym", ["gym", "fitness", "traning", "tranas", "fitnesscenter", "sport"]],
  ["parkering", ["parkering", "bil", "parkera", "parking", "parken"]],
  ["restaurang", ["restaurang", "restaurant", "mat", "middag", "dinner", "essen"]],
  ["bar", ["bar", "dryck", "cocktail", "drink"]],
  ["familj", ["familj", "barn", "family", "kids", "kinder", "barnvanlig", "barnvänlig"]],
  ["romantik", ["romantik", "romantisk", "par", "romantic", "romantisch", "parresa", "brollop", "bröllop"]],
  ["business", ["business", "affar", "affärs", "konferens", "congress", "mote", "geschaft"]],
  ["budget", ["budget", "billig", "billiga", "cheap", "gunstig", "prisvärd", "spara", "ekonomi"]],
  ["lyx", ["lyx", "lyxig", "luxury", "luxus", "exklusiv", "premium", "fin", "finest"]],
  ["design", ["design", "modern", "trendig", "hip", "stylish", "stilren", "boutique"]],
  ["historisk", ["historisk", "history", "historic", "gammalt", "historisch", "charme", "charm"]],
  ["lagenhet", ["lagenhet", "lägenhet", "apartment", "studio", "kok", "kök", "kuchenette", "boende"]],
  ["stars5", ["5 stjarnor", "5 stjärnor", "5 stars", "5 sterne", "femstjarnigt", "lyxhotell"]],
  ["stars4", ["4 stjarnor", "4 stjärnor", "4 stars", "4 sterne", "fyrstjarnigt"]],
  ["stars3", ["3 stjarnor", "3 stjärnor", "3 stars", "3 sterne", "trestjarnigt"]],
  ["stars2", ["2 stjarnor", "2 stjärnor", "2 stars", "2 sterne", "vandrarhem", "hostel"]],
  ["scandic", ["scandic"]],
  ["elite", ["elite"]],
  ["radisson", ["radisson", "blu"]],
  ["marriott", ["marriott", "renaissance", "ac hotel"]],
  ["clarion", ["clarion", "nordic choice"]],
];

const TERM_TO_KEY: Record<string, string> = {};
for (const [key, terms] of SEARCH_TAGS) {
  for (const t of terms) TERM_TO_KEY[norm(t)] = key;
}

function hotelKeys(h: Hotel): string[] {
  const keys = new Set<string>();
  keys.add(norm(h.area).replace(/\s+/g, "_"));
  keys.add(`stars${h.stars}`);
  if (h.travelerType === "family") keys.add("familj");
  if (h.travelerType === "romantic") keys.add("romantik");
  if (h.travelerType === "business") keys.add("business");
  if (h.travelerType === "budget") keys.add("budget");
  for (const tag of h.tags) {
    const n = norm(tag);
    if (n.includes("pool")) keys.add("pool");
    if (n.includes("spa")) keys.add("spa");
    if (n.includes("frukost")) keys.add("frukost");
    if (n.includes("gym")) keys.add("gym");
    if (n.includes("parkering")) keys.add("parkering");
    if (n.includes("restaurang")) keys.add("restaurang");
    if (n.includes("bar")) keys.add("bar");
    if (n.includes("familj")) keys.add("familj");
    if (n.includes("lyx")) keys.add("lyx");
    if (n.includes("design")) keys.add("design");
    if (n.includes("historisk")) keys.add("historisk");
    if (n.includes("lagenhet") || n.includes("kok")) keys.add("lagenhet");
    if (n.includes("budget") || n.includes("vandrarhem")) keys.add("budget");
  }
  const nn = norm(h.name);
  if (nn.includes("scandic")) keys.add("scandic");
  if (nn.includes("elite")) keys.add("elite");
  if (nn.includes("radisson")) keys.add("radisson");
  if (nn.includes("renaissance") || nn.includes("marriott") || nn.includes("ac hotel")) keys.add("marriott");
  if (nn.includes("clarion")) keys.add("clarion");
  if (h.stars === 5 || h.travelerType === "romantic" && h.pricePerNight > 1500) keys.add("lyx");
  return [...keys];
}

function expandQuery(q: string): string[] {
  const key = TERM_TO_KEY[q];
  return key ? [key] : [q];
}

// ─── Translations ─────────────────────────────────────────────────────────────
const T = {
  sv: {
    title: "Hitta", em: "ditt hotell",
    sub: (n: number) => `${n} hotell i Malmö — jämför pris, stjärnor och gästrecensioner.`,
    search: "Sök hotell, område eller faciliteter…",
    area: "Område", allAreas: "Alla områden",
    stars: "Stjärnor", allStars: "Alla",
    rating: "Gästrecension", allRatings: "Alla betyg",
    traveler: "Resenärstyp", allTravelers: "Alla resenärer",
    sort: "Sortera", popular: "Populärast", priceAsc: "Lägsta pris", priceDesc: "Högsta pris", ratingSort: "Bäst betyg",
    filter: "Filter",
    showing: (a: number, b: number, t: number) => `Visar ${a}–${b} av ${t} hotell`,
    perNight: "/ natt",
    book: "Visa",
    reset: "Rensa",
    empty: "Inga hotell matchar dina filter.",
    prev: "Föregående", next: "Nästa",
    travelerBusiness: "Affärsresenär",
    travelerFamily: "Familj",
    travelerRomantic: "Par/Romantik",
    travelerBudget: "Budget",
    reviews: (n: number) => `${n} recensioner`,
    areas: {
      centrum: "Centrum", gamla_stan: "Gamla stan",
      vastra_hamnen: "Västra hamnen", hyllie: "Hyllie",
    },
  },
  en: {
    title: "Find", em: "your hotel",
    sub: (n: number) => `${n} hotels in Malmö — compare price, stars and guest reviews.`,
    search: "Search hotel, area or facilities…",
    area: "Area", allAreas: "All areas",
    stars: "Stars", allStars: "All",
    rating: "Guest rating", allRatings: "All ratings",
    traveler: "Traveler type", allTravelers: "All travelers",
    sort: "Sort", popular: "Most popular", priceAsc: "Lowest price", priceDesc: "Highest price", ratingSort: "Best rated",
    filter: "Filter",
    showing: (a: number, b: number, t: number) => `Showing ${a}–${b} of ${t} hotels`,
    perNight: "/ night",
    book: "View",
    reset: "Reset",
    empty: "No hotels match your filters.",
    prev: "Previous", next: "Next",
    travelerBusiness: "Business",
    travelerFamily: "Family",
    travelerRomantic: "Couples",
    travelerBudget: "Budget",
    reviews: (n: number) => `${n} reviews`,
    areas: {
      centrum: "City Centre", gamla_stan: "Old Town",
      vastra_hamnen: "Western Harbour", hyllie: "Hyllie",
    },
  },
  de: {
    title: "Finde", em: "dein Hotel",
    sub: (n: number) => `${n} Hotels in Malmö — Preise, Sterne und Gästebewertungen vergleichen.`,
    search: "Hotel, Lage oder Ausstattung suchen…",
    area: "Lage", allAreas: "Alle Lagen",
    stars: "Sterne", allStars: "Alle",
    rating: "Gästebewertung", allRatings: "Alle Bewertungen",
    traveler: "Reiseart", allTravelers: "Alle Reisenden",
    sort: "Sortieren", popular: "Beliebteste", priceAsc: "Günstigste", priceDesc: "Teuerste", ratingSort: "Beste Bewertung",
    filter: "Filter",
    showing: (a: number, b: number, t: number) => `Zeige ${a}–${b} von ${t} Hotels`,
    perNight: "/ Nacht",
    book: "Ansehen",
    reset: "Zurücksetzen",
    empty: "Keine Hotels entsprechen deinen Filtern.",
    prev: "Zurück", next: "Weiter",
    travelerBusiness: "Geschäftsreisende",
    travelerFamily: "Familie",
    travelerRomantic: "Paare",
    travelerBudget: "Budget",
    reviews: (n: number) => `${n} Bewertungen`,
    areas: {
      centrum: "Stadtzentrum", gamla_stan: "Altstadt",
      vastra_hamnen: "Westhafen", hyllie: "Hyllie",
    },
  },
};

const PER_PAGE = 12;
const AREAS = ["centrum", "gamla_stan", "vastra_hamnen", "hyllie"] as const;

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="13" height="13" viewBox="0 0 12 12" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1" aria-hidden="true">
      <path d="M6 1l1.39 2.82L10.5 4.27l-2.25 2.19.53 3.1L6 8l-2.78 1.56.53-3.1L1.5 4.27l3.11-.45z" />
    </svg>
  );
}

export default function HotellList() {
  const [lang, setLang] = useState<Lang>("sv");
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("all");
  const [minStars, setMinStars] = useState("all");
  const [minRating, setMinRating] = useState("all");
  const [traveler, setTraveler] = useState("all");
  const [sort, setSort] = useState("popular");
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
    if (area !== "all") list = list.filter(h => norm(h.area).replace(/\s+/g, "_") === area);
    if (minStars !== "all") list = list.filter(h => h.stars >= parseInt(minStars));
    if (minRating !== "all") list = list.filter(h => h.guestRating >= parseFloat(minRating));
    if (traveler !== "all") list = list.filter(h => h.travelerType === traveler);
    if (query.trim()) {
      const terms = query.trim().split(/\s+/).map(norm);
      list = list.filter(h => {
        const keys = hotelKeys(h);
        const fields = [norm(h.name), norm(h.area), ...h.tags.map(norm)].join(" ");
        return terms.every(term => {
          const resolved = expandQuery(term)[0];
          if (keys.includes(resolved)) return true;
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

  const areaLabels: Record<string, string> = t.areas;

  return (
    <main className="ht-page">
      {/* Hero */}
      <div className="upp-hero">
        <div className="upp-hero-inner">
          <h1 className="upp-hero-title">
            {t.title} <em className="upp-hero-em">{t.em}</em>
          </h1>
          <p className="upp-count">{t.sub(HOTELS.length)}</p>
        </div>
      </div>

      <div className="upp-layout">
        {/* Sökruta */}
        <div className="upp-search-wrap">
          <div className="upp-search">
            <svg width="16" height="16" viewBox="0 0 16 16" className="upp-search-icon" aria-hidden="true">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              placeholder={t.search}
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label={t.search}
            />
          </div>
          <button className="upp-filter-toggle-btn" onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {t.filter}
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d={filtersOpen ? "M2 10l6-6 6 6" : "M2 6l6 6 6-6"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Filter */}
        <section className={`upp-filters hb-filters${filtersOpen ? " mob-open" : ""}`} aria-label="Filter">
          <div className="upp-filter-group">
            <span className="upp-filter-label">{t.area}</span>
            <div className="upp-chips">
              <button className={`upp-chip${area === "all" ? " active" : ""}`} onClick={() => setArea("all")}>{t.allAreas}</button>
              {AREAS.map(a => (
                <button key={a} className={`upp-chip${area === a ? " active" : ""}`} onClick={() => setArea(a)}>
                  {areaLabels[a] ?? a}
                </button>
              ))}
            </div>
          </div>
          <div className="upp-filter-group">
            <span className="upp-filter-label">{t.stars}</span>
            <div className="upp-chips">
              <button className={`upp-chip${minStars === "all" ? " active" : ""}`} onClick={() => setMinStars("all")}>{t.allStars}</button>
              {["5", "4", "3", "2"].map(s => (
                <button key={s} className={`upp-chip${minStars === s ? " active" : ""}`} onClick={() => setMinStars(s)}>
                  {s}★
                </button>
              ))}
            </div>
          </div>
          <div className="upp-filter-group">
            <span className="upp-filter-label">{t.rating}</span>
            <div className="upp-chips">
              <button className={`upp-chip${minRating === "all" ? " active" : ""}`} onClick={() => setMinRating("all")}>{t.allRatings}</button>
              {[["9", "9+"], ["8.5", "8.5+"], ["8", "8+"]].map(([val, lbl]) => (
                <button key={val} className={`upp-chip${minRating === val ? " active" : ""}`} onClick={() => setMinRating(val)}>{lbl}</button>
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
          <div className="upp-filter-group">
            <span className="upp-filter-label">{t.sort}</span>
            <div className="upp-chips">
              <button className={`upp-chip${sort === "popular" ? " active" : ""}`} onClick={() => setSort("popular")}>{t.popular}</button>
              <button className={`upp-chip${sort === "price-asc" ? " active" : ""}`} onClick={() => setSort("price-asc")}>{t.priceAsc}</button>
              <button className={`upp-chip${sort === "price-desc" ? " active" : ""}`} onClick={() => setSort("price-desc")}>{t.priceDesc}</button>
              <button className={`upp-chip${sort === "rating" ? " active" : ""}`} onClick={() => setSort("rating")}>{t.ratingSort}</button>
            </div>
          </div>
          <button className="upp-reset" onClick={resetFilters}>{t.reset}</button>
        </section>

        {/* Räknare */}
        <div className="upp-count-row">
          <p className="upp-count">{t.showing((page - 1) * PER_PAGE + 1, Math.min(page * PER_PAGE, filtered.length), filtered.length)}</p>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <p className="ht-empty">{t.empty}</p>
        ) : (
          <section className="ht-grid">
            {paginated.map(h => (
              <a key={h.id} href={AFFILIATE} target="_blank" rel="noopener noreferrer sponsored" className="ht-card">
                <div className="ht-card-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={h.image} alt={h.name} className="ht-card-img" loading="lazy"
                    onError={e => { (e.target as HTMLImageElement).src = "https://images.trvl-media.com/lodging/1000000/20000/19300/19290/7d5d1e2d.jpg"; }} />
                  <span className="ht-card-rating-badge">
                    {h.guestRating.toFixed(1)}
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                      <path d="M6 1l1.39 2.82L10.5 4.27l-2.25 2.19.53 3.1L6 8l-2.78 1.56.53-3.1L1.5 4.27l3.11-.45z" />
                    </svg>
                  </span>
                </div>
                <div className="ht-card-body">
                  <div className="ht-card-meta">
                    <span className="ht-card-area">{h.area}</span>
                    <span className="ht-card-stars">
                      {Array.from({ length: 5 }, (_, i) => (
                        <StarIcon key={i} filled={i < h.stars} />
                      ))}
                    </span>
                  </div>
                  <h3 className="ht-card-title">{h.name}</h3>
                  <p className="ht-card-rating-label">{h.ratingLabel} · {t.reviews(h.reviewCount)}</p>
                  <div className="ht-card-tags">
                    {h.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="ht-card-tag">{tag}</span>
                    ))}
                  </div>
                  <div className="ht-card-footer">
                    <div className="ht-card-price-wrap">
                      <span className="ht-card-price">{h.pricePerNight.toLocaleString("sv-SE")} kr</span>
                      <span className="ht-card-price-unit">{t.perNight}</span>
                    </div>
                    <span className="hb-book-btn">{t.book}</span>
                  </div>
                </div>
              </a>
            ))}
          </section>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="upp-pagination" aria-label="Sidnavigation">
            <button className="upp-page-btn" onClick={() => goToPage(page - 1)} disabled={page === 1} aria-label={t.prev}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className={`upp-page-btn${page === p ? " active" : ""}`} onClick={() => goToPage(p)} aria-label={`Sida ${p}`} aria-current={page === p ? "page" : undefined}>{p}</button>
            ))}
            <button className="upp-page-btn" onClick={() => goToPage(page + 1)} disabled={page === totalPages} aria-label={t.next}>›</button>
          </nav>
        )}
      </div>
    </main>
  );
}
