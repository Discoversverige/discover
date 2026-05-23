"use client";

import { useEffect, useRef, useState } from "react";

type Lang = "sv" | "en" | "de";

const FOOTER = {
  sv: { copy: "Discover Malmö 2026", contact: "Kontakta oss", news: "Nyheter" },
  en: { copy: "Discover Malmö 2026", contact: "Contact us", news: "News" },
  de: { copy: "Discover Malmö 2026", contact: "Kontakt", news: "Neuigkeiten" },
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

  const t = FOOTER[lang];
  const current = LANGS.find((l) => l.code === lang)!;

  return (
    <footer className="foot">
      <div className="foot-inner">
        <div className="foot-grid">
          <a href="/news" className="foot-link">{t.news}</a>
          <a href="/om-oss" className="foot-link">{t.contact}</a>
        </div>
        <div className="foot-bottom">
          <span className="foot-copy">{t.copy}</span>
          <div className="foot-lang" ref={ref}>
            <button className="foot-lang-trigger" onClick={() => setOpen((v) => !v)} aria-label="Byt språk">
              <span>{current.flag}</span>
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
