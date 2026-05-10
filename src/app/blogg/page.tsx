import type { Metadata } from "next";
import { getAllPosts, getFeaturedAndRest, getAllCategories } from "@/lib/blog";
import { EXPERIENCES } from "@/lib/experiences";
import BloggSegmentLatest from "@/components/BloggSegmentLatest";
import BloggSegmentExperiences from "@/components/BloggSegmentExperiences";
import BloggSegmentTopics from "@/components/BloggSegmentTopics";

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
  const { featured, rest } = getFeaturedAndRest();
  const allPosts = getAllPosts();
  const categories = getAllCategories();
  const carouselExperiences = EXPERIENCES
    .filter((e) => e.region === "Malmö")
    .slice(0, 8);

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

      {featured ? (
        <BloggSegmentLatest featured={featured} rest={rest} />
      ) : (
        <section className="blogg-segment">
          <p className="blogg-empty">Inga inlägg ännu.</p>
        </section>
      )}

      {carouselExperiences.length > 0 && (
        <BloggSegmentExperiences items={carouselExperiences} />
      )}

      {allPosts.length > 0 && (
        <BloggSegmentTopics posts={allPosts} categories={categories} />
      )}
    </main>
  );
}
