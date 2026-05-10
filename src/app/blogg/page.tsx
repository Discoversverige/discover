import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blogg | Discover Malmö – Stories, guider och tips från staden",
  description: "Discover Malmös blogg: artiklar, stadsguider och insidertips från Malmöbor om resor, mat, hotell och kultur i Malmö.",
  openGraph: {
    title: "Blogg | Discover Malmö",
    description: "Stories, guider och Malmö-tips från lokalbor.",
    url: "https://discovermalmo.se/blogg",
    siteName: "Discover Malmö",
    locale: "sv_SE",
    type: "website",
  },
  alternates: { canonical: "https://discovermalmo.se/blogg" },
};

export default function BloggPage() {
  const posts = getAllPosts();

  return (
    <main className="blogg-page">
      <section className="blogg-list-hero">
        <div className="blogg-list-hero-inner">
          <p className="om-eyebrow">Bloggen</p>
          <h1 className="blogg-list-title">
            Stories, guider<br /><em>och Malmö-tips.</em>
          </h1>
          <p className="blogg-list-lead">
            Artiklar om Malmös platser, restauranger, kultur och praktiska resetips —
            skrivna av Malmöbor.
          </p>
        </div>
      </section>

      <section className="blogg-list-section">
        <div className="blogg-list-inner">
          {posts.length === 0 ? (
            <p className="blogg-empty">Inga inlägg ännu.</p>
          ) : (
            <ul className="blogg-list">
              {posts.map((post) => (
                <li key={post.slug} className="blogg-card">
                  <Link href={`/blogg/${post.slug}`} className="blogg-card-link">
                    <div className="blogg-card-meta">
                      {post.category && <span className="blogg-card-cat">{post.category}</span>}
                      <span className="blogg-card-dot">·</span>
                      <span className="blogg-card-date">{formatDate(post.date, "sv")}</span>
                    </div>
                    <h2 className="blogg-card-title">{post.title}</h2>
                    <p className="blogg-card-desc">{post.description}</p>
                    <span className="blogg-card-readtime">{post.readTime}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
