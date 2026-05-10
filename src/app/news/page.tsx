import type { Metadata } from "next";
import { getAllPosts, getFeaturedAndRest, getAllCategories } from "@/lib/news";
import { EXPERIENCES } from "@/lib/experiences";
import NewsSegmentLatest from "@/components/NewsSegmentLatest";
import NewsSegmentExperiences from "@/components/NewsSegmentExperiences";
import NewsSegmentTopics from "@/components/NewsSegmentTopics";

export const metadata: Metadata = {
  title: "News | Discover Malmö – Stories, guider och tips från staden",
  description: "Discover Malmös news: artiklar, stadsguider och insidertips från Malmöbor om resor, mat, hotell och kultur i Malmö.",
  openGraph: {
    title: "News | Discover Malmö",
    description: "Stories, guider och Malmö-tips från lokalbor.",
    url: "https://discovermalmo.se/news",
    siteName: "Discover Malmö",
    locale: "sv_SE",
    type: "website",
  },
  alternates: { canonical: "https://discovermalmo.se/news" },
};

export default function NewsPage() {
  const { featured, rest } = getFeaturedAndRest();
  const allPosts = getAllPosts();
  const categories = getAllCategories();
  const carouselExperiences = EXPERIENCES
    .filter((e) => e.region === "Malmö")
    .slice(0, 8);

  return (
    <main className="news-page">
      <section className="news-list-hero">
        <div className="news-list-hero-inner">
          <p className="om-eyebrow">News</p>
          <h1 className="news-list-title">
            Stories, guider<br /><em>och Malmö-tips.</em>
          </h1>
          <p className="news-list-lead">
            Artiklar om Malmös platser, restauranger, kultur och praktiska resetips —
            skrivna av Malmöbor.
          </p>
        </div>
      </section>

      {featured ? (
        <NewsSegmentLatest featured={featured} rest={rest} />
      ) : (
        <section className="news-segment">
          <p className="news-empty">Inga inlägg ännu.</p>
        </section>
      )}

      {carouselExperiences.length > 0 && (
        <NewsSegmentExperiences items={carouselExperiences} />
      )}

      {allPosts.length > 0 && (
        <NewsSegmentTopics posts={allPosts} categories={categories} />
      )}
    </main>
  );
}
