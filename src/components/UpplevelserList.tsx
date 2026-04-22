"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Experience } from "@/lib/experiences";
import { CATEGORIES, REGIONS, formatPrice } from "@/lib/experiences";

type SortKey = "popular" | "price-asc" | "price-desc" | "name";
type PriceBucket = "all" | "0-500" | "500-1500" | "1500+";

interface Props {
  experiences: Experience[];
}

export default function UpplevelserList({ experiences }: Props) {
  const [category, setCategory] = useState<string>("all");
  const [region, setRegion] = useState<string>("all");
  const [price, setPrice] = useState<PriceBucket>("all");
  const [sort, setSort] = useState<SortKey>("popular");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = experiences;
    if (category !== "all") list = list.filter((e) => e.category === category);
    if (region !== "all") list = list.filter((e) => e.region === region);
    if (price !== "all") {
      list = list.filter((e) => {
        if (price === "0-500") return e.priceFrom <= 500;
        if (price === "500-1500") return e.priceFrom > 500 && e.priceFrom <= 1500;
        if (price === "1500+") return e.priceFrom > 1500;
        return true;
      });
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.shortDescription.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.priceFrom - b.priceFrom);
    if (sort === "price-desc") sorted.sort((a, b) => b.priceFrom - a.priceFrom);
    if (sort === "name") sorted.sort((a, b) => a.title.localeCompare(b.title, "sv"));
    return sorted;
  }, [experiences, category, region, price, sort, query]);

  return (
    <div className="upp-page">
      <header className="upp-header">
        <div className="upp-header-inner">
          <p className="upp-eyebrow">Upplevelser i Malmö och Skåne</p>
          <h1 className="upp-title">
            Hitta <em>din nästa</em> upplevelse
          </h1>
          <p className="upp-sub">
            {experiences.length} upplevelser — från ölprovning och spa till racing och luftballong.
          </p>

          <div className="upp-search">
            <input
              type="search"
              placeholder="Sök upplevelse, tagg eller kategori…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Sök upplevelser"
            />
          </div>
        </div>
      </header>

      <section className="upp-filters" aria-label="Filter">
        <div className="upp-filter-group">
          <span className="upp-filter-label">Kategori</span>
          <div className="upp-chips">
            <button
              className={`upp-chip ${category === "all" ? "active" : ""}`}
              onClick={() => setCategory("all")}
            >
              Alla
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`upp-chip ${category === c ? "active" : ""}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="upp-filter-group">
          <span className="upp-filter-label">Område</span>
          <div className="upp-chips">
            <button
              className={`upp-chip ${region === "all" ? "active" : ""}`}
              onClick={() => setRegion("all")}
            >
              Alla
            </button>
            {REGIONS.map((r) => (
              <button
                key={r}
                className={`upp-chip ${region === r ? "active" : ""}`}
                onClick={() => setRegion(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="upp-filter-group">
          <span className="upp-filter-label">Pris</span>
          <div className="upp-chips">
            {([
              ["all", "Alla"],
              ["0-500", "≤ 500 kr"],
              ["500-1500", "500–1 500 kr"],
              ["1500+", "1 500+ kr"],
            ] as [PriceBucket, string][]).map(([key, label]) => (
              <button
                key={key}
                className={`upp-chip ${price === key ? "active" : ""}`}
                onClick={() => setPrice(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="upp-filter-group upp-sort">
          <span className="upp-filter-label">Sortera</span>
          <select
            className="upp-select"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sortering"
          >
            <option value="popular">Populärast</option>
            <option value="price-asc">Lägsta pris</option>
            <option value="price-desc">Högsta pris</option>
            <option value="name">Namn (A–Ö)</option>
          </select>
        </div>
      </section>

      <p className="upp-count">
        Visar {filtered.length} av {experiences.length}
      </p>

      {filtered.length === 0 ? (
        <div className="upp-empty">
          <p>Inga upplevelser matchar dina filter.</p>
          <button
            className="upp-reset"
            onClick={() => {
              setCategory("all");
              setRegion("all");
              setPrice("all");
              setQuery("");
            }}
          >
            Rensa filter
          </button>
        </div>
      ) : (
        <section className="upp-grid">
          {filtered.map((e) => (
            <Link key={e.id} href={`/upplevelser/${e.slug}`} className="upp-card">
              <div className="upp-card-img-wrap">
                {e.images.main ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={e.images.main}
                    alt={e.images.alt}
                    className="upp-card-img"
                    loading="lazy"
                  />
                ) : (
                  <div className="upp-card-img upp-card-img-placeholder" aria-hidden="true" />
                )}
                {e.priceCompareAt && e.priceCompareAt > e.priceFrom && (
                  <span className="upp-card-badge">
                    −{Math.round((1 - e.priceFrom / e.priceCompareAt) * 100)}%
                  </span>
                )}
              </div>
              <div className="upp-card-body">
                <div className="upp-card-meta">
                  <span className="upp-card-cat">{e.category}</span>
                  <span className="upp-card-region">{e.region}</span>
                </div>
                <h3 className="upp-card-title">{e.title}</h3>
                {e.duration && <p className="upp-card-duration">⏱ {e.duration}</p>}
                <div className="upp-card-price-row">
                  <span className="upp-card-price">Från {formatPrice(e.priceFrom)}</span>
                  {e.priceCompareAt && e.priceCompareAt > e.priceFrom && (
                    <span className="upp-card-price-compare">{formatPrice(e.priceCompareAt)}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
