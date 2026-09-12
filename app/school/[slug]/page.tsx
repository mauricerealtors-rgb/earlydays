import { notFound } from "next/navigation";
import { findListing } from "@/lib/query";
import { DashboardChrome } from "@/components/school/DashboardChrome";
import { OverviewPanel } from "@/components/school/OverviewPanel";

export default async function OverviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = findListing(slug);
  if (!listing) notFound();
  return (
    <DashboardChrome slug={slug}>
      <OverviewPanel slug={slug} listingName={listing.name} />
    </DashboardChrome>
  );
}
