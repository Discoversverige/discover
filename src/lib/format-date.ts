export function formatDate(iso: string, lang: "sv" | "en" | "de" = "sv"): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const locale = lang === "sv" ? "sv-SE" : lang === "de" ? "de-DE" : "en-US";
  return d.toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
}
