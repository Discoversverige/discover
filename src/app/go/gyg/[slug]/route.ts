/**
 * Affiliate-redirect för GetYourGuide.
 *
 * Flow: kund klickar /go/gyg/{slug} → vi loggar + sätter first-party cookie →
 * 302 till GYG med affiliate-params (partner_id=WOULPPB & utm_medium=online_publisher).
 *
 * Samma upplägg som /go/viator/[code] men för GYG.
 */

import { NextRequest, NextResponse } from "next/server";
import { GYG_EXPERIENCES } from "@/lib/gyg-experiences.generated";

const COOKIE_NAME = "dm_gyg_click";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 dagar

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  // Slug i URL kan vara antingen "gyg-foo-12345" (vår lokala slug) eller bara "12345".
  // Försök hitta produkten i båda fallen.
  const exp = GYG_EXPERIENCES.find((e) => e.slug === slug || e.slug.endsWith(`-${slug}`));
  if (!exp) {
    return NextResponse.json({ error: "Unknown product" }, { status: 404 });
  }

  // sourceUrl är redan affiliate-formaterad i ingest:en
  const targetUrl = exp.sourceUrl;

  const clickId = Math.random().toString(36).slice(2, 14);
  const referer = request.headers.get("referer") || "direct";
  console.log(
    `[gyg-click] ${new Date().toISOString()} slug=${slug} click=${clickId} ref=${referer}`,
  );

  const response = NextResponse.redirect(targetUrl, 302);
  response.cookies.set(COOKIE_NAME, `${slug}:${clickId}:${Date.now()}`, {
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return response;
}
