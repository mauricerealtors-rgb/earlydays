import { notFound } from "next/navigation";
import { findListing } from "@/lib/query";
import { DashboardChrome } from "@/components/school/DashboardChrome";
import { AnalyticsPanel } from "@/components/school/AnalyticsPanel";

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = findListing(slug);
  if (!listing) notFound();
  return (
    <DashboardChrome slug={slug}>
      <AnalyticsPanel slug={slug} />
    </DashboardChrome>
  );
}
