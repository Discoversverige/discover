import type { Metadata } from "next";
import { Inter_Tight, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

const interTight = Inter_Tight({ variable: "--font-inter-tight", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({ variable: "--font-instrument-serif", subsets: ["latin"], weight: "400" });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discover Malmö",
  description: "Utforska Malmö med skräddarsydda rutter och upplevelser.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sv" className={`${interTight.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}>
      <head>
        <Script
          id="travelpayouts"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){var s=document.createElement("script");s.async=1;s.src='https://tpembars.com/NTIyNTkw.js?t=522590';document.head.appendChild(s);})();`,
          }}
        />
      </head>
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
