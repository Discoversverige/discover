# Primer — Discover

> Uppdateras i slutet av varje session. Läs detta FÖRST.

## Nuläge (uppdaterad: 2026-05-10)

Discover är en svensk reseaffiliate-sida (Next.js 16, React 19). Live har: trip.com, Agoda, Expedia, Tripadvisor, Hotels.com, Tiqets, GoCity, Ticketmaster, GetTransfer, RailEurope, Yesim, Airalo, Drimsim, Viator (58 experiences), GetYourGuide, Discover Cars (83 bilar). Senaste committen är `fb03ffc Lägg till blogg med MDX-arkitektur och två första inlägg`.

Två parallella arbetsstrandar:
1. **Blogg** (ny, just startad) — 2 SV-inlägg/vecka, MDX-driven, mål 50+ inlägg
2. **Affiliate-portfölj** (pågående sen 2026-04-26) — registrera 5 hubbar + ansökningar

## Vad hände senast

- Session 2026-05-10:
  - Pullade kollegans 22 commits från GitHub (hyra-bil page, Om oss video-rebuild, hyra-bil i header, affiliate-parametrar, ny favicon)
  - Bytte alla mailadresser till `info@discovermalmo.se` (CTA på Om oss + 3 språk i kontakt-i18n)
  - Bygggde blogg-arkitektur från scratch: MDX-filer i `/content/blog/`, `lib/blog.ts` parser, `/blogg` listsida, `/blogg/[slug]` post-sida
  - Installerade `gray-matter` + `next-mdx-remote`
  - Skrev 2 SEO-inlägg på svenska (~2000 ord/styck): "Guide till Malmö för tyska besökare" + "Bästa hotellen i Malmö 2026"
  - Lagt blogg-länk i footern (bara på startsidan — footer är inte global än)
  - Tog bort död `/test`-länk från footern
  - Bytte aktivt GitHub-konto till `abdbajr` (FVS låg som default)

- Session 2026-04-26: Researchade nya affiliate-program i två omgångar, genererade `affiliate-malmo.pdf` med klickbara ansökningslänkar

## Öppna uppgifter

Se `tasks/todo.md` för full lista. Huvudpunkter:

**Blogg-pipeline (8 inlägg kvar i nuvarande lista):**
- Hidden gems in malmö
- How to get around malmö
- Malmö vs Copenhagen
- Best restaurants
- 3-day itinerary
- eSIM for Sweden
- Renting a car in Malmö
- Travel tips for first-timers

**Affiliate (sen 2026-04-26):**
- Registrera 5 affiliate-hubbar (Awin, Adtraction, Travelpayouts, Impact, CJ)
- Ansök sen till individuella program enligt PDF
- Wire in nya affiliates när godkännanden trillar in

## Viktigt för nästa session

- **Blogg-publicering:** användaren vill ha 2 inlägg/vecka. Bägge dagens posts är daterade 2026-05-10. Diskuterade bakdatering — beslut: gör inte mer än 1-3 dagar bakåt. Sprid ut kommande posts framåt istället. Frågan om att stagger nuvarande 2 posts (en idag, en 13 maj) lämnades obesvarad — fråga vid nästa session.
- **Bloggspråk:** alla inlägg skrivs på SVENSKA tills vidare (i18n för EN/DE kan komma senare via separata MDX-filer per språk).
- **Footer är inte global** — ligger i `DiscoverApp.tsx` och visas bara på startsidan. Beslut togs medvetet att inte göra global nu. Om bloggen blir viktig kan vi behöva flytta upp den till `layout.tsx`.
- **Bilder skippas i bloggen för nu** — typografi-fokus. Bygg ut med riktiga bilder när vi har dem.
- **Hindsight-skillen är skriven för Fastighetsvård Syd** och refererar FVS-repon. Discover är ett separat projekt — kör ALDRIG FVS-commit-stegen härifrån (memory-regel: Discover får aldrig deployas under FVS).
