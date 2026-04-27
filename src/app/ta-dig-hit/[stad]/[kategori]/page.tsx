import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TravelLanding from "@/components/TravelLanding";
import {
  TRAVEL_CITIES,
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  getAllRoutes,
  getCity,
  isCitySlug,
  isCategorySlug,
  type CitySlug,
  type CategorySlug,
} from "@/lib/travel-data";

interface Params {
  params: Promise<{ stad: string; kategori: string }>;
}

export async function generateStaticParams() {
  return getAllRoutes();
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { stad, kategori } = await params;
  if (!isCitySlug(stad) || !isCategorySlug(kategori)) {
    return { title: "Discover Malmö" };
  }
  const city = getCity(stad);
  if (!city) return { title: "Discover Malmö" };

  const cityName = city.name.sv;
  const catName = CATEGORY_LABELS[kategori].sv;
  const titleByCat: Record<CategorySlug, string> = {
    boende: `Boende ${cityName}`,
    bil: `Hyrbil ${cityName}`,
    transport: `Transport ${cityName}`,
  };
  const descByCat: Record<CategorySlug, string> = {
    boende: `Hotell och boende vid ${cityName} — handplockade alternativ med karta och bokning.`,
    bil: `Hyrbil vid ${cityName} — biluthyrning på plats med pris och tillgänglighet.`,
    transport: `Transport från ${cityName} — tåg, buss och transferalternativ direkt på kartan.`,
  };
  const title = `${titleByCat[kategori]} | Discover Malmö`;
  return {
    title,
    description: descByCat[kategori],
    openGraph: { title, description: descByCat[kategori] },
  };
}

export default async function TravelLandingPage({ params }: Params) {
  const { stad, kategori } = await params;
  if (!isCitySlug(stad) || !isCategorySlug(kategori)) notFound();
  return <TravelLanding city={stad as CitySlug} category={kategori as CategorySlug} />;
}
