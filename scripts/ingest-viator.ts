/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Ingest pipeline för Viator Malmö (destination 680).
 * Körs med: npm run ingest:viator
 *
 * Använder Viators officiella Affiliate API. Kräver VIATOR_API_KEY i .env.local.
 * Datan sparas lokalt i src/lib/viator-experiences.generated.ts.
 *
 * VIKTIGT: Denna data importeras INTE i experiences.ts än.
 * Användaren ska först fylla i affiliate-länkar per produkt.
 */

import fs from "node:fs";
import path from "node:path";

const ENV_PATH = path.resolve(".env.local");
function loadEnv() {
  if (!fs.existsSync(ENV_PATH)) {
    console.error("Saknar .env.local — kör inte vidare.");
    process.exit(1);
  }
  const content = fs.readFileSync(ENV_PATH, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) process.env[m[1]] = m[2];
  }
}
loadEnv();

const API_KEY = process.env.VIATOR_API_KEY!;
const PARTNER_ID = process.env.VIATOR_PARTNER_ID || "P00298480";
const DESTINATION_ID = 680; // Malmö
const OUT_DATA = path.resolve("src/lib/viator-experiences.generated.ts");
const OUT_IMG_DIR = path.resolve("public/experiences");
const MAX_RETRIES = 2;
const REQUEST_DELAY_MS = 350;

const HEADERS = {
  "exp-api-key": API_KEY,
  "Accept-Language": "sv-SE",
  Accept: "application/json;version=2.0",
  "Content-Type": "application/json",
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function tryApi(url: string, init?: RequestInit): Promise<any | null> {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const res = await fetch(url, { ...init, headers: { ...HEADERS, ...(init?.headers || {}) } });
      if (res.ok) return await res.json();
      const body = await res.text();
      console.warn(`  ! ${url} -> HTTP ${res.status}: ${body.slice(0, 200)}`);
    } catch (err) {
      console.warn(`  ! ${url} -> ${(err as Error).message}`);
    }
    if (i < MAX_RETRIES - 1) await sleep(600);
  }
  return null;
}

async function tryDownloadImage(url: string, dest: string): Promise<boolean> {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(dest, buf);
        return true;
      }
    } catch {}
    if (i < MAX_RETRIES - 1) await sleep(400);
  }
  return false;
}

function extFromUrl(url: string): string {
  try {
    const clean = url.split("?")[0];
    const ext = path.extname(clean).toLowerCase();
    if ([".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)) return ext;
  } catch {}
  return ".jpg";
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

function categorize(title: string, tags: string[]): string {
  const all = [title, ...tags].join(" ").toLowerCase();
  if (/(museum|konst|teater|historisk|slott|kultur|guidad)/i.test(all)) return "Kultur";
  if (/(mat|smak|prov|lunch|middag|brunch|food|öl|vin)/i.test(all)) return "Mat & dryck";
  if (/(båt|kanal|sightseeing|cykel|bike|walking|tour)/i.test(all)) return "Sightseeing";
  if (/(barn|familj|family|lekplats|äventyr)/i.test(all)) return "Familj";
  if (/(foil|surf|sport|adventure|äventyr)/i.test(all)) return "Äventyr";
  return "Övrigt";
}

const q = (s: string) => JSON.stringify(s);

async function main() {
  console.log("=== Viator Malmö ingest ===");
  if (!API_KEY) {
    console.error("VIATOR_API_KEY saknas i .env.local");
    process.exit(1);
  }
  fs.mkdirSync(OUT_IMG_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(OUT_DATA), { recursive: true });

  // STEP 1: Search products by destination
  console.log("\n[1/3] Söker produkter för destination Malmö (680)...");
  const allProducts: any[] = [];
  let start = 1;
  const pageSize = 50;
  let total = -1;

  while (true) {
    const data = await tryApi("https://api.viator.com/partner/products/search", {
      method: "POST",
      body: JSON.stringify({
        filtering: { destination: String(DESTINATION_ID) },
        sorting: { sort: "DEFAULT" },
        pagination: { start, count: pageSize },
        currency: "SEK",
      }),
    });
    if (!data) {
      console.warn(`  Stoppar paginering vid start=${start}`);
      break;
    }
    const items = data.products || [];
    total = data.totalCount ?? items.length;
    console.log(`  start=${start}: ${items.length} produkter (totalt: ${total})`);
    allProducts.push(...items);
    if (allProducts.length >= total || items.length === 0) break;
    start += pageSize;
    await sleep(REQUEST_DELAY_MS);
  }

  if (allProducts.length === 0) {
    console.error("Inga produkter hittade. Avbryter.");
    process.exit(1);
  }

  // STEP 2: Process each product (search response usually has enough data; fetch detail if needed)
  console.log(`\n[2/3] Behandlar ${allProducts.length} produkter och laddar ner bilder...`);
  const records: string[] = [];
  let imgCount = 0;
  let imgFail = 0;

  for (let i = 0; i < allProducts.length; i++) {
    const p = allProducts[i];
    const code = p.productCode || p.code;
    const slug = `viator-${code}`.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const title = p.title || p.name || "Untitled";
    const description = p.description || p.shortDescription || "";
    const shortDesc = firstSentence(htmlToPlainText(description));

    // Price
    const priceFrom = p.pricing?.summary?.fromPrice ?? p.price?.fromPrice ?? p.fromPrice ?? 0;
    const priceCurrency = p.pricing?.summary?.fromPriceCurrency || p.price?.currency || "SEK";

    // Rating
    const rating = p.reviews?.combinedAverageRating ?? p.rating;
    const reviewCount = p.reviews?.totalReviews ?? p.reviewCount;

    // Duration (string from API or derived)
    const duration =
      p.duration?.fixedDurationInMinutes
        ? `${p.duration.fixedDurationInMinutes} minuter`
        : p.duration?.variableDurationFromMinutes
          ? `${p.duration.variableDurationFromMinutes}–${p.duration.variableDurationToMinutes} minuter`
          : undefined;

    // Affiliate URL — canonical produkt-URL utan locale-prefix, med exakt manual-format
    // query-string (matchar Viator's Tools/Links: ?pid=...&mcid=42383&medium=link).
    // Viators API inkluderar /sv-SE/ i productUrl — vi stripar det för att matcha referensmönstret.
    const rawUrl = (p.productUrl || `https://www.viator.com/tours/Malmo/${slug}/d${DESTINATION_ID}-${code}`).split("?")[0];
    const baseUrl = rawUrl.replace(/\/(sv-SE|en-US|de-DE|en-GB|fr-FR|es-ES|it-IT|nl-NL|pt-BR|ja-JP|zh-CN|zh-TW|ko-KR|ru-RU|pl-PL|tr-TR)\//, "/");
    const sourceUrl = `${baseUrl}?pid=${PARTNER_ID}&mcid=42383&medium=link`;

    // Images
    const imageUrls: string[] = [];
    if (Array.isArray(p.images)) {
      for (const img of p.images) {
        const variants = img.variants || [];
        // Prefer medium-large variant (~480-720px wide)
        const sorted = [...variants].sort((a, b) => (b.width || 0) - (a.width || 0));
        const best = sorted.find((v) => v.width && v.width <= 720) || sorted[0];
        if (best?.url) imageUrls.push(best.url);
      }
    }

    // Download images
    const imgDir = path.join(OUT_IMG_DIR, slug);
    fs.mkdirSync(imgDir, { recursive: true });
    const localPaths: string[] = [];
    for (let j = 0; j < imageUrls.length; j++) {
      const src = imageUrls[j];
      const ext = extFromUrl(src);
      const dest = path.join(imgDir, `${j + 1}${ext}`);
      if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
        localPaths.push(`/experiences/${slug}/${j + 1}${ext}`);
        continue;
      }
      const ok = await tryDownloadImage(src, dest);
      if (ok) {
        localPaths.push(`/experiences/${slug}/${j + 1}${ext}`);
        imgCount++;
      } else {
        imgFail++;
      }
      await sleep(80);
    }

    const tags: string[] = (p.tags || [])
      .map((t: any) => (typeof t === "object" ? t.name || String(t.id) : String(t)))
      .filter(Boolean);
    const category = categorize(title, tags);
    const main = localPaths[0] ?? "";
    const gallery = localPaths.slice(1);
    const galleryStr = gallery.map((g) => `      ${q(g)}`).join(",\n");

    records.push(`  {
    id: ${q("viator-" + code)},
    slug: ${q(slug)},
    title: ${q(title)},
    shortDescription: ${q(shortDesc)},
    descriptionHtml: ${q("<p>" + htmlToPlainText(description) + "</p>")},
    category: ${q(category)},
    tags: [${tags.slice(0, 8).map((t) => q(t)).join(", ")}, "Viator"],
    priceFrom: ${Math.round(priceFrom)},
    pricePerPerson: [{ people: 1, price: ${Math.round(priceFrom)} }],${duration ? `\n    duration: ${q(duration)},` : ""}
    locations: ${q("Malmö")},
    faq: [],
    region: "Malmö" as const,
    images: {
      main: ${q(main)},
      alt: ${q(title)},
      gallery: [
${galleryStr}
      ],
    },
    sourceUrl: ${q(sourceUrl)},
    source: "viator" as const,${rating !== undefined ? `\n    rating: ${Number(rating).toFixed(2)},\n    reviewCount: ${reviewCount || 0},` : ""}
    productCode: ${q(code)},
    priceCurrency: ${q(priceCurrency)},
  }`);

    console.log(`  [${i + 1}/${allProducts.length}] ${title} — ${localPaths.length} bilder, ${Math.round(priceFrom)} ${priceCurrency}`);
    await sleep(REQUEST_DELAY_MS);
  }

  // STEP 3: Write generated file
  console.log(`\n[3/3] Skriver ${OUT_DATA}...`);
  const out = `/* AUTO-GENERATED by scripts/ingest-viator.ts — do not edit manually. */
/* Source: Viator Affiliate API (destination ${DESTINATION_ID} = Malmö) */
/* Generated: ${new Date().toISOString()} */

import type { Experience } from "./experiences";

/**
 * Viator-data är INTE importerad i experiences.ts än — väntar på affiliate-länkar
 * och beslut om hur den ska renderas (eventuellt med noimageindex meta).
 *
 * Varje record har productCode och en sourceUrl som redan inkluderar
 * partnerId — affiliate-spårning är automatisk.
 */
export interface ViatorExperience extends Experience {
  productCode: string;
  priceCurrency: string;
}

export const VIATOR_EXPERIENCES: ViatorExperience[] = [
${records.join(",\n")}
];
`;
  fs.writeFileSync(OUT_DATA, out, "utf8");

  console.log(`\nKlar. ${allProducts.length} produkter, ${imgCount} bilder (fel: ${imgFail}).`);
  console.log(`Output: ${OUT_DATA}`);
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
