"use client";

import { useEffect, useState } from "react";

type Lang = "sv" | "en" | "de";

const FOOTER = {
  sv: { text: "En tjänst av Discover Malmö · 2026", contact: "Kontakta oss", news: "Nyheter" },
  en: { text: "A service by Discover Malmö · 2026", contact: "Contact us", news: "News" },
  de: { text: "Ein Service von Discover Malmö · 2026", contact: "Kontakt", news: "Neuigkeiten" },
};

const FLAGS: Record<Lang, string> = { sv: "🇸🇪", en: "🇬🇧", de: "🇩🇪" };
const LABELS: Record<Lang, string> = { sv: "SV", en: "EN", de: "DE" };

const getInitialLang = (): Lang => {
  try {
    const saved = localStorage.getItem("dm-lang") as Lang;
    if (saved && ["sv", "en", "de"].includes(saved)) return saved;
  } catch {}
  return "sv";
};

export default function SiteFooter() {
  const [lang, setLang] = useState<Lang>("sv");

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

  const changeLang = (l: Lang) => {
    try { localStorage.setItem("dm-lang", l); } catch {}
    setLang(l);
    window.dispatchEvent(new CustomEvent("dm-lang-change", { detail: l }));
  };

  const t = FOOTER[lang];

  return (
    <footer className="foot">
      <div className="foot-left">
        <span className="foot-copy">{t.text}</span>
        <nav className="foot-nav">
          <a href="/om-oss" className="foot-link">{t.contact}</a>
          <span className="foot-sep">·</span>
          <a href="/news" className="foot-link">{t.news}</a>
        </nav>
      </div>
      <div className="foot-lang">
        {(["sv", "en", "de"] as Lang[]).map((l) => (
          <button
            key={l}
            onClick={() => changeLang(l)}
            className={`foot-lang-btn${lang === l ? " active" : ""}`}
            aria-label={l === "sv" ? "Svenska" : l === "en" ? "English" : "Deutsch"}
          >
            <span>{FLAGS[l]}</span>
            <span>{LABELS[l]}</span>
          </button>
        ))}
      </div>
    </footer>
  );
}
