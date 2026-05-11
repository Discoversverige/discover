"use client";

import { useEffect, useState } from "react";

type Lang = "sv" | "en" | "de";

const FOOTER = {
  sv: { text: "En tjänst av Discover Malmö · 2026", contact: "Kontakta oss", news: "News", navLabel: "Navigering" },
  en: { text: "A service by Discover Malmö · 2026", contact: "Contact us", news: "News", navLabel: "Navigation" },
  de: { text: "Ein Service von Discover Malmö · 2026", contact: "Kontakt", news: "News", navLabel: "Navigation" },
};

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

  const t = FOOTER[lang];

  return (
    <footer className="foot">
      <span className="foot-copy">{t.text}</span>
      <div className="foot-nav">
        <span className="foot-nav-label">{t.navLabel}</span>
        <a href="/om-oss" className="foot-link">{t.contact}</a>
        <a href="/news" className="foot-link">{t.news}</a>
      </div>
    </footer>
  );
}
