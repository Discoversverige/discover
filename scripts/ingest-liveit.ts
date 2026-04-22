/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Ingest pipeline för Live it Malmö (~80 produkter).
 * Körs med: npm run ingest:liveit
 *
 * Strategi:
 *  1. Anropa https://litium.liveit.se/api/products/list?channel=privat&filter-Areas=Malmö
 *     med pagination (offset=0, 10, 20, ... upp till totalAmount)
 *  2. Varje item innehåller all data vi behöver direkt: namn, beskrivning,
 *     bilder, pris, rating, location, seoDescription
 *  3. Ladda ner alla bilder till public/experiences/liveit-{id}/
 *  4. Generera src/lib/liveit-experiences.generated.ts
 */

import fs from "node:fs";
import path from "node:path";

const API_BASE = "https://litium.liveit.se/api";
const LISTING_URL = `${API_BASE}/products/list?filter-Areas=Malm%C3%B6&channel=privat`;
const OUT_DATA = path.resolve("src/lib/liveit-experiences.generated.ts");
const OUT_IMG_DIR = path.resolve("public/experiences");
const MAX_RETRIES = 2;
const REQUEST_DELAY_MS = 250;

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
  Accept: "application/json",
  Referer: "https://www.liveit.se/sok?filter-Areas=Malm%C3%B6",
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function tryJson(url: string): Promise<any | null> {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const res = await fetch(url, { headers: HEADERS });
      if (res.ok) return await res.json();
      console.warn(`  ! ${url} -> HTTP ${res.status}`);
    } catch (err) {
      console.warn(`  ! ${url} -> ${(err as Error).message}`);
    }
    if (i < MAX_RETRIES - 1) await sleep(500);
  }
  return null;
}

async function tryDownloadImage(url: string, dest: string): Promise<boolean> {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": HEADERS["User-Agent"] } });
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

function slugFromUrl(urlPath: string, id: string): string {
  // urlPath: /upplevelser/upplevelsepresenter-afternoon-tea-the-lodge
  const last = urlPath.split("/").filter(Boolean).pop() || id;
  return `liveit-${last}`;
}

function detectRegion(locations: any[]): "Malmö" | "Skåne" | "Sverige" {
  const names = locations.map((l) => (l?.name ?? "").toLowerCase());
  if (names.some((n) => n.includes("malmö"))) return "Malmö";
  const skane = ["lund", "helsingborg", "ystad", "trelleborg", "landskrona", "höllviken", "falsterbo", "skåne"];
  if (names.some((n) => skane.some((c) => n.includes(c)))) return "Skåne";
  return "Sverige";
}

function categorize(name: string, seoDesc: string | null, description: string): string {
  const all = (name + " " + (seoDesc || "") + " " + description).toLowerCase();
  if (/(prov|öl|vin|whisky|gin|rom|champagne|choklad|mat|brunch|middag|tea|afternoon|smak)/i.test(all)) return "Mat & dryck";
  if (/(racing|kör|supercar|ferrari|lamborghini|porsche|flyg|helikopter|segelflyg|surf|drake|fallskärm|bungee|rib|kajak|paddel)/i.test(all)) return "Äventyr";
  if (/(massage|spa|wellness|välmående|ansiktsbehandling|yoga|float|bastu|pedikyr|manikyr)/i.test(all)) return "Välmående";
  if (/(kurs|blomster|sip|måla|keramik|kreativ|teck|fotograf|binderi)/i.test(all)) return "Kreativt";
  if (/(sport|padel|golf|bowl|cross|klätt|bouldering)/i.test(all)) return "Sport";
  if (/(kultur|museum|konst|teater|opera|bio|mordgåta|escape|guidad)/i.test(all)) return "Kultur";
  if (/(båt|kanal|sightseeing|cykel|bussturn|segway)/i.test(all)) return "Sightseeing";
  return "Övrigt";
}

function firstSentence(text: string): string {
  const clean = text.trim();
  const match = clean.match(/^[^.!?]*[.!?]/);
  if (match && match[0].length < 240) return match[0].trim();
  return clean.slice(0, 200).trim() + (clean.length > 200 ? "…" : "");
}

const q = (s: string) => JSON.stringify(s);

function serializeExperience(item: any): string {
  const variant = item.data.variants[0];
  const slug = slugFromUrl(item.id, variant.id);
  const title = variant.name || item.data.name;
  const description = item.data.description || variant.listProductDescription || "";
  const category = categorize(title, variant.seoDescription, description);
  const region = detectRegion(item.data.locations || []);
  const locations = (item.data.locations || [])
    .map((l: any) => l.name)
    .filter(Boolean)
    .join(", ");
  const price = variant.price?.listPrice ?? 0;
  const compareAt = variant.price?.reducedPrice ?? null;

  const images = variant.images || item.data.images || [];
  const imagePaths: string[] = images.map((_img: any, i: number) => `/experiences/${slug}/${i + 1}.jpg`);
  const main = imagePaths[0] ?? "";
  const gallery = imagePaths.slice(1);
  const galleryStr = gallery.map((g) => `      ${q(g)}`).join(",\n");

  const ratingAvg = variant.ratingAverage;
  const numRatings = variant.numberOfRatings;

  const sourceUrl = `https://www.liveit.se${item.id}`;
  const shortDesc = firstSentence(description);
  const tags = (item.data.labels || []).concat(locations ? [locations] : []).concat(["Live it"]);

  return `  {
    id: ${q("liveit-" + variant.id)},
    slug: ${q(slug)},
    title: ${q(title)},
    shortDescription: ${q(shortDesc)},
    descriptionHtml: ${q("<p>" + description + "</p>")},
    category: ${q(category)},
    tags: [${tags.map((t: string) => q(t)).join(", ")}],
    priceFrom: ${price},${compareAt && compareAt > price ? `\n    priceCompareAt: ${compareAt},` : ""}
    pricePerPerson: [{ people: ${variant.participantAmount || 1}, price: ${price} }],${locations ? `\n    locations: ${q(locations)},` : ""}
    faq: [],
    region: ${q(region)} as const,
    images: {
      main: ${q(main)},
      alt: ${q(title)},
      gallery: [
${galleryStr}
      ],
    },
    sourceUrl: ${q(sourceUrl)},
    source: "liveit",${ratingAvg ? `\n    rating: ${Number(ratingAvg).toFixed(2)},\n    reviewCount: ${numRatings || 0},` : ""}
  }`;
}

async function main() {
  console.log("=== Live it Malmö ingest ===");
  fs.mkdirSync(OUT_IMG_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(OUT_DATA), { recursive: true });

  // STEP 1: Fetch all products via pagination
  console.log("\n[1/3] Fetching products via paginated API...");
  const allItems: any[] = [];
  let offset = 0;
  const limit = 50;
  let total = -1;

  while (true) {
    const url = `${LISTING_URL}&offset=${offset}&limit=${limit}`;
    const data = await tryJson(url);
    if (!data || !data.items) {
      console.warn(`  Could not fetch offset=${offset}, stopping.`);
      break;
    }
    total = data.metaData.totalAmount;
    allItems.push(...data.items);
    console.log(`  offset ${offset}: ${data.items.length} items (total: ${total})`);
    if (allItems.length >= total || data.items.length === 0) break;
    offset += limit;
    await sleep(REQUEST_DELAY_MS);
  }
  console.log(`  Total collected: ${allItems.length} / ${total}`);

  if (allItems.length === 0) {
    console.error("No items. Aborting.");
    process.exit(1);
  }

  // STEP 2: Download images
  console.log(`\n[2/3] Downloading images...`);
  let imgCount = 0;
  let imgFail = 0;

  for (let i = 0; i < allItems.length; i++) {
    const item = allItems[i];
    const variant = item.data?.variants?.[0];
    if (!variant) continue;
    const slug = slugFromUrl(item.id, variant.id);
    const imgDir = path.join(OUT_IMG_DIR, slug);
    fs.mkdirSync(imgDir, { recursive: true });
    const images = variant.images || item.data.images || [];

    for (let j = 0; j < images.length; j++) {
      const img = images[j];
      const src = img.urlPath;
      if (!src) continue;
      const dest = path.join(imgDir, `${j + 1}.jpg`);
      if (fs.existsSync(dest) && fs.statSync(dest).size > 0) continue;
      const ok = await tryDownloadImage(src, dest);
      if (ok) imgCount++;
      else imgFail++;
      await sleep(60);
    }

    if ((i + 1) % 10 === 0) {
      console.log(`  ${i + 1}/${allItems.length} processed (${imgCount} images so far)`);
    }
  }

  // STEP 3: Generate file
  console.log(`\n[3/3] Writing ${OUT_DATA}...`);
  const body = allItems
    .filter((item) => item.data?.variants?.[0])
    .map((item) => serializeExperience(item))
    .join(",\n");
  const out = `/* AUTO-GENERATED by scripts/ingest-liveit.ts — do not edit manually. */
/* Source: liveit.se Malmö filter */
/* Generated: ${new Date().toISOString()} */

import type { Experience } from "./experiences";

export const LIVEIT_EXPERIENCES: Experience[] = [
${body}
];
`;
  fs.writeFileSync(OUT_DATA, out, "utf8");

  console.log(`\nDone. ${allItems.length} products, ${imgCount} images (fails: ${imgFail}).`);
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
