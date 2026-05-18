# Lessons — Discover

> Korta rader: datum | vad gick fel / vad lärde vi | regel framåt

## 2026-05-11

- **2026-05-11** | `generate_review.py` (skill-creator eval-viewer) producerade mojibake — svenska tecken visades som "Ã¥", "Ã¤" i browser. Orsak: Python på Windows använder cp1252 som default i `Path.read_text()`, inte UTF-8. | När du kör Python-skript som läser/skriver UTF-8-textfiler på Windows, prefix kommandot med `PYTHONUTF8=1`. Gäller alla skill-creator-skripter (`generate_review.py`, `aggregate_benchmark.py` osv).

- **2026-05-11** | `discover-blogg`-skillen satte 1500-2800 ord som rimligt span, men hidden-gems-testfallet landade naturligt på 1350 ord med skarp vinkel — och det var ändå det starkare inlägget. | Skarp vinkel slår ord-räkning. Om skillen behöver justeras: tillåt kortare inlägg när vinkeln är extremt fokuserad (smal målgrupp eller åsiktsdriven).

- **2026-05-11** | Subagenter som läste `content/news/` (då `content/blog/`) som mall imiterade de befintliga inläggens stil, vilket är exakt det användaren sa är fel. | När skillar instruerar agenter att INTE härma befintligt innehåll, måste det stå explicit. `discover-blogg` säger nu "läs inte befintliga inlägg som mall" i references — men det är värt att kolla att andra framtida skills också är medvetna om det här när det gäller.
