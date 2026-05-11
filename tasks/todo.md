# Todo — Discover

## News-pipeline (svenska SEO-artiklar, 1500-2500 ord/styck)

Klart 2026-05-10:
- [x] 1. Malmö travel guide for germans → `malmo-guide-for-tyska-besokare.mdx`
- [x] 2. Best hotels in Malmö Sweden → `basta-hotellen-i-malmo.mdx`

Klart 2026-05-11 (via discover-blogg-skill med SERP-research):
- [x] 3. Hidden gems in Malmö → `dolda-parlor-i-malmo.mdx`
- [x] 4. How to get around Malmö → `sa-tar-du-dig-runt-i-malmo.mdx`

Att göra:
- [ ] 5. Malmö vs Copenhagen — which to visit
- [ ] 6. Best restaurants in Malmö
- [ ] 7. Malmö 3-day itinerary
- [ ] 8. eSIM for traveling Sweden
- [ ] 9. Renting a car in Malmö
- [ ] 10. Malmö travel tips for first-timers

Bygg-rytm: 2 inlägg per session, 2 dagar per vecka. Använd `discover-blogg`-skillen för SERP-research + vinkelval (gör skillnad mot manuellt skrivande).

## Affiliate-hubbar (registrera — täcker majoriteten av program)

- [ ] Awin — https://www.awin.com/se/affiliate-network (Booking, Novasol, Stena Line, Opodo, Lonely Planet, Osprey EU, Cotopaxi EU)
- [ ] Adtraction — https://www.adtraction.com (NordVPN SE, nordiska annonsörer)
- [ ] Travelpayouts — https://www.travelpayouts.com (Kiwitaxi, WeGoTrip, EKTA, Radical Storage)
- [ ] Impact — https://impact.com (Skyscanner, Pelago, Tinggly, TUI, Surfshark)
- [ ] CJ Affiliate — https://www.cj.com (Kiwi.com, World Nomads, ExpressVPN)

## Affiliate-direktansökningar (se affiliate-malmo.pdf för full lista)

Hotell:
- [ ] Booking.com — partnerships.booking.com
- [ ] Strawberry Hotels — strawberryhotels.com/about/affiliate-program/
- [ ] Marriott Bonvoy — marriott.com/marriott/affiliateprogram.mi
- [ ] Vrbo — creator.expediagroup.com/affiliates

Aktiviteter:
- [ ] Civitatis — civitatis.com/en/affiliates/
- [ ] TUI Musement — partner.tuimusement.com/partner-sign-up/
- [ ] WeGoTrip — partner.wegotrip.com/
- [ ] Tinggly — tinggly.com/affiliate-program

Flyg/charter:
- [ ] Skyscanner — partners.skyscanner.net/product/affiliates
- [ ] KAYAK/Momondo — affiliates.kayak.com
- [ ] Ving — mejla affiliate@ving.se direkt

Biluthyrning + transfer:
- [ ] Discover Cars — discovercars.com/affiliate
- [ ] Welcome Pickups — go.partner.welcomepickups.com/en/affiliates/signup/

Tåg/färja:
- [ ] Omio — omio.com/affiliate
- [ ] Trainline — join.partnerize.com/trainline/en

Bagage:
- [ ] Bounce — bounce.com/ls/affiliates
- [ ] Radical Storage — radicalstorage.com/affiliates
- [ ] LuggageHero — luggagehero.com/affiliate-program/

Försäkring + eSIM + VPN: se PDF för 13 program till.

## Efter godkännanden

- [ ] Wire in nya affiliates på rätt undersidor (analogt med Viator-flödet: redirect-endpoint per program för förstapartstracking)
- [ ] Lägg till nya kategorier på `/upplevelser` om relevant
- [ ] Eventuellt egen sida för eSIM/försäkring/transport om utbudet växer

## Övrigt — kandidater att lyfta vid behov

- [ ] Stagger nuvarande news-posts datum (en 2026-05-10, en 2026-05-13) — fortfarande obesvarad
- [x] Flytta footer till `layout.tsx` så den syns på alla sidor (klart 2026-05-11)
- [ ] Sociala media-länkar i SiteHeader.tsx är `#` placeholders — fyll i riktiga URL:er när konton finns
- [ ] Lägga till egna bilder (just nu använder vi /public/images/* + Unsplash hotlinks)
- [ ] Översättning av news till EN/DE (separata MDX-filer per språk)
- [ ] Font-konsolidering: byt till EN font (Apple-stil eller Inter Tight) på alla enheter — beslut parkerat
- [ ] Konsekvent designsystem: 35 av 142 font-family-deklarationer är hårdkodade till Next.js font-vars istället för --sans/--serif/--mono. Cleanup vid behov.
