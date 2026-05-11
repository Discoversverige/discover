import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/news";

export const dynamic = "force-static";

export async function GET() {
  const posts = getAllPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    date: p.date,
    category: p.category,
    image: p.image,
  }));
  return NextResponse.json(posts);
}
