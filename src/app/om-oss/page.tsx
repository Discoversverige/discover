import DiscoverApp from "@/components/DiscoverApp";

export const metadata = {
  title: "Om oss | Discover Malmö",
  description: "Lär känna Discover Malmö — tjänsten som hjälper dig utforska staden.",
};

export default function OmOssPage() {
  return <DiscoverApp initialView="about" />;
}
