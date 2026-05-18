# Primer — Discover

> Uppdateras i slutet av varje session. Läs detta FÖRST.

## Nuläge (uppdaterad: 2026-05-18)

Discover är en svensk reseaffiliate-sida (Next.js 16, React 19). Live har: trip.com, Agoda, Expedia, Tripadvisor, Hotels.com, Tiqets, GoCity, Ticketmaster, GetTransfer, RailEurope, Yesim, Airalo, Drimsim, Viator (58 experiences), GetYourGuide, Discover Cars (83 bilar). Senaste committen är `8f67644 Fix: hamburgermenyns topbar matchar nu sidans topbar i höjd`.

Bloggen heter **News** (`/news` URL, klassnamn `.news-*`, type `NewsPost`, MDX i `content/news/`).

Två parallella arbetsstrandar:
1. **News** — 6 inlägg live, riktning 2/vecka, 4 kvar i pipeline
2. **Affiliate-portfölj** (pågående sen 2026-04-26) — registrera 5 hubbar + ansökningar

## Vad hände senast

- Session 2026-05-18:
  - Switchat aktivt GitHub-konto till `abdbajr` (Discover-kontot) via `gh auth switch`
  - Skrev 2 nya News-inlägg via `discover-blogg`-skill (SERP-research + vinkelval):
    - `malmo-vs-kopenhamn.mdx` — ärlig beslutsguide, inte "gör båda"-floskel. Konkret budgetjämförelse + 4 fall där hybridstrategi inte funkar.
    - `basta-restaurangerna-i-malmo.mdx` — organiserad efter situation (date, utan bokning, Möllan-runda, med barn, lunch), inte topp-10. Plus 3 ärliga skipp.
  - Båda inläggen har internlänkar till andra news-poster (`basta-hotellen-i-malmo`, `sa-tar-du-dig-runt-i-malmo`, `dolda-parlor-i-malmo`, korsvis mellan de nya). Användaren krävde att internlänkar alltid ska finnas — gäller framöver.

- Session 2026-05-11 (forts. sen kväll):
  - Mini-cards bilder bytte från 1:1 square till **4:3 rektangulära** (per användarfeedback "smala fast bredd kvar")
  - Datum mindre (9.5px var 11px) i både Senaste och Hela arkivet
  - **Hela arkivet (segment 3)** minimaliserat: tog bort kategori-tag och beskrivning, bara titel + datum, 50:50 grid med 4:3 bilder (matchar Senaste-stilen)
  - **Carousel-pilar** bytte från tjocka ←/→ till tunna chevron-SVG:er (Airbnb-stil), 36px små cirklar
  - **`.news-page` får explicit `background: #fff`** så hela news-sidan är vit (carousel-sektionen kände sig beige tidigare)
  - **Hamburgermeny ombyggd igen:**
    - Fullscreen overlay (top: 0, z-index: 1000) med slide-in från höger (0.28s ease)
    - Logo + border-bottom inuti menyns top-section, identiska responsive padding som .topbar
    - X close-knapp uppe till höger (samma stil som carousel-pilar)
    - **Bug-fix:** `.mobile-menu a`-selektorn för menyalternativ matchade även logo-länken inuti `.mobile-menu-top` → padding 16px 0 → extra 32px höjd. Fixat med `.mobile-menu-top .logo { padding: 0; }` override.

- Session 2026-05-10/11 (skill-skapande, för referens):
  - Byggde `discover-blogg`-skillen från SEO-transkript: SKILL.md + 4 references (serp-research, vinkelval, skrivstil, mdx-struktur) under `~/.claude/skills/discover-blogg/`
  - Verifierade med 3 testfall (hidden gems, hyrbil, Malmö vs KBH) via parallella subagenter (med/utan skill). Resultat: +27 procentenheter pass rate (95% vs 68%). Allt under `~/.claude/skills/discover-blogg-workspace/iteration-1/`
  - Mojibake-fix i `generate_review.py` (Python defaultar cp1252 på Windows) — körs med `PYTHONUTF8=1` framför kommandot

- Session 2026-05-11 (tidigare):
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
