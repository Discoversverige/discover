"use client";

import { useState, useEffect } from "react";

type Lang = "sv" | "en" | "de";

const T = {
  sv: {
    eyebrow: "Om oss",
    heroTitle: "Vi visar Malmö",
    heroEm: "på riktigt.",
    heroLead: "Discover Malmö är en digital stadsguide skapad av Malmöbor. Inga turistfällor. Bara de bästa platserna, upplevelserna och tipsen du inte hittar någon annanstans.",
    storyLabel: "Vår story",
    storyTitle: "En guide byggd av dem som älskar Malmö",
    storyP1: "Discover Malmö startade med en enkel tanke: varför är det så svårt att hitta vad som faktiskt är bra i en stad? Turistlistor är generiska. Sökmotorer ger dig kedjor och sponsrade resultat. Vi ville göra något annat.",
    storyP2: "Vi är ett litet team av Malmöbor — designers, skribenter och lokalkännare — som kurerar rutter, upplevelser och guider baserade på verklig kunskap om staden. Allt vi rekommenderar har vi själva besökt, testat och älskar.",
    stat1: "Platser kartlagda",
    stat2: "Språk",
    stat3: "Lokalt kurerat",
    offerLabel: "Vad vi erbjuder",
    offerTitle: "Allt du behöver för att uppleva Malmö",
    p1Title: "Skräddarsydda rutter",
    p1: "Tematiska promenadguider och dagsturer skapade av Malmöbor — från matupplevelser till arkitekturvandringar.",
    p2Title: "Handplockade upplevelser",
    p2: "Vi listar bara det vi faktiskt rekommenderar — restauranger, events, aktiviteter och dolda pärlor i Malmö och Skåne.",
    p3Title: "Praktisk reseinformation",
    p3: "Hitta hit, hyra bil, boka boende — allt samlat på ett ställe så du kan fokusera på att njuta av staden.",
    ctaTitle: "Vill du synas på Discover Malmö?",
    ctaLead: "Vi samarbetar med lokala aktörer, restauranger, upplevelseföretag och hotell. Hör av dig så berättar vi mer.",
    ctaBtn: "Kontakta oss",
  },
  en: {
    eyebrow: "About us",
    heroTitle: "We show Malmö",
    heroEm: "for real.",
    heroLead: "Discover Malmö is a digital city guide created by locals. No tourist traps. Just the best places, experiences and tips you won't find anywhere else.",
    storyLabel: "Our story",
    storyTitle: "A guide built by people who love Malmö",
    storyP1: "Discover Malmö started with a simple idea: why is it so hard to find what's actually good in a city? Tourist lists are generic. Search engines give you chains and sponsored results. We wanted to do something different.",
    storyP2: "We are a small team of Malmö locals — designers, writers and insiders — who curate routes, experiences and guides based on real knowledge of the city. Everything we recommend we have personally visited, tested and love.",
    stat1: "Places mapped",
    stat2: "Languages",
    stat3: "Locally curated",
    offerLabel: "What we offer",
    offerTitle: "Everything you need to experience Malmö",
    p1Title: "Tailor-made routes",
    p1: "Themed walking guides and day trips created by Malmö locals — from food experiences to architecture walks.",
    p2Title: "Handpicked experiences",
    p2: "We only list what we actually recommend — restaurants, events, activities and hidden gems in Malmö and Skåne.",
    p3Title: "Practical travel info",
    p3: "Getting here, renting a car, booking accommodation — all in one place so you can focus on enjoying the city.",
    ctaTitle: "Want to be featured on Discover Malmö?",
    ctaLead: "We partner with local businesses, restaurants, experience providers and hotels. Get in touch and we'll tell you more.",
    ctaBtn: "Contact us",
  },
  de: {
    eyebrow: "Über uns",
    heroTitle: "Wir zeigen Malmö",
    heroEm: "echt und authentisch.",
    heroLead: "Discover Malmö ist ein digitaler Stadtführer, erstellt von Malmöern. Keine Touristenfallen. Nur die besten Orte, Erlebnisse und Tipps, die du nirgendwo sonst findest.",
    storyLabel: "Unsere Geschichte",
    storyTitle: "Ein Reiseführer von Menschen, die Malmö lieben",
    storyP1: "Discover Malmö begann mit einer einfachen Idee: Warum ist es so schwer, herauszufinden, was in einer Stadt wirklich gut ist? Touristenlisten sind generisch. Suchmaschinen zeigen dir Ketten und gesponserte Ergebnisse. Wir wollten etwas anderes machen.",
    storyP2: "Wir sind ein kleines Team aus Malmöern — Designer, Autoren und Insider — die Routen, Erlebnisse und Reiseführer auf Basis echter Stadtkenntnis zusammenstellen. Alles, was wir empfehlen, haben wir selbst besucht, getestet und lieben wir.",
    stat1: "Orte kartiert",
    stat2: "Sprachen",
    stat3: "Lokal kuratiert",
    offerLabel: "Was wir anbieten",
    offerTitle: "Alles, was du brauchst, um Malmö zu erleben",
    p1Title: "Maßgeschneiderte Routen",
    p1: "Thematische Spaziergänge und Tagestouren von Malmöern erstellt — von kulinarischen Erlebnissen bis zu Architekturführungen.",
    p2Title: "Handverlesene Erlebnisse",
    p2: "Wir listen nur das auf, was wir wirklich empfehlen — Restaurants, Events, Aktivitäten und versteckte Perlen in Malmö und Skåne.",
    p3Title: "Praktische Reiseinfos",
    p3: "Anreise, Mietwagen, Unterkunft — alles an einem Ort, damit du dich auf das Genießen der Stadt konzentrieren kannst.",
    ctaTitle: "Möchtest du auf Discover Malmö erscheinen?",
    ctaLead: "Wir arbeiten mit lokalen Unternehmen, Restaurants, Erlebnisanbietern und Hotels zusammen. Melde dich und wir erzählen dir mehr.",
    ctaBtn: "Kontakt aufnehmen",
  },
};

export default function OmOssContent() {
  const [lang, setLang] = useState<Lang>("sv");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const readLang = () => {
      try {
        const saved = localStorage.getItem("dm-lang") as Lang;
        if (saved && ["sv", "en", "de"].includes(saved)) setLang(saved);
      } catch {}
    };
    const onCustom = (e: Event) => {
      const l = (e as CustomEvent).detail as Lang;
      if (["sv", "en", "de"].includes(l)) setLang(l);
    };
    readLang();
    window.addEventListener("storage", readLang);
    window.addEventListener("dm-lang-change", onCustom);
    setMounted(true);
    return () => {
      window.removeEventListener("storage", readLang);
      window.removeEventListener("dm-lang-change", onCustom);
    };
  }, []);

  const t = T[lang];

  if (!mounted) return (
    <main className="om-page">
      <div style={{maxWidth: 760, margin: "0 auto", padding: "60px 40px", textAlign: "center", display: "flex", flexDirection: "column", gap: 20, alignItems: "center"}}>
        <div className="skeleton" style={{height: 300, width: "100%", borderRadius: 16}} />
        <div className="skeleton skeleton-line w-40" style={{marginTop: 16}} />
        <div className="skeleton" style={{height: 52, width: "70%", borderRadius: 8}} />
        <div className="skeleton skeleton-line w-80" />
        <div className="skeleton skeleton-line w-60" />
      </div>
      <div style={{maxWidth: 1180, margin: "0 auto", padding: "0 40px 80px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24}}>
        {Array.from({length: 3}).map((_, i) => (
          <div key={i} className="skeleton-card" style={{padding: 32}}>
            <div className="skeleton skeleton-line w-20" style={{height: 14, marginBottom: 16}} />
            <div className="skeleton skeleton-line w-80 h-16" style={{marginBottom: 10}} />
            <div className="skeleton skeleton-line w-100" />
            <div className="skeleton skeleton-line w-60" />
          </div>
        ))}
      </div>
    </main>
  );

  return (
    <main className="om-page">

      {/* Video-banner */}
      <section className="om-hero" aria-label={t.eyebrow}>
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
          <p className="om-eyebrow">{t.eyebrow}</p>
          <h1 className="om-hero-title">{t.heroTitle}<br /><em>{t.heroEm}</em></h1>
          <p className="om-hero-lead">{t.heroLead}</p>
        </div>
      </section>

      {/* Story */}
      <section className="om-section om-story">
        <div className="om-section-inner">
          <div className="om-story-text">
            <h2>{t.storyTitle}</h2>
            <p>{t.storyP1}</p>
            <p>{t.storyP2}</p>
          </div>
          <div className="om-story-stats">
            <div className="om-stat">
              <span className="om-stat-val">500+</span>
              <span className="om-stat-lbl">{t.stat1}</span>
            </div>
            <div className="om-stat">
              <span className="om-stat-val">3</span>
              <span className="om-stat-lbl">{t.stat2}</span>
            </div>
            <div className="om-stat">
              <span className="om-stat-val">100%</span>
              <span className="om-stat-lbl">{t.stat3}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Erbjudanden */}
      <section className="om-section om-pillars">
        <div className="om-section-inner om-section-inner--center">
          <h2>{t.offerTitle}</h2>
          <div className="om-pillars-grid">
            <div className="om-pillar">
              <h3>{t.p1Title}</h3>
              <p>{t.p1}</p>
            </div>
            <div className="om-pillar">
              <h3>{t.p2Title}</h3>
              <p>{t.p2}</p>
            </div>
            <div className="om-pillar">
              <h3>{t.p3Title}</h3>
              <p>{t.p3}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="om-section om-cta-section">
        <div className="om-section-inner om-section-inner--center">
          <h2>{t.ctaTitle}</h2>
          <p>{t.ctaLead}</p>
          <a href="mailto:info@discovermalmo.se" className="om-cta-btn">{t.ctaBtn}</a>
        </div>
      </section>

    </main>
  );
}
