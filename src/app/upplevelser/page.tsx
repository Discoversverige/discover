import DiscoverApp from "@/components/DiscoverApp";

export const metadata = {
  title: "Upplevelser i Malmö | Discover Malmö",
  description: "Utforska aktiviteter och upplevelser i Malmö — mat, äventyr, kultur och mer.",
};

export default function UpplevelserPage() {
  return <DiscoverApp initialView="experiences" />;
}
