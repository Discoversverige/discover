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

const HomeView = ({ lang, onSearch, onContact }: { lang: Lang; onSearch: (term: string, cat: string) => void; onContact: () => void }) => {
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

          <button type="button" className="ad-banner" onClick={onContact} aria-label={lang === "sv" ? "Annonsera på Discover Malmö" : lang === "de" ? "Auf Discover Malmö werben" : "Advertise on Discover Malmö"}>
            <span className="ad-banner-text">
              {lang === "sv" ? "Vill du synas här?" : lang === "de" ? "Willst du hier gesehen werden?" : "Want to be seen here?"}
            </span>
            <span className="ad-banner-cta">
              {lang === "sv" ? "Klicka här" : lang === "de" ? "Klicke hier" : "Click here"}
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M1 7h12M8 2l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>

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
              {t.popular.slice(0, 6).map((p, i) => {
                const lookup = p.toLowerCase();
                let key = "default";
                if (/fika|kaffe|coffee/.test(lookup)) key = "food";
                else if (/torso|west|hamn/.test(lookup)) key = "architecture";
                else if (/bad|kallbad/.test(lookup)) key = "nature";
                else if (/slott|castle|schloss/.test(lookup)) key = "culture";
                else if (/street|food/.test(lookup)) key = "food";
                const imgs: Array<{ src: string; alt?: string }> = [
                  { src: "/images/turning-torso-solnedgang.jpg", alt: "Turning Torso i solnedgång, Malmö" },
                  { src: "/images/malmo-live.jpg", alt: "Malmö Live vid kanalen" },
                  { src: "/images/triangeln-malmo.jpg", alt: "Triangelns glaskupol och historiska byggnader, Malmö" },
                  { src: "/images/kallbadhuset-malmo.jpg", alt: "Brygga till Ribersborgs kallbadhus i solnedgång, Malmö" },
                  { src: "/images/malmohus-slott-malmo.jpg", alt: "Malmöhus slott med vallgrav och spegling, Malmö" },
                  { src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80", alt: "Street food och marknad" },
                ];
                const img = imgs[i % imgs.length];
                return (
                  <button key={i} className="pop-card" onClick={() => onSearch(p, key)}>
                    <img src={img.src} alt={img.alt ?? p} className="pop-card-img" />
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
          <img src="/logos/uber.svg" alt="Uber" className="logo-img" style={{height: "52px"}} />
          <img src="/logos/bolt.png" alt="Bolt" className="logo-img" style={{height: "28px"}} />
          <img src="/logos/airbnb.png" alt="Airbnb" className="logo-img" style={{height: "52px"}} />
          <img src="/logos/revolut.svg" alt="Revolut" className="logo-img" style={{height: "52px"}} />
          <img src="/logos/sj.png" alt="SJ" className="logo-img" style={{height: "38px"}} />
          <img src="/logos/bus4u.png" alt="Bus4u" className="logo-img" style={{height: "52px"}} />
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

const TravelView = ({ lang }: { lang: Lang }) => {
  const tr = I18N[lang].travel;
  return (
    <div className="travel-page">
      <div className="travel-hero">
        <h1 className="travel-title">{tr.title}</h1>
        <p className="travel-sub">{tr.sub}</p>
      </div>
      <div className="travel-grid">
        <div className="travel-card">
          <div className="travel-icon">✈️</div>
          <div className="travel-content">
            <h2 className="travel-card-title">{tr.cph_title}</h2>
            <p className="travel-card-sub">{tr.cph_sub}</p>
            <div className="travel-steps">
              <div className="travel-step"><span className="travel-step-num">1</span><div><strong>{tr.cph_s1_title}</strong><p>{tr.cph_s1}</p></div></div>
              <div className="travel-step"><span className="travel-step-num">2</span><div><strong>{tr.cph_s2_title}</strong><p>{tr.cph_s2}</p></div></div>
              <div className="travel-step"><span className="travel-step-num">3</span><div><strong>{tr.cph_s3_title}</strong><p>{tr.cph_s3}</p></div></div>
            </div>
            <div className="travel-info-row">
              <span className="travel-badge">{tr.cph_b1}</span>
              <span className="travel-badge">{tr.cph_b2}</span>
              <span className="travel-badge">{tr.cph_b3}</span>
            </div>
          </div>
        </div>
        <div className="travel-card">
          <div className="travel-icon">🚂</div>
          <div className="travel-content">
            <h2 className="travel-card-title">{tr.gbg_title}</h2>
            <p className="travel-card-sub">{tr.gbg_sub}</p>
            <div className="travel-steps">
              <div className="travel-step"><span className="travel-step-num">1</span><div><strong>{tr.gbg_s1_title}</strong><p>{tr.gbg_s1}</p></div></div>
              <div className="travel-step"><span className="travel-step-num">2</span><div><strong>{tr.gbg_s2_title}</strong><p>{tr.gbg_s2}</p></div></div>
              <div className="travel-step"><span className="travel-step-num">3</span><div><strong>{tr.gbg_s3_title}</strong><p>{tr.gbg_s3}</p></div></div>
            </div>
            <div className="travel-info-row">
              <span className="travel-badge">{tr.gbg_b1}</span>
              <span className="travel-badge">{tr.gbg_b2}</span>
              <span className="travel-badge">{tr.gbg_b3}</span>
            </div>
          </div>
        </div>
        <div className="travel-card travel-card-wide">
          <div className="travel-icon">💡</div>
          <div className="travel-content">
            <h2 className="travel-card-title">{tr.tips_title}</h2>
            <div className="travel-tips-grid">
              <div className="travel-tip"><strong>{tr.tip1_title}</strong><p>{tr.tip1}</p></div>
              <div className="travel-tip"><strong>{tr.tip2_title}</strong><p>{tr.tip2}</p></div>
              <div className="travel-tip"><strong>{tr.tip3_title}</strong><p>{tr.tip3}</p></div>
              <div className="travel-tip"><strong>{tr.tip4_title}</strong><p>{tr.tip4}</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AboutView = ({ lang, onContact }: { lang: Lang; onContact: () => void }) => {
  const a = I18N[lang].about;
  return (
    <div className="about-page">
      <div className="about-hero">
        <p className="about-eyebrow">{a.eyebrow}</p>
        <h1 className="about-title">{a.title}</h1>
        <p className="about-lead">{a.lead}</p>
      </div>
      <div className="about-grid">
        <div className="about-card">
          <div className="about-num">01</div>
          <h2>{a.s1_title}</h2>
          <p>{a.s1}</p>
        </div>
        <div className="about-card">
          <div className="about-num">02</div>
          <h2>{a.s2_title}</h2>
          <p>{a.s2}</p>
        </div>
        <div className="about-card">
          <div className="about-num">03</div>
          <h2>{a.s3_title}</h2>
          <p>{a.s3}</p>
        </div>
      </div>
      <div className="about-stats">
        <div className="about-stat"><span className="about-stat-val">{a.stat1_val}</span><span className="about-stat-lbl">{a.stat1_lbl}</span></div>
        <div className="about-stat"><span className="about-stat-val">{a.stat2_val}</span><span className="about-stat-lbl">{a.stat2_lbl}</span></div>
        <div className="about-stat"><span className="about-stat-val">{a.stat3_val}</span><span className="about-stat-lbl">{a.stat3_lbl}</span></div>
      </div>
      <div className="about-cta">
        <h3>{a.cta_title}</h3>
        <button className="about-cta-btn" onClick={onContact}>
          {a.cta_btn}
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M1 7h12M8 2l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const ContactView = ({ lang }: { lang: Lang }) => {
  const c = I18N[lang].contact;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [topic, setTopic] = useState("ad");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setStatus("sending");
    setTimeout(() => setStatus("done"), 700);
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <p className="contact-eyebrow">{c.eyebrow}</p>
        <h1 className="contact-title">{c.title}</h1>
        <p className="contact-lead">{c.lead}</p>
      </div>
      <div className="contact-grid">
        <aside className="contact-info">
          <div className="contact-info-row"><span className="contact-info-lbl">{c.info_email}</span><span className="contact-info-val">{c.info_email_val}</span></div>
          <div className="contact-info-row"><span className="contact-info-lbl">{c.info_city}</span><span className="contact-info-val">{c.info_city_val}</span></div>
          <div className="contact-info-row"><span className="contact-info-lbl">{c.info_hours}</span><span className="contact-info-val">{c.info_hours_val}</span></div>
        </aside>
        <div className="contact-form-wrap">
          {status === "done" ? (
            <div className="contact-success">
              <div className="contact-success-icon">
                <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
                  <circle cx="22" cy="22" r="20" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M14 22l6 6 11-13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2>{c.success_title}</h2>
              <p>{c.success_msg}</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={submit}>
              <div className="contact-field">
                <label htmlFor="cf-name">{c.name_label}</label>
                <input id="cf-name" type="text" required value={name} onChange={e => setName(e.target.value)} placeholder={c.name_placeholder} />
              </div>
              <div className="contact-row">
                <div className="contact-field">
                  <label htmlFor="cf-email">{c.email_label}</label>
                  <input id="cf-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder={c.email_placeholder} />
                </div>
                <div className="contact-field">
                  <label htmlFor="cf-company">{c.company_label}</label>
                  <input id="cf-company" type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder={c.company_placeholder} />
                </div>
              </div>
              <div className="contact-field">
                <label htmlFor="cf-topic">{c.topic_label}</label>
                <select id="cf-topic" value={topic} onChange={e => setTopic(e.target.value)}>
                  <option value="ad">{c.topic_ad}</option>
                  <option value="tip">{c.topic_tip}</option>
                  <option value="press">{c.topic_press}</option>
                  <option value="other">{c.topic_other}</option>
                </select>
              </div>
              <div className="contact-field">
                <label htmlFor="cf-message">{c.message_label}</label>
                <textarea id="cf-message" required rows={6} value={message} onChange={e => setMessage(e.target.value)} placeholder={c.message_placeholder} />
              </div>
              <button type="submit" className="contact-submit" disabled={status === "sending"}>
                {status === "sending" ? c.sending : c.submit}
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M1 7h12M8 2l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const EXPERIENCES = [
  { title: "Ost och Vinprovning i Malmö", cat: "Mat & dryck", price: "499 kr", rating: 4.58, reviews: 14, img: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=600&q=80" },
  { title: "Whiskyprovning i Malmö", cat: "Mat & dryck", price: "545 kr", rating: null, reviews: 9, img: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&q=80" },
  { title: "Kör folkrace Malmö", cat: "Sport", price: "1 795 kr", rating: 5.0, reviews: 3, img: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80" },
  { title: "Romprovning i Malmö", cat: "Mat & dryck", price: "595 kr", rating: null, reviews: 8, img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80" },
  { title: "Flyg Luftballong i Malmö", cat: "Äventyr", price: "2 495 kr", rating: null, reviews: 21, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80" },
  { title: "Helikoptertur i Malmö", cat: "Äventyr", price: "1 295 kr", rating: 5.0, reviews: 16, img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80" },
  { title: "Segelflyg i Malmö", cat: "Äventyr", price: "2 195 kr", rating: null, reviews: 2, img: "https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=600&q=80" },
  { title: "Massage i Malmö", cat: "Välmående", price: "550 kr", rating: null, reviews: 11, img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80" },
  { title: "Sip and create i Malmö", cat: "Kreativt", price: "499 kr", rating: null, reviews: 5, img: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80" },
  { title: "Vindsurfing Malmö", cat: "Sport", price: "925 kr", rating: null, reviews: 1, img: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&q=80" },
  { title: "Champagneprovning Malmö", cat: "Mat & dryck", price: "529 kr", rating: 3.33, reviews: 13, img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80" },
  { title: "Blomsterkurs i Malmö", cat: "Kreativt", price: "849 kr", rating: null, reviews: 2, img: "https://images.unsplash.com/photo-1487530811015-780b28fece8f?w=600&q=80" },
  { title: "Blomsterbinderikurs i Malmö", cat: "Kreativt", price: "849 kr", rating: null, reviews: 2, img: "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=600&q=80" },
  { title: "Ansiktsbehandling i Malmö", cat: "Välmående", price: "980 kr", rating: null, reviews: 13, img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80" },
  { title: "Ölprovning i Malmö", cat: "Mat & dryck", price: "399 kr", rating: null, reviews: 16, img: "https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=600&q=80" },
  { title: "Gravidmassage i Malmö", cat: "Välmående", price: "980 kr", rating: null, reviews: 6, img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80" },
];

const EXP_COORDS: [number, number][] = [
  [55.6065, 12.9987], [55.6059, 13.0007], [55.6141, 12.9968], [55.6034, 13.0021],
  [55.6097, 12.9741], [55.6134, 12.9889], [55.6118, 12.9812], [55.6027, 13.0008],
  [55.6058, 12.9978], [55.6097, 12.9741], [55.6065, 12.9987], [55.5921, 13.0082],
  [55.5921, 13.0082], [55.6072, 12.9918], [55.6148, 12.9952], [55.6059, 13.0007],
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
                  {e.rating && <span className="exp-rating">★ {e.rating} <span className="exp-reviews">({e.reviews})</span></span>}
                </div>
                <h3 className="exp-name">{e.title}</h3>
                <p className="exp-duration-line">{(e as any).duration ?? e.cat}</p>
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
  const [view, setView] = useState<"home" | "map" | "experiences" | "travel" | "about" | "contact">("home");
  const [routeKey, setRouteKey] = useState<RouteKey>("default");
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
        <Logo onClick={() => { setView("home"); setMenuOpen(false); }} />
        <nav className="nav">
          <a href="#" onClick={e => { e.preventDefault(); setView("home"); }}>{t.nav.discover}</a>
          <a href="#" onClick={e => { e.preventDefault(); setView("experiences"); }} className={view === "experiences" ? "active" : ""}>{t.nav.experiences}</a>
          <a href="#" onClick={e => { e.preventDefault(); setView("travel"); }} className={view === "travel" ? "active" : ""}>{t.nav.plan}</a>
          <a href="#" onClick={e => { e.preventDefault(); setView("about"); }} className={view === "about" ? "active" : ""}>{t.nav.about}</a>
        </nav>
        <LangSwitcher lang={lang} setLang={setLang} />
        <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Meny">
          <span /><span /><span />
        </button>
      </header>
      {menuOpen && (
        <div className="mobile-menu">
          <a href="#" onClick={e => { e.preventDefault(); setView("home"); setMenuOpen(false); }}>{t.nav.discover}</a>
          <a href="#" onClick={e => { e.preventDefault(); setView("experiences"); setMenuOpen(false); }}>{t.nav.experiences}</a>
          <a href="#" onClick={e => { e.preventDefault(); setView("travel"); setMenuOpen(false); }}>{t.nav.plan}</a>
          <a href="#" onClick={e => { e.preventDefault(); setView("about"); setMenuOpen(false); }}>{t.nav.about}</a>
          <div className="mobile-menu-lang"><LangSwitcher lang={lang} setLang={(l) => { setLang(l); setMenuOpen(false); }} /></div>
        </div>
      )}

      {view === "home" && <HomeView lang={lang} onSearch={handleSearch} onContact={() => { setView("contact"); window.scrollTo({ top: 0, behavior: "smooth" }); }} />}
      {view === "map" && <MapView lang={lang} routeKey={routeKey} searchTerm={searchTerm} onBack={() => setView("home")} />}
      {view === "experiences" && <ExperiencesView lang={lang} />}
      {view === "travel" && <TravelView lang={lang} />}
      {view === "about" && <AboutView lang={lang} onContact={() => { setView("contact"); window.scrollTo({ top: 0, behavior: "smooth" }); }} />}
      {view === "contact" && <ContactView lang={lang} />}

      <footer className="foot">
        <span>{t.footer}</span>
        <a href="#" className="foot-link" onClick={e => { e.preventDefault(); setView("contact"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>{t.footer_contact}</a>
        <span className="coords">55°36′N · 13°00′E</span>
      </footer>
    </div>
  );
}
