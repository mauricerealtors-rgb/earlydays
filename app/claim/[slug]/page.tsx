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
          already listed and parents can already find it. Claiming is how you
          take the page over: your words, your photographs, your fees, and every
          enquiry that comes off it.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Perk
            title="Say it in your words"
            body="Your description, programmes, ages, hours, admissions status and fees. Fees are what parents search for most, and almost no school in Ghana publishes them."
          />
          <Perk
            title="Your own photographs"
            body="Your building, your classrooms, your children at work. A profile with real photos gets opened. One with none gets scrolled past."
          />
          <Perk
            title="Every enquiry, direct"
            body="Parents reach you from the page and it lands in your inbox. You also see who viewed, who called and who tapped WhatsApp."
          />
        </div>

        <div className="mt-6 rounded-2xl border-2 border-[color:var(--color-ink)] bg-[color:var(--color-cream)] p-4 md:p-5">
          <h2 className="font-display text-[16px] leading-tight md:text-[18px]">
            Three things before you start
          </h2>
          <ul className="mt-3 space-y-2 text-[14px] leading-relaxed text-[color:var(--color-text-body)]">
            <li>
              <strong className="font-bold text-[color:var(--color-ink)]">
                We ring the school, not you.
              </strong>{" "}
              Give us the school&rsquo;s own line. We call it and ask for you by
              name, which is how we know the page goes to the right person and
              why nobody can take it from you later.
            </li>
            <li>
              <strong className="font-bold text-[color:var(--color-ink)]">
                You do not need an account yet.
              </strong>{" "}
              No password to invent today. We set the login up after the call
              and email it to you.
            </li>
            <li>
              <strong className="font-bold text-[color:var(--color-ink)]">
                Managing the page is a yearly plan.
              </strong>{" "}
              Being listed is free and stays free. We show you what the year
              costs on the next screen, before you have paid anything or
              committed to anything.
            </li>
          </ul>
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
