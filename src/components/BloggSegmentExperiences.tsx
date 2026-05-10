"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Experience } from "@/lib/experiences";

type Props = {
  items: Experience[];
};

export default function BloggSegmentExperiences({ items }: Props) {
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
    const card = el.querySelector<HTMLElement>(".blogg-carousel-card");
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.85;
    el.scrollBy({ left: dir === "next" ? step : -step, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <section className="blogg-segment blogg-segment-carousel">
      <div className="blogg-segment-header blogg-segment-header-row">
        <div>
          <p className="blogg-segment-label">Utvalda upplevelser</p>
          <h2 className="blogg-segment-title">Handplockade saker att göra i Malmö</h2>
        </div>
        <div className="blogg-carousel-controls" aria-hidden="true">
          <button
            type="button"
            className="blogg-carousel-arrow"
            onClick={() => scrollByCard("prev")}
            disabled={!canPrev}
            aria-label="Visa föregående"
          >
            ←
          </button>
          <button
            type="button"
            className="blogg-carousel-arrow"
            onClick={() => scrollByCard("next")}
            disabled={!canNext}
            aria-label="Visa nästa"
          >
            →
          </button>
        </div>
      </div>

      <div className="blogg-carousel-wrap">
        <div className="blogg-carousel" ref={scrollerRef}>
          {items.map((exp) => (
            <Link
              key={exp.id}
              href={`/upplevelser/${exp.slug}`}
              className="blogg-carousel-card"
            >
              <div className="blogg-carousel-img-wrap">
                <img
                  src={exp.images.main}
                  alt={exp.images.alt || exp.title}
                  className="blogg-carousel-img"
                  loading="lazy"
                />
              </div>
              <div className="blogg-carousel-card-info">
                <span className="blogg-carousel-cat">{exp.category}</span>
                <h3 className="blogg-carousel-title">{exp.title}</h3>
                <span className="blogg-carousel-price">
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
