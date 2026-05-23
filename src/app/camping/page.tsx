import { CAMPSITES } from "@/lib/camping";
import CampingList from "@/components/CampingList";

export const metadata = {
  title: "Camping i Skåne, Småland & Blekinge | Discover Malmö",
  description:
    "Hitta och boka campingplatser i Skåne, Småland och Blekinge. Strand, sjö, natur och familjecamping — via Campcation.",
};

export default function CampingPage() {
  return <CampingList campsites={CAMPSITES} />;
}
