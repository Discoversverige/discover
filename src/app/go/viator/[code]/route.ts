/**
 * Affiliate-redirect för Viator.
 *
 * Flow: kund klickar /go/viator/{productCode} → vi loggar + sätter
 * first-party cookie → 302 till Viator med färska affiliate-params.
 *
 * Fördelar mot direkt-länkning:
 * - Vi har egen tracking oavsett om kunden accepterar Viators cookies
 * - Om Viator ändrar URL-format ändrar vi en plats istället för 58
 * - First-party cookie räknas som "essential" (GDPR-exempt) eftersom
 *   den driver kärnfunktionalitet (vår egen affiliate-attribution)
 * - Vi kan A/B-testa olika URL-format utan att röra produktdata
 */

import { NextRequest, NextResponse } from "next/server";
import { VIATOR_EXPERIENCES } from "@/lib/viator-experiences.generated";
import { VIATOR_AFFILIATE_OVERRIDES } from "@/lib/viator-affiliate-overrides";

const PARTNER_ID = "P00298480";
const MCID = "42383";
const COOKIE_NAME = "dm_viator_click";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 dagar (matchar Viators attribution window)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;

  // 1. Verifiera att produkten finns i vår katalog (inte open redirect)
  const exp = VIATOR_EXPERIENCES.find((v) => v.productCode === code);
  if (!exp) {
    return NextResponse.json({ error: "Unknown product" }, { status: 404 });
  }

  // 2. Bygg affiliate-URL — använd override om den finns, annars
  //    konstruera från API:ts canonical URL men behåll /sv-SE/ för
  //    att Viator inte ska redirecta till listsidan
  let targetUrl: string;
  if (VIATOR_AFFILIATE_OVERRIDES[code]) {
    targetUrl = VIATOR_AFFILIATE_OVERRIDES[code];
  } else {
    // Använd det vi sparat (utan /sv-SE/) men lägg tillbaka det
    // — Viators redirect-logik verkar funka bättre med locale i URL:en
    const baseUrl = exp.sourceUrl.split("?")[0];
    const withLocale = baseUrl.includes("/sv-SE/")
      ? baseUrl
      : baseUrl.replace("viator.com/tours/", "viator.com/sv-SE/tours/");
    targetUrl = `${withLocale}?pid=${PARTNER_ID}&mcid=${MCID}&medium=link`;
  }

  // 3. Logga (i produktion: skicka till analytics; just nu enkel console)
  const clickId = Math.random().toString(36).slice(2, 14);
  const referer = request.headers.get("referer") || "direct";
  console.log(
    `[viator-click] ${new Date().toISOString()} code=${code} click=${clickId} ref=${referer}`,
  );

  // 4. Sätt first-party cookie för attribution + 302 till Viator
  const response = NextResponse.redirect(targetUrl, 302);
  response.cookies.set(COOKIE_NAME, `${code}:${clickId}:${Date.now()}`, {
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return response;
}
