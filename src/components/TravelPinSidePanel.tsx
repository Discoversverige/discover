"use client";

import { useEffect } from "react";
import type { Lang } from "@/lib/lang";
import type { TravelOffer } from "@/lib/travel-data";

const CLOSE_LABELS: Record<Lang, string> = { sv: "Stäng", en: "Close", de: "Schließen" };

interface Props {
  offer: TravelOffer | null;
  lang: Lang;
  ctaLabel: string;
  onClose: () => void;
}

export default function TravelPinSidePanel({ offer, lang, ctaLabel, onClose }: Props) {
  useEffect(() => {
    if (!offer) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [offer, onClose]);

  return (
    <>
      <div
        className={`land-panel-backdrop ${offer ? "is-open" : ""}`}
        onClick={onClose}
        aria-hidden={!offer}
      />
      <aside
        className={`land-panel ${offer ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={offer?.name ?? ""}
      >
        {offer && (
          <>
            <button
              type="button"
              className="land-panel-close"
              onClick={onClose}
              aria-label={CLOSE_LABELS[lang]}
            >
              ✕
            </button>
            <div className="land-panel-img" style={{ backgroundImage: `url(${offer.image})` }} />
            <div className="land-panel-body">
              <h3 className="land-panel-name">{offer.name}</h3>
              <p className="land-panel-blurb">{offer.blurb[lang]}</p>
              <div className="land-panel-meta">
                <span className="land-panel-price">{offer.price[lang]}</span>
              </div>
              <a
                href={offer.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="land-panel-cta"
              >
                {ctaLabel}
                <span aria-hidden>→</span>
              </a>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
