"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { NewsPost } from "@/lib/news";
import { formatDate } from "@/lib/format-date";

type Props = {
  posts: NewsPost[];
  categories: string[];
};

const ALL_KEY = "Alla";

export default function NewsSegmentTopics({ posts, categories }: Props) {
  const [active, setActive] = useState<string>(ALL_KEY);

  const filtered = useMemo(() => {
    if (active === ALL_KEY) return posts;
    return posts.filter((p) => p.category === active);
  }, [posts, active]);

  return (
    <section className="news-segment">
      <div className="news-segment-header">
        <p className="news-segment-label">Bläddra efter ämne</p>
        <h2 className="news-segment-title">Hela arkivet</h2>
      </div>

      <div className="news-topics-chips" role="tablist" aria-label="Filtrera efter kategori">
        <button
          type="button"
          role="tab"
          aria-selected={active === ALL_KEY}
          className="news-topic-chip"
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
            className="news-topic-chip"
            data-active={active === cat}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="news-empty">Inga inlägg i den här kategorin ännu.</p>
      ) : (
        <ul className="news-topics-list">
          {filtered.map((post) => (
            <li key={post.slug} className="news-topic-row">
              <Link href={`/news/${post.slug}`} className="news-topic-row-link">
                <img
                  src={post.image}
                  alt={post.title}
                  className="news-topic-row-img"
                  loading="lazy"
                />
                <div className="news-topic-row-text">
                  <div className="news-card-meta">
                    {post.category && <span className="news-card-cat">{post.category}</span>}
                    <span className="news-card-dot">·</span>
                    <span className="news-card-date">{formatDate(post.date, "sv")}</span>
                  </div>
                  <h3 className="news-topic-row-title">{post.title}</h3>
                  <p className="news-topic-row-desc">{post.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
