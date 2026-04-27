"use client";

import { useEffect, useState } from "react";

export type Lang = "sv" | "en" | "de";

const isLang = (v: unknown): v is Lang => v === "sv" || v === "en" || v === "de";

export function readLang(): Lang {
  try {
    const saved = localStorage.getItem("dm-lang");
    if (isLang(saved)) return saved;
  } catch {}
  return "sv";
}

export function useLang(): Lang {
  const [lang, setLang] = useState<Lang>("sv");

  useEffect(() => {
    setLang(readLang());
    const handler = (e: Event) => {
      const next = (e as CustomEvent<Lang>).detail;
      if (isLang(next)) setLang(next);
    };
    window.addEventListener("dm-lang-change", handler);
    return () => window.removeEventListener("dm-lang-change", handler);
  }, []);

  return lang;
}
