import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export { formatDate } from "./format-date";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  featured: boolean;
  content: string;
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const FALLBACK_IMAGE = "/images/bannern.jpg";

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: data.date ?? "",
    readTime: data.readTime ?? "",
    category: data.category ?? "",
    image: data.image ?? FALLBACK_IMAGE,
    featured: data.featured === true,
    content,
  };
}

export function getAllPosts(): BlogPost[] {
  return getAllPostSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is BlogPost => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getFeaturedAndRest(): { featured: BlogPost | null; rest: BlogPost[] } {
  const all = getAllPosts();
  if (all.length === 0) return { featured: null, rest: [] };
  const explicitFeatured = all.find((p) => p.featured);
  const featured = explicitFeatured ?? all[0];
  const rest = all.filter((p) => p.slug !== featured.slug);
  return { featured, rest };
}

export function getAllCategories(): string[] {
  const cats = new Set<string>();
  for (const post of getAllPosts()) {
    if (post.category) cats.add(post.category);
  }
  return Array.from(cats).sort();
}

