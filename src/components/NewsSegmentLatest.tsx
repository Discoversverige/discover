import Link from "next/link";
import type { NewsPost } from "@/lib/news";
import { formatDate } from "@/lib/news";

type Props = {
  featured: NewsPost;
  rest: NewsPost[];
};

export default function NewsSegmentLatest({ featured, rest }: Props) {
  return (
    <section className="news-segment">
      <div className="news-segment-header">
        <p className="news-segment-label">Senaste</p>
        <h1 className="news-segment-title">Nya inlägg från Discover Malmö</h1>
      </div>

      <article className="news-featured">
        <Link href={`/news/${featured.slug}`} className="news-featured-link">
          <img
            src={featured.image}
            alt={featured.title}
            className="news-featured-img"
          />
          <div className="news-featured-text">
            <div className="news-card-meta">
              {featured.category && <span className="news-card-cat">{featured.category}</span>}
              <span className="news-card-dot">·</span>
              <span className="news-card-date">{formatDate(featured.date, "sv")}</span>
              {featured.readTime && (
                <>
                  <span className="news-card-dot">·</span>
                  <span className="news-card-readtime">{featured.readTime}</span>
                </>
              )}
            </div>
            <h3 className="news-featured-title">{featured.title}</h3>
            <p className="news-featured-desc">{featured.description}</p>
            <span className="news-featured-cta">Läs mer →</span>
          </div>
        </Link>
      </article>

      {rest.length > 0 && (
        <ul className="news-grid-3">
          {rest.slice(0, 3).map((post) => (
            <li key={post.slug} className="news-mini-card">
              <Link href={`/news/${post.slug}`} className="news-mini-link">
                <img src={post.image} alt={post.title} className="news-mini-img" />
                <div className="news-mini-text">
                  <div className="news-card-meta">
                    {post.category && <span className="news-card-cat">{post.category}</span>}
                  </div>
                  <h3 className="news-mini-title">{post.title}</h3>
                  <span className="news-mini-date">{formatDate(post.date, "sv")}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
