import type { Metadata } from "next";
import { Inter_Tight, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const interTight = Inter_Tight({ variable: "--font-inter-tight", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({ variable: "--font-instrument-serif", subsets: ["latin"], weight: "400" });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discover Malmö – Din lokala guide till stadens pärlor",
  description: "Utforska Malmö med våra skräddarsydda rutter. Vi hjälper dig hitta de bästa hotellen, trendigaste restaurangerna och dolda sevärdheter. Planera ditt Malmö-äventyr här!",
  icons: {
    icon: [
      { url: "/favicon-logo.png", sizes: "any" },
      { url: "/favicon-logo.png", sizes: "192x192", type: "image/png" },
    ],
    apple: { url: "/favicon-logo.png", sizes: "180x180" },
    shortcut: "/favicon-logo.png",
  },
  openGraph: {
    title: "Discover Malmö – Din lokala guide till stadens pärlor",
    description: "Utforska Malmö med våra skräddarsydda rutter. Vi hjälper dig hitta de bästa hotellen, trendigaste restaurangerna och dolda sevärdheter. Planera ditt Malmö-äventyr här!",
    url: "https://discovermalmo.se",
    siteName: "Discover Malmö",
    images: [{ url: "https://discovermalmo.se/favicon-logo.png", width: 1080, height: 1080 }],
    locale: "sv_SE",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sv" className={`${interTight.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
