"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";

type Lang = "sv" | "en" | "de";

const NAV = {
  sv: { discover: "Upptäck", experiences: "Upplevelser", rentCar: "Hyra bil", plan: "Ta dig hit", about: "Om oss" },
  en: { discover: "Discover", experiences: "Experiences", rentCar: "Rent a car", plan: "Get here", about: "About" },
  de: { discover: "Entdecken", experiences: "Erlebnisse", rentCar: "Auto mieten", plan: "Anfahrt", about: "Über uns" },
};

const SEARCH_PLACEHOLDER: Record<Lang, string> = {
  sv: "Sök i nyheter…",
  en: "Search news…",
  de: "News durchsuchen…",
};

const SEARCH_NO_RESULTS: Record<Lang, string> = {
  sv: "Inga nyheter matchar",
  en: "No news match",
  de: "Keine News gefunden",
};

const LANG_LABEL: Record<Lang, string> = {
  sv: "Svenska",
  en: "English",
  de: "Deutsch",
};

const FlagSV = () => (
  <svg viewBox="0 0 16 10" width="16" height="10" aria-hidden="true">
    <rect width="16" height="10" fill="#006aa7" />
    <rect x="5" width="2" height="10" fill="#fecc00" />
    <rect y="4" width="16" height="2" fill="#fecc00" />
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
    <rect width="16" height="3.33" fill="#000" />
    <rect y="3.33" width="16" height="3.34" fill="#DD0000" />
    <rect y="6.67" width="16" height="3.33" fill="#FFCC00" />
  </svg>
);
const FLAGS = { sv: FlagSV, en: FlagEN, de: FlagDE };

const GlobeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
  </svg>
);
const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
    style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);

const getInitialLang = (): Lang => {
  try {
    const saved = localStorage.getItem("dm-lang") as Lang;
    if (saved && ["sv","en","de"].includes(saved)) return saved;
  } catch {}
  return "sv";
};

type NewsItem = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
};

/**
 * Global huvudmeny som renderas på alla sidor från layout.tsx.
 * Använder samma CSS-klasser som home-sidan (topbar, nav, logo, lang-switch,
 * hamburger, mobile-menu) så menyn ser identisk ut överallt.
 *
 * DiscoverApp har sin egen interna topbar — den ska tas bort så denna är
 * single source of truth.
 *
 * News-search visas bara på /news* sidor.
 */
export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("sv");
  const [searchQuery, setSearchQuery] = useState("");
  const [newsItems, setNewsItems] = useState<NewsItem[] | null>(null);
  const pathname = usePathname();
  const isOnNews = pathname === "/news" || pathname.startsWith("/news/");

  useEffect(() => {
    setLang(getInitialLang());
  }, []);

  useEffect(() => { setMenuOpen(false); setLangOpen(false); setSearchQuery(""); }, [pathname]);

  // Lås body-scroll när hamburgermenyn är öppen så bakomliggande sida inte scrollar igenom
  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [menuOpen]);

  // Lazy-load news posts vid första öppning av sökrutan
  useEffect(() => {
    if (!isOnNews || !menuOpen || newsItems !== null) return;
    fetch("/api/news")
      .then((r) => r.json())
      .then((data: NewsItem[]) => setNewsItems(data))
      .catch(() => setNewsItems([]));
  }, [isOnNews, menuOpen, newsItems]);

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim() || !newsItems) return [];
    const q = searchQuery.toLowerCase();
    return newsItems
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [searchQuery, newsItems]);

  const changeLang = (l: Lang) => {
    setLang(l);
    try {
      localStorage.setItem("dm-lang", l);
      window.dispatchEvent(new CustomEvent("dm-lang-change", { detail: l }));
    } catch {}
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
  const t = NAV[lang];

  return (
    <>
      <header className="topbar">
        <a href="/" className="logo" aria-label="Discover Malmö hem">
          <img src="/logo-transparent.png" alt="Discover Malmö" className="logo-img-brand" />
        </a>
        <nav className="nav" aria-label="Huvudmeny">
          <a href="/" className={isActive("/") ? "active" : ""}>{t.discover}</a>
          <a href="/upplevelser" className={isActive("/upplevelser") ? "active" : ""}>{t.experiences}</a>
          <a href="/hyra-bil" className={isActive("/hyra-bil") ? "active" : ""}>{t.rentCar}</a>
          <a href="/ta-dig-hit" className={isActive("/ta-dig-hit") ? "active" : ""}>{t.plan}</a>
          <a href="/om-oss" className={isActive("/om-oss") ? "active" : ""}>{t.about}</a>
        </nav>
        <div className="lang-switch" role="tablist">
          {(["sv","en","de"] as Lang[]).map(c => {
            const Flag = FLAGS[c];
            return (
              <button key={c} role="tab" aria-selected={lang === c} className={lang === c ? "active" : ""} onClick={() => changeLang(c)}>
                <span className="flag"><Flag /></span>
                {c.toUpperCase()}
              </button>
            );
          })}
        </div>
        <button
          className="hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? "Stäng meny" : "Öppna meny"}
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </header>

      {menuOpen && (
        <div className="mobile-menu" role="dialog" aria-label="Mobilmeny">
          <div className="mobile-menu-top">
            <a href="/" className="logo" aria-label="Discover Malmö hem" onClick={() => setMenuOpen(false)}>
              <img src="/logo-transparent.png" alt="Discover Malmö" className="logo-img-brand" />
            </a>
            <button
              type="button"
              className="mobile-menu-close"
              onClick={() => setMenuOpen(false)}
              aria-label="Stäng meny"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <div className="mobile-menu-content">
          {isOnNews && (
            <div className="mobile-search-wrap">
              <div className="mobile-search-input">
                <SearchIcon />
                <input
                  type="search"
                  placeholder={SEARCH_PLACEHOLDER[lang]}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Sök i nyheter"
                />
              </div>
              {searchQuery.trim() && (
                <ul className="mobile-search-results">
                  {filteredResults.length === 0 ? (
                    <li className="mobile-search-empty">{SEARCH_NO_RESULTS[lang]}</li>
                  ) : (
                    filteredResults.map((post) => (
                      <li key={post.slug}>
                        <a href={`/news/${post.slug}`} onClick={() => setMenuOpen(false)}>
                          <span className="mobile-search-result-title">{post.title}</span>
                          {post.category && (
                            <span className="mobile-search-result-cat">{post.category}</span>
                          )}
                        </a>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          )}

          <div className="mobile-lang-dropdown-wrap">
            <button
              type="button"
              className="mobile-lang-toggle"
              aria-expanded={langOpen}
              aria-haspopup="listbox"
              onClick={() => setLangOpen(o => !o)}
            >
              <GlobeIcon />
              <span className="mobile-lang-toggle-label">{LANG_LABEL[lang]}</span>
              <ChevronIcon open={langOpen} />
            </button>
            {langOpen && (
              <ul className="mobile-lang-list" role="listbox">
                {(["sv","en","de"] as Lang[]).map(c => {
                  const Flag = FLAGS[c];
                  return (
                    <li key={c}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={lang === c}
                        className={lang === c ? "active" : ""}
                        onClick={() => { changeLang(c); setLangOpen(false); }}
                      >
                        <span className="flag"><Flag /></span>
                        <span>{LANG_LABEL[c]}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <a href="/" onClick={() => setMenuOpen(false)}>{t.discover}</a>
          <a href="/upplevelser" onClick={() => setMenuOpen(false)}>{t.experiences}</a>
          <a href="/hyra-bil" onClick={() => setMenuOpen(false)}>{t.rentCar}</a>
          <a href="/ta-dig-hit" onClick={() => setMenuOpen(false)}>{t.plan}</a>
          <a href="/om-oss" onClick={() => setMenuOpen(false)}>{t.about}</a>

          <div className="mobile-menu-socials" aria-label="Sociala medier">
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99C18.34 21.13 22 16.99 22 12z"/>
              </svg>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.45a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.88z"/>
              </svg>
            </a>
          </div>
          </div>
        </div>
      )}
    </>
  );
}
