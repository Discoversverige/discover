"use client";

import { useState } from "react";

interface Props {
  main: string;
  gallery: string[];
  alt: string;
}

export default function ExperienceGallery({ main, gallery, alt }: Props) {
  const all = [main, ...gallery].filter(Boolean);
  const [active, setActive] = useState(0);
  if (all.length === 0) {
    return <div className="exp-gallery-main" aria-hidden="true" />;
  }
  return (
    <div className="exp-gallery">
      <div className="exp-gallery-main">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={all[active]} alt={alt} />
      </div>
      {all.length > 1 && (
        <div className="exp-gallery-thumbs">
          {all.map((src, i) => (
            <button
              key={src}
              className={`exp-gallery-thumb ${i === active ? "active" : ""}`}
              onClick={() => setActive(i)}
              aria-label={`Visa bild ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
