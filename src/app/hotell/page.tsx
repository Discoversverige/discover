import HotellList from "@/components/HotellList";

export const metadata = {
  title: "Hotell i Malmö | Discover Malmö",
  description:
    "Hitta och boka hotell i Malmö — jämför pris, stjärnor och gästrecensioner. De bästa boendena i Malmö centrum, nära Turning Torso och Malmö Airport.",
};

export default function HotellPage() {
  return <HotellList />;
}
