import { notFound } from "next/navigation";
import { findListing } from "@/lib/query";
import { DashboardChrome } from "@/components/school/DashboardChrome";
import { PhotoManager } from "@/components/school/PhotoManager";

export default async function PhotosPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = findListing(slug);
  if (!listing) notFound();
  return (
    <DashboardChrome slug={slug}>
      <PhotoManager slug={slug} listingName={listing.name} />
    </DashboardChrome>
  );
}
