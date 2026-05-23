"use client";

import { useEffect, useRef, useState } from "react";

type Lang = "sv" | "en" | "de";

const T = {
  sv: {
    copy: "Discover Malmö 2026",
    col1: "Upptäck mer", col2: "Företag",
    news: "Nyheter", contact: "Kontakta oss", about: "Om oss",
    experiences: "Upplevelser", rentCar: "Hyra bil", hotels: "Hotell", camping: "Camping",
  },
  en: {
    copy: "Discover Malmö 2026",
    col1: "Discover more", col2: "Company",
    news: "News", contact: "Contact us", about: "About",
    experiences: "Experiences", rentCar: "Rent a car", hotels: "Hotels", camping: "Camping",
  },
  de: {
    copy: "Discover Malmö 2026",
    col1: "Mehr entdecken", col2: "Unternehmen",
    news: "Neuigkeiten", contact: "Kontakt", about: "Über uns",
    experiences: "Erlebnisse", rentCar: "Auto mieten", hotels: "Hotels", camping: "Camping",
  },
};

const LANGS: { code: Lang; flag: string; label: string }[] = [
  { code: "sv", flag: "🇸🇪", label: "Svenska" },
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "de", flag: "🇩🇪", label: "Deutsch" },
];

const getInitialLang = (): Lang => {
  try {
    const saved = localStorage.getItem("dm-lang") as Lang;
    if (saved && ["sv", "en", "de"].includes(saved)) return saved;
  } catch {}
  return "sv";
};

export default function SiteFooter() {
  const [lang, setLang] = useState<Lang>("sv");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLang(getInitialLang());
    const onStorage = () => setLang(getInitialLang());
    const onCustom = (e: Event) => {
      const l = (e as CustomEvent).detail as Lang;
      if (["sv", "en", "de"].includes(l)) setLang(l);
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("dm-lang-change", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("dm-lang-change", onCustom);
    };
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const changeLang = (l: Lang) => {
    try { localStorage.setItem("dm-lang", l); } catch {}
    setLang(l);
    setOpen(false);
    window.dispatchEvent(new CustomEvent("dm-lang-change", { detail: l }));
  };

  const t = T[lang];
  const current = LANGS.find((l) => l.code === lang)!;

  return (
    <footer className="foot">
      <div className="foot-inner">
        <div className="foot-cols">
          <nav className="foot-nav">
            <span className="foot-nav-title">{t.col1}</span>
            <a href="/upplevelser" className="foot-link">{t.experiences}</a>
            <a href="/hyra-bil" className="foot-link">{t.rentCar}</a>
            <a href="/hotell" className="foot-link">{t.hotels}</a>
            <a href="/camping" className="foot-link">{t.camping}</a>
          </nav>
          <nav className="foot-nav">
            <span className="foot-nav-title">{t.col2}</span>
            <a href="/news" className="foot-link">{t.news}</a>
            <a href="/om-oss" className="foot-link">{t.contact}</a>
            <a href="/om-oss" className="foot-link">{t.about}</a>
          </nav>
        </div>
        <div className="foot-bottom">
          <span className="foot-copy">{t.copy}</span>
          <div className="foot-lang" ref={ref}>
            <button className="foot-lang-trigger" onClick={() => setOpen((v) => !v)} aria-label="Byt språk">
              {current.flag}
            </button>
            {open && (
              <div className="foot-lang-menu">
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    className={`foot-lang-opt${lang === l.code ? " active" : ""}`}
                    onClick={() => changeLang(l.code)}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
