import { notFound } from "next/navigation";
import Link from "next/link";
import { findListing } from "@/lib/query";
import { AdminSchoolEditor } from "@/components/admin/AdminSchoolEditor";

export default async function AdminSchoolEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = findListing(slug);
  if (!listing) notFound();

  return (
    <>
      <div className="mb-6">
        <Link href="/admin/schools" className="text-xs text-white/50 hover:text-white">
          ← All schools
        </Link>
      </div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">
            Editing
          </p>
          <h1 className="mt-1 font-display text-2xl md:text-3xl">{listing.name}</h1>
          <p className="mt-1 text-xs text-white/50">/{listing.slug}</p>
        </div>
        <Link
          href={`/schools/${listing.slug}`}
          target="_blank"
          className="rounded-lg border border-white/10 px-3 py-2 text-xs hover:bg-white/5"
        >
          View live page ↗
        </Link>
      </header>

      <AdminSchoolEditor
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
    </>
  );
}
