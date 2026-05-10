import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import { formatDate } from "@/lib/blog";

type Props = {
  featured: BlogPost;
  rest: BlogPost[];
};

export default function BloggSegmentLatest({ featured, rest }: Props) {
  return (
    <section className="blogg-segment">
      <div className="blogg-segment-header">
        <p className="blogg-segment-label">Senaste</p>
        <h2 className="blogg-segment-title">Nya inlägg från Discover Malmö</h2>
      </div>

      <article className="blogg-featured">
        <Link href={`/blogg/${featured.slug}`} className="blogg-featured-link">
          <img
            src={featured.image}
            alt={featured.title}
            className="blogg-featured-img"
          />
          <div className="blogg-featured-text">
            <div className="blogg-card-meta">
              {featured.category && <span className="blogg-card-cat">{featured.category}</span>}
              <span className="blogg-card-dot">·</span>
              <span className="blogg-card-date">{formatDate(featured.date, "sv")}</span>
              {featured.readTime && (
                <>
                  <span className="blogg-card-dot">·</span>
                  <span className="blogg-card-readtime">{featured.readTime}</span>
                </>
              )}
            </div>
            <h3 className="blogg-featured-title">{featured.title}</h3>
            <p className="blogg-featured-desc">{featured.description}</p>
            <span className="blogg-featured-cta">Läs mer →</span>
          </div>
        </Link>
      </article>

      {rest.length > 0 && (
        <ul className="blogg-grid-3">
          {rest.slice(0, 3).map((post) => (
            <li key={post.slug} className="blogg-mini-card">
              <Link href={`/blogg/${post.slug}`} className="blogg-mini-link">
                <img src={post.image} alt={post.title} className="blogg-mini-img" />
                <div className="blogg-mini-text">
                  <div className="blogg-card-meta">
                    {post.category && <span className="blogg-card-cat">{post.category}</span>}
                    <span className="blogg-card-dot">·</span>
                    <span className="blogg-card-date">{formatDate(post.date, "sv")}</span>
                  </div>
                  <h3 className="blogg-mini-title">{post.title}</h3>
                  <p className="blogg-mini-desc">{post.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
