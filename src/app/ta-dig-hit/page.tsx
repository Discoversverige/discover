import type { Metadata } from "next";
import TravelHub from "@/components/TravelHub";

export const metadata: Metadata = {
  title: "Ta dig hit | Discover Malmö",
  description:
    "Karta över Öresundsregionen — boende, bil och transport från Copenhagen Airport, Malmö C, Malmö Airport och Trelleborg.",
  openGraph: {
    title: "Ta dig hit | Discover Malmö",
    description:
      "Karta över Öresundsregionen — boende, bil och transport från Copenhagen Airport, Malmö C, Malmö Airport och Trelleborg.",
  },
};

export default function TaDigHitPage() {
  return <TravelHub />;
}
