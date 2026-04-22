/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Ingest pipeline för Happy Day upplevelser.
 * Körs med: npm run ingest:happyday
 *
 * Strategi (per user request, max 2 försök per steg, hoppa vidare på fel):
 *  1. Hämta alla produkter via Shopify public JSON (/collections/.../products.json)
 *  2. För varje produkt, hämta produktsidans HTML för att parsa faq-data metafält
 *     (Orter, Varaktighet, Tillgänglighet, Åldersgräns, Antal deltagare, FAQ)
 *  3. Ladda ner alla bilder lokalt till public/experiences/{slug}/
 *  4. Generera src/lib/experiences.generated.ts
 *
 * Not: Happy Day säljer presentkort/värdebevis — faktiska datum bokas efter köp
 *      via happy-day.com/book (bakom inloggning). Det finns alltså ingen publik
 *      bokningskalender att skrapa. Istället använder vi "Tillgänglighet"-metafältet
 *      som ger säsong/period.
 */

import * as cheerio from "cheerio";
import fs from "node:fs";
import path from "node:path";

const COLLECTION_HANDLE = "upplevelser-malmo";
const BASE = "https://happy-day.com";
const OUT_DATA = path.resolve("src/lib/experiences.generated.ts");
const OUT_IMG_DIR = path.resolve("public/experiences");
const MAX_RETRIES = 2;
const REQUEST_DELAY_MS = 250;

// --- Types ---

interface ShopifyVariant {
  id: number;
  title: string;
  price: string;
  compare_at_price: string | null;
  sku: string | null;
  available: boolean;
}

interface ShopifyImage {
  id: number;
  src: string;
  width: number;
  height: number;
  alt: string | null;
}

interface ShopifyProduct {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  vendor: string;
  product_type: string;
  tags: string[];
  variants: ShopifyVariant[];
  images: ShopifyImage[];
  options: { name: string; values: string[] }[];
}

interface PricePoint {
  people: number;
  price: number;
  compareAt?: number;
}

interface FaqEntry {
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

// --- Utilities ---

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function tryFetch(url: string, attempts = MAX_RETRIES): Promise<Response | null> {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Discover-Malmo ingest)",
          Accept: "text/html,application/json,*/*",
        },
      });
      if (res.ok) return res;
      console.warn(`  ! ${url} -> HTTP ${res.status} (attempt ${i + 1})`);
    } catch (err) {
      console.warn(`  ! ${url} -> error ${(err as Error).message} (attempt ${i + 1})`);
    }
    if (i < attempts - 1) await sleep(500);
  }
  return null;
}

async function tryDownloadImage(url: string, dest: string, attempts = MAX_RETRIES): Promise<boolean> {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(dest, buf);
        return true;
      }
    } catch (err) {
      console.warn(`  ! image ${url} -> ${(err as Error).message} (attempt ${i + 1})`);
    }
    if (i < attempts - 1) await sleep(400);
  }
  return false;
}

function categorize(tags: string[], title: string): string {
  const all = [...tags, title].map((t) => t.toLowerCase()).join(" ");
  if (/(racing|kör|folkrace|supercar|ferrari|lamborghini|porsche|gt4|rally|flyg|luftballong|helikopter|segelflyg|vinds|drake|klätt|zipline|fallskärm|bungee)/i.test(all))
    return "Äventyr";
  if (/(prov|öl|vin|whisky|gin|rom|champagne|choklad|mat|fika|brunch|middag|kokk|bage)/i.test(all))
    return "Mat & dryck";
  if (/(massage|spa|wellness|välm|ansiktsbehandling|yoga|float|gravid)/i.test(all))
    return "Välmående";
  if (/(kurs|blomster|sip and create|måla|keramik|kreativ|teck|fotograf)/i.test(all))
    return "Kreativt";
  if (/(sport|padel|golf|bowl|cross|surf|fotboll|skid|skridsko)/i.test(all))
    return "Sport";
  if (/(kultur|museum|konst|teater|opera|bio|mordgåta|escape)/i.test(all))
    return "Kultur";
  return "Övrigt";
}

function detectRegion(locations: string | undefined, title: string, tags: string[]): Experience["region"] {
  const text = [locations ?? "", title, tags.join(" ")].join(" ").toLowerCase();
  if (/malmö/.test(text)) return "Malmö";
  const skane = ["lund", "helsingborg", "ystad", "trelleborg", "landskrona", "höganäs", "kristianstad", "simrishamn", "ängelholm", "hässleholm", "eslöv", "knutstorp", "svedala"];
  if (skane.some((c) => text.includes(c))) return "Skåne";
  return "Sverige";
}

function htmlToPlainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function firstSentence(text: string): string {
  const clean = text.trim();
  const match = clean.match(/^[^.!?]*[.!?]/);
  if (match && match[0].length < 240) return match[0].trim();
  return clean.slice(0, 200).trim() + (clean.length > 200 ? "…" : "");
}

function extFromUrl(url: string): string {
  try {
    const clean = url.split("?")[0];
    const ext = path.extname(clean).toLowerCase();
    if ([".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)) return ext;
  } catch {}
  return ".jpg";
}

function parsePricePerPerson(variants: ShopifyVariant[]): PricePoint[] {
  const points: PricePoint[] = [];
  for (const v of variants) {
    const people = parseInt(v.title, 10);
    if (isNaN(people)) continue;
    points.push({
      people,
      price: Math.round(parseFloat(v.price)),
      compareAt: v.compare_at_price ? Math.round(parseFloat(v.compare_at_price)) : undefined,
    });
  }
  points.sort((a, b) => a.people - b.people);
  return points;
}

interface ProductPageMeta {
  faq: FaqEntry[];
  fields: Map<string, string>;
}

function parseProductPage(html: string): ProductPageMeta {
  const faq: FaqEntry[] = [];
  const fields = new Map<string, string>();
  try {
    const $ = cheerio.load(html);
    $('script[type="application/faq-data"]').each((_, el) => {
      const q = $(el).attr("data-question")?.trim() || "";
      const a = $(el).attr("data-answer")?.trim() || "";
      if (!q || !a) return;
      const cleaned = htmlToPlainText(a);
      if (!fields.has(q)) fields.set(q, cleaned);
      faq.push({ question: q, answer: cleaned });
    });
  } catch (err) {
    console.warn(`  ! parse error ${(err as Error).message}`);
  }
  return { faq, fields };
}

/** JSON.stringify producerar giltiga TS/JS string-literaler och escape:ar allt korrekt. */
const q = (s: string) => JSON.stringify(s);

function serializeExperience(e: Experience, indent = "  "): string {
  const i = indent;
  const ii = indent + "  ";
  const iii = indent + "    ";
  const pricePerPerson = e.pricePerPerson
    .map(
      (p) =>
        `${iii}{ people: ${p.people}, price: ${p.price}${
          p.compareAt ? `, compareAt: ${p.compareAt}` : ""
        } }`,
    )
    .join(",\n");
  const gallery = e.images.gallery.map((g) => `${iii}${q(g)}`).join(",\n");
  const tags = e.tags.map((t) => q(t)).join(", ");
  const faq = e.faq
    .map((f) => `${iii}{ question: ${q(f.question)}, answer: ${q(f.answer)} }`)
    .join(",\n");

  const field = (key: string, val: string | undefined) =>
    val === undefined ? "" : `\n${ii}${key}: ${q(val)},`;

  return `${i}{
${ii}id: ${q(e.id)},
${ii}slug: ${q(e.slug)},
${ii}title: ${q(e.title)},
${ii}shortDescription: ${q(e.shortDescription)},
${ii}descriptionHtml: ${q(e.descriptionHtml)},
${ii}category: ${q(e.category)},
${ii}tags: [${tags}],
${ii}priceFrom: ${e.priceFrom},${e.priceCompareAt ? `\n${ii}priceCompareAt: ${e.priceCompareAt},` : ""}
${ii}pricePerPerson: [
${pricePerPerson}
${ii}],${field("duration", e.duration)}${field("locations", e.locations)}${field("availability", e.availability)}${field("ageLimit", e.ageLimit)}${field("participants", e.participants)}${field("importantInfo", e.importantInfo)}
${ii}faq: [
${faq}
${ii}],
${ii}region: ${q(e.region)} as const,
${ii}images: {
${iii}main: ${q(e.images.main)},
${iii}alt: ${q(e.images.alt)},
${iii}gallery: [
${gallery}
${iii}],
${ii}},
${ii}sourceUrl: ${q(e.sourceUrl)},
${i}}`;
}

// --- Main ---

async function main() {
  console.log("=== Happy Day ingest ===");
  fs.mkdirSync(OUT_IMG_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(OUT_DATA), { recursive: true });

  // STEP 1: Fetch collection products
  console.log(`\n[1/4] Fetching collection ${COLLECTION_HANDLE}...`);
  let allProducts: ShopifyProduct[] = [];
  for (let page = 1; page <= 10; page++) {
    const res = await tryFetch(`${BASE}/collections/${COLLECTION_HANDLE}/products.json?limit=250&page=${page}`);
    if (!res) {
      console.warn(`  Could not fetch page ${page}, stopping pagination.`);
      break;
    }
    const data = (await res.json()) as { products: ShopifyProduct[] };
    const chunk = data.products ?? [];
    console.log(`  page ${page}: ${chunk.length} products`);
    allProducts.push(...chunk);
    if (chunk.length < 250) break;
    await sleep(REQUEST_DELAY_MS);
  }
  console.log(`  Total: ${allProducts.length} products`);

  if (allProducts.length === 0) {
    console.error("No products retrieved. Aborting.");
    process.exit(1);
  }

  // STEP 2+3: Per-product enrichment and image download
  console.log(`\n[2/4] Enriching products and downloading images...`);
  const experiences: Experience[] = [];
  let imgCount = 0;
  let imgFail = 0;
  let productsEnriched = 0;
  let productsFailedEnrich = 0;

  for (const p of allProducts) {
    try {
      const slug = p.handle;
      const sourceUrl = `${BASE}/products/${slug}`;

      // Parse product page for metafields (optional — continue on fail)
      let meta: ProductPageMeta = { faq: [], fields: new Map() };
      const htmlRes = await tryFetch(sourceUrl);
      if (htmlRes) {
        const html = await htmlRes.text();
        meta = parseProductPage(html);
        productsEnriched++;
      } else {
        productsFailedEnrich++;
        console.warn(`  ! no metafields for ${slug}`);
      }

      const locations = meta.fields.get("Orter") ?? meta.fields.get("Plats") ?? undefined;
      const duration = meta.fields.get("Varaktighet") ?? meta.fields.get("Längd") ?? undefined;
      const availability = meta.fields.get("Tillgänglighet") ?? undefined;
      const ageLimit = meta.fields.get("Åldersgräns") ?? undefined;
      const participants = meta.fields.get("Antal deltagare") ?? undefined;
      const importantInfo = meta.fields.get("Viktig information") ?? undefined;

      const pricePerPerson = parsePricePerPerson(p.variants);
      const priceFrom = pricePerPerson.length ? pricePerPerson[0].price : 0;
      const priceCompareAt = pricePerPerson[0]?.compareAt;

      const bodyText = htmlToPlainText(p.body_html || "");
      const shortDescription = firstSentence(bodyText);

      const category = categorize(p.tags, p.title);
      const region = detectRegion(locations, p.title, p.tags);

      // Download images
      const imgDir = path.join(OUT_IMG_DIR, slug);
      fs.mkdirSync(imgDir, { recursive: true });
      const localImages: string[] = [];
      for (let i = 0; i < p.images.length; i++) {
        const src = p.images[i].src;
        const ext = extFromUrl(src);
        const filename = `${i + 1}${ext}`;
        const dest = path.join(imgDir, filename);
        if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
          localImages.push(`/experiences/${slug}/${filename}`);
          continue;
        }
        const ok = await tryDownloadImage(src, dest);
        if (ok) {
          localImages.push(`/experiences/${slug}/${filename}`);
          imgCount++;
        } else {
          imgFail++;
        }
        await sleep(80); // gentle
      }

      const main = localImages[0] ?? "";
      const gallery = localImages.slice(1);

      const experience: Experience = {
        id: String(p.id),
        slug,
        title: p.title,
        shortDescription,
        descriptionHtml: p.body_html ?? "",
        category,
        tags: p.tags,
        priceFrom,
        priceCompareAt,
        pricePerPerson,
        duration,
        locations,
        availability,
        ageLimit,
        participants,
        importantInfo,
        faq: meta.faq,
        region,
        images: { main, gallery, alt: p.images[0]?.alt || p.title },
        sourceUrl,
      };
      experiences.push(experience);
      console.log(`  [${experiences.length}/${allProducts.length}] ${p.title} — ${localImages.length} bilder`);

      await sleep(REQUEST_DELAY_MS);
    } catch (err) {
      console.warn(`  !! Product ${p.handle} failed hard: ${(err as Error).message}`);
    }
  }

  // STEP 4: Write generated file
  console.log(`\n[3/4] Writing ${OUT_DATA}...`);
  const body = experiences.map((e) => serializeExperience(e)).join(",\n");
  const out = `/* AUTO-GENERATED by scripts/ingest-happyday.ts — do not edit manually. */
/* Source: ${BASE}/collections/${COLLECTION_HANDLE} */
/* Generated: ${new Date().toISOString()} */

import type { Experience } from "./experiences";

export const EXPERIENCES_GENERATED: Experience[] = [
${body}
];
`;
  fs.writeFileSync(OUT_DATA, out, "utf8");

  // Summary
  console.log(`\n[4/4] Summary`);
  console.log(`  Products: ${experiences.length}`);
  console.log(`  Metafields enriched: ${productsEnriched}, failed: ${productsFailedEnrich}`);
  console.log(`  Images downloaded: ${imgCount} (fails: ${imgFail})`);
  console.log(`  Output: ${OUT_DATA}`);
  console.log(`\nDone.`);
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
