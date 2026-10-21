import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { allListings, findListing } from "@/lib/query";
import { findLocation } from "@/data/locations";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ClaimForm } from "@/components/ClaimForm";
import { SITE } from "@/lib/site";
import { fetchListingSideData } from "@/lib/listing-overrides";
import { VerifiedCheck } from "@/components/VerifiedCheck";

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
    description: `Verify you run ${listing.name} and take control of your EarlyDays profile: your photos, your fees, and every parent enquiry.`,
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
        <span className="chip chip-sun">Claim your school</span>
        <h1 className="mt-3 font-display text-[32px] leading-tight md:text-[44px]">
          Take control of <span className="marker">{listing.name}</span> on
          EarlyDays.
        </h1>
        <p className="mt-3 text-[17px] leading-relaxed text-[color:var(--color-text-body)]">
          {loc?.name ?? listing.neighbourhood}, {listing.region}. Your school is
          already listed. Claiming makes it yours.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Perk
            title="Your words"
            body="Programmes, ages, hours and fees. Fees are what parents search for most."
          />
          <Perk
            title="Your photographs"
            body="A profile with real photos gets opened. One with none gets scrolled past."
          />
          <Perk
            title="Your enquiries"
            body="Parents reach you from the page, and you see who viewed and who called."
          />
        </div>

        {alreadyClaimed ? (
          <div className="mt-8 rounded-2xl border-2 border-[color:var(--color-ink)] bg-[color:var(--color-sky)] p-5">
            <p className="flex items-center gap-2 font-bold text-[color:var(--color-ink)]">
              <VerifiedCheck size={18} />
              Managed by {listing.name}
            </p>
            <p className="mt-1 text-sm text-[color:var(--color-text-body)]">
              This profile has already been claimed and is kept up to date by
              the school, so there is nothing to claim here.{" "}
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
    <div className="rounded-2xl border-2 border-[color:var(--color-ink)] bg-white p-4">
      <p className="font-display text-[16px] leading-tight">{title}</p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-[color:var(--color-text-body)]">
        {body}
      </p>
    </div>
  );
}
