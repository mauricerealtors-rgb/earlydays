import { notFound } from "next/navigation";
import { findListing } from "@/lib/query";
import { EditListingForm } from "@/components/school/EditListingForm";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = findListing(slug);
  if (!listing) notFound();

  return (
    <div className="mx-auto max-w-3xl pb-16">
      <EditListingForm
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
        }}
      />
    </div>
  );
}
