export type CitySlug = "copenhagen-airport" | "malmo" | "malmo-airport" | "trelleborg";
export type CategorySlug = "boende" | "bil" | "transport";
export type PinMode = "popup" | "sidepanel";

export interface TravelCity {
  slug: CitySlug;
  name: { sv: string; en: string; de: string };
  tag: { sv: string; en: string; de: string };
  lat: number;
  lng: number;
  zoom: number;
  pinMode: PinMode;
}

export interface TravelOffer {
  id: string;
  city: CitySlug;
  category: CategorySlug;
  name: string;
  blurb: { sv: string; en: string; de: string };
  lat: number;
  lng: number;
  price: { sv: string; en: string; de: string };
  image: string;
  url: string;
}

export const REGION_BOUNDS: [[number, number], [number, number]] = [
  [55.20, 12.30],
  [55.80, 13.65],
];
export const REGION_CENTER: [number, number] = [55.55, 12.95];
export const REGION_ZOOM = 10;

export const CATEGORY_LABELS: Record<CategorySlug, { sv: string; en: string; de: string }> = {
  boende: { sv: "Boende", en: "Stays", de: "Unterkunft" },
  bil: { sv: "Bil", en: "Car", de: "Auto" },
  transport: { sv: "Transport", en: "Transport", de: "Transport" },
};

export const CATEGORY_ORDER: CategorySlug[] = ["boende", "bil", "transport"];

export const TRAVEL_CITIES: TravelCity[] = [
  {
    slug: "copenhagen-airport",
    name: { sv: "Copenhagen Airport", en: "Copenhagen Airport", de: "Flughafen Kopenhagen" },
    tag: { sv: "CPH · Kastrup", en: "CPH · Kastrup", de: "CPH · Kastrup" },
    lat: 55.6181,
    lng: 12.6562,
    zoom: 13,
    pinMode: "sidepanel",
  },
  {
    slug: "malmo",
    name: { sv: "Malmö Central", en: "Malmö Central", de: "Malmö Hauptbahnhof" },
    tag: { sv: "Malmö C", en: "Malmö C", de: "Malmö C" },
    lat: 55.6094,
    lng: 12.9989,
    zoom: 14,
    pinMode: "popup",
  },
  {
    slug: "malmo-airport",
    name: { sv: "Malmö Airport", en: "Malmö Airport", de: "Flughafen Malmö" },
    tag: { sv: "MMX · Sturup", en: "MMX · Sturup", de: "MMX · Sturup" },
    lat: 55.5299,
    lng: 13.3712,
    zoom: 13,
    pinMode: "popup",
  },
  {
    slug: "trelleborg",
    name: { sv: "Trelleborg", en: "Trelleborg", de: "Trelleborg" },
    tag: { sv: "Hamnen", en: "Port", de: "Hafen" },
    lat: 55.3744,
    lng: 13.1572,
    zoom: 13,
    pinMode: "popup",
  },
];

const IMG = {
  triangeln: "/images/triangeln-malmo.webp",
  torso: "/images/turning-torso-solnedgang.webp",
  kallbadhuset: "/images/kallbadhuset-malmo.webp",
  malmohus: "/images/malmohus-slott-malmo.webp",
  live: "/images/malmo-live.webp",
  bannern: "/images/bannern.webp",
} as const;

export const TRAVEL_OFFERS: TravelOffer[] = [
  // ─── Copenhagen Airport · Boende ─────────────────────────
  {
    id: "cph-boende-hilton",
    city: "copenhagen-airport",
    category: "boende",
    name: "Hilton Copenhagen Airport",
    blurb: {
      sv: "Direkt anslutet till Terminal 3 — gå till tåget på 4 minuter.",
      en: "Connected directly to Terminal 3 — four minutes to the train.",
      de: "Direkt mit Terminal 3 verbunden — vier Minuten zum Zug.",
    },
    lat: 55.6298,
    lng: 12.6489,
    price: { sv: "från 1 895 kr", en: "from 189 €", de: "ab 189 €" },
    image: IMG.live,
    url: "https://www.booking.com/searchresults.html?ss=Hilton+Copenhagen+Airport",
  },
  {
    id: "cph-boende-clarion",
    city: "copenhagen-airport",
    category: "boende",
    name: "Clarion Hotel Copenhagen Airport",
    blurb: {
      sv: "Stora rum, lugnt — populärt bland affärsresenärer.",
      en: "Spacious, quiet — favoured by business travellers.",
      de: "Geräumig, ruhig — bei Geschäftsreisenden beliebt.",
    },
    lat: 55.6322,
    lng: 12.6555,
    price: { sv: "från 1 495 kr", en: "from 149 €", de: "ab 149 €" },
    image: IMG.malmohus,
    url: "https://www.booking.com/searchresults.html?ss=Clarion+Copenhagen+Airport",
  },
  {
    id: "cph-boende-comfort",
    city: "copenhagen-airport",
    category: "boende",
    name: "Comfort Hotel Copenhagen Airport",
    blurb: {
      sv: "Smart prisvärt nära flygplatsen — gratis shuttle.",
      en: "Affordable near the airport — free shuttle service.",
      de: "Günstig in Flughafennähe — kostenloser Shuttle.",
    },
    lat: 55.6276,
    lng: 12.6537,
    price: { sv: "från 895 kr", en: "from 89 €", de: "ab 89 €" },
    image: IMG.bannern,
    url: "https://www.booking.com/searchresults.html?ss=Comfort+Copenhagen+Airport",
  },

  // ─── Copenhagen Airport · Bil ────────────────────────────
  {
    id: "cph-bil-hertz",
    city: "copenhagen-airport",
    category: "bil",
    name: "Hertz Copenhagen Airport",
    blurb: {
      sv: "Direkt på flygplatsen — biluthyrning hela dygnet.",
      en: "On-airport pickup — 24/7 rental desk.",
      de: "Direkt am Flughafen — 24/7 verfügbar.",
    },
    lat: 55.6312,
    lng: 12.6495,
    price: { sv: "från 549 kr/dag", en: "from 55 €/day", de: "ab 55 €/Tag" },
    image: IMG.kallbadhuset,
    url: "https://www.discovercars.com/denmark/copenhagen-airport-cph",
  },
  {
    id: "cph-bil-sixt",
    city: "copenhagen-airport",
    category: "bil",
    name: "Sixt Copenhagen Airport",
    blurb: {
      sv: "Premium-bilar och elbilar — snabb upphämtning.",
      en: "Premium cars and EVs — quick pickup.",
      de: "Premium-Wagen und E-Autos — schnelle Abholung.",
    },
    lat: 55.6307,
    lng: 12.6512,
    price: { sv: "från 695 kr/dag", en: "from 69 €/day", de: "ab 69 €/Tag" },
    image: IMG.torso,
    url: "https://www.discovercars.com/denmark/copenhagen-airport-cph",
  },
  {
    id: "cph-bil-avis",
    city: "copenhagen-airport",
    category: "bil",
    name: "Avis Copenhagen Airport",
    blurb: {
      sv: "Stort utbud, låga priser och fri av­bokning.",
      en: "Big fleet, low prices, free cancellation.",
      de: "Große Auswahl, faire Preise, kostenlose Stornierung.",
    },
    lat: 55.6312,
    lng: 12.6502,
    price: { sv: "från 425 kr/dag", en: "from 43 €/day", de: "ab 43 €/Tag" },
    image: IMG.triangeln,
    url: "https://www.discovercars.com/denmark/copenhagen-airport-cph",
  },

  // ─── Copenhagen Airport · Transport ──────────────────────
  {
    id: "cph-transport-dsb",
    city: "copenhagen-airport",
    category: "transport",
    name: "Öresundståget · CPH → Malmö",
    blurb: {
      sv: "20 min direkt till Malmö C, avgång var 10:e minut.",
      en: "20 min direct to Malmö C, every 10 minutes.",
      de: "20 min direkt nach Malmö C, alle 10 Minuten.",
    },
    lat: 55.6304,
    lng: 12.6526,
    price: { sv: "från 120 kr", en: "from 12 €", de: "ab 12 €" },
    image: IMG.live,
    url: "https://www.skanetrafiken.se/biljetter/oresundstaget/",
  },
  {
    id: "cph-transport-flixbus",
    city: "copenhagen-airport",
    category: "transport",
    name: "FlixBus · CPH → Malmö",
    blurb: {
      sv: "45 min med direktbuss — wifi och eluttag ombord.",
      en: "45 min direct bus — wifi and outlets onboard.",
      de: "45 min Direktbus — WLAN und Steckdosen an Bord.",
    },
    lat: 55.6289,
    lng: 12.6548,
    price: { sv: "från 89 kr", en: "from 9 €", de: "ab 9 €" },
    image: IMG.bannern,
    url: "https://www.flixbus.se/buss/koepenhamns-flygplats/malmoe",
  },
  {
    id: "cph-transport-taxi",
    city: "copenhagen-airport",
    category: "transport",
    name: "Privat transfer · CPH → hotell",
    blurb: {
      sv: "Förbokad bil direkt till hotellet — 30 min.",
      en: "Pre-booked car door-to-door — 30 min.",
      de: "Vorgebuchter Wagen bis zum Hotel — 30 min.",
    },
    lat: 55.6298,
    lng: 12.6510,
    price: { sv: "från 895 kr", en: "from 89 €", de: "ab 89 €" },
    image: IMG.kallbadhuset,
    url: "#",
  },

  // ─── Malmö · Boende ──────────────────────────────────────
  {
    id: "mma-boende-scandic-triangeln",
    city: "malmo",
    category: "boende",
    name: "Scandic Triangeln",
    blurb: {
      sv: "20 våningar mitt i centrum — utsikt över hela staden.",
      en: "Twenty floors in the city centre — sweeping views.",
      de: "Zwanzig Stockwerke mitten in der Stadt — weite Aussicht.",
    },
    lat: 55.5915,
    lng: 13.0048,
    price: { sv: "från 1 295 kr", en: "from 129 €", de: "ab 129 €" },
    image: IMG.triangeln,
    url: "https://www.booking.com/searchresults.html?ss=Scandic+Triangeln+Malm%C3%B6",
  },
  {
    id: "mma-boende-story",
    city: "malmo",
    category: "boende",
    name: "Story Hotel Studio Malmö",
    blurb: {
      sv: "Designhotell i gamla skeppshandeln — boutique-känsla.",
      en: "Design hotel in the old chandlery — boutique feel.",
      de: "Designhotel im alten Schiffshandel — Boutique-Feeling.",
    },
    lat: 55.6055,
    lng: 13.0006,
    price: { sv: "från 1 595 kr", en: "from 159 €", de: "ab 159 €" },
    image: IMG.malmohus,
    url: "https://www.booking.com/searchresults.html?ss=Story+Hotel+Studio+Malm%C3%B6",
  },
  {
    id: "mma-boende-clarion-live",
    city: "malmo",
    category: "boende",
    name: "Clarion Hotel Malmö Live",
    blurb: {
      sv: "Vid kanalen, 25 våningar — sky bar med 360°-utsikt.",
      en: "Canal-side, 25 floors — sky bar with 360° views.",
      de: "Am Kanal, 25 Stockwerke — Sky Bar mit 360°-Blick.",
    },
    lat: 55.6101,
    lng: 12.9961,
    price: { sv: "från 1 695 kr", en: "from 169 €", de: "ab 169 €" },
    image: IMG.live,
    url: "https://www.booking.com/searchresults.html?ss=Clarion+Malm%C3%B6+Live",
  },

  // ─── Malmö · Bil ─────────────────────────────────────────
  {
    id: "mma-bil-hertz",
    city: "malmo",
    category: "bil",
    name: "Hertz Malmö Centralstation",
    blurb: {
      sv: "Hämta bilen direkt vid tåget — öppet alla dagar.",
      en: "Pick up at the station — open every day.",
      de: "Abholung am Bahnhof — täglich geöffnet.",
    },
    lat: 55.6094,
    lng: 12.9999,
    price: { sv: "från 495 kr/dag", en: "from 49 €/day", de: "ab 49 €/Tag" },
    image: IMG.bannern,
    url: "https://www.discovercars.com/sweden/malmo",
  },
  {
    id: "mma-bil-europcar",
    city: "malmo",
    category: "bil",
    name: "Europcar Malmö C",
    blurb: {
      sv: "Familjebilar och kombi — låg startavgift.",
      en: "Family cars and estates — low base fee.",
      de: "Familienwagen und Kombis — niedrige Grundgebühr.",
    },
    lat: 55.6088,
    lng: 12.9997,
    price: { sv: "från 445 kr/dag", en: "from 44 €/day", de: "ab 44 €/Tag" },
    image: IMG.torso,
    url: "https://www.discovercars.com/sweden/malmo",
  },
  {
    id: "mma-bil-sixt",
    city: "malmo",
    category: "bil",
    name: "Sixt Malmö C",
    blurb: {
      sv: "Premium och elbilar — uthyrning över helger.",
      en: "Premium and EVs — weekend rentals.",
      de: "Premium und E-Autos — Wochenend-Mieten.",
    },
    lat: 55.6090,
    lng: 13.0010,
    price: { sv: "från 595 kr/dag", en: "from 59 €/day", de: "ab 59 €/Tag" },
    image: IMG.kallbadhuset,
    url: "https://www.discovercars.com/sweden/malmo",
  },

  // ─── Malmö · Transport ───────────────────────────────────
  {
    id: "mma-transport-skanetrafiken",
    city: "malmo",
    category: "transport",
    name: "Skånetrafiken · stadsbuss & spårvagn",
    blurb: {
      sv: "Hela Malmö i appen — köp enkelbiljett eller dygn.",
      en: "All of Malmö in the app — single tickets or 24h.",
      de: "Ganz Malmö in der App — Einzelfahrt oder Tagesticket.",
    },
    lat: 55.6094,
    lng: 12.9989,
    price: { sv: "från 28 kr", en: "from 3 €", de: "ab 3 €" },
    image: IMG.triangeln,
    url: "https://www.skanetrafiken.se/biljetter/",
  },
  {
    id: "mma-transport-flixbus",
    city: "malmo",
    category: "transport",
    name: "FlixBus Malmö C",
    blurb: {
      sv: "Avgångar mot Stockholm, Berlin, Hamburg dagligen.",
      en: "Departures to Stockholm, Berlin, Hamburg daily.",
      de: "Tägliche Abfahrten nach Stockholm, Berlin, Hamburg.",
    },
    lat: 55.6086,
    lng: 12.9996,
    price: { sv: "från 195 kr", en: "from 19 €", de: "ab 19 €" },
    image: IMG.malmohus,
    url: "https://www.flixbus.se/buss/malmoe",
  },
  {
    id: "mma-transport-snalltaget",
    city: "malmo",
    category: "transport",
    name: "Snälltåget · Stockholm → Malmö",
    blurb: {
      sv: "Direkttåg från Stockholm — wifi och bistro ombord.",
      en: "Direct train from Stockholm — wifi and bistro.",
      de: "Direktzug aus Stockholm — WLAN und Bistro.",
    },
    lat: 55.6094,
    lng: 12.9989,
    price: { sv: "från 295 kr", en: "from 29 €", de: "ab 29 €" },
    image: IMG.live,
    url: "https://www.snalltaget.se/",
  },

  // ─── Malmö Airport (Sturup) · Boende ─────────────────────
  {
    id: "mmx-boende-aviator",
    city: "malmo-airport",
    category: "boende",
    name: "Best Western Malmö Airport Hotel",
    blurb: {
      sv: "Närmast Sturup — gratis flygplatsshuttle dygnet runt.",
      en: "Closest to Sturup — free 24h airport shuttle.",
      de: "Nächstgelegen zu Sturup — gratis Flughafenshuttle.",
    },
    lat: 55.5325,
    lng: 13.3641,
    price: { sv: "från 995 kr", en: "from 99 €", de: "ab 99 €" },
    image: IMG.bannern,
    url: "https://www.booking.com/searchresults.html?ss=Malm%C3%B6+Airport+Hotel",
  },
  {
    id: "mmx-boende-skogshojd",
    city: "malmo-airport",
    category: "boende",
    name: "Hotell Skogshöjd Svedala",
    blurb: {
      sv: "Lugnt i Svedala — 8 minuter från Sturup.",
      en: "Quiet in Svedala — eight minutes from Sturup.",
      de: "Ruhig in Svedala — acht Minuten vom Sturup.",
    },
    lat: 55.5048,
    lng: 13.2331,
    price: { sv: "från 845 kr", en: "from 84 €", de: "ab 84 €" },
    image: IMG.kallbadhuset,
    url: "https://www.booking.com/searchresults.html?ss=Skogsh%C3%B6jd+Svedala",
  },
  {
    id: "mmx-boende-temperance",
    city: "malmo-airport",
    category: "boende",
    name: "Clarion Collection Hotel Temperance",
    blurb: {
      sv: "I Malmö centrum — 25 min till flygplatsen med bil.",
      en: "Malmö centre — 25 min to airport by car.",
      de: "Im Zentrum von Malmö — 25 min mit dem Auto.",
    },
    lat: 55.6045,
    lng: 13.0029,
    price: { sv: "från 1 195 kr", en: "from 119 €", de: "ab 119 €" },
    image: IMG.triangeln,
    url: "https://www.booking.com/searchresults.html?ss=Temperance+Malm%C3%B6",
  },

  // ─── Malmö Airport (Sturup) · Bil ────────────────────────
  {
    id: "mmx-bil-avis",
    city: "malmo-airport",
    category: "bil",
    name: "Avis Malmö Airport",
    blurb: {
      sv: "Direkt vid ankomsthallen — pickup på 5 minuter.",
      en: "At the arrivals hall — five-minute pickup.",
      de: "An der Ankunftshalle — fünf Minuten Abholung.",
    },
    lat: 55.5316,
    lng: 13.3715,
    price: { sv: "från 475 kr/dag", en: "from 47 €/day", de: "ab 47 €/Tag" },
    image: IMG.torso,
    url: "https://www.discovercars.com/sweden/malmo-airport-mmx",
  },
  {
    id: "mmx-bil-sixt",
    city: "malmo-airport",
    category: "bil",
    name: "Sixt Malmö Airport",
    blurb: {
      sv: "Premium-flotta direkt på flygplatsen.",
      en: "Premium fleet on-airport.",
      de: "Premium-Flotte am Flughafen.",
    },
    lat: 55.5320,
    lng: 13.3725,
    price: { sv: "från 625 kr/dag", en: "from 62 €/day", de: "ab 62 €/Tag" },
    image: IMG.malmohus,
    url: "https://www.discovercars.com/sweden/malmo-airport-mmx",
  },
  {
    id: "mmx-bil-hertz",
    city: "malmo-airport",
    category: "bil",
    name: "Hertz Malmö Airport",
    blurb: {
      sv: "Stort utbud familjebilar och SUV — fri av­bokning.",
      en: "Family cars and SUVs — free cancellation.",
      de: "Familienwagen und SUVs — kostenlose Stornierung.",
    },
    lat: 55.5310,
    lng: 13.3720,
    price: { sv: "från 545 kr/dag", en: "from 54 €/day", de: "ab 54 €/Tag" },
    image: IMG.live,
    url: "https://www.discovercars.com/sweden/malmo-airport-mmx",
  },

  // ─── Malmö Airport (Sturup) · Transport ──────────────────
  {
    id: "mmx-transport-flygbussarna",
    city: "malmo-airport",
    category: "transport",
    name: "Flygbussarna · Sturup → Malmö C",
    blurb: {
      sv: "45 min till Malmö C — koordinerat med varje flyg.",
      en: "45 min to Malmö C — meets every flight.",
      de: "45 min nach Malmö C — abgestimmt mit jedem Flug.",
    },
    lat: 55.5316,
    lng: 13.3712,
    price: { sv: "från 119 kr", en: "from 11 €", de: "ab 11 €" },
    image: IMG.bannern,
    url: "https://www.flygbussarna.se/malmoaviation",
  },
  {
    id: "mmx-transport-taxi",
    city: "malmo-airport",
    category: "transport",
    name: "Taxi Skåne · Sturup transfer",
    blurb: {
      sv: "Förbokat fastpris till hotell i Malmö.",
      en: "Pre-booked flat fare to Malmö hotels.",
      de: "Vorbuchung mit Festpreis zu Hotels in Malmö.",
    },
    lat: 55.5310,
    lng: 13.3705,
    price: { sv: "från 695 kr", en: "from 69 €", de: "ab 69 €" },
    image: IMG.kallbadhuset,
    url: "#",
  },
  {
    id: "mmx-transport-skanetrafiken",
    city: "malmo-airport",
    category: "transport",
    name: "Skånetrafiken Pågatåg",
    blurb: {
      sv: "Tåg från Svedala — billigast om du har tid.",
      en: "Train via Svedala — cheapest if you have time.",
      de: "Zug über Svedala — günstig, wenn Sie Zeit haben.",
    },
    lat: 55.5305,
    lng: 13.3710,
    price: { sv: "från 65 kr", en: "from 6 €", de: "ab 6 €" },
    image: IMG.triangeln,
    url: "https://www.skanetrafiken.se/biljetter/",
  },

  // ─── Trelleborg · Boende ─────────────────────────────────
  {
    id: "tre-boende-continental",
    city: "trelleborg",
    category: "boende",
    name: "Hotel Continental Trelleborg",
    blurb: {
      sv: "Vid hamnen — perfekt vid färjeavgång till Tyskland.",
      en: "By the port — ideal for ferries to Germany.",
      de: "Am Hafen — ideal für Fähren nach Deutschland.",
    },
    lat: 55.3756,
    lng: 13.1567,
    price: { sv: "från 945 kr", en: "from 94 €", de: "ab 94 €" },
    image: IMG.malmohus,
    url: "https://www.booking.com/searchresults.html?ss=Hotel+Continental+Trelleborg",
  },
  {
    id: "tre-boende-horisont",
    city: "trelleborg",
    category: "boende",
    name: "Hotell Horisont",
    blurb: {
      sv: "Modernt, lugnt — havsutsikt från övre våningarna.",
      en: "Modern, quiet — sea views from upper floors.",
      de: "Modern, ruhig — Meerblick von oberen Etagen.",
    },
    lat: 55.3782,
    lng: 13.1502,
    price: { sv: "från 1 095 kr", en: "from 109 €", de: "ab 109 €" },
    image: IMG.torso,
    url: "https://www.booking.com/searchresults.html?ss=Horisont+Trelleborg",
  },
  {
    id: "tre-boende-aktiv",
    city: "trelleborg",
    category: "boende",
    name: "Hotel Aktiv Trelleborg",
    blurb: {
      sv: "Familjedrivet, nära centrum — stora rum.",
      en: "Family-run, near centre — spacious rooms.",
      de: "Familiengeführt, zentral — große Zimmer.",
    },
    lat: 55.3733,
    lng: 13.1545,
    price: { sv: "från 745 kr", en: "from 74 €", de: "ab 74 €" },
    image: IMG.live,
    url: "https://www.booking.com/searchresults.html?ss=Hotel+Aktiv+Trelleborg",
  },

  // ─── Trelleborg · Bil ────────────────────────────────────
  {
    id: "tre-bil-hertz",
    city: "trelleborg",
    category: "bil",
    name: "Hertz Trelleborg",
    blurb: {
      sv: "Plocka upp efter färjan — bilar i alla storlekar.",
      en: "Pickup after the ferry — all car sizes.",
      de: "Abholung nach der Fähre — alle Wagengrößen.",
    },
    lat: 55.3760,
    lng: 13.1580,
    price: { sv: "från 425 kr/dag", en: "from 42 €/day", de: "ab 42 €/Tag" },
    image: IMG.bannern,
    url: "https://www.discovercars.com/sweden/trelleborg",
  },
  {
    id: "tre-bil-europcar",
    city: "trelleborg",
    category: "bil",
    name: "Europcar Trelleborg",
    blurb: {
      sv: "Direkt vid hamnen — perfekt för Skåne-rundtur.",
      en: "Right by the port — ideal for a Skåne tour.",
      de: "Direkt am Hafen — ideal für eine Skåne-Tour.",
    },
    lat: 55.3744,
    lng: 13.1572,
    price: { sv: "från 395 kr/dag", en: "from 39 €/day", de: "ab 39 €/Tag" },
    image: IMG.kallbadhuset,
    url: "https://www.discovercars.com/sweden/trelleborg",
  },
  {
    id: "tre-bil-sixt",
    city: "trelleborg",
    category: "bil",
    name: "Sixt Trelleborg",
    blurb: {
      sv: "Premium-bilar — boka i förväg, lämna i Malmö.",
      en: "Premium cars — book ahead, return in Malmö.",
      de: "Premium-Wagen — vorbuchen, in Malmö abgeben.",
    },
    lat: 55.3735,
    lng: 13.1561,
    price: { sv: "från 575 kr/dag", en: "from 57 €/day", de: "ab 57 €/Tag" },
    image: IMG.triangeln,
    url: "https://www.discovercars.com/sweden/trelleborg",
  },

  // ─── Trelleborg · Transport ──────────────────────────────
  {
    id: "tre-transport-stena",
    city: "trelleborg",
    category: "transport",
    name: "Stena Line · Trelleborg → Rostock",
    blurb: {
      sv: "Färja till Tyskland — 6 timmar med restaurang ombord.",
      en: "Ferry to Germany — six hours with onboard dining.",
      de: "Fähre nach Deutschland — sechs Stunden mit Restaurant.",
    },
    lat: 55.3744,
    lng: 13.1572,
    price: { sv: "från 295 kr", en: "from 29 €", de: "ab 29 €" },
    image: IMG.malmohus,
    url: "https://www.stenaline.se/rutter/trelleborg-rostock",
  },
  {
    id: "tre-transport-ttline",
    city: "trelleborg",
    category: "transport",
    name: "TT-Line · Trelleborg → Travemünde",
    blurb: {
      sv: "Nattfärja till Lübeck — sov över på sjön.",
      en: "Overnight ferry to Lübeck — sleep on the sea.",
      de: "Nachtfähre nach Lübeck — auf See übernachten.",
    },
    lat: 55.3739,
    lng: 13.1575,
    price: { sv: "från 385 kr", en: "from 38 €", de: "ab 38 €" },
    image: IMG.torso,
    url: "https://www.ttline.com/sv/sweden/",
  },
  {
    id: "tre-transport-flixbus",
    city: "trelleborg",
    category: "transport",
    name: "Flixbus · Trelleborg → Malmö",
    blurb: {
      sv: "30 min direktbuss — koordinerat med färjeankomster.",
      en: "30 min direct bus — meets ferry arrivals.",
      de: "30 min Direktbus — passt zu Fährankünften.",
    },
    lat: 55.3756,
    lng: 13.1567,
    price: { sv: "från 95 kr", en: "from 9 €", de: "ab 9 €" },
    image: IMG.live,
    url: "https://www.flixbus.se/buss/trelleborg",
  },
];

export function getCity(slug: string): TravelCity | undefined {
  return TRAVEL_CITIES.find((c) => c.slug === slug);
}

export function getOffers(city: CitySlug, category: CategorySlug): TravelOffer[] {
  return TRAVEL_OFFERS.filter((o) => o.city === city && o.category === category);
}

export function getAllRoutes(): { stad: CitySlug; kategori: CategorySlug }[] {
  const routes: { stad: CitySlug; kategori: CategorySlug }[] = [];
  for (const city of TRAVEL_CITIES) {
    for (const cat of CATEGORY_ORDER) {
      routes.push({ stad: city.slug, kategori: cat });
    }
  }
  return routes;
}

export function isCitySlug(s: string): s is CitySlug {
  return TRAVEL_CITIES.some((c) => c.slug === s);
}

export function isCategorySlug(s: string): s is CategorySlug {
  return CATEGORY_ORDER.includes(s as CategorySlug);
}
