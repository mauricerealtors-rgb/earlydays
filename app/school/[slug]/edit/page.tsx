import { notFound } from "next/navigation";
import { findListing } from "@/lib/query";
import { DashboardChrome } from "@/components/school/DashboardChrome";
import { SchoolProfileEditor } from "@/components/school/SchoolProfileEditor";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = findListing(slug);
  if (!listing) notFound();

  return (
    <DashboardChrome slug={slug}>
      <SchoolProfileEditor
        slug={listing.slug}
        baseline={{
          name: listing.name,
          shortDescription: listing.shortDescription,
          description: listing.description,
          phone: listing.phone ?? "",
          whatsapp: listing.whatsapp ?? "",
          email: listing.email ?? "",
          website: listing.website ?? "",
          hours: listing.hours ?? "",
          feesHint: listing.feesHint ?? "",
          address: listing.address ?? "",
          admissions: listing.admissions,
          logoUrl: listing.logoUrl ?? "",
        }}
      />
    </DashboardChrome>
  );
}
