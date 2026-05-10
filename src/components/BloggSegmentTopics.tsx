"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import { formatDate } from "@/lib/format-date";

type Props = {
  posts: BlogPost[];
  categories: string[];
};

const ALL_KEY = "Alla";

export default function BloggSegmentTopics({ posts, categories }: Props) {
  const [active, setActive] = useState<string>(ALL_KEY);

  const filtered = useMemo(() => {
    if (active === ALL_KEY) return posts;
    return posts.filter((p) => p.category === active);
  }, [posts, active]);

  return (
    <section className="blogg-segment">
      <div className="blogg-segment-header">
        <p className="blogg-segment-label">Bläddra efter ämne</p>
        <h2 className="blogg-segment-title">Hela arkivet</h2>
      </div>

      <div className="blogg-topics-chips" role="tablist" aria-label="Filtrera efter kategori">
        <button
          type="button"
          role="tab"
          aria-selected={active === ALL_KEY}
          className="blogg-topic-chip"
          data-active={active === ALL_KEY}
          onClick={() => setActive(ALL_KEY)}
        >
          {ALL_KEY}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={active === cat}
            className="blogg-topic-chip"
            data-active={active === cat}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="blogg-empty">Inga inlägg i den här kategorin ännu.</p>
      ) : (
        <ul className="blogg-topics-list">
          {filtered.map((post) => (
            <li key={post.slug} className="blogg-topic-row">
              <Link href={`/blogg/${post.slug}`} className="blogg-topic-row-link">
                <img
                  src={post.image}
                  alt={post.title}
                  className="blogg-topic-row-img"
                  loading="lazy"
                />
                <div className="blogg-topic-row-text">
                  <div className="blogg-card-meta">
                    {post.category && <span className="blogg-card-cat">{post.category}</span>}
                    <span className="blogg-card-dot">·</span>
                    <span className="blogg-card-date">{formatDate(post.date, "sv")}</span>
                  </div>
                  <h3 className="blogg-topic-row-title">{post.title}</h3>
                  <p className="blogg-topic-row-desc">{post.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
