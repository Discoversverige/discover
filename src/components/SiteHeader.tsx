"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

type Lang = "sv" | "en" | "de";

const HIDDEN_ON = ["/", "/ta-dig-hit", "/om-oss", "/login"];
const HIDDEN_PREFIX = ["/rutt/"];

const NAV = {
  sv: { discover: "Upptäck", experiences: "Upplevelser", plan: "Planera", about: "Om oss" },
  en: { discover: "Discover", experiences: "Experiences", plan: "Plan", about: "About" },
  de: { discover: "Entdecken", experiences: "Erlebnisse", plan: "Planen", about: "Über uns" },
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

const getInitialLang = (): Lang => {
  try {
    const saved = localStorage.getItem("dm-lang") as Lang;
    if (saved && ["sv","en","de"].includes(saved)) return saved;
  } catch {}
  return "sv";
};

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState<Lang>("sv");
  const pathname = usePathname();

  useEffect(() => {
    setLang(getInitialLang());
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const changeLang = (l: Lang) => {
    setLang(l);
    try {
      localStorage.setItem("dm-lang", l);
      window.dispatchEvent(new CustomEvent("dm-lang-change", { detail: l }));
    } catch {}
  };

  if (HIDDEN_ON.includes(pathname)) return null;
  if (HIDDEN_PREFIX.some(p => pathname.startsWith(p))) return null;

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const t = NAV[lang];

  return (
    <>
      <header className={`site-topbar${scrolled ? " scrolled" : ""}`}>
        <a href="/" className="site-logo" aria-label="Discover Malmö hem">
          <img src="/logo-transparent.png" alt="Discover Malmö" className="logo-img-brand" />
        </a>

        <nav className="site-nav" aria-label="Huvudmeny">
          <a href="/" className={pathname === "/" ? "site-nav-active" : ""}>{t.discover}</a>
          <a href="/upplevelser" className={isActive("/upplevelser") ? "site-nav-active" : ""}>{t.experiences}</a>
          <a href="/ta-dig-hit" className={isActive("/ta-dig-hit") ? "site-nav-active" : ""}>{t.plan}</a>
          <a href="/om-oss" className={isActive("/om-oss") ? "site-nav-active" : ""}>{t.about}</a>
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
          className={`site-hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? "Stäng meny" : "Öppna meny"}
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </header>

      {menuOpen && (
        <div className="site-mobile-menu" role="dialog" aria-label="Mobilmeny">
          <a href="/" onClick={() => setMenuOpen(false)}>{t.discover}</a>
          <a href="/upplevelser" onClick={() => setMenuOpen(false)}>{t.experiences}</a>
          <a href="/ta-dig-hit" onClick={() => setMenuOpen(false)}>{t.plan}</a>
          <a href="/om-oss" onClick={() => setMenuOpen(false)}>{t.about}</a>
          <div className="mobile-menu-lang">
            <div className="lang-switch" role="tablist">
              {(["sv","en","de"] as Lang[]).map(c => {
                const Flag = FLAGS[c];
                return (
                  <button key={c} role="tab" aria-selected={lang === c} className={lang === c ? "active" : ""} onClick={() => { changeLang(c); setMenuOpen(false); }}>
                    <span className="flag"><Flag /></span>
                    {c.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
