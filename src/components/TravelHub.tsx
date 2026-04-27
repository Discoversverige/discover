"use client";

import dynamic from "next/dynamic";
import { useLang } from "@/lib/lang";
import { TRAVEL_CITIES, CATEGORY_ORDER, CATEGORY_LABELS } from "@/lib/travel-data";

const TravelHubMap = dynamic(() => import("./TravelHubMap"), { ssr: false });

const HERO = {
  sv: {
    eyebrow: "Region · Öresund",
    titleLead: "Ta dig till",
    titleEm: "Malmö.",
    titleTail: "Vi visar dig vägen.",
    intro:
      "Fyra ankomstpunkter — Kastrup, Malmö C, Sturup och Trelleborg. Klicka på en plats för att se boende, bil och transport som tar dig vidare.",
    sectionEyebrow: "Översikt",
    sectionTitle: "Fyra sätt att komma hit",
    learnMore: "Visa boende, bil och transport",
  },
  en: {
    eyebrow: "Region · Øresund",
    titleLead: "Get to",
    titleEm: "Malmö.",
    titleTail: "We'll show you the way.",
    intro:
      "Four arrival points — Kastrup, Malmö Central, Sturup and Trelleborg. Click a location to see stays, car and transport options.",
    sectionEyebrow: "Overview",
    sectionTitle: "Four ways to get here",
    learnMore: "Show stays, car and transport",
  },
  de: {
    eyebrow: "Region · Øresund",
    titleLead: "Anreise nach",
    titleEm: "Malmö.",
    titleTail: "Wir zeigen den Weg.",
    intro:
      "Vier Ankunftspunkte — Kastrup, Malmö Central, Sturup und Trelleborg. Wählen Sie einen Ort für Unterkunft, Auto und Transport.",
    sectionEyebrow: "Übersicht",
    sectionTitle: "Vier Wege, um hierher zu kommen",
    learnMore: "Unterkunft, Auto und Transport zeigen",
  },
};

export default function TravelHub() {
  const lang = useLang();
  const t = HERO[lang];

  return (
    <div className="hub-page">
      <header className="hub-hero">
        <div className="hub-hero-inner">
          <div className="hub-eyebrow">{t.eyebrow}</div>
          <h1 className="hub-title">
            <span className="hub-title-lead">{t.titleLead}</span>{" "}
            <span className="hub-title-em">{t.titleEm}</span>
            <span className="hub-title-tail">{t.titleTail}</span>
          </h1>
          <p className="hub-intro">{t.intro}</p>
        </div>
        <div className="hub-hero-meta">
          <div className="hub-meta-item">
            <span className="hub-meta-num">04</span>
            <span className="hub-meta-label">
              {lang === "sv" ? "Ankomstpunkter" : lang === "de" ? "Ankunftspunkte" : "Arrival points"}
            </span>
          </div>
          <div className="hub-meta-item">
            <span className="hub-meta-num">12</span>
            <span className="hub-meta-label">
              {lang === "sv" ? "Sidor att utforska" : lang === "de" ? "Seiten" : "Pages to explore"}
            </span>
          </div>
        </div>
      </header>

      <div className="hub-map-section">
        <TravelHubMap />
      </div>

      <section className="hub-cities">
        <div className="hub-cities-head">
          <div className="hub-eyebrow">{t.sectionEyebrow}</div>
          <h2 className="hub-cities-title">{t.sectionTitle}</h2>
        </div>
        <div className="hub-cities-grid">
          {TRAVEL_CITIES.map((city, idx) => (
            <article key={city.slug} className="hub-city-card">
              <div className="hub-city-num">{String(idx + 1).padStart(2, "0")}</div>
              <h3 className="hub-city-name">{city.name[lang]}</h3>
              <div className="hub-city-tag">{city.tag[lang]}</div>
              <ul className="hub-city-cats">
                {CATEGORY_ORDER.map((cat) => (
                  <li key={cat}>
                    <a
                      href={`/ta-dig-hit/${city.slug}/${cat}`}
                      className="hub-city-cat-link"
                    >
                      <span>{CATEGORY_LABELS[cat][lang]}</span>
                      <span className="hub-city-cat-arrow">→</span>
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
