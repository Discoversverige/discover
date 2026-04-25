import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EXPERIENCES, formatPrice, getExperienceBySlug } from "@/lib/experiences";
import { VIATOR_EXPERIENCES } from "@/lib/viator-experiences.generated";
import { getViatorAffiliateUrl } from "@/lib/viator-affiliate-overrides";
import ExperienceGallery from "@/components/ExperienceGallery";

export function generateStaticParams() {
  return EXPERIENCES.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const exp = getExperienceBySlug(slug);
  if (!exp) return { title: "Upplevelse — Discover Malmö" };
  // Viators T&C: sidan får indexeras (text), men deras bilder får inte indexeras.
  const robots = exp.source === "viator"
    ? { index: true, follow: true, noimageindex: true }
    : undefined;
  return {
    title: `${exp.title} | Discover Malmö`,
    description: exp.shortDescription || `Upplevelse i ${exp.region} — ${exp.category}.`,
    robots,
    openGraph: {
      title: exp.title,
      description: exp.shortDescription,
      images: exp.images.main ? [exp.images.main] : undefined,
    },
  };
}

export default async function UpplevelseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const exp = getExperienceBySlug(slug);
  if (!exp) notFound();

  const related = EXPERIENCES.filter(
    (e) => e.slug !== exp.slug && e.category === exp.category,
  ).slice(0, 4);

  const hasDiscount = exp.priceCompareAt && exp.priceCompareAt > exp.priceFrom;

  // Viator-produkter använder affiliate-URL via override-helper
  const viatorRecord = exp.source === "viator"
    ? VIATOR_EXPERIENCES.find((v) => v.slug === exp.slug)
    : undefined;
  const ctaUrl = viatorRecord ? getViatorAffiliateUrl(viatorRecord) : exp.sourceUrl;
  const ctaLabel = exp.source === "viator" ? "Boka via Viator →" : "Se mer info →";

  return (
    <main className="exp-detail">
      <Link href="/upplevelser" className="exp-back">
        ← Tillbaka till upplevelser
      </Link>

      <section className="exp-hero">
        <ExperienceGallery
          main={exp.images.main}
          gallery={exp.images.gallery}
          alt={exp.images.alt}
        />

        <div className="exp-info">
          <div className="exp-info-meta">
            <span className="exp-info-tag accent">{exp.category}</span>
            <span className="exp-info-tag">{exp.region}</span>
            {exp.duration && <span className="exp-info-tag">⏱ {exp.duration.length > 40 ? exp.duration.slice(0, 40) + "…" : exp.duration}</span>}
          </div>
          <h1 className="exp-info-title">{exp.title}</h1>
          {exp.shortDescription && <p className="exp-info-short">{exp.shortDescription}</p>}

          <div className="exp-info-price-box">
            <div className="exp-info-price-head">
              <span className="exp-info-price-big">Från {formatPrice(exp.priceFrom)}</span>
              {hasDiscount && (
                <span className="exp-info-price-compare">{formatPrice(exp.priceCompareAt!)}</span>
              )}
              <span className="exp-info-price-from">per person</span>
            </div>
            {exp.pricePerPerson.length > 1 && (
              <div className="exp-info-price-list">
                {exp.pricePerPerson.map((p) => (
                  <div key={p.people} className="exp-info-price-point">
                    <p className="exp-info-price-point-people">
                      {p.people} {p.people === 1 ? "person" : "personer"}
                    </p>
                    <p className="exp-info-price-point-amount">{formatPrice(p.price)}</p>
                  </div>
                ))}
              </div>
            )}
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="exp-info-cta"
            >
              {ctaLabel}
            </a>
          </div>
        </div>
      </section>

      <section className="exp-facts">
        {exp.duration && (
          <div>
            <p className="exp-fact-label">Varaktighet</p>
            <p className="exp-fact-value">{exp.duration}</p>
          </div>
        )}
        {exp.locations && (
          <div>
            <p className="exp-fact-label">Orter</p>
            <p className="exp-fact-value">{exp.locations}</p>
          </div>
        )}
        {exp.availability && (
          <div>
            <p className="exp-fact-label">Tillgänglighet</p>
            <p className="exp-fact-value">{exp.availability}</p>
          </div>
        )}
        {exp.participants && (
          <div>
            <p className="exp-fact-label">Antal deltagare</p>
            <p className="exp-fact-value">{exp.participants}</p>
          </div>
        )}
        {exp.ageLimit && (
          <div>
            <p className="exp-fact-label">Åldersgräns</p>
            <p className="exp-fact-value">{exp.ageLimit}</p>
          </div>
        )}
        {!exp.duration && !exp.locations && !exp.availability && !exp.participants && !exp.ageLimit && (
          <div>
            <p className="exp-fact-label">Information</p>
            <p className="exp-fact-value">Bokas efter köp — se källa för detaljer.</p>
          </div>
        )}
      </section>

      <section className="exp-body">
        <div
          className="exp-body-prose"
          dangerouslySetInnerHTML={{ __html: sanitizeShopifyHtml(exp.descriptionHtml) }}
        />
        <aside className="exp-body-side">
          {exp.importantInfo && (
            <div className="exp-body-side-card">
              <h3>Viktigt att veta</h3>
              <p>{exp.importantInfo}</p>
            </div>
          )}
          <div className="exp-body-side-card">
            <h3>Så fungerar det</h3>
            <p>
              Köp upplevelsen som en presentkod — din mottagare bokar sedan tid själv på
              leverantörens bokningssida. Giltig i 12 månader.
            </p>
          </div>
          {exp.tags.length > 0 && (
            <div className="exp-body-side-card">
              <h3>Taggar</h3>
              <p style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {exp.tags.slice(0, 12).map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: 12,
                      padding: "3px 9px",
                      border: "1px solid var(--line-soft)",
                      borderRadius: 999,
                      color: "var(--ink-2)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </p>
            </div>
          )}
        </aside>
      </section>

      {exp.faq.length > 0 && (
        <section className="exp-faq">
          <h2>Vanliga frågor</h2>
          {exp.faq.slice(0, 12).map((f, i) => (
            <details key={i} className="exp-faq-item">
              <summary>{f.question}</summary>
              <div className="exp-faq-item-body">{f.answer}</div>
            </details>
          ))}
        </section>
      )}

      {related.length > 0 && (
        <section className="exp-related">
          <h2>Liknande upplevelser</h2>
          <div className="exp-related-grid">
            {related.map((r) => (
              <Link key={r.id} href={`/upplevelser/${r.slug}`} className="upp-card">
                <div className="upp-card-img-wrap">
                  {r.images.main && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={r.images.main}
                      alt={r.images.alt}
                      className="upp-card-img"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="upp-card-body">
                  <div className="upp-card-meta">
                    <span className="upp-card-cat">{r.category}</span>
                    <span className="upp-card-region">{r.region}</span>
                  </div>
                  <h3 className="upp-card-title">{r.title}</h3>
                  <div className="upp-card-price-row">
                    <span className="upp-card-price">Från {formatPrice(r.priceFrom)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

/**
 * Basic sanitization av Shopify-HTML: tar bort <script>, <iframe>, <style>, on*-attribut.
 * Kör i renderstid (server). Vi stolar på Happy Days innehåll som i princip redaktionellt.
 */
function sanitizeShopifyHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/ on\w+="[^"]*"/gi, "")
    .replace(/ on\w+='[^']*'/gi, "");
}
