import { EXPERIENCES } from "@/lib/experiences";
import UpplevelserList from "@/components/UpplevelserList";

export const metadata = {
  title: "Upplevelser i Malmö och Skåne | Discover Malmö",
  description:
    "Utforska 76 upplevelser — mat & dryck, äventyr, spa, racing, flyg och mer. Från 399 kr.",
};

export default function UpplevelserPage() {
  return <UpplevelserList experiences={EXPERIENCES} />;
}
