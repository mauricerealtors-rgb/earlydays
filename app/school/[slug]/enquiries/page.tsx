import { notFound } from "next/navigation";
import { findListing } from "@/lib/query";
import { DashboardChrome } from "@/components/school/DashboardChrome";
import { EnquiriesPanel } from "@/components/school/EnquiriesPanel";

export default async function EnquiriesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = findListing(slug);
  if (!listing) notFound();
  return (
    <DashboardChrome slug={slug}>
      <EnquiriesPanel slug={slug} />
    </DashboardChrome>
  );
}
