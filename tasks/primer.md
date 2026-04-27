# Primer — Discover

> Uppdateras i slutet av varje session. Läs detta FÖRST.

## Nuläge (uppdaterad: 2026-04-26)

Discover är en svensk reseaffiliate-sida (Next.js). Live har redan: trip.com, Agoda, Expedia, Tripadvisor, Hotels.com, Tiqets, GoCity, Ticketmaster, GetTransfer, RailEurope, Yesim, Airalo, Drimsim, Viator (58 experiences via Affiliate API + redirect-endpoint), GetYourGuide. Senaste committen är `Match menu label with URL: 'Planera' → 'Ta dig hit'`. Fokus just nu: bredda affiliate-portföljen med fler program riktade mot Malmö-publik.

## Vad hände senast

- Session 2026-04-26: Researchade nya affiliate-program i två omgångar (Google + 5 hubbar via parallella agenter, sen live-verifiering per program)
- Sållade listan från ~60 program till bara de som har faktisk Malmö-närvaro
- Genererade `affiliate-malmo.pdf` (snygg PDF, klickbara länkar, alla med affiliate-ansökningslänkar) i projektroten + på skrivbordet
- Tog bort Hilton efter feedback — Hilton har bara Stockholm Slussen + Göteborg, inget i Malmö
- HTML-källan ligger i `affiliate-malmo.html` för regenerering (Chrome headless `--print-to-pdf`)
- `.gitignore` blockerar `affiliate-malmo.*` och `*.pdf` — referensmaterial, inte kod

## Öppna uppgifter

Se `tasks/todo.md` för full lista. Huvudpunkter:
- Registrera 5 affiliate-hubbar (Awin, Adtraction, Travelpayouts, Impact, CJ) — täcker majoriteten
- Ansök sen till individuella program enligt PDF
- Wire in nya affiliates på rätt undersidor när godkännanden trillar in

## Viktigt för nästa session

- Hindsight-skillen är skriven för Fastighetsvård Syd och refererar FVS-repon. Discover är ett separat projekt — kör ALDRIG FVS-commit-stegen härifrån (memory-regeln: Discover får aldrig deployas under FVS).
- Klook, 12Go Asia, QEEQ ströks — Asien-fokus, ej Malmö-relevant. Aktivera bara om Asien-undersida byggs senare.
- Ving har inget publikt affiliate-program — kontakta affiliate@ving.se direkt.
