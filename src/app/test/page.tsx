export const metadata = {
  title: "Flyg till Malmö | Discover Malmö",
  description: "Hitta billiga flyg till Malmö och Köpenhamn. Jämför priser och boka enkelt.",
  robots: { index: false, follow: false },
};

export default function TestPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Hero */}
      <section style={{
        padding: "80px 24px 64px",
        textAlign: "center",
        maxWidth: 720,
        margin: "0 auto",
      }}>
        <p style={{ fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--mute)", marginBottom: 16 }}>
          Resa till Malmö
        </p>
        <h1 style={{
          fontSize: "clamp(2.2rem, 6vw, 3.8rem)",
          fontFamily: "var(--serif)",
          fontWeight: 700,
          lineHeight: 1.1,
          color: "var(--ink)",
          margin: "0 0 24px",
        }}>
          Hitta billiga flyg till{" "}
          <em style={{ color: "var(--accent)", fontStyle: "italic" }}>Malmö</em>
        </h1>
        <p style={{ fontSize: "1.1rem", color: "var(--ink-2)", lineHeight: 1.6, maxWidth: 560, margin: "0 auto 48px" }}>
          Jämför flyg från hela världen till Malmö och Köpenhamn. Boka enkelt och hitta de bästa priserna för din resa.
        </p>
      </section>

      {/* Search widget */}
      <section style={{ maxWidth: 900, margin: "0 auto 48px", padding: "0 24px" }}>
        <div id="tpwl-search" />
      </section>

      {/* Tickets widget */}
      <section style={{ maxWidth: 900, margin: "0 auto 80px", padding: "0 24px" }}>
        <div id="tpwl-tickets" />
      </section>

      {/* USPs */}
      <section style={{ maxWidth: 900, margin: "0 auto 80px", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
        {[
          { icon: "✈️", title: "Alla flygbolag", desc: "Jämför hundratals flygbolag på ett ställe." },
          { icon: "💰", title: "Bästa priset", desc: "Se prisutvecklingen och boka när det är billigast." },
          { icon: "🗺️", title: "Nära Malmö", desc: "Flyg in till Kastrup och ta tåget på 20 minuter." },
        ].map((item) => (
          <div key={item.title} style={{
            background: "var(--paper)",
            border: "1px solid var(--line-soft)",
            borderRadius: "var(--r-lg)",
            padding: "28px 24px",
          }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: "0 0 8px", color: "var(--ink)" }}>{item.title}</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--mute)", margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
