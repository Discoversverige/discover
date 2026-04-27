"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useLang } from "@/lib/lang";
import {
  getCity,
  getOffers,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  type CitySlug,
  type CategorySlug,
  type TravelOffer,
} from "@/lib/travel-data";
import TravelPinSidePanel from "./TravelPinSidePanel";

const TravelLandingMap = dynamic(() => import("./TravelLandingMap"), { ssr: false });

const STRINGS = {
  sv: {
    back: "Ta dig hit",
    introBoende: "Handplockat boende — boka direkt på kartan eller via listan nedan.",
    introBil: "Hyrbil på plats — direkt vid ankomst, fri avbokning på de flesta.",
    introTransport: "Tåg, buss och transfer — så tar du dig vidare härifrån.",
    listEyebrow: "Alternativ",
    cta: "VISA",
    other: "Andra kategorier",
    altIntro: "Boende, bil och transport från",
  },
  en: {
    back: "Get here",
    introBoende: "Hand-picked stays — book directly on the map or from the list.",
    introBil: "On-site car rental — at arrival, free cancellation on most.",
    introTransport: "Train, bus and transfer — how to continue from here.",
    listEyebrow: "Options",
    cta: "VIEW",
    other: "Other categories",
    altIntro: "Stays, car and transport from",
  },
  de: {
    back: "Anfahrt",
    introBoende: "Handverlesene Unterkünfte — direkt auf der Karte oder unten buchen.",
    introBil: "Mietwagen vor Ort — bei Ankunft, meist kostenlose Stornierung.",
    introTransport: "Zug, Bus und Transfer — wie es weitergeht von hier.",
    listEyebrow: "Optionen",
    cta: "ANSEHEN",
    other: "Andere Kategorien",
    altIntro: "Unterkunft, Auto und Transport ab",
  },
} as const;

interface Props {
  city: CitySlug;
  category: CategorySlug;
}

export default function TravelLanding({ city, category }: Props) {
  const lang = useLang();
  const t = STRINGS[lang];
  const cityData = getCity(city)!;
  const offers = getOffers(city, category);
  const catLabel = CATEGORY_LABELS[category][lang];
  const cityName = cityData.name[lang];
  const cityTag = cityData.tag[lang];
  const mode = cityData.pinMode;

  const [activeOffer, setActiveOffer] = useState<TravelOffer | null>(null);

  const introByCat: Record<CategorySlug, string> = {
    boende: t.introBoende,
    bil: t.introBil,
    transport: t.introTransport,
  };

  const titleByCat: Record<CategorySlug, { lead: string; em: string }> = {
    boende: {
      sv: { lead: "Boende vid", em: cityName + "." },
      en: { lead: "Stay near", em: cityName + "." },
      de: { lead: "Unterkunft bei", em: cityName + "." },
    }[lang],
    bil: {
      sv: { lead: "Hyrbil vid", em: cityName + "." },
      en: { lead: "Rent a car at", em: cityName + "." },
      de: { lead: "Mietwagen ab", em: cityName + "." },
    }[lang],
    transport: {
      sv: { lead: "Transport från", em: cityName + "." },
      en: { lead: "Transport from", em: cityName + "." },
      de: { lead: "Transport ab", em: cityName + "." },
    }[lang],
  };
  const title = titleByCat[category];

  return (
    <div className="land-page">
      <header className="land-hero">
        <div className="land-hero-top">
          <a href="/ta-dig-hit" className="land-back">
            <span className="land-back-arrow">←</span>
            <span>{t.back}</span>
          </a>
          <div className="land-hero-trail">
            <span>{cityTag}</span>
            <span className="land-hero-trail-sep">/</span>
            <span>{catLabel}</span>
          </div>
        </div>
        <div className="land-hero-eyebrow">
          {catLabel.toUpperCase()} · {cityTag.toUpperCase()}
        </div>
        <h1 className="land-title">
          <span className="land-title-lead">{title.lead}</span>{" "}
          <span className="land-title-em">{title.em}</span>
        </h1>
        <p className="land-intro">{introByCat[category]}</p>
      </header>

      <div className="land-map-section">
        <TravelLandingMap
          city={cityData}
          offers={offers}
          mode={mode}
          activeId={activeOffer?.id ?? null}
          onSelect={(offer) => setActiveOffer(offer)}
          ctaLabel={t.cta}
          lang={lang}
        />
      </div>

      <section className="land-list">
        <div className="land-list-head">
          <div className="hub-eyebrow">{t.listEyebrow}</div>
          <div className="land-list-count">
            {String(offers.length).padStart(2, "0")} ·{" "}
            <span>{catLabel}</span>
          </div>
        </div>
        <div className="land-list-grid">
          {offers.map((offer, idx) => (
            <article key={offer.id} className="land-card">
              <div className="land-card-num">{String(idx + 1).padStart(2, "0")}</div>
              <div className="land-card-img" style={{ backgroundImage: `url(${offer.image})` }} />
              <div className="land-card-body">
                <h3 className="land-card-name">{offer.name}</h3>
                <p className="land-card-blurb">{offer.blurb[lang]}</p>
                <div className="land-card-foot">
                  <span className="land-card-price">{offer.price[lang]}</span>
                  <a href={offer.url} target="_blank" rel="noopener noreferrer sponsored" className="land-card-cta">
                    {t.cta}
                    <span aria-hidden>→</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="land-other">
        <div className="hub-eyebrow">{t.other}</div>
        <div className="land-other-grid">
          {CATEGORY_ORDER.filter((c) => c !== category).map((c) => (
            <a key={c} href={`/ta-dig-hit/${city}/${c}`} className="land-other-link">
              <span className="land-other-label">{CATEGORY_LABELS[c][lang]}</span>
              <span className="land-other-meta">
                {t.altIntro} {cityName}
              </span>
              <span className="land-other-arrow">→</span>
            </a>
          ))}
        </div>
      </section>

      {mode === "sidepanel" && (
        <TravelPinSidePanel
          offer={activeOffer}
          lang={lang}
          ctaLabel={t.cta}
          onClose={() => setActiveOffer(null)}
        />
      )}
    </div>
  );
}
