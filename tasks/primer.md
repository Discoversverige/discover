# Primer — Discover

> Uppdateras i slutet av varje session. Läs detta FÖRST.

## Nuläge (uppdaterad: 2026-05-11)

Discover är en svensk reseaffiliate-sida (Next.js 16, React 19). Live har: trip.com, Agoda, Expedia, Tripadvisor, Hotels.com, Tiqets, GoCity, Ticketmaster, GetTransfer, RailEurope, Yesim, Airalo, Drimsim, Viator (58 experiences), GetYourGuide, Discover Cars (83 bilar). Senaste committen är `16842fc Global footer på alla sidor`.

Bloggen heter nu **News** (`/news` URL, klassnamn `.news-*`, type `NewsPost`, MDX i `content/news/`). Allt blogg-relaterat döptes om i denna session.

Två parallella arbetsstrandar:
1. **News** — 4 inlägg live, riktning 2/vecka, fokus är nu visuell finputs (nästan klar)
2. **Affiliate-portfölj** (pågående sen 2026-04-26) — registrera 5 hubbar + ansökningar

## Vad hände senast

- Session 2026-05-11:
  - Skrev 2 nya inlägg via `discover-blogg`-skill (med SERP-research): "Dolda pärlor i Malmö" + "Så tar du dig runt i Malmö"
  - Bygde 3 segment på /news: featured + utvalda upplevelser-carousel + topic-arkiv-filter
  - Döpte om hela "blogg/Blogg" → "news/News" (URL, klassnamn, types, content-mapp, i18n)
  - Featured-card matchar Airbnb mobile-stil: bild överst, datum, h1, "Läs mer"-pill (ingen beskrivning, ingen kategori-meta)
  - Mini-cards: 50:50 grid (image vänster 1:1 square, text höger), titel + datum
  - Mobilmeny ombyggd: språk-dropdown med globe + chevron, sociala ikoner centrerade, scroll-lock när öppen, top:95px så loggan syns
  - News-search: API-route `/api/news` + sökfält i mobilmeny som visas BARA på `/news*`
  - Header: logo 60px desktop / 50px mobil, nav 16px/weight 500, padding bumpad till 28/22px, tunn neutral grå border-bottom
  - Färgrensning: alla `--line-soft` (gold #e5dcc2) bytta mot `rgba(0,0,0,0.1-0.15)` på sökfält, lang-dropdown, divider, header
  - Carousel-segment ärver standardbredd (max-width 1180px) — inte längre full-bleed
  - **Global footer**: ny `SiteFooter.tsx` i `layout.tsx`, syns på alla sidor (var bara på startsidan tidigare)

- Session 2026-05-10:
  - Pullade kollegans 22 commits, bytte alla mailadresser → info@discovermalmo.se
  - Byggde MDX-arkitektur (gray-matter + next-mdx-remote)
  - Skrev 2 SEO-inlägg manuellt: "Guide till Malmö för tyska besökare" + "Bästa hotellen i Malmö 2026"

## Öppna uppgifter

Se `tasks/todo.md`. Huvudpunkter:

**News-pipeline (6 inlägg kvar):**
- Malmö vs Copenhagen
- Best restaurants
- 3-day itinerary
- eSIM for Sweden
- Renting a car in Malmö
- Travel tips for first-timers

**Affiliate (sen 2026-04-26):**
- Registrera 5 affiliate-hubbar (Awin, Adtraction, Travelpayouts, Impact, CJ)
- Ansök sen till individuella program enligt `affiliate-malmo.pdf`

## Viktigt för nästa session

- **Font-frågan parkerad:** användaren ville se om vi ska köra EN font (Apple-stil/Inter Tight) på alla enheter (som Airbnb gör med Cereal). Just nu: SF Pro på Apple, Inter Tight på resten. Beslut: vänta. Säg till om vi ska byta — det är 2 rader i `:root`.
- **Sociala media-länkar är `#` placeholders** i `SiteHeader.tsx` (Instagram, Facebook, TikTok). Fyll i riktiga URL:er när användaren har konton.
- **News-publicering:** användaren vill ha 2/vecka. Alla 4 nuvarande dateras 2026-05-10. Stagger-frågan (en idag, en om några dagar) fortfarande obesvarad.
- **News-language:** alla inlägg skrivs på SVENSKA tills vidare. Sökrutan filtrerar bara nuvarande svenska posts.
- **Hindsight-skillen är skriven för Fastighetsvård Syd** — kör ALDRIG FVS-commit-stegen härifrån (memory-regel: Discover får aldrig deployas under FVS).
