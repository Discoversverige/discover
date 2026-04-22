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

export interface Experience {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
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
}

import { EXPERIENCES_GENERATED } from "./experiences.generated";

export const EXPERIENCES: Experience[] = EXPERIENCES_GENERATED;

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
