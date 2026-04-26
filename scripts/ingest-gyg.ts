/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Ingest pipeline för GetYourGuide Malmö (~34 aktiviteter).
 * Körs med: npm run ingest:gyg
 *
 * Strategi:
 *  1. Hämta listningssidan, extrahera alla activity URLs
 *  2. För varje URL, hämta produktsidan med browser-headers (403 annars)
 *  3. Parsa ld+json application/ld+json med @type=Product → titel, beskrivning,
 *     bilder, SKU, aggregateRating, offers (lowPrice, priceCurrency)
 *  4. Parsa HTML för duration ("XX timmar", "XX minuter") och mötesplats
 *  5. Ladda ner alla bilder till public/experiences/gyg-{slug}/
 *  6. Generera src/lib/gyg-experiences.generated.ts
 *
 * Per user request: max 2 försök per steg, hoppa vidare på fel.
 */

import * as cheerio from "cheerio";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const LISTING_URL = "https://www.getyourguide.com/sv-se/malmo-l2647/";
const OUT_DATA = path.resolve("src/lib/gyg-experiences.generated.ts");
const OUT_IMG_DIR = path.resolve("public/experiences");
const MAX_RETRIES = 2;
const REQUEST_DELAY_MS = 350;
const GYG_PARTNER_ID = "WOULPPB";

/**
 * Konverterar canonical GYG-URL till affiliate-format.
 * Ex: getyourguide.com/sv-se/malmo-l2647/foo-t12345/
 *  -> getyourguide.se/malmo-l2647/foo-t12345/?partner_id=WOULPPB&utm_medium=online_publisher
 */
function toAffiliateUrl(canonicalUrl: string): string {
  // Ta bort ev. existerande query-string
  const baseUrl = canonicalUrl.split("?")[0];
  // Säkerställ trailing slash
  const withSlash = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
  // Byt domän + locale
  const affiliate = withSlash.replace(
    /https?:\/\/www\.getyourguide\.com\/sv-se\//,
    "https://www.getyourguide.se/",
  );
  return `${affiliate}?partner_id=${GYG_PARTNER_ID}&utm_medium=online_publisher`;
}

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "sv-SE,sv;q=0.9,en;q=0.8",
  Referer: "https://www.getyourguide.com/sv-se/malmo-l2647/",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "same-origin",
  "Upgrade-Insecure-Requests": "1",
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** GYG använder Cloudflare anti-bot — Node's fetch blockeras även med browser-headers.
 *  curl (som bygger HTTP-anrop annorlunda) lyckas. Vi kör curl som subprocess. */
function curlGet(url: string, referer?: string): Promise<{ ok: boolean; body: string; status: number }> {
  return new Promise((resolve) => {
    const args = [
      "-s", "-L", "--compressed",
      "-A", HEADERS["User-Agent"],
      "-H", `Accept: ${HEADERS.Accept}`,
      "-H", `Accept-Language: ${HEADERS["Accept-Language"]}`,
      "-H", `Referer: ${referer || HEADERS.Referer}`,
      "-H", "Sec-Fetch-Dest: document",
      "-H", "Sec-Fetch-Mode: navigate",
      "-H", "Sec-Fetch-Site: same-origin",
      "-H", "Upgrade-Insecure-Requests: 1",
      "-w", "\n__HTTP_STATUS__%{http_code}",
      url,
    ];
    const proc = spawn("curl", args, { shell: false });
    let out = "";
    proc.stdout.on("data", (d) => { out += d.toString("utf8"); });
    proc.on("close", () => {
      const m = out.match(/\n__HTTP_STATUS__(\d+)$/);
      const status = m ? parseInt(m[1], 10) : 0;
      const body = m ? out.slice(0, m.index!) : out;
      resolve({ ok: status >= 200 && status < 400, body, status });
    });
    proc.on("error", () => resolve({ ok: false, body: "", status: 0 }));
  });
}

async function tryFetchHtml(url: string, referer?: string): Promise<string | null> {
  for (let i = 0; i < MAX_RETRIES; i++) {
    const r = await curlGet(url, referer);
    if (r.ok && r.body.length > 500) return r.body;
    console.warn(`  ! ${url} -> HTTP ${r.status} (attempt ${i + 1})`);
    if (i < MAX_RETRIES - 1) await sleep(800);
  }
  return null;
}

function curlDownload(url: string, dest: string): Promise<boolean> {
  return new Promise((resolve) => {
    const args = ["-s", "-L", "--compressed", "-A", HEADERS["User-Agent"], "-o", dest, url];
    const proc = spawn("curl", args, { shell: false });
    proc.on("close", (code) => {
      if (code === 0 && fs.existsSync(dest) && fs.statSync(dest).size > 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    proc.on("error", () => resolve(false));
  });
}

async function tryDownloadImage(url: string, dest: string): Promise<boolean> {
  for (let i = 0; i < MAX_RETRIES; i++) {
    if (await curlDownload(url, dest)) return true;
    if (i < MAX_RETRIES - 1) await sleep(400);
  }
  return false;
}

interface GygProductLd {
  "@type": "Product";
  name: string;
  image: string[] | string;
  description: string;
  sku?: string;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
  offers?: {
    priceCurrency: string;
    lowPrice: number;
    highPrice?: number;
  };
}

interface ExtractedActivity {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  descriptionHtml: string;
  priceFrom: number;
  priceCurrency: string;
  rating?: number;
  reviewCount?: number;
  duration?: string;
  imageUrls: string[];
  sourceUrl: string;
  city?: string;
}

function extractActivityUrls(listingHtml: string): string[] {
  const urls = new Set<string>();
  // Matchar både absoluta (https://www.getyourguide.com/sv-se/...) och relativa (/sv-se/...) URLs
  const reAbs = /https?:\/\/www\.getyourguide\.com(\/sv-se\/[a-z0-9\-]+\-l\d+\/[a-z0-9\-]+\-t\d+)/g;
  const rePath = /(?<![a-z0-9\-])(\/sv-se\/[a-z0-9\-]+\-l\d+\/[a-z0-9\-]+\-t\d+)/g;
  for (const re of [reAbs, rePath]) {
    for (const m of listingHtml.matchAll(re)) {
      const path = m[1].endsWith("/") ? m[1].slice(0, -1) : m[1];
      urls.add(`https://www.getyourguide.com${path}`);
    }
  }
  return Array.from(urls);
}

function extractProductLd(html: string): GygProductLd | null {
  const re = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  const matches = html.matchAll(re);
  for (const m of matches) {
    try {
      const j = JSON.parse(m[1]);
      if (j["@type"] === "Product") return j as GygProductLd;
    } catch {}
  }
  return null;
}

function extractDuration(html: string): string | undefined {
  const $ = cheerio.load(html);
  // Vanliga mönster på GYG: "Varaktighet", "Duration", "timmar", "minuter"
  const text = $("body").text();
  const match = text.match(
    /(\d+(?:[.,]\d+)?(?:\s*-\s*\d+(?:[.,]\d+)?)?)\s*(timmar?|minuter|tim\b|min\b|hours?|minutes?|dagar?|days?)/i,
  );
  if (match) return `${match[1]} ${match[2]}`.replace(/\s+/g, " ").trim();
  return undefined;
}

function firstSentence(text: string): string {
  const clean = text.trim();
  const match = clean.match(/^[^.!?]*[.!?]/);
  if (match && match[0].length < 240) return match[0].trim();
  return clean.slice(0, 200).trim() + (clean.length > 200 ? "…" : "");
}

function slugFromUrl(url: string): string {
  const m = url.match(/\/([a-z0-9\-]+)\-t(\d+)$/);
  if (!m) return url.split("/").pop() || "unknown";
  return `gyg-${m[1]}-${m[2]}`;
}

function cityFromUrl(url: string): string | undefined {
  const m = url.match(/\/sv-se\/([a-z0-9\-]+)\-l\d+\//);
  if (!m) return undefined;
  const slug = m[1];
  const map: Record<string, string> = {
    malmo: "Malmö",
    kopenhamn: "Köpenhamn",
    falsterbo: "Falsterbo",
    hollviken: "Höllviken",
    lund: "Lund",
  };
  return map[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
}

function detectRegion(city: string | undefined): "Malmö" | "Skåne" | "Sverige" {
  if (city === "Malmö") return "Malmö";
  const skane = ["Lund", "Falsterbo", "Höllviken", "Helsingborg", "Ystad", "Trelleborg"];
  if (city && skane.includes(city)) return "Skåne";
  return "Sverige";
}

function categorize(title: string, description: string): string {
  const all = (title + " " + description).toLowerCase();
  if (/(museum|konst|teater|historisk|slott|sevärdhet|guidad)/i.test(all)) return "Kultur";
  if (/(mat|restaurang|smak|prov|lunch|middag|brunch|kafé)/i.test(all)) return "Mat & dryck";
  if (/(båt|kanal|sightseeing|bussturn|cykel|buss|tåg)/i.test(all)) return "Sightseeing";
  if (/(barn|familj|lekplats|äventyr)/i.test(all)) return "Familj";
  if (/(foil|surf|sport|padel)/i.test(all)) return "Äventyr";
  return "Övrigt";
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

const q = (s: string) => JSON.stringify(s);

function serializeExperience(e: ExtractedActivity, imagePaths: string[], region: string, category: string): string {
  const gallery = imagePaths.slice(1).map((g) => `      ${q(g)}`).join(",\n");
  return `  {
    id: ${q(e.id)},
    slug: ${q(e.slug)},
    title: ${q(e.title)},
    shortDescription: ${q(e.shortDescription)},
    descriptionHtml: ${q(e.descriptionHtml)},
    category: ${q(category)},
    tags: [${e.city ? q(e.city) : ""}${e.city ? ", " : ""}${q("GetYourGuide")}],
    priceFrom: ${e.priceFrom},
    pricePerPerson: [{ people: 1, price: ${e.priceFrom} }],${e.duration ? `\n    duration: ${q(e.duration)},` : ""}${e.city ? `\n    locations: ${q(e.city)},` : ""}
    faq: [],
    region: ${q(region)} as const,
    images: {
      main: ${q(imagePaths[0] ?? "")},
      alt: ${q(e.title)},
      gallery: [
${gallery}
      ],
    },
    sourceUrl: ${q(toAffiliateUrl(e.sourceUrl))},
    source: "getyourguide",${e.rating !== undefined ? `\n    rating: ${e.rating.toFixed(2)},\n    reviewCount: ${e.reviewCount ?? 0},` : ""}
  }`;
}

async function main() {
  console.log("=== GetYourGuide Malmö ingest ===");
  fs.mkdirSync(OUT_IMG_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(OUT_DATA), { recursive: true });

  // STEP 1: Fetch listing via curl
  console.log("\n[1/4] Fetching listing via curl...");
  const listHtml = await tryFetchHtml(LISTING_URL);
  if (!listHtml) {
    console.error("Could not fetch listing. Aborting.");
    process.exit(1);
  }
  const urls = extractActivityUrls(listHtml);
  console.log(`  Found ${urls.length} activity URLs`);

  // STEP 2-3: Fetch each activity
  console.log(`\n[2/4] Fetching activities via curl...`);
  const activities: { act: ExtractedActivity; imgPaths: string[]; region: string; category: string }[] = [];
  let imgCount = 0;
  let imgFail = 0;
  let failedFetch = 0;

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const slug = slugFromUrl(url);
    const city = cityFromUrl(url);

    const html = await tryFetchHtml(url, LISTING_URL);
    if (!html) {
      failedFetch++;
      console.warn(`  [${i + 1}/${urls.length}] ${url} — FAILED`);
      await sleep(REQUEST_DELAY_MS);
      continue;
    }
    const ld = extractProductLd(html);
    if (!ld) {
      failedFetch++;
      console.warn(`  [${i + 1}/${urls.length}] ${url} — no ld+json`);
      await sleep(REQUEST_DELAY_MS);
      continue;
    }

    const id = String(ld.sku ?? slug);
    const images = Array.isArray(ld.image) ? ld.image : ld.image ? [ld.image] : [];
    const description = htmlToPlainText(ld.description ?? "");
    const duration = extractDuration(html);

    const act: ExtractedActivity = {
      id,
      slug,
      title: ld.name,
      shortDescription: firstSentence(description),
      descriptionHtml: `<p>${ld.description}</p>`,
      priceFrom: ld.offers?.lowPrice ?? 0,
      priceCurrency: ld.offers?.priceCurrency ?? "SEK",
      rating: ld.aggregateRating?.ratingValue,
      reviewCount: ld.aggregateRating?.reviewCount,
      duration,
      imageUrls: images,
      sourceUrl: url,
      city,
    };

    // Download images
    const imgDir = path.join(OUT_IMG_DIR, slug);
    fs.mkdirSync(imgDir, { recursive: true });
    const localPaths: string[] = [];
    for (let j = 0; j < act.imageUrls.length; j++) {
      const src = act.imageUrls[j];
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

    const region = detectRegion(city);
    const category = categorize(ld.name, description);

    activities.push({ act, imgPaths: localPaths, region, category });
    console.log(`  [${i + 1}/${urls.length}] ${ld.name} — ${localPaths.length} bilder, ${act.priceFrom} ${act.priceCurrency}`);
    await sleep(REQUEST_DELAY_MS);
  }

  // STEP 4: Write generated file
  console.log(`\n[3/4] Writing ${OUT_DATA}...`);
  const body = activities
    .map((a) => serializeExperience(a.act, a.imgPaths, a.region, a.category))
    .join(",\n");
  const out = `/* AUTO-GENERATED by scripts/ingest-gyg.ts — do not edit manually. */
/* Source: ${LISTING_URL} */
/* Generated: ${new Date().toISOString()} */

import type { Experience } from "./experiences";

export const GYG_EXPERIENCES: Experience[] = [
${body}
];
`;
  fs.writeFileSync(OUT_DATA, out, "utf8");

  console.log(`\n[4/4] Summary`);
  console.log(`  Activities imported: ${activities.length} / ${urls.length}`);
  console.log(`  Failed fetches: ${failedFetch}`);
  console.log(`  Images downloaded: ${imgCount} (fails: ${imgFail})`);
  console.log(`  Output: ${OUT_DATA}`);
  console.log(`\nDone.`);
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
