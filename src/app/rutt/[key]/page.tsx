import { notFound } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import RouttePage from "@/components/RouttePage";

export function generateStaticParams() {
  return Object.keys(ROUTES).map((key) => ({ key }));
}

export async function generateMetadata({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const route = ROUTES[key as keyof typeof ROUTES];
  if (!route) return { title: "Rutt — Discover Malmö" };
  return {
    title: `${route.title.sv} | Discover Malmö`,
    description: `${route.duration.sv} · ${route.distance} · ${route.stops.length} stopp i Malmö.`,
  };
}

export default async function Page({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!ROUTES[key as keyof typeof ROUTES]) notFound();
  return <RouttePage routeKey={key} />;
}
