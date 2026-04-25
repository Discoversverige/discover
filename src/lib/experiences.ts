/**
 * Experience typ + publikt API för upplevelsedata.
 * Själva arrayen genereras av scripts/ingest-happyday.ts till experiences.generated.ts.
 */

export interface PricePoint {
  people: number;
  price: number;
  compareAt?: number;
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export type ExperienceSource = "happy-day" | "getyourguide" | "liveit" | "viator";

export interface Experience {
  id: string;
  slug: string;
  title: string;
  title_en?: string;
  title_de?: string;
  shortDescription: string;
  shortDescription_en?: string;
  shortDescription_de?: string;
  descriptionHtml: string;
  category: string;
  tags: string[];
  priceFrom: number;
  priceCompareAt?: number;
  pricePerPerson: PricePoint[];
  duration?: string;
  locations?: string;
  availability?: string;
  ageLimit?: string;
  participants?: string;
  importantInfo?: string;
  faq: FaqEntry[];
  region: "Malmö" | "Skåne" | "Sverige";
  images: {
    main: string;
    gallery: string[];
    alt: string;
  };
  sourceUrl: string;
  source?: ExperienceSource;
  rating?: number;
  reviewCount?: number;
}

import { EXPERIENCES_GENERATED } from "./experiences.generated";
import { GYG_EXPERIENCES } from "./gyg-experiences.generated";
import { LIVEIT_EXPERIENCES } from "./liveit-experiences.generated";
import { VIATOR_EXPERIENCES } from "./viator-experiences.generated";

const HAPPYDAY_EXPERIENCES: Experience[] = EXPERIENCES_GENERATED.map((e) => ({
  ...e,
  source: (e as Experience).source ?? "happy-day",
}));

export const EXPERIENCES: Experience[] = [
  ...HAPPYDAY_EXPERIENCES,
  ...GYG_EXPERIENCES,
  ...LIVEIT_EXPERIENCES,
  ...(VIATOR_EXPERIENCES as Experience[]),
];

export const CATEGORIES: string[] = Array.from(
  new Set(EXPERIENCES.map((e) => e.category))
).sort();

export const REGIONS: Experience["region"][] = ["Malmö", "Skåne", "Sverige"];

export function getExperienceBySlug(slug: string): Experience | undefined {
  return EXPERIENCES.find((e) => e.slug === slug);
}

export function formatPrice(sek: number): string {
  return `${sek.toLocaleString("sv-SE").replace(/,/g, " ")} kr`;
}

/**
 * Deterministiska lat/lng för Malmö-upplevelser baserat på slug-hash.
 * Happy Day exponerar inte exakta adresser — vi distribuerar pins jämnt
 * över centrala Malmö + Västra Hamnen så varje upplevelse får en stabil pin.
 * Returnerar null för upplevelser utanför Malmö (de aggregeras separat).
 */
export function getExperienceCoords(exp: Experience): [number, number] | null {
  if (exp.region !== "Malmö") return null;
  let h1 = 0;
  let h2 = 0;
  for (let i = 0; i < exp.slug.length; i++) {
    h1 = (h1 * 31 + exp.slug.charCodeAt(i)) | 0;
    h2 = (h2 * 37 + exp.slug.charCodeAt(i) * 7) | 0;
  }
  // Bounding box: central Malmö + Västra Hamnen + Möllevången
  // lat 55.590 (söder) – 55.620 (norr/Västra Hamnen)
  // lng 12.970 (väst) – 13.020 (öst/Möllan)
  const lat = 55.5915 + (Math.abs(h1) % 1000) / 1000 * 0.028;
  const lng = 12.9720 + (Math.abs(h2) % 1000) / 1000 * 0.045;
  return [lat, lng];
}

