/**
 * Translates experience titles and shortDescriptions to EN + DE using Claude API.
 * Reads all three generated files, adds title_en/title_de/shortDescription_en/shortDescription_de,
 * and writes them back.
 *
 * Usage: ANTHROPIC_API_KEY=sk-... tsx scripts/translate-experiences.ts
 */

import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface ExperienceSlice {
  slug: string;
  title: string;
  shortDescription: string;
}

interface Translation {
  slug: string;
  title_en: string;
  title_de: string;
  shortDescription_en: string;
  shortDescription_de: string;
}

// Extract slug+title+shortDescription from a generated .ts file source
function parseExperiences(src: string): ExperienceSlice[] {
  const results: ExperienceSlice[] = [];
  // Match each object block between { and the next top-level },
  const blockRe = /\{\s*id:\s*"[^"]+",\s*slug:\s*"([^"]+)"[\s\S]*?\n  \}/g;
  let m: RegExpExecArray | null;
  while ((m = blockRe.exec(src)) !== null) {
    const block = m[0];
    const slug = m[1];
    const titleM = block.match(/\btitle:\s*"((?:[^"\\]|\\.)*)"/);
    const descM = block.match(/\bshortDescription:\s*"((?:[^"\\]|\\.)*?)"/);
    if (titleM && descM) {
      results.push({
        slug,
        title: titleM[1].replace(/\\"/g, '"'),
        shortDescription: descM[1].replace(/\\"/g, '"'),
      });
    }
  }
  return results;
}

async function translateBatch(items: ExperienceSlice[]): Promise<Translation[]> {
  const payload = items.map((e) => ({
    slug: e.slug,
    title: e.title,
    shortDescription: e.shortDescription,
  }));

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    system:
      "You are a professional translator specializing in tourism and experiences. " +
      "Translate Swedish experience titles and short descriptions to English (en) and German (de). " +
      "Keep translations concise, natural, and marketing-appropriate. " +
      "Respond ONLY with a valid JSON array — no markdown, no commentary.",
    messages: [
      {
        role: "user",
        content:
          "Translate each item to English and German. Return a JSON array with objects containing: " +
          "slug, title_en, title_de, shortDescription_en, shortDescription_de.\n\n" +
          JSON.stringify(payload, null, 2),
      },
    ],
  });

  const text = (response.content[0] as { type: string; text: string }).text.trim();
  // Strip possible markdown fences
  const json = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  return JSON.parse(json) as Translation[];
}

// Inject translations back into a source file string
function injectTranslations(src: string, translations: Map<string, Translation>): string {
  return src.replace(
    /( {4}slug:\s*"([^"]+)",\n {4}title:\s*"((?:[^"\\]|\\.)*)")/g,
    (match, _full, slug, title) => {
      const t = translations.get(slug);
      if (!t) return match;
      const enTitle = t.title_en.replace(/"/g, '\\"');
      const deTitle = t.title_de.replace(/"/g, '\\"');
      return `    slug: "${slug}",\n    title: "${title}",\n    title_en: "${enTitle}",\n    title_de: "${deTitle}"`;
    }
  ).replace(
    /( {4}shortDescription:\s*"((?:[^"\\]|\\.)*)")/g,
    (match, _full, desc) => {
      // Find the slug for this shortDescription by looking backwards — not possible in a simple replace.
      // Instead we do a second pass below.
      return match;
    }
  );
}

// Full inject: slug-aware, two-pass
function injectAll(src: string, translations: Map<string, Translation>): string {
  // Replace title lines (slug is always just before title)
  let out = src.replace(
    /(    slug: "([^"]+)",\n    title: "((?:[^"\\]|\\.)*)")/g,
    (_match, _full, slug, title) => {
      const t = translations.get(slug);
      if (!t) return _match;
      const enTitle = t.title_en.replace(/"/g, '\\"');
      const deTitle = t.title_de.replace(/"/g, '\\"');
      return `    slug: "${slug}",\n    title: "${title}",\n    title_en: "${enTitle}",\n    title_de: "${deTitle}"`;
    }
  );

  // Replace shortDescription lines — need slug context
  // We'll do it by splitting on object boundaries
  out = out.replace(
    /(\{[\s\S]*?    slug: "([^"]+)"[\s\S]*?)(    shortDescription: "((?:[^"\\]|\\.)*)")/g,
    (match, before, slug, descLine, desc) => {
      const t = translations.get(slug);
      if (!t) return match;
      const enDesc = t.shortDescription_en.replace(/"/g, '\\"');
      const deDesc = t.shortDescription_de.replace(/"/g, '\\"');
      return `${before}    shortDescription: "${desc}",\n    shortDescription_en: "${enDesc}",\n    shortDescription_de: "${deDesc}"`;
    }
  );

  return out;
}

const FILES = [
  "src/lib/experiences.generated.ts",
  "src/lib/gyg-experiences.generated.ts",
  "src/lib/liveit-experiences.generated.ts",
];

const BATCH_SIZE = 20;

async function processFile(filePath: string) {
  const abs = path.join(process.cwd(), filePath);
  const src = fs.readFileSync(abs, "utf-8");

  // Skip if already translated
  if (src.includes("title_en:")) {
    console.log(`⏭  ${filePath} already translated, skipping.`);
    return;
  }

  const items = parseExperiences(src);
  if (items.length === 0) {
    console.log(`⚠️  No experiences found in ${filePath}`);
    return;
  }

  console.log(`\n📄 ${filePath} — ${items.length} experiences`);

  const allTranslations = new Map<string, Translation>();

  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    console.log(`  🔄 Translating ${i + 1}–${Math.min(i + BATCH_SIZE, items.length)}...`);
    const translations = await translateBatch(batch);
    for (const t of translations) allTranslations.set(t.slug, t);
  }

  const updated = injectAll(src, allTranslations);
  fs.writeFileSync(abs, updated, "utf-8");
  console.log(`  ✅ Written ${allTranslations.size} translations to ${filePath}`);
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("❌ ANTHROPIC_API_KEY is not set.");
    process.exit(1);
  }

  for (const file of FILES) {
    await processFile(file);
  }

  console.log("\n✅ All done! Run npm run build to verify.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
