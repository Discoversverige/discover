import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Om oss | Discover Malmö – Din lokala guide till stadens pärlor",
  description: "Discover Malmö är en digital stadsguide skapad av Malmöbor för dig som vill uppleva staden på riktigt. Vi listar de bästa restaurangerna, upplevelserna och dolda pärlorna.",
  openGraph: {
    title: "Om oss | Discover Malmö",
    description: "Discover Malmö är en digital stadsguide skapad av Malmöbor för dig som vill uppleva staden på riktigt.",
    url: "https://discovermalmo.se/om-oss",
    siteName: "Discover Malmö",
    locale: "sv_SE",
    type: "website",
  },
  alternates: { canonical: "https://discovermalmo.se/om-oss" },
};

export default function OmOssPage() {
  return (
    <main className="om-page">

      {/* ── Video-banner ── */}
      <section className="om-hero" aria-label="Om Discover Malmö">
        <video
          className="om-hero-video"
          src="/videos/malmo-drone.mp4"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <div className="om-hero-overlay" />
        <div className="om-hero-content">
          <p className="om-eyebrow">Om oss</p>
          <h1 className="om-hero-title">Vi visar Malmö —<br /><em>på riktigt.</em></h1>
          <p className="om-hero-lead">
            Discover Malmö är en digital stadsguide skapad av Malmöbor. Inga turistfällor — bara de bästa platserna, upplevelserna och tipsen du inte hittar någon annanstans.
          </p>
        </div>
      </section>

      {/* ── Vår story ── */}
      <section className="om-section om-story">
        <div className="om-section-inner">
          <div className="om-story-text">
            <p className="om-label">Vår story</p>
            <h2>En guide byggd av dem som älskar Malmö</h2>
            <p>
              Discover Malmö startade med en enkel tanke: varför är det så svårt att hitta vad som faktiskt är bra i en stad? Turistlistor är generiska. Sökmotorer ger dig kedjor och sponsrade resultat. Vi ville göra något annat.
            </p>
            <p>
              Vi är ett litet team av Malmöbor — designers, skribenter och lokalkännare — som kurerar rutter, upplevelser och guider baserade på verklig kunskap om staden. Allt vi rekommenderar har vi själva besökt, testat och älskar.
            </p>
          </div>
          <div className="om-story-stats">
            <div className="om-stat">
              <span className="om-stat-val">500+</span>
              <span className="om-stat-lbl">Platser kartlagda</span>
            </div>
            <div className="om-stat">
              <span className="om-stat-val">3</span>
              <span className="om-stat-lbl">Språk</span>
            </div>
            <div className="om-stat">
              <span className="om-stat-val">100%</span>
              <span className="om-stat-lbl">Lokalt kurerat</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Vad vi erbjuder ── */}
      <section className="om-section om-pillars">
        <div className="om-section-inner om-section-inner--center">
          <p className="om-label">Vad vi erbjuder</p>
          <h2>Allt du behöver för att uppleva Malmö</h2>
          <div className="om-pillars-grid">
            <div className="om-pillar">
              <div className="om-pillar-icon">🗺</div>
              <h3>Skräddarsydda rutter</h3>
              <p>Tematiska promenadguider och dagsturer skapade av Malmöbor — från matupplevelser till arkitekturvandringar.</p>
            </div>
            <div className="om-pillar">
              <div className="om-pillar-icon">✨</div>
              <h3>Handplockade upplevelser</h3>
              <p>Vi listar bara det vi faktiskt rekommenderar — restauranger, events, aktiviteter och dolda pärlor i Malmö och Skåne.</p>
            </div>
            <div className="om-pillar">
              <div className="om-pillar-icon">🚗</div>
              <h3>Praktisk reseinformation</h3>
              <p>Hitta hit, hyra bil, boka boende — allt samlat på ett ställe så du kan fokusera på att njuta av staden.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="om-section om-cta-section">
        <div className="om-section-inner om-section-inner--center">
          <h2>Vill du synas på Discover Malmö?</h2>
          <p>Vi samarbetar med lokala aktörer, restauranger, upplevelseföretag och hotell. Hör av dig så berättar vi mer.</p>
          <a href="mailto:benjamin.ishoh@gmail.com" className="om-cta-btn">Kontakta oss</a>
        </div>
      </section>

    </main>
  );
}
