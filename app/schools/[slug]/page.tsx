import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  allListings,
  findListing,
  findRegion,
  listingsByRegion,
  locationsInRegion,
  relatedListings,
} from "@/lib/query";
import { REGIONS, LOCATIONS } from "@/data/locations";
import { findCategoryByType } from "@/data/categories";
import { findLocation } from "@/data/locations";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { FactRow } from "@/components/FactRow";
import { ContactActions } from "@/components/ContactActions";
import { ListingCard } from "@/components/ListingCard";
import { LocationCard } from "@/components/LocationCard";
import { PageHeading } from "@/components/PageHeading";
import { PhotoGallery } from "@/components/PhotoGallery";
import { JsonLd } from "@/components/JsonLd";
import { TrackView } from "@/components/TrackView";
import { EnquiryForm } from "@/components/EnquiryForm";
import { educationalTypeFor, courseJsonLd } from "@/lib/schema";
import { fetchListingSideData } from "@/lib/listing-overrides";
import { mergeListing } from "@/lib/merge-listing";
import { SITE } from "@/lib/site";

export const dynamicParams = false;
// Drop from 1h to 60s so schools' edits appear on the public site
// within a minute of saving from the dashboard.
export const revalidate = 60;

export async function generateStaticParams() {
  const listingSlugs = allListings().map((l) => ({ slug: l.slug }));
  const regionSlugs = REGIONS.map((r) => ({ slug: r.slug }));
  return [...listingSlugs, ...regionSlugs];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = findListing(slug);
  if (listing) {
    const loc = findLocation(listing.neighbourhood);
    const cat = findCategoryByType(listing.listingTypes[0]);
    const title = `${listing.name} — ${cat?.singular ?? "School"} in ${loc?.name ?? listing.region}`;
    return {
      title,
      description: listing.shortDescription,
      alternates: { canonical: `${SITE.url}/schools/${listing.slug}` },
      openGraph: {
        title,
        description: listing.shortDescription,
        type: "article",
        url: `${SITE.url}/schools/${listing.slug}`,
      },
    };
  }
  const region = findRegion(slug);
  if (region) {
    const count = listingsByRegion(region.slug).length;
    return {
      title: `Schools & learning centres in ${region.name}`,
      description: `Discover ${count} school${count === 1 ? "" : "s"} and children's learning centres across ${region.name}, Ghana.`,
      alternates: { canonical: `${SITE.url}/schools/${region.slug}` },
    };
  }
  return {};
}

export default async function SchoolOrRegionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = findListing(slug);
  if (listing) {
    const side = await fetchListingSideData(slug);
    const merged = mergeListing(listing, side.override, side.subscription, side.claimed);
    return renderListing(merged);
  }
  const region = findRegion(slug);
  if (region) return renderRegion(region);
  notFound();
}

/* ---------------- Region view ---------------- */

function renderRegion(region: { slug: string; name: string }) {
  const listings = listingsByRegion(region.slug);
  const areas = locationsInRegion(region.slug);
  return (
    <div className="container-page pt-8 md:pt-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Schools", href: "/schools" },
          { label: region.name },
        ]}
      />
      <PageHeading
        eyebrow="Region"
        title={`Schools & learning centres in ${region.name}`}
        subtitle={`${listings.length} listing${listings.length === 1 ? "" : "s"} across ${areas.length} area${areas.length === 1 ? "" : "s"}.`}
      />

      {areas.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 font-display text-xl">Areas in {region.name}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {areas.map((a) => {
              const count = listings.filter((l) => l.neighbourhood === a.slug).length;
              if (count === 0) return null;
              return <LocationCard key={a.slug} location={a} count={count} />;
            })}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 font-display text-xl">All listings in {region.name}</h2>
        {listings.length === 0 ? (
          <p className="text-[color:var(--color-ink-mute)]">
            No listings yet for {region.name}. Check back soon.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ---------------- Listing view ---------------- */

function renderListing(listing: import("@/lib/types").Listing) {
  const loc = findLocation(listing.neighbourhood);
  const primaryCat = findCategoryByType(listing.listingTypes[0]);
  const related = relatedListings(listing, 3);
  const canonical = `${SITE.url}/schools/${listing.slug}`;

  const faq = [
    {
      q: "What age groups does the school accept?",
      a: listing.ageBlurb
        ? `${listing.name} is listed as serving children ${listing.ageBlurb}.`
        : "Age range has not been published for this listing yet.",
    },
    {
      q: "Where is the school located?",
      a: loc
        ? `${listing.name} is in ${loc.name}, ${loc.regionName}, Ghana.`
        : `${listing.name} is in ${listing.region}, Ghana.`,
    },
    {
      q: "What curriculum does the school follow?",
      a: listing.curriculum.length
        ? `Curriculum(s) listed: ${listing.curriculum.join(", ")}.`
        : "Curriculum has not been published for this listing yet.",
    },
    {
      q: "How can I contact the school?",
      a:
        listing.phone || listing.whatsapp || listing.website
          ? "Use the contact actions on this page."
          : `${listing.name} has not published a public contact channel. Use "Request information" and we'll pass your enquiry on.`,
    },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": educationalTypeFor(listing),
          "@id": canonical,
          name: listing.name,
          alternateName: listing.alternateNames,
          description: listing.description,
          url: canonical,
          telephone: listing.phone,
          email: listing.email,
          image: listing.images?.map((i) => i.url),
          sameAs: listing.website ? [listing.website] : undefined,
          address: {
            "@type": "PostalAddress",
            streetAddress: listing.address,
            addressLocality: loc?.name ?? listing.neighbourhood,
            addressRegion: listing.region,
            addressCountry: "GH",
          },
          areaServed: {
            "@type": "Place",
            name: loc?.name ?? listing.region,
            containedInPlace: {
              "@type": "AdministrativeArea",
              name: listing.region,
              containedInPlace: { "@type": "Country", name: "Ghana" },
            },
          },
          openingHours: listing.hours,
          knowsLanguage: listing.curriculum.includes("Bilingual (French–English)")
            ? ["en", "fr"]
            : "en",
          curriculum: listing.curriculum.length ? listing.curriculum : undefined,
          isPartOf: { "@id": `${SITE.url}#website` },
        }}
      />
      {listing.listingTypes.includes("language-centre") && (
        <JsonLd data={courseJsonLd(listing)} />
      )}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />

      <TrackView slug={listing.slug} />

      <div className="container-page pt-8 md:pt-12">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Schools", href: "/schools" },
            loc
              ? { label: loc.name, href: `/schools/${loc.region}/${loc.slug}` }
              : { label: listing.region },
            { label: listing.name },
          ]}
        />

        {listing.images && listing.images.length > 0 && (
          <div className="mb-8 grid gap-2 overflow-hidden rounded-3xl md:grid-cols-[2fr_1fr] md:gap-2">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl md:aspect-auto md:h-[380px]">
              <Image
                src={listing.images[0].url}
                alt={listing.images[0].alt}
                fill
                sizes="(min-width: 1024px) 720px, 100vw"
                className="object-cover"
                priority
                unoptimized
              />
            </div>
            {listing.images[1] && (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl md:aspect-auto md:h-[380px]">
                <Image
                  src={listing.images[1].url}
                  alt={listing.images[1].alt}
                  fill
                  sizes="(min-width: 1024px) 360px, 100vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
          </div>
        )}
        {listing.images && listing.images.length > 0 && (
          <p className="mb-4 text-xs text-[color:var(--color-ink-mute)]">
            {listing.images[0].credit ?? `Photo: ${listing.name}`}
          </p>
        )}

        <header className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {primaryCat && <span className="chip chip-sky">{primaryCat.singular}</span>}
              <VerifiedBadge status={listing.verification} />
            </div>
            <h1 className="font-display text-[36px] leading-tight tracking-tight md:text-[52px]">
              {listing.name}
            </h1>
            <p className="mt-3 text-lg text-[color:var(--color-ink-mute)]">
              {listing.shortDescription}
            </p>
            <p className="mt-3 flex items-center gap-2 text-[15px] font-semibold text-[color:var(--color-navy)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 22s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12Z" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              {loc?.name ?? listing.neighbourhood}, {listing.region}
            </p>
          </div>

          <aside
            className="card p-5 lg:sticky lg:top-24 lg:self-start"
            aria-labelledby="contact-heading"
          >
            <h2 id="contact-heading" className="mb-3 font-display text-lg">
              Contact this school
            </h2>
            <ContactActions listing={listing} />
            <p className="mt-3 text-xs text-[color:var(--color-ink-mute)]">
              Last updated {formatDate(listing.updatedAt)}
              {listing.sourceUrls && listing.sourceUrls.length > 0
                ? ` · Sourced from the school's own website${listing.sourceUrls.length > 1 ? "s" : ""}`
                : " · Publicly discovered listing"}
              .
            </p>
            {!listing.claimed && (
              <Link
                href={`/claim/${listing.slug}`}
                className="mt-4 block rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-cream)] p-3 text-[13px] hover:border-[color:var(--color-navy)]/30"
              >
                <span className="font-semibold text-[color:var(--color-navy)]">
                  Do you run this school?
                </span>{" "}
                <span className="text-[color:var(--color-ink-mute)]">
                  Claim your profile — free.
                </span>{" "}
                <span aria-hidden className="text-[color:var(--color-coral)]">→</span>
              </Link>
            )}
          </aside>
        </header>

        <section className="mt-10">
          <h2 className="mb-3 font-display text-2xl">Key facts</h2>
          <div className="card-soft rounded-2xl bg-white p-5 md:p-6">
            <dl>
              <FactRow
                label="Type"
                value={listing.listingTypes
                  .map((t) => findCategoryByType(t)?.singular ?? t)
                  .join(", ")}
              />
              <FactRow label="Ages" value={listing.ageBlurb} />
              <FactRow
                label="Curriculum"
                value={
                  listing.curriculum.length
                    ? listing.curriculum.join(", ")
                    : <NotPublished />
                }
              />
              <FactRow
                label="Services"
                value={
                  listing.services.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {listing.services.map((s) => (
                        <span key={s} className="chip">{s}</span>
                      ))}
                    </div>
                  ) : (
                    <NotPublished />
                  )
                }
              />
              <FactRow
                label="Hours"
                value={listing.hours ?? <NotPublished />}
              />
              <FactRow
                label="Admissions"
                value={
                  listing.admissions === "open"
                    ? "Open"
                    : listing.admissions === "waitlist"
                      ? "Waitlist"
                      : listing.admissions === "closed"
                        ? "Closed"
                        : "Not published"
                }
              />
              <FactRow
                label="Fees"
                value={
                  listing.feesHint ?? (
                    <NotPublished text="Fees not published — request from the school." />
                  )
                }
              />
              <FactRow
                label="Address"
                value={listing.address ?? <NotPublished />}
              />
              <FactRow
                label="Location"
                value={`${loc?.name ?? listing.neighbourhood}, ${listing.region}`}
              />
              {listing.website && (
                <FactRow
                  label="Website"
                  value={
                    <a
                      href={listing.website}
                      target="_blank"
                      rel="nofollow noopener"
                      className="text-[color:var(--color-sky-deep)] underline"
                    >
                      {new URL(listing.website).host.replace(/^www\./, "")}
                    </a>
                  }
                />
              )}
              {listing.email && (
                <FactRow
                  label="Email"
                  value={
                    <a
                      href={`mailto:${listing.email}`}
                      className="text-[color:var(--color-sky-deep)] underline"
                    >
                      {listing.email}
                    </a>
                  }
                />
              )}
              {listing.phones && listing.phones.length > 1 && (
                <FactRow
                  label="Phones"
                  value={listing.phones.join(" · ")}
                />
              )}
            </dl>
          </div>

        </section>

        {listing.images && listing.images.length > 2 && (
          <PhotoGallery
            images={listing.images}
            heroCount={2}
            schoolName={listing.name}
          />
        )}

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="mb-3 font-display text-2xl">About {listing.name}</h2>
            <p className="text-[16px] leading-relaxed text-[color:var(--color-ink)]">
              {listing.description}
            </p>

            {listing.listingTypes.length > 0 && (
              <>
                <h3 className="mt-8 mb-3 font-display text-xl">Programmes</h3>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {listing.listingTypes.map((t) => {
                    const c = findCategoryByType(t);
                    return (
                      <li
                        key={t}
                        className="card-soft rounded-2xl bg-white p-4"
                      >
                        <p className="font-display text-lg text-[color:var(--color-navy)]">
                          {c?.singular ?? t}
                        </p>
                        <p className="mt-1 text-sm text-[color:var(--color-ink-mute)]">
                          {c?.short ?? ""}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>

          <section id="faq">
            <h2 className="mb-3 font-display text-2xl">Common questions</h2>
            <div className="card-soft rounded-2xl bg-white p-2">
              {faq.map((f) => (
                <details
                  key={f.q}
                  className="group border-b border-[color:var(--color-line-2)] p-3 last:border-none"
                >
                  <summary className="cursor-pointer list-none font-semibold text-[color:var(--color-navy)]">
                    <span className="mr-2 text-[color:var(--color-coral)] group-open:hidden">＋</span>
                    <span className="mr-2 hidden text-[color:var(--color-coral)] group-open:inline">−</span>
                    {f.q}
                  </summary>
                  <p className="mt-2 text-sm text-[color:var(--color-ink)]">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </section>

        <section className="mt-14">
          <EnquiryForm slug={listing.slug} schoolName={listing.name} />
        </section>

        {related.length > 0 && (
          <section className="mt-14">
            <div className="mb-4 flex items-end justify-between">
              <h2 className="font-display text-2xl">Similar schools nearby</h2>
              <Link href="/schools" className="btn btn-ghost text-sm">
                Browse all →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

function NotPublished({ text = "Not published" }: { text?: string }) {
  return (
    <span className="italic font-normal text-[color:var(--color-ink-mute)]">
      {text}
    </span>
  );
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
