import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPostSlugs, getPostBySlug, formatDate } from "@/lib/blog";

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
      url: `https://discovermalmo.se/blogg/${post.slug}`,
      siteName: "Discover Malmö",
      locale: "sv_SE",
      type: "article",
    },
    alternates: { canonical: `https://discovermalmo.se/blogg/${post.slug}` },
  };
}

export default async function BloggPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="blogg-article-page">
      <article className="blogg-article">
        <header className="blogg-article-header">
          <Link href="/blogg" className="blogg-back">← Alla inlägg</Link>
          <div className="blogg-article-meta">
            {post.category && <span className="blogg-card-cat">{post.category}</span>}
            <span className="blogg-card-dot">·</span>
            <span className="blogg-card-date">{formatDate(post.date, "sv")}</span>
            <span className="blogg-card-dot">·</span>
            <span className="blogg-card-readtime">{post.readTime}</span>
          </div>
          <h1 className="blogg-article-title">{post.title}</h1>
          <p className="blogg-article-lead">{post.description}</p>
        </header>

        <div className="blogg-article-body">
          <MDXRemote source={post.content} />
        </div>

        <footer className="blogg-article-footer">
          <Link href="/blogg" className="blogg-back">← Tillbaka till alla inlägg</Link>
        </footer>
      </article>
    </main>
  );
}
