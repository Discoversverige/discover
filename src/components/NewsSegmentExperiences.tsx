"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Experience } from "@/lib/experiences";

type Props = {
  items: Experience[];
};

export default function NewsSegmentExperiences({ items }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrowState = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrowState();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrowState, { passive: true });
    window.addEventListener("resize", updateArrowState);
    return () => {
      el.removeEventListener("scroll", updateArrowState);
      window.removeEventListener("resize", updateArrowState);
    };
  }, [items.length]);

  const scrollByCard = (dir: "prev" | "next") => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".news-carousel-card");
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.85;
    el.scrollBy({ left: dir === "next" ? step : -step, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <section className="news-segment news-segment-carousel">
      <div className="news-segment-header news-segment-header-row">
        <div>
          <p className="news-segment-label">Utvalda upplevelser</p>
          <h2 className="news-segment-title">Handplockade saker att göra i Malmö</h2>
        </div>
        <div className="news-carousel-controls" aria-hidden="true">
          <button
            type="button"
            className="news-carousel-arrow"
            onClick={() => scrollByCard("prev")}
            disabled={!canPrev}
            aria-label="Visa föregående"
          >
            ←
          </button>
          <button
            type="button"
            className="news-carousel-arrow"
            onClick={() => scrollByCard("next")}
            disabled={!canNext}
            aria-label="Visa nästa"
          >
            →
          </button>
        </div>
      </div>

      <div className="news-carousel-wrap">
        <div className="news-carousel" ref={scrollerRef}>
          {items.map((exp) => (
            <Link
              key={exp.id}
              href={`/upplevelser/${exp.slug}`}
              className="news-carousel-card"
            >
              <div className="news-carousel-img-wrap">
                <img
                  src={exp.images.main}
                  alt={exp.images.alt || exp.title}
                  className="news-carousel-img"
                  loading="lazy"
                />
              </div>
              <div className="news-carousel-card-info">
                <span className="news-carousel-cat">{exp.category}</span>
                <h3 className="news-carousel-title">{exp.title}</h3>
                <span className="news-carousel-price">
                  Från {exp.priceFrom.toLocaleString("sv-SE")} kr
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
