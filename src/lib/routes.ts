export const ROUTES = {
  default: {
    title: { sv: "Halvdag i Malmö", en: "Half a day in Malmö", de: "Halber Tag in Malmö" },
    duration: { sv: "4 tim", en: "4 hrs", de: "4 Std" },
    distance: "4.2 km",
    stops: [
      { x: 460, y: 330, lat: 55.6059, lng: 13.0007, name: { sv: "Stortorget", en: "Stortorget", de: "Stortorget" }, kind: { sv: "Start · Gamla staden", en: "Start · Old town", de: "Start · Altstadt" } },
      { x: 360, y: 360, lat: 55.6072, lng: 12.9918, name: { sv: "Malmöhus slott", en: "Malmöhus castle", de: "Schloss Malmöhus" }, kind: { sv: "Historia · 45 min", en: "History · 45 min", de: "Geschichte · 45 Min" } },
      { x: 280, y: 230, lat: 55.6097, lng: 12.9741, name: { sv: "Ribersborg", en: "Ribersborg beach", de: "Ribersborg" }, kind: { sv: "Hav · Promenad", en: "Sea · Walk", de: "Meer · Spaziergang" } },
      { x: 410, y: 130, lat: 55.6155, lng: 12.9773, name: { sv: "Turning Torso", en: "Turning Torso", de: "Turning Torso" }, kind: { sv: "Arkitektur · Foto", en: "Architecture · Photo", de: "Architektur · Foto" } },
      { x: 560, y: 180, lat: 55.6134, lng: 12.9889, name: { sv: "Västra hamnen", en: "Western Harbour", de: "Westhafen" }, kind: { sv: "Fika · Havsbad", en: "Coffee · Swim", de: "Kaffee · Baden" } },
      { x: 620, y: 430, lat: 55.5921, lng: 13.0082, name: { sv: "Möllevången", en: "Möllevången", de: "Möllevången" }, kind: { sv: "Street food · Marknad", en: "Street food · Market", de: "Street Food · Markt" } },
    ],
  },
  food: {
    title: { sv: "Bästa fikat i Malmö", en: "The best coffee in Malmö", de: "Der beste Kaffee in Malmö" },
    duration: { sv: "2 tim", en: "2 hrs", de: "2 Std" },
    distance: "1.8 km",
    stops: [
      { x: 470, y: 310, lat: 55.6065, lng: 12.9987, name: { sv: "Lilla torg", en: "Lilla torg", de: "Lilla torg" }, kind: { sv: "Start · Fik-kluster", en: "Start · Café cluster", de: "Start · Café-Cluster" } },
      { x: 540, y: 360, lat: 55.6027, lng: 13.0008, name: { sv: "Davidshall", en: "Davidshall", de: "Davidshall" }, kind: { sv: "Specialty coffee", en: "Specialty coffee", de: "Specialty Coffee" } },
      { x: 620, y: 430, lat: 55.5921, lng: 13.0082, name: { sv: "Möllevången", en: "Möllevången", de: "Möllevången" }, kind: { sv: "Surdegsbageri", en: "Sourdough bakery", de: "Sauerteigbäckerei" } },
      { x: 680, y: 520, lat: 55.5878, lng: 13.0121, name: { sv: "Folkets park", en: "Folkets park", de: "Folkets park" }, kind: { sv: "Kardemummabulle", en: "Cardamom bun", de: "Kardamombrötchen" } },
    ],
  },
  architecture: {
    title: { sv: "Turning Torso & Västra hamnen", en: "Turning Torso & Western Harbour", de: "Turning Torso & Westhafen" },
    duration: { sv: "3 tim", en: "3 hrs", de: "3 Std" },
    distance: "3.1 km",
    stops: [
      { x: 460, y: 330, lat: 55.6059, lng: 13.0007, name: { sv: "Stortorget", en: "Stortorget", de: "Stortorget" }, kind: { sv: "Start", en: "Start", de: "Start" } },
      { x: 410, y: 130, lat: 55.6155, lng: 12.9773, name: { sv: "Turning Torso", en: "Turning Torso", de: "Turning Torso" }, kind: { sv: "190 m · Calatrava", en: "190 m · Calatrava", de: "190 m · Calatrava" } },
      { x: 560, y: 180, lat: 55.6134, lng: 12.9889, name: { sv: "Västra hamnen", en: "Western Harbour", de: "Westhafen" }, kind: { sv: "Bo01 · Promenad", en: "Bo01 · Walk", de: "Bo01 · Spaziergang" } },
      { x: 650, y: 240, lat: 55.6148, lng: 12.9952, name: { sv: "Dockan", en: "Dockan", de: "Dockan" }, kind: { sv: "Kontor & kaj", en: "Offices & pier", de: "Büros & Kai" } },
    ],
  },
  family: {
    title: { sv: "Halvdag i Malmö med barn", en: "Half a day in Malmö with kids", de: "Ein halber Tag in Malmö mit Kindern" },
    duration: { sv: "4 tim", en: "4 hrs", de: "4 Std" },
    distance: "3.8 km",
    stops: [
      { x: 360, y: 360, lat: 55.6072, lng: 12.9918, name: { sv: "Malmöhus slott", en: "Malmöhus castle", de: "Schloss Malmöhus" }, kind: { sv: "Akvarium · Slott", en: "Aquarium · Castle", de: "Aquarium · Schloss" } },
      { x: 340, y: 420, lat: 55.6048, lng: 12.9901, name: { sv: "Slottsparken", en: "Slottsparken", de: "Slottsparken" }, kind: { sv: "Picknick · Lek", en: "Picnic · Play", de: "Picknick · Spielen" } },
      { x: 680, y: 520, lat: 55.5878, lng: 13.0121, name: { sv: "Folkets park", en: "Folkets park", de: "Folkets park" }, kind: { sv: "Karusell · Glass", en: "Carousel · Ice cream", de: "Karussell · Eis" } },
      { x: 560, y: 540, lat: 55.5895, lng: 13.0065, name: { sv: "Mitt Möllan", en: "Mitt Möllan", de: "Mitt Möllan" }, kind: { sv: "Lunch · Marknad", en: "Lunch · Market", de: "Mittag · Markt" } },
      { x: 280, y: 230, lat: 55.6097, lng: 12.9741, name: { sv: "Ribersborg", en: "Ribersborg beach", de: "Ribersborg" }, kind: { sv: "Sandstrand", en: "Sandy beach", de: "Sandstrand" } },
    ],
  },
  culture: {
    title: { sv: "Museer & gallerier på en dag", en: "Museums & galleries in a day", de: "Museen & Galerien an einem Tag" },
    duration: { sv: "6 tim", en: "6 hrs", de: "6 Std" },
    distance: "5.4 km",
    stops: [
      { x: 360, y: 360, lat: 55.6072, lng: 12.9918, name: { sv: "Malmöhus slott", en: "Malmöhus castle", de: "Schloss Malmöhus" }, kind: { sv: "Konstmuseum", en: "Art museum", de: "Kunstmuseum" } },
      { x: 480, y: 300, lat: 55.6058, lng: 12.9978, name: { sv: "Form/Design Center", en: "Form/Design Center", de: "Form/Design Center" }, kind: { sv: "Design", en: "Design", de: "Design" } },
      { x: 540, y: 380, lat: 55.6034, lng: 13.0021, name: { sv: "Moderna Museet", en: "Moderna Museet", de: "Moderna Museet" }, kind: { sv: "Samtidskonst", en: "Contemporary art", de: "Zeitgenössische Kunst" } },
      { x: 620, y: 430, lat: 55.5921, lng: 13.0082, name: { sv: "Möllevången", en: "Möllevången", de: "Möllevången" }, kind: { sv: "Gallerier", en: "Galleries", de: "Galerien" } },
      { x: 700, y: 360, lat: 55.5962, lng: 13.0148, name: { sv: "Konsthallen", en: "Konsthallen", de: "Kunsthalle" }, kind: { sv: "Utställning", en: "Exhibition", de: "Ausstellung" } },
      { x: 560, y: 540, lat: 55.5895, lng: 13.0065, name: { sv: "Inkonst", en: "Inkonst", de: "Inkonst" }, kind: { sv: "Scenkonst", en: "Performance", de: "Darstellende Kunst" } },
    ],
  },
  nature: {
    title: { sv: "Promenad längs havet", en: "A walk along the sea", de: "Ein Spaziergang am Meer" },
    duration: { sv: "2 tim", en: "2 hrs", de: "2 Std" },
    distance: "3.6 km",
    stops: [
      { x: 280, y: 230, lat: 55.6097, lng: 12.9741, name: { sv: "Ribersborg", en: "Ribersborg", de: "Ribersborg" }, kind: { sv: "Kallbadhus", en: "Cold bathhouse", de: "Kaltbadehaus" } },
      { x: 420, y: 170, lat: 55.6118, lng: 12.9812, name: { sv: "Scaniabadet", en: "Scaniabadet", de: "Scaniabadet" }, kind: { sv: "Strand", en: "Beach", de: "Strand" } },
      { x: 620, y: 200, lat: 55.6141, lng: 12.9968, name: { sv: "Daniaparken", en: "Daniaparken", de: "Daniaparken" }, kind: { sv: "Hopptorn · Havsbad", en: "Diving · Swim", de: "Sprungturm · Baden" } },
    ],
  },
  shopping: {
    title: { sv: "Lokal design & second hand", en: "Local design & vintage", de: "Lokales Design & Vintage" },
    duration: { sv: "3 tim", en: "3 hrs", de: "3 Std" },
    distance: "2.6 km",
    stops: [
      { x: 470, y: 310, lat: 55.6065, lng: 12.9987, name: { sv: "Lilla torg", en: "Lilla torg", de: "Lilla torg" }, kind: { sv: "Butiker", en: "Boutiques", de: "Boutiquen" } },
      { x: 540, y: 360, lat: 55.6027, lng: 13.0008, name: { sv: "Davidshall", en: "Davidshall", de: "Davidshall" }, kind: { sv: "Design", en: "Design", de: "Design" } },
      { x: 620, y: 430, lat: 55.5921, lng: 13.0082, name: { sv: "Möllevången", en: "Möllevången", de: "Möllevången" }, kind: { sv: "Second hand", en: "Vintage", de: "Vintage" } },
      { x: 560, y: 540, lat: 55.5895, lng: 13.0065, name: { sv: "Mitt Möllan", en: "Mitt Möllan", de: "Mitt Möllan" }, kind: { sv: "Konceptbutiker", en: "Concept stores", de: "Conceptstores" } },
      { x: 700, y: 360, lat: 55.5962, lng: 13.0148, name: { sv: "Södra Förstadsgatan", en: "Södra Förstadsgatan", de: "Södra Förstadsgatan" }, kind: { sv: "Shopping", en: "Shopping", de: "Shopping" } },
      { x: 480, y: 300, lat: 55.6058, lng: 12.9978, name: { sv: "Form/Design", en: "Form/Design", de: "Form/Design" }, kind: { sv: "Svensk design", en: "Swedish design", de: "Schwedisches Design" } },
      { x: 380, y: 290, lat: 55.6068, lng: 12.9945, name: { sv: "Gustav", en: "Gustav", de: "Gustav" }, kind: { sv: "Antikt", en: "Antiques", de: "Antiquitäten" } },
    ],
  },
};

export type RouteKey = keyof typeof ROUTES;
export type Route = typeof ROUTES[RouteKey];
