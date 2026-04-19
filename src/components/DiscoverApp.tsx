"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { I18N, type Lang } from "@/lib/i18n";
import { ROUTES, type RouteKey } from "@/lib/routes";
import MalmoMap from "./MalmoMap";

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

const Logo = () => (
  <div className="logo">
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
              {t.popular.map((p, i) => {
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
          <img src="/logos/uber.svg" alt="Uber" className="logo-img logo-uber" />
          <img src="/logos/bolt.png" alt="Bolt" className="logo-img logo-bolt" />
          <img src="/logos/airbnb.png" alt="Airbnb" className="logo-img logo-airbnb" />
          <img src="/logos/revolut.svg" alt="Revolut" className="logo-img logo-revolut" />
          <img src="/logos/oresundsbron.png" alt="Öresundsbron" className="logo-img logo-oresund" />
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
        <MalmoMap route={route} activeStop={activeStop} onStopClick={setActiveStop} lang={lang} />
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

export default function DiscoverApp() {
  const [lang, setLang] = useState<Lang>("sv");
  const [view, setView] = useState<"home" | "map">("home");
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
        <Logo />
        <nav className="nav">
          <a href="#">{t.nav.discover}</a>
          <a href="#">{t.nav.experiences}</a>
          <a href="#">{t.nav.plan}</a>
          <a href="#">{t.nav.about}</a>
        </nav>
        <LangSwitcher lang={lang} setLang={setLang} />
      </header>

      {view === "home" ? (
        <HomeView lang={lang} onSearch={handleSearch} />
      ) : (
        <MapView lang={lang} routeKey={routeKey} searchTerm={searchTerm} onBack={() => setView("home")} />
      )}

      <footer className="foot">
        <span>{t.footer}</span>
        <span className="coords">55°36′N · 13°00′E</span>
      </footer>
    </div>
  );
}
