# Lessons — Discover

> Korta rader: datum | vad gick fel / vad lärde vi | regel framåt

## 2026-05-11

- **2026-05-11** | `generate_review.py` (skill-creator eval-viewer) producerade mojibake — svenska tecken visades som "Ã¥", "Ã¤" i browser. Orsak: Python på Windows använder cp1252 som default i `Path.read_text()`, inte UTF-8. | När du kör Python-skript som läser/skriver UTF-8-textfiler på Windows, prefix kommandot med `PYTHONUTF8=1`. Gäller alla skill-creator-skripter (`generate_review.py`, `aggregate_benchmark.py` osv).

- **2026-05-11** | `discover-blogg`-skillen satte 1500-2800 ord som rimligt span, men hidden-gems-testfallet landade naturligt på 1350 ord med skarp vinkel — och det var ändå det starkare inlägget. | Skarp vinkel slår ord-räkning. Om skillen behöver justeras: tillåt kortare inlägg när vinkeln är extremt fokuserad (smal målgrupp eller åsiktsdriven).

- **2026-05-11** | Subagenter som läste `content/news/` (då `content/blog/`) som mall imiterade de befintliga inläggens stil, vilket är exakt det användaren sa är fel. | När skillar instruerar agenter att INTE härma befintligt innehåll, måste det stå explicit. `discover-blogg` säger nu "läs inte befintliga inlägg som mall" i references — men det är värt att kolla att andra framtida skills också är medvetna om det här när det gäller.

## 2026-05-20

- **2026-05-20** | Påstod att Sonos-stil + Inter-byte var live när användaren sa "inget är online". Faktiskt VAR det live — användarens browser hade cachat den gamla CSS:n. Jag försvarade mig med data från live-inspection istället för att direkt erkänna cache-möjligheten. | När användaren säger "inget syns" efter en deploy, första hypotesen ska alltid vara browser-cache (Vercel cachar CSS-filer med innehållshash). Säg det direkt och be om hard refresh INNAN du går till "men jag har bevis". Spara försvaret tills hard refresh inte hjälper.

- **2026-05-20** | Sed-kedja `s/9px/11px/; s/10px/12px/; s/11px/12px/; s/12px/13px/` resulterade i att ALLT 9-12px blev 13px (kaskad — varje steg matchade output från föregående steg). Resultat: tappade granularitet jag ville bevara. | Använd ALDRIG sed-kedjor där en regels output kan matchas av nästa regel. Antingen: gå från störst till minst (`s/12→13; s/11→12; s/10→12; s/9→11`), använd python med dict-mapping i ett pass, eller använd unika placeholder-tokens (`__BUMP_9__` osv) mellan steg.

- **2026-05-20** | `repeat(3, 1fr)` i CSS Grid lät en kolumn bli bredare än andra eftersom labels hade `white-space: nowrap`. `1fr` är egentligen `minmax(auto, 1fr)` och `auto` = min-content (= nowrap text-bredd). | I CSS Grid när celler har nowrap-content som kan vara olika långt: använd alltid `repeat(N, minmax(0, 1fr))` istället för `repeat(N, 1fr)`. Garanterar lika kolumner.

- **2026-05-20** | Föreslog "Köp Aktiv Grotesk-licens från Dalton Maag" till en sajt med ~0 trafik. Användaren hade redan Inter (gratis). Pengar bättre spenderade på riktig hotellbild-research eller affiliate-API. | Vid premium-känsla-frågor: börja med "vad får du ut av att betala?" och jämför mot status quo. För typografi: Inter och Aktiv Grotesk är visuellt nästan identiska för 99% av besökare.
