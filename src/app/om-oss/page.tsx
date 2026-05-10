import type { Metadata } from "next";
import OmOssContent from "@/components/OmOssContent";

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
  return <OmOssContent />;
}
