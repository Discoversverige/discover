"use client";

import { useMemo, useState, useEffect } from "react";

type Lang = "sv" | "en" | "de";
type Location = "all" | "airport" | "city";
type SortKey = "popular" | "price-asc" | "price-desc" | "rating";

const AFFILIATE_BASE = "https://www.discovercars.com/se/sweden/malm";
const AFFILIATE_PARAM = "?a_aid=affiliateid&currency=sek";
const AFFILIATE_AIRPORT = "https://www.discovercars.com/se/sweden/malm/mmx" + AFFILIATE_PARAM;
const AFFILIATE_CITY = AFFILIATE_BASE + AFFILIATE_PARAM;

interface Car {
  id: string;
  name: string;
  category: string;
  supplier: string;
  supplierRating: number;
  supplierReviews: number;
  location: "airport" | "city";
  pricePerDay: number;
  seats: number;
  doors: number;
  transmission: "Automat" | "Manuell";
  fuelPolicy: string;
  mileage: string;
  freeCancellation: boolean;
  image: string;
  badge?: string;
}

const CARS: Car[] = [
  {
    id: "1",
    name: "VW Polo eller liknande",
    category: "Liten",
    supplier: "Sixt",
    supplierRating: 8.4,
    supplierReviews: 1243,
    location: "airport",
    pricePerDay: 389,
    seats: 5,
    doors: 4,
    transmission: "Manuell",
    fuelPolicy: "Full till full",
    mileage: "Obegränsad",
    freeCancellation: true,
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&q=80",
    badge: "Populärast",
  },
  {
    id: "2",
    name: "Ford Focus eller liknande",
    category: "Mellanstor",
    supplier: "Europcar",
    supplierRating: 7.9,
    supplierReviews: 892,
    location: "airport",
    pricePerDay: 449,
    seats: 5,
    doors: 4,
    transmission: "Automat",
    fuelPolicy: "Full till full",
    mileage: "Obegränsad",
    freeCancellation: true,
    image: "https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=600&q=80",
  },
  {
    id: "3",
    name: "Toyota Yaris eller liknande",
    category: "Liten",
    supplier: "Hertz",
    supplierRating: 8.1,
    supplierReviews: 2104,
    location: "city",
    pricePerDay: 359,
    seats: 5,
    doors: 4,
    transmission: "Automat",
    fuelPolicy: "Full till full",
    mileage: "Obegränsad",
    freeCancellation: true,
    image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=600&q=80",
    badge: "Bästa värde",
  },
  {
    id: "4",
    name: "BMW 3-serie eller liknande",
    category: "Premium",
    supplier: "Sixt",
    supplierRating: 8.4,
    supplierReviews: 1243,
    location: "airport",
    pricePerDay: 799,
    seats: 5,
    doors: 4,
    transmission: "Automat",
    fuelPolicy: "Full till full",
    mileage: "Obegränsad",
    freeCancellation: true,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80",
  },
  {
    id: "5",
    name: "Skoda Octavia eller liknande",
    category: "Mellanstor",
    supplier: "Budget",
    supplierRating: 7.6,
    supplierReviews: 541,
    location: "city",
    pricePerDay: 419,
    seats: 5,
    doors: 4,
    transmission: "Manuell",
    fuelPolicy: "Full till full",
    mileage: "Obegränsad",
    freeCancellation: false,
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&q=80",
  },
  {
    id: "6",
    name: "Mercedes-Benz A-klass eller liknande",
    category: "Premium",
    supplier: "Europcar",
    supplierRating: 7.9,
    supplierReviews: 892,
    location: "city",
    pricePerDay: 699,
    seats: 5,
    doors: 4,
    transmission: "Automat",
    fuelPolicy: "Full till full",
    mileage: "Obegränsad",
    freeCancellation: true,
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80",
  },
  {
    id: "7",
    name: "Volvo XC60 eller liknande",
    category: "SUV",
    supplier: "Hertz",
    supplierRating: 8.1,
    supplierReviews: 2104,
    location: "airport",
    pricePerDay: 849,
    seats: 5,
    doors: 5,
    transmission: "Automat",
    fuelPolicy: "Full till full",
    mileage: "Obegränsad",
    freeCancellation: true,
    image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=600&q=80",
    badge: "Toppval",
  },
  {
    id: "8",
    name: "Kia Sportage eller liknande",
    category: "SUV",
    supplier: "Avis",
    supplierRating: 8.6,
    supplierReviews: 3217,
    location: "city",
    pricePerDay: 649,
    seats: 5,
    doors: 5,
    transmission: "Automat",
    fuelPolicy: "Full till full",
    mileage: "Obegränsad",
    freeCancellation: true,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80",
  },
  {
    id: "9",
    name: "Seat Ibiza eller liknande",
    category: "Liten",
    supplier: "Avis",
    supplierRating: 8.6,
    supplierReviews: 3217,
    location: "city",
    pricePerDay: 329,
    seats: 5,
    doors: 4,
    transmission: "Manuell",
    fuelPolicy: "Full till full",
    mileage: "Obegränsad",
    freeCancellation: true,
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80",
    badge: "Lägsta pris",
  },
  {
    id: "10",
    name: "Toyota RAV4 Hybrid eller liknande",
    category: "SUV",
    supplier: "Sixt",
    supplierRating: 8.4,
    supplierReviews: 1243,
    location: "airport",
    pricePerDay: 929,
    seats: 5,
    doors: 5,
    transmission: "Automat",
    fuelPolicy: "Full till full",
    mileage: "Obegränsad",
    freeCancellation: true,
    image: "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=600&q=80",
  },
  {
    id: "11",
    name: "VW Passat eller liknande",
    category: "Stor",
    supplier: "Budget",
    supplierRating: 7.6,
    supplierReviews: 541,
    location: "airport",
    pricePerDay: 559,
    seats: 5,
    doors: 4,
    transmission: "Automat",
    fuelPolicy: "Full till full",
    mileage: "Obegränsad",
    freeCancellation: false,
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=600&q=80",
  },
  {
    id: "12",
    name: "Ford Kuga eller liknande",
    category: "SUV",
    supplier: "Europcar",
    supplierRating: 7.9,
    supplierReviews: 892,
    location: "city",
    pricePerDay: 729,
    seats: 5,
    doors: 5,
    transmission: "Automat",
    fuelPolicy: "Full till full",
    mileage: "Obegränsad",
    freeCancellation: true,
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=80",
  },
];

const CATEGORIES = ["Liten", "Mellanstor", "Stor", "SUV", "Premium"];
const SUPPLIERS = ["Sixt", "Europcar", "Hertz", "Avis", "Budget"];

const T = {
  sv: {
    title: "Hitta", em: "din hyrbil", sub: "Jämför hyrbilar från ledande företag i Malmö.",
    location: "Upphämtningsplats", allLocations: "Alla",
    airport: "Malmö Airport", city: "Malmö City",
    rating: "Betyg", allRatings: "Alla betyg",
    r8: "8+", r75: "7.5+", r7: "7+",
    supplier: "Biluthyrningsföretag", allSuppliers: "Alla",
    category: "Biltyp",
    sort: "Sortera", popular: "Populärast", priceAsc: "Lägsta pris", priceDesc: "Högsta pris", ratingSort: "Bäst betyg",
    filter: "Filter",
    showing: (n: number) => `${n} bilar`,
    perDay: "/dag",
    seats: "säten",
    transmission: "Växellåda",
    fuel: "Bränsleavgift",
    mileage: "Körsträcka",
    freeCancellation: "Fri avbokning",
    book: "Visa bil →",
    empty: "Inga bilar matchar dina filter.",
    reset: "Rensa filter",
    reviews: "recensioner",
  },
  en: {
    title: "Find", em: "your rental car", sub: "Compare rental cars from leading companies in Malmö.",
    location: "Pickup location", allLocations: "All",
    airport: "Malmö Airport", city: "Malmö City",
    rating: "Rating", allRatings: "All ratings",
    r8: "8+", r75: "7.5+", r7: "7+",
    supplier: "Car rental company", allSuppliers: "All",
    category: "Car type",
    sort: "Sort", popular: "Most popular", priceAsc: "Lowest price", priceDesc: "Highest price", ratingSort: "Best rating",
    filter: "Filter",
    showing: (n: number) => `${n} cars`,
    perDay: "/day",
    seats: "seats",
    transmission: "Transmission",
    fuel: "Fuel policy",
    mileage: "Mileage",
    freeCancellation: "Free cancellation",
    book: "View car →",
    empty: "No cars match your filters.",
    reset: "Clear filters",
    reviews: "reviews",
  },
  de: {
    title: "Finde", em: "dein Mietauto", sub: "Vergleiche Mietautos von führenden Unternehmen in Malmö.",
    location: "Abholort", allLocations: "Alle",
    airport: "Flughafen Malmö", city: "Malmö City",
    rating: "Bewertung", allRatings: "Alle",
    r8: "8+", r75: "7,5+", r7: "7+",
    supplier: "Autovermieter", allSuppliers: "Alle",
    category: "Fahrzeugtyp",
    sort: "Sortieren", popular: "Beliebteste", priceAsc: "Günstigster Preis", priceDesc: "Höchster Preis", ratingSort: "Beste Bewertung",
    filter: "Filter",
    showing: (n: number) => `${n} Autos`,
    perDay: "/Tag",
    seats: "Sitze",
    transmission: "Getriebe",
    fuel: "Kraftstoffpolitik",
    mileage: "Kilometerleistung",
    freeCancellation: "Kostenlose Stornierung",
    book: "Auto ansehen →",
    empty: "Keine Autos entsprechen Ihren Filtern.",
    reset: "Filter zurücksetzen",
    reviews: "Bewertungen",
  },
};

export default function HyraBilList() {
  const [lang, setLang] = useState<Lang>("sv");
  const [location, setLocation] = useState<Location>("all");
  const [minRating, setMinRating] = useState<string>("all");
  const [supplier, setSupplier] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("popular");
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

  const filtered = useMemo(() => {
    let list = CARS;
    if (location !== "all") list = list.filter((c) => c.location === location);
    if (minRating !== "all") list = list.filter((c) => c.supplierRating >= parseFloat(minRating));
    if (supplier !== "all") list = list.filter((c) => c.supplier === supplier);
    if (category !== "all") list = list.filter((c) => c.category === category);

    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.pricePerDay - b.pricePerDay);
    else if (sort === "price-desc") sorted.sort((a, b) => b.pricePerDay - a.pricePerDay);
    else if (sort === "rating") sorted.sort((a, b) => b.supplierRating - a.supplierRating);
    else sorted.sort((a, b) => b.supplierReviews - a.supplierReviews);

    return sorted;
  }, [location, minRating, supplier, category, sort]);

  const t = T[lang];

  const affiliateLink = (car: Car) =>
    car.location === "airport" ? AFFILIATE_AIRPORT : AFFILIATE_CITY;

  return (
    <div className="upp-page hb-page">
      <header className="upp-header">
        <div className="upp-header-inner">
          <h1 className="upp-title">
            {t.title} <em>{t.em}</em>
          </h1>
          <p className="upp-sub">{t.sub}</p>
        </div>
      </header>

      <div className="upp-mob-bar">
        <button
          className="upp-filter-toggle-btn"
          onClick={() => setFiltersOpen(!filtersOpen)}
          aria-expanded={filtersOpen}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {t.filter}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
            <path d={filtersOpen ? "M2 8l4-4 4 4" : "M2 4l4 4 4-4"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="upp-sort-pill">
          <span>{t.sort}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label={t.sort}>
            <option value="popular">{t.popular}</option>
            <option value="price-asc">{t.priceAsc}</option>
            <option value="price-desc">{t.priceDesc}</option>
            <option value="rating">{t.ratingSort}</option>
          </select>
        </div>
      </div>

      <section className={`upp-filters hb-filters${filtersOpen ? " mob-open" : ""}`} aria-label="Filter">
        <div className="upp-filter-group">
          <span className="upp-filter-label">{t.location}</span>
          <div className="upp-chips">
            {([["all", t.allLocations], ["airport", t.airport], ["city", t.city]] as [Location, string][]).map(([key, label]) => (
              <button key={key} className={`upp-chip${location === key ? " active" : ""}`} onClick={() => setLocation(key)}>
                {key === "airport" && <span className="hb-loc-icon">✈</span>}
                {key === "city" && <span className="hb-loc-icon">🏙</span>}
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="upp-filter-group">
          <span className="upp-filter-label">{t.rating}</span>
          <div className="upp-chips">
            {([["all", t.allRatings], ["8", t.r8], ["7.5", t.r75], ["7", t.r7]] as [string, string][]).map(([key, label]) => (
              <button key={key} className={`upp-chip${minRating === key ? " active" : ""}`} onClick={() => setMinRating(key)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="upp-filter-group">
          <span className="upp-filter-label">{t.supplier}</span>
          <div className="upp-chips">
            <button className={`upp-chip${supplier === "all" ? " active" : ""}`} onClick={() => setSupplier("all")}>{t.allSuppliers}</button>
            {SUPPLIERS.map((s) => (
              <button key={s} className={`upp-chip${supplier === s ? " active" : ""}`} onClick={() => setSupplier(s)}>{s}</button>
            ))}
          </div>
        </div>

        <div className="upp-filter-group">
          <span className="upp-filter-label">{t.category}</span>
          <div className="upp-chips">
            <button className={`upp-chip${category === "all" ? " active" : ""}`} onClick={() => setCategory("all")}>{t.allLocations}</button>
            {CATEGORIES.map((c) => (
              <button key={c} className={`upp-chip${category === c ? " active" : ""}`} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>
        </div>

        <div className="upp-filter-group upp-sort">
          <span className="upp-filter-label">{t.sort}</span>
          <div className="upp-sort-pill">
            <span>{t[sort === "popular" ? "popular" : sort === "price-asc" ? "priceAsc" : sort === "price-desc" ? "priceDesc" : "ratingSort"]}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label={t.sort}>
              <option value="popular">{t.popular}</option>
              <option value="price-asc">{t.priceAsc}</option>
              <option value="price-desc">{t.priceDesc}</option>
              <option value="rating">{t.ratingSort}</option>
            </select>
          </div>
        </div>
      </section>

      <div className="upp-count-row">
        <p className="upp-count">{t.showing(filtered.length)}</p>
      </div>

      {filtered.length === 0 ? (
        <div className="upp-empty">
          <p>{t.empty}</p>
          <button className="upp-reset" onClick={() => { setLocation("all"); setMinRating("all"); setSupplier("all"); setCategory("all"); }}>
            {t.reset}
          </button>
        </div>
      ) : (
        <section className="hb-grid">
          {filtered.map((car) => (
            <a
              key={car.id}
              href={affiliateLink(car)}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="hb-card"
            >
              <div className="hb-card-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={car.image} alt={car.name} className="hb-card-img" loading="lazy" />
                {car.badge && <span className="hb-card-badge">{car.badge}</span>}
                <span className={`hb-card-loc-tag ${car.location}`}>
                  {car.location === "airport" ? `✈ ${t.airport}` : `🏙 ${t.city}`}
                </span>
              </div>

              <div className="hb-card-body">
                <div className="hb-card-meta">
                  <span className="hb-card-category">{car.category}</span>
                  <span className="hb-card-supplier">{car.supplier}</span>
                </div>

                <h3 className="hb-card-title">{car.name}</h3>

                <div className="hb-card-specs">
                  <span>👥 {car.seats} {t.seats}</span>
                  <span>⚙️ {lang === "sv" ? car.transmission : car.transmission === "Automat" ? "Automatic" : "Manual"}</span>
                  <span>⛽ {car.fuelPolicy}</span>
                </div>

                <div className="hb-card-rating">
                  <span className="hb-rating-score">{car.supplierRating.toFixed(1)}</span>
                  <div className="hb-rating-bar">
                    <div className="hb-rating-fill" style={{ width: `${(car.supplierRating / 10) * 100}%` }} />
                  </div>
                  <span className="hb-rating-count">{car.supplierReviews.toLocaleString("sv-SE")} {t.reviews}</span>
                </div>

                <div className="hb-card-footer">
                  <div className="hb-card-price-wrap">
                    <span className="hb-card-price">{car.pricePerDay} kr</span>
                    <span className="hb-card-price-unit">{t.perDay}</span>
                  </div>
                  <div className="hb-card-cta">
                    {car.freeCancellation && (
                      <span className="hb-free-cancel">✓ {t.freeCancellation}</span>
                    )}
                    <span className="hb-book-btn">{t.book}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </section>
      )}

      <div className="hb-disclaimer">
        <p>Priser och tillgänglighet uppdateras kontinuerligt via Discover Cars. Klicka på en bil för att se aktuellt pris och boka.</p>
      </div>
    </div>
  );
}
