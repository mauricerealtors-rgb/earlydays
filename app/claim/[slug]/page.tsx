import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { allListings, findListing } from "@/lib/query";
import { findLocation } from "@/data/locations";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ClaimForm } from "@/components/ClaimForm";
import { SITE } from "@/lib/site";
import { fetchListingSideData } from "@/lib/listing-overrides";

export const dynamicParams = false;
// listing.claimed in the static data is always false — real ownership lives in
// listingOwners. Revalidate so a school that has just been handed over stops
// showing a claim form. /api/claim refuses a claimed slug regardless, so this
// is about not offering the form, not about enforcement.
export const revalidate = 300;

export async function generateStaticParams() {
  return allListings().map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = findListing(slug);
  if (!listing) return {};
  return {
    title: `Claim ${listing.name} on EarlyDays`,
    description: `Verify you run ${listing.name} and take control of your EarlyDays profile. Free to claim.`,
    alternates: { canonical: `${SITE.url}/claim/${listing.slug}` },
    robots: { index: false, follow: false },
  };
}

export default async function ClaimPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = findListing(slug);
  if (!listing) notFound();
  const loc = findLocation(listing.neighbourhood);
  const { claimed } = await fetchListingSideData(slug);
  const alreadyClaimed = listing.claimed || claimed;

  return (
    <div className="container-page pt-8 md:pt-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: listing.name, href: `/schools/${listing.slug}` },
          { label: "Claim" },
        ]}
      />
      <div className="mx-auto max-w-2xl pb-16">
        <span className="chip chip-coral">Claim your school</span>
        <h1 className="mt-3 font-display text-[32px] leading-tight tracking-tight md:text-[44px]">
          Take control of <span className="text-[color:var(--color-pink-hot)]">{listing.name}</span> on EarlyDays.
        </h1>
        <p className="mt-3 text-lg text-[color:var(--color-ink-mute)]">
          {loc?.name ?? listing.neighbourhood}, {listing.region} · Claiming is free and takes about a minute.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Perk title="Edit your profile" body="Update your description, hours, phone, WhatsApp, admissions status and website." />
          <Perk title="Upload real photos" body="Show parents your own gallery: building, classrooms, activities." />
          <Perk title="Reach real parents" body="Get enquiries direct from parents searching in your area." />
        </div>

        {alreadyClaimed ? (
          <div className="mt-8 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-leaf-soft)] p-5">
            <p className="font-semibold text-[#2F7C25]">
              Managed by the school.
            </p>
            <p className="mt-1 text-sm text-[color:var(--color-ink-mute)]">
              {listing.name} has already claimed this profile and keeps it up to
              date, so there is nothing to claim here.{" "}
              <Link href={`/schools/${listing.slug}`} className="underline">
                View the profile
              </Link>
              . If you run the school and believe this is wrong,{" "}
              <Link href="/contact" className="underline">
                get in touch
              </Link>
              .
            </p>
          </div>
        ) : (
          <ClaimForm slug={listing.slug} schoolName={listing.name} />
        )}
      </div>
    </div>
  );
}

function Perk({ title, body }: { title: string; body: string }) {
  return (
    <div className="card-soft rounded-2xl p-4">
      <p className="font-display text-base text-[color:var(--color-navy)]">{title}</p>
      <p className="mt-1 text-[13px] text-[color:var(--color-ink-mute)]">{body}</p>
    </div>
  );
}
