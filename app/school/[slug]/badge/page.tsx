import { notFound } from "next/navigation";
import { findListing } from "@/lib/query";
import { DashboardChrome } from "@/components/school/DashboardChrome";
import { BadgePanel } from "@/components/school/BadgePanel";

export default async function SchoolBadgePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = findListing(slug);
  if (!listing) notFound();

  return (
    <DashboardChrome slug={slug}>
      <BadgePanel slug={listing.slug} schoolName={listing.name} />
    </DashboardChrome>
  );
}
