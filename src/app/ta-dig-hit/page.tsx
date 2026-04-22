import DiscoverApp from "@/components/DiscoverApp";

export const metadata = {
  title: "Ta dig hit | Discover Malmö",
  description: "Guide till hur du tar dig till Malmö — från Köpenhamns flygplats, tåg från Göteborg och mer.",
};

export default function TaDigHitPage() {
  return <DiscoverApp initialView="travel" />;
}
