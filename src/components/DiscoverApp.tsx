"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { I18N, type Lang } from "@/lib/i18n";
import { ROUTES, type RouteKey } from "@/lib/routes";
import LeafletMap from "./LeafletMap";

const getInitialLang = (): Lang => {
  try {
    const saved = localStorage.getItem("dm-lang") as Lang;
    if (saved && I18N[saved]) return saved;
  } catch {}
  return "sv";
};

const getInitialView = () => {
  try {
    const saved = localStorage.getItem("dm-view");
    if (saved === "map" || saved === "home") return saved as "map" | "home";
  } catch {}
  return "home" as const;
};

const getInitialRoute = (): RouteKey => {
  try {
    const saved = localStorage.getItem("dm-route") as RouteKey;
    if (saved && ROUTES[saved]) return saved;
  } catch {}
  return "default";
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

const FlagSV = () => (
  <svg viewBox="0 0 16 10" width="16" height="10" aria-hidden="true">
    <rect width="16" height="10" fill="#006aa7" /><rect x="5" width="2" height="10" fill="#fecc00" /><rect y="4" width="16" height="2" fill="#fecc00" />
  </svg>
);
const FlagEN = () => (
  <svg viewBox="0 0 16 10" width="16" height="10" aria-hidden="true">
    <rect width="16" height="10" fill="#012169" />
    <path d="M0 0L16 10M16 0L0 10" stroke="#fff" strokeWidth="2" />
    <path d="M0 0L16 10M16 0L0 10" stroke="#C8102E" strokeWidth="1" />
    <path d="M8 0V10M0 5H16" stroke="#fff" strokeWidth="3" />
    <path d="M8 0V10M0 5H16" stroke="#C8102E" strokeWidth="1.6" />
  </svg>
);
const FlagDE = () => (
  <svg viewBox="0 0 16 10" width="16" height="10" aria-hidden="true">
    <rect width="16" height="3.33" fill="#000" /><rect y="3.33" width="16" height="3.34" fill="#DD0000" /><rect y="6.67" width="16" height="3.33" fill="#FFCC00" />
  </svg>
);
const FLAGS = { sv: FlagSV, en: FlagEN, de: FlagDE };

const LangSwitcher = ({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) => (
  <div className="lang-switch" role="tablist">
    {(["sv", "en", "de"] as Lang[]).map(c => {
      const Flag = FLAGS[c];
      return (
        <button key={c} role="tab" aria-selected={lang === c} className={lang === c ? "active" : ""} onClick={() => setLang(c)}>
          <span className="flag"><Flag /></span>
          {c.toUpperCase()}
        </button>
      );
    })}
  </div>
);

const Logo = ({ onClick }: { onClick?: () => void }) => (
  <div className="logo" onClick={onClick} style={{ cursor: "pointer" }}>
    <img src="/logo-transparent.png" alt="Discover Malmö" className="logo-img-brand" />
  </div>
);

const HomeView = ({ lang, onSearch }: { lang: Lang; onSearch: (term: string, cat: string) => void }) => {
  const t = I18N[lang];
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeCat, setActiveCat] = useState("all");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    let list = t.suggestions;
    if (activeCat !== "all") list = list.filter(s => s.cat === activeCat);
    if (q.trim()) {
      const ql = q.toLowerCase();
      list = list.filter(s => s.text.toLowerCase().includes(ql) || t.hero.category[s.cat as keyof typeof t.hero.category].toLowerCase().includes(ql));
    }
    return list;
  }, [q, activeCat, lang]);

  const cats = Object.keys(t.hero.category);

  return (
    <div className="home">
      <div className={`hero ${focused ? "map-active" : ""}`}>
        <div className="hero-bg" aria-hidden="true">
          <img src="/malmokarta.png" alt="" draggable={false} />
        </div>
        <div className="hero-inner">
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1 className="display">
            <span className="line-1">{"\n"}</span>
            <span className="line-2"><em>{t.hero.title_2}</em></span>
          </h1>
          <p className="sub">{t.hero.sub}</p>

          <div className={`search ${focused ? "focused" : ""}`}>
            <div className="search-row">
              <svg width="20" height="20" viewBox="0 0 20 20" className="search-icon" aria-hidden="true">
                <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <line x1="13.5" y1="13.5" x2="17" y2="17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder={t.hero.placeholder}
                value={q}
                onChange={e => setQ(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 180)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    const first = filtered[0];
                    onSearch(q || (first ? first.text : ""), first ? first.cat : "default");
                  }
                }}
              />
              <button className="search-cta" onClick={() => {
                const first = filtered[0];
                onSearch(q || (first ? first.text : ""), first ? first.cat : "default");
              }}>
                {t.hero.cta}
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M1 7h12M8 2l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="cats">
              <button className={`cat-chip ${activeCat === "all" ? "active" : ""}`} onClick={() => setActiveCat("all")}>
                <span className="dot" />
                {lang === "sv" ? "Alla" : lang === "de" ? "Alle" : "All"}
              </button>
              {cats.map(c => (
                <button key={c} className={`cat-chip ${activeCat === c ? "active" : ""}`} onClick={() => setActiveCat(c)}>
                  <CategoryIcon cat={c} />
                  {t.hero.category[c as keyof typeof t.hero.category]}
                </button>
              ))}
            </div>

            {focused && <div className="suggestions">
              <div className="sug-label">
                <span className="rule" /><span>{t.hero.suggestions_label}</span><span className="rule" />
              </div>
              <ul className="sug-list">
                {filtered.length === 0 && (
                  <li className="sug-empty">
                    {lang === "sv" ? "Inga förslag — testa en annan kategori." : lang === "de" ? "Keine Vorschläge — probier eine andere Kategorie." : "No suggestions — try another category."}
                  </li>
                )}
                {filtered.map((s, i) => (
                  <li key={i}>
                    <button className={`sug ${i < 3 ? "featured" : ""}`} onClick={() => onSearch(s.text, s.cat)}>
                      <span className="sug-icon"><CategoryIcon cat={s.cat} size={16} /></span>
                      <span className="sug-text">{s.text}</span>
                      <span className="sug-hint">{s.hint}</span>
                      <svg width="12" height="12" viewBox="0 0 12 12" className="sug-arrow" aria-hidden="true">
                        <path d="M2 6h8M7 2l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>}
          </div>

          <div className="popular">
            <p className="pop-label">{t.hero.popular_label}</p>
            <div className="pop-cards">
              {t.popular.slice(0, 5).map((p, i) => {
                const lookup = p.toLowerCase();
                let key = "default";
                if (/fika|kaffe|coffee/.test(lookup)) key = "food";
                else if (/torso|west|hamn/.test(lookup)) key = "architecture";
                else if (/bad|kallbad/.test(lookup)) key = "nature";
                else if (/slott|castle|schloss/.test(lookup)) key = "culture";
                else if (/street|food/.test(lookup)) key = "food";
                const imgs = [
                  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
                  "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80",
                  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
                  "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=400&q=80",
                  "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=400&q=80",
                  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
                ];
                return (
                  <button key={i} className="pop-card" onClick={() => onSearch(p, key)}>
                    <img src={imgs[i % imgs.length]} alt={p} className="pop-card-img" />
                    <span className="pop-card-label">{p}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <section className="partners">
        <p className="partners-label">{lang === "sv" ? "Planera resan med" : lang === "de" ? "Plane deine Reise mit" : "Plan your trip with"}</p>
        <div className="partners-row">
          <img src="/logos/uber.svg" alt="Uber" className="logo-img" />
          <img src="/logos/bolt.png" alt="Bolt" className="logo-img" style={{height: "22px"}} />
          <img src="/logos/airbnb.png" alt="Airbnb" className="logo-img" style={{height: "44px"}} />
          <img src="/logos/revolut.svg" alt="Revolut" className="logo-img" />
        </div>
      </section>
    </div>
  );
};

const MapView = ({ lang, routeKey, searchTerm, onBack }: { lang: Lang; routeKey: RouteKey; searchTerm: string; onBack: () => void }) => {
  const t = I18N[lang];
  const route = ROUTES[routeKey] || ROUTES.default;
  const [activeStop, setActiveStop] = useState(0);
  const [panelOpen, setPanelOpen] = useState(true);

  useEffect(() => { setActiveStop(0); }, [routeKey]);

  return (
    <div className="map-view">
      <div className="map-canvas">
        <LeafletMap route={route} activeStop={activeStop} onStopClick={setActiveStop} lang={lang} />
      </div>

      <aside className={`route-panel ${panelOpen ? "open" : "closed"}`}>
        <button className="panel-back" onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M13 7H1M6 2L1 7l5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t.map.back}
        </button>

        <p className="panel-eyebrow">{t.map.title}</p>
        <h2 className="panel-title">{route.title[lang] || route.title.en}</h2>
        {searchTerm && <p className="panel-query">&ldquo;{searchTerm}&rdquo;</p>}

        <div className="stats">
          <div><span className="stat-label">{t.map.duration}</span><span className="stat-val">{route.duration[lang] || route.duration.en}</span></div>
          <div><span className="stat-label">{t.map.distance}</span><span className="stat-val">{route.distance}</span></div>
          <div><span className="stat-label">{t.map.stops}</span><span className="stat-val">{route.stops.length}</span></div>
        </div>

        <ol className="stop-list">
          {route.stops.map((s, i) => (
            <li key={i} className={activeStop === i ? "active" : ""} onClick={() => setActiveStop(i)}>
              <span className="stop-letter">{String.fromCharCode(65 + i)}</span>
              <span className="stop-body">
                <span className="stop-name-text">{s.name[lang] || s.name.en}</span>
                <span className="stop-kind-text">{s.kind[lang] || s.kind.en}</span>
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

      <button className="panel-toggle" onClick={() => setPanelOpen(o => !o)} aria-label="Toggle panel">
        <svg width="20" height="20" viewBox="0 0 20 20">
          <path d={panelOpen ? "M6 7l4 4 4-4" : "M6 13l4-4 4 4"} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};

const EXPERIENCES = [
  { title: "Kayaking i Inre hamnen", cat: "Natur", duration: "2 tim", price: "395 kr", rating: 4.9, reviews: 87, img: "https://images.unsplash.com/photo-1472745942893-4b9f730c7668?w=600&q=80" },
  { title: "Street food-tur på Möllevången", cat: "Mat", duration: "3 tim", price: "295 kr", rating: 4.8, reviews: 142, img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80" },
  { title: "Arkitekturpromenad Västra hamnen", cat: "Arkitektur", duration: "2 tim", price: "199 kr", rating: 4.7, reviews: 63, img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80" },
  { title: "Cykeltur längs havet", cat: "Natur", duration: "3 tim", price: "249 kr", rating: 4.9, reviews: 211, img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
  { title: "Fika & bakning — surdegsworkshop", cat: "Mat", duration: "4 tim", price: "695 kr", rating: 5.0, reviews: 34, img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80" },
  { title: "Middag hos lokal kock", cat: "Mat", duration: "3 tim", price: "895 kr", rating: 4.9, reviews: 56, img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80" },
  { title: "Solnedgång vid Ribersborg kallbadhus", cat: "Natur", duration: "2 tim", price: "Gratis", rating: 4.8, reviews: 98, img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80" },
  { title: "Konstgalleri-tur i Gamla stan", cat: "Kultur", duration: "2.5 tim", price: "149 kr", rating: 4.6, reviews: 45, img: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&q=80" },
  { title: "SUP-bräda i Öresund", cat: "Natur", duration: "2 tim", price: "450 kr", rating: 4.7, reviews: 72, img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80" },
  { title: "Malmöhus slott — privat guidad tur", cat: "Historia", duration: "1.5 tim", price: "195 kr", rating: 4.8, reviews: 89, img: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=600&q=80" },
  { title: "Keramikworkshop i Möllevången", cat: "Kreativt", duration: "3 tim", price: "595 kr", rating: 4.9, reviews: 41, img: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80" },
  { title: "Yoga vid havet — soluppgång", cat: "Natur", duration: "1.5 tim", price: "150 kr", rating: 5.0, reviews: 28, img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80" },
  { title: "Ölprovning på lokalt bryggeri", cat: "Mat", duration: "2 tim", price: "395 kr", rating: 4.8, reviews: 103, img: "https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=600&q=80" },
  { title: "Fotografi-promenad i hamnen", cat: "Kreativt", duration: "3 tim", price: "299 kr", rating: 4.7, reviews: 57, img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80" },
  { title: "Vinprovning med sommelier", cat: "Mat", duration: "2.5 tim", price: "695 kr", rating: 4.9, reviews: 67, img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80" },
  { title: "Stadsodling & matlagning", cat: "Mat", duration: "4 tim", price: "495 kr", rating: 4.8, reviews: 38, img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80" },
  { title: "Historisk vandring i Gamla stan", cat: "Historia", duration: "2 tim", price: "175 kr", rating: 4.6, reviews: 134, img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80" },
  { title: "Klättring i Stapelbäddsparken", cat: "Sport", duration: "2 tim", price: "275 kr", rating: 4.7, reviews: 49, img: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600&q=80" },
  { title: "Textilworkshop — naturligt tyg", cat: "Kreativt", duration: "3 tim", price: "545 kr", rating: 4.8, reviews: 22, img: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80" },
  { title: "Morgonbad i Öresund", cat: "Natur", duration: "1 tim", price: "Gratis", rating: 4.9, reviews: 176, img: "https://images.unsplash.com/photo-1530053969600-caed2596d242?w=600&q=80" },
  { title: "Jazz-kväll på lokal klubb", cat: "Kultur", duration: "3 tim", price: "195 kr", rating: 4.7, reviews: 83, img: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=600&q=80" },
  { title: "Matmarknad — Möllevångstorget", cat: "Mat", duration: "2 tim", price: "Gratis", rating: 4.8, reviews: 245, img: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&q=80" },
  { title: "Privat båttur i Malmö kanal", cat: "Natur", duration: "1.5 tim", price: "550 kr", rating: 4.9, reviews: 61, img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80" },
  { title: "Målarworkshop — akvarell", cat: "Kreativt", duration: "3 tim", price: "445 kr", rating: 4.8, reviews: 33, img: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80" },
  { title: "Löptur med guide — Malmös historia", cat: "Sport", duration: "1.5 tim", price: "125 kr", rating: 4.6, reviews: 91, img: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=80" },
];

const EXP_COORDS: [number, number][] = [
  [55.6097, 12.9741], [55.5921, 13.0082], [55.6134, 12.9889], [55.6097, 12.9741],
  [55.6065, 12.9987], [55.6034, 13.0021], [55.6097, 12.9741], [55.6059, 13.0007],
  [55.6118, 12.9812], [55.6072, 12.9918], [55.5921, 13.0082], [55.6097, 12.9741],
  [55.6148, 12.9952], [55.6134, 12.9889], [55.6065, 12.9987], [55.6058, 12.9978],
  [55.6059, 13.0007], [55.6141, 12.9968], [55.6027, 13.0008], [55.6097, 12.9741],
  [55.6034, 13.0021], [55.5921, 13.0082], [55.6148, 12.9952], [55.6058, 12.9978],
  [55.6059, 13.0007],
];

const ExpMap = ({ active }: { active: number | null }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;
    const init = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
      const map = L.map(containerRef.current!, { zoomControl: true, scrollWheelZoom: true });
      mapRef.current = map;
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '© OpenStreetMap © CARTO', maxZoom: 19,
      }).addTo(map);
      map.setView([55.605, 12.998], 13);
      markersRef.current = EXPERIENCES.map((e, i) => {
        const [lat, lng] = EXP_COORDS[i];
        const icon = L.divIcon({
          className: "",
          html: `<div style="background:#fff;border:1.5px solid #222;border-radius:999px;padding:4px 10px;font-size:12px;font-weight:600;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.15)">${e.price === "Gratis" ? "Gratis" : e.price}</div>`,
          iconAnchor: [30, 16],
        });
        return L.marker([lat, lng], { icon }).addTo(map).bindTooltip(e.title, { direction: "top", offset: [0, -20] });
      });
    };
    init();
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, []);

  useEffect(() => {
    if (!markersRef.current.length) return;
    markersRef.current.forEach((marker, i) => {
      const isActive = i === active;
      const e = EXPERIENCES[i];
      const el = marker.getElement();
      if (el) {
        const inner = el.querySelector("div") as HTMLElement | null;
        if (inner) {
          inner.style.background = isActive ? "#222" : "#fff";
          inner.style.color = isActive ? "#fff" : "#222";
          inner.style.transform = isActive ? "scale(1.1)" : "scale(1)";
        }
      }
    });
  }, [active]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};

const ExperiencesView = ({ lang }: { lang: Lang }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="exp-layout">
      <div className="exp-left">
        <div className="exp-header">
          <h1 className="exp-title">Över {EXPERIENCES.length} upplevelser i Malmö</h1>
          <p className="exp-sub">Hur vi sorterar resultat</p>
        </div>
        <div className="exp-grid">
          {EXPERIENCES.map((e, i) => (
            <div key={i} className="exp-card" onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
              <div className="exp-img-wrap">
                <img src={e.img} alt={e.title} className="exp-img" />
              </div>
              <div className="exp-info">
                <div className="exp-meta-row">
                  <span className="exp-cat-tag">{e.cat}</span>
                  <span className="exp-rating">★ {e.rating} <span className="exp-reviews">({e.reviews})</span></span>
                </div>
                <h3 className="exp-name">{e.title}</h3>
                <p className="exp-duration-line">{e.duration}</p>
                <p className="exp-price">{e.price === "Gratis" ? <strong>Gratis</strong> : <><span style={{textDecoration:"none"}}>Totalt </span><strong>{e.price}</strong></>}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="exp-map-panel">
        <ExpMap active={hovered} />
      </div>
    </div>
  );
};

export default function DiscoverApp() {
  const [lang, setLang] = useState<Lang>("sv");
  const [view, setView] = useState<"home" | "map" | "experiences">("home");
  const [routeKey, setRouteKey] = useState<RouteKey>("default");
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLang(getInitialLang());
    setView(getInitialView());
    setRouteKey(getInitialRoute());
    setMounted(true);
  }, []);

  useEffect(() => { try { localStorage.setItem("dm-lang", lang); } catch {} }, [lang]);
  useEffect(() => { try { localStorage.setItem("dm-view", view); } catch {} }, [view]);
  useEffect(() => { try { localStorage.setItem("dm-route", routeKey); } catch {} }, [routeKey]);

  const handleSearch = (term: string, catKey: string) => {
    setSearchTerm(term);
    setRouteKey(ROUTES[catKey as RouteKey] ? (catKey as RouteKey) : "default");
    setView("map");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!mounted) return null;

  const t = I18N[lang];

  return (
    <div className={`app view-${view}`}>
      <header className="topbar">
        <Logo onClick={() => setView("home")} />
        <nav className="nav">
          <a href="#" onClick={e => { e.preventDefault(); setView("home"); }}>{t.nav.discover}</a>
          <a href="#" onClick={e => { e.preventDefault(); setView("experiences"); }} className={view === "experiences" ? "active" : ""}>{t.nav.experiences}</a>
          <a href="#">{t.nav.plan}</a>
          <a href="#">{t.nav.about}</a>
        </nav>
        <LangSwitcher lang={lang} setLang={setLang} />
      </header>

      {view === "home" && <HomeView lang={lang} onSearch={handleSearch} />}
      {view === "map" && <MapView lang={lang} routeKey={routeKey} searchTerm={searchTerm} onBack={() => setView("home")} />}
      {view === "experiences" && <ExperiencesView lang={lang} />}

      <footer className="foot">
        <span>{t.footer}</span>
        <span className="coords">55°36′N · 13°00′E</span>
      </footer>
    </div>
  );
}
