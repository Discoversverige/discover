import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPostSlugs, getPostBySlug, formatDate } from "@/lib/news";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Inlägget hittades inte | Discover Malmö" };
  return {
    title: `${post.title} | Discover Malmö`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://discovermalmo.se/news/${post.slug}`,
      siteName: "Discover Malmö",
      locale: "sv_SE",
      type: "article",
    },
    alternates: { canonical: `https://discovermalmo.se/news/${post.slug}` },
  };
}

export default async function NewsPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="news-article-page">
      <article className="news-article">
        <header className="news-article-header">
          <Link href="/news" className="news-back">← Alla inlägg</Link>
          <div className="news-article-meta">
            {post.category && <span className="news-card-cat">{post.category}</span>}
            <span className="news-card-dot">·</span>
            <span className="news-card-date">{formatDate(post.date, "sv")}</span>
            <span className="news-card-dot">·</span>
            <span className="news-card-readtime">{post.readTime}</span>
          </div>
          <h1 className="news-article-title">{post.title}</h1>
          <p className="news-article-lead">{post.description}</p>
        </header>

        <div className="news-article-body">
          <MDXRemote source={post.content} />
        </div>

        <footer className="news-article-footer">
          <Link href="/news" className="news-back">← Tillbaka till alla inlägg</Link>
        </footer>
      </article>
    </main>
  );
}
