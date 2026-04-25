/**
 * Override-affiliate-länkar för Viator-produkter.
 *
 * Viator-API:t returnerar redan färdiga affiliate-länkar med din partner ID
 * (P00298480) inbakad i varje produkts `sourceUrl`. Du behöver INTE fylla i
 * något här — det fungerar direkt.
 *
 * Använd denna fil bara om du vill överstyra en specifik produkts länk med
 * en anpassad affiliate-URL (t.ex. för kampanjspårning, en specifik mcid,
 * eller en deep-link till en specifik bokningstid).
 *
 * Format: { "productCode": "https://www.viator.com/...?pid=P00298480&..." }
 *
 * Produktkoderna hittar du i src/lib/viator-experiences.generated.ts under
 * fältet `productCode` på varje record.
 */

export const VIATOR_AFFILIATE_OVERRIDES: Record<string, string> = {
  // Exempel:
  // "5010P11": "https://www.viator.com/tours/Malmo/Malmo-Rundan-Sightseeing/d680-5010P11?pid=P00298480&mcid=42383&medium=link",
};

import type { ViatorExperience } from "./viator-experiences.generated";

/**
 * Returnerar rätt affiliate-URL för en Viator-produkt:
 * - Om productCode finns i VIATOR_AFFILIATE_OVERRIDES → den anpassade länken
 * - Annars → API:ts sourceUrl (som redan har pid inbakad)
 */
export function getViatorAffiliateUrl(exp: ViatorExperience): string {
  return VIATOR_AFFILIATE_OVERRIDES[exp.productCode] ?? exp.sourceUrl;
}
