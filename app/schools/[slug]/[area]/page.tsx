import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  LOCATIONS,
  REGIONS,
  findLocation,
  findRegion,
  listingsByLocation,
} from "@/lib/query";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeading } from "@/components/PageHeading";
import { ListingCard } from "@/components/ListingCard";
import { EmptyResults } from "@/components/EmptyResults";
import { JsonLd } from "@/components/JsonLd";
import { CATEGORIES } from "@/data/categories";
import { mergeManyListings } from "@/lib/listing-overrides";
import { SITE } from "@/lib/site";
import { itemListJsonLd, faqJsonLd } from "@/lib/schema";

export const dynamicParams = false;
export const revalidate = 60;

export async function generateStaticParams() {
  const pairs: { slug: string; area: string }[] = [];
  for (const loc of LOCATIONS) {
    if (loc.region && REGIONS.some((r) => r.slug === loc.region)) {
      pairs.push({ slug: loc.region, area: loc.slug });
    }
  }
  return pairs;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; area: string }>;
}): Promise<Metadata> {
  const { slug, area } = await params;
  const r = findRegion(slug);
  const l = findLocation(area);
  if (!r || !l) return {};
  const count = listingsByLocation(l.slug).length;
  return {
    title: `Schools & learning centres in ${l.name}, ${r.name} (${count} listed)`,
    description: `Discover ${count} schools and children's learning centres in ${l.name}, ${r.name}. Compare programmes, ages, curriculum and location. parent-first, honest profiles from EarlyDays.`,
    alternates: { canonical: `${SITE.url}/schools/${r.slug}/${l.slug}` },
    openGraph: {
      title: `Schools in ${l.name}, ${r.name}`,
      description: `Discover ${count} schools and learning centres in ${l.name}.`,
      url: `${SITE.url}/schools/${r.slug}/${l.slug}`,
      type: "website",
    },
  };
}

export default async function AreaPage({
  params,
}: {
  params: Promise<{ slug: string; area: string }>;
}) {
  const { slug, area } = await params;
  const r = findRegion(slug);
  const l = findLocation(area);
  if (!r || !l || l.region !== r.slug) notFound();

  const results = await mergeManyListings(listingsByLocation(l.slug));
  const canonical = `${SITE.url}/schools/${r.slug}/${l.slug}`;
  const nearby = LOCATIONS.filter(
    (x) => x.region === r.slug && x.slug !== l.slug
  ).slice(0, 6);

  // Programmes that actually have listings in this area. used for JSON-LD
  // and the internal-linking chip row (helps AI understand the area's mix).
  const programmesHere = CATEGORIES.filter((c) =>
    results.some((x) => x.listingTypes.includes(c.listingType))
  );

  const faq = buildAreaFaq(l.name, r.name, results.length, programmesHere.map(p => p.plural.toLowerCase()));

  return (
    <>
      <JsonLd
        data={itemListJsonLd(
          results,
          `Schools & learning centres in ${l.name}, ${r.name}`,
          canonical
        )}
      />
      <JsonLd data={faqJsonLd(faq)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${canonical}#page`,
          name: `Schools & learning centres in ${l.name}, ${r.name}`,
          url: canonical,
          isPartOf: { "@id": `${SITE.url}#website` },
          about: {
            "@type": "Place",
            name: l.name,
            containedInPlace: {
              "@type": "AdministrativeArea",
              name: r.name,
              containedInPlace: { "@type": "Country", name: "Ghana" },
            },
          },
          inLanguage: "en-GH",
        }}
      />

      <div className="container-page pt-8 md:pt-12">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Schools", href: "/schools" },
            { label: r.name, href: `/schools/${r.slug}` },
            { label: l.name },
          ]}
        />
        <PageHeading
          eyebrow={r.name}
          title={`Schools & learning centres in ${l.name}`}
          subtitle={l.blurb}
        />

        {/* Answer-first snippet */}
        <div className="card-soft mb-8 rounded-2xl bg-white p-5 md:p-6">
          <p className="text-[15px] leading-relaxed text-[color:var(--color-ink)]">
            <strong className="text-[color:var(--color-navy)]">
              Schools in {l.name}, {r.name}:
            </strong>{" "}
            {results.length === 0
              ? `no listings yet. we're adding them as we source each one.`
              : `EarlyDays lists ${results.length} ${results.length === 1 ? "school or learning centre" : "schools and learning centres"} in ${l.name}`}
            {programmesHere.length > 0 &&
              `, spanning ${programmesHere
                .slice(0, 4)
                .map((p) => p.plural.toLowerCase())
                .join(", ")}${programmesHere.length > 4 ? ", and more" : ""}`}
            . Every profile is sourced from the school's own website ,
            fees, curriculum and contact details appear only when the school
            has published them.
          </p>
        </div>

        {/* Programme chip row. internal linking */}
        {programmesHere.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {programmesHere.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}/${r.slug}/${l.slug}`}
                className="chip chip-sky"
              >
                {c.plural} in {l.name}
              </Link>
            ))}
          </div>
        )}

        {results.length === 0 ? (
          <EmptyResults
            title={`No listings in ${l.name} yet.`}
            nearby={nearby.map((n) => ({
              href: `/schools/${r.slug}/${n.slug}`,
              label: n.name,
            }))}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((x) => (
              <ListingCard key={x.id} listing={x} />
            ))}
          </div>
        )}

        {/* Local guide-y content (kept factual, no fabrication) */}
        <section className="mt-14 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-3 font-display text-2xl">About {l.name} for families</h2>
            <p className="text-[15px] leading-relaxed text-[color:var(--color-ink)]">
              {l.blurb}
            </p>
            {results.length > 0 && (
              <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--color-ink)]">
                Parents searching in {l.name} typically weigh how long the
                daily drop-off takes, which curriculum best suits their
                child, and how the school handles meals, rest and outdoor
                play. On EarlyDays you can compare all of these side by side
                for the {results.length} school{results.length === 1 ? "" : "s"} listed here.
              </p>
            )}
            {nearby.length > 0 && (
              <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--color-ink)]">
                If you want to widen the net, nearby areas include{" "}
                {nearby.slice(0, 3).map((n, i) => (
                  <span key={n.slug}>
                    <Link
                      href={`/schools/${r.slug}/${n.slug}`}
                      className="text-[color:var(--color-sky-deep)] underline"
                    >
                      {n.name}
                    </Link>
                    {i < Math.min(2, nearby.length - 1) ? ", " : ""}
                  </span>
                ))}
                .
              </p>
            )}
          </div>

          {/* FAQ block */}
          <div>
            <h2 className="mb-3 font-display text-2xl">Common questions</h2>
            <div className="card-soft rounded-2xl bg-white p-2">
              {faq.map((f) => (
                <details
                  key={f.q}
                  className="group border-b border-[color:var(--color-line-2)] p-4 last:border-none"
                >
                  <summary className="cursor-pointer list-none font-semibold text-[color:var(--color-navy)]">
                    <span className="mr-2 text-[color:var(--color-coral)] group-open:hidden">＋</span>
                    <span className="mr-2 hidden text-[color:var(--color-coral)] group-open:inline">−</span>
                    {f.q}
                  </summary>
                  <p className="mt-2 text-[15px] leading-relaxed text-[color:var(--color-ink)]">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {nearby.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-3 font-display text-xl">Nearby areas</h2>
            <div className="flex flex-wrap gap-2">
              {nearby.map((n) => (
                <Link
                  key={n.slug}
                  href={`/schools/${r.slug}/${n.slug}`}
                  className="chip"
                >
                  {n.name}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

function buildAreaFaq(
  areaName: string,
  regionName: string,
  count: number,
  programmes: string[]
) {
  const progText =
    programmes.length === 0
      ? "schools and learning centres"
      : programmes.slice(0, 3).join(", ") +
        (programmes.length > 3 ? " and more" : "");
  return [
    {
      q: `How many schools are listed in ${areaName}?`,
      a: `EarlyDays currently lists ${count} ${count === 1 ? "school or learning centre" : "schools and learning centres"} in ${areaName}, ${regionName}. We add listings as we can source each school's information directly from its own website.`,
    },
    {
      q: `What kinds of schools are in ${areaName}?`,
      a: `Listings in ${areaName} cover ${progText}. Compare programmes, age bands and curriculum on each school's profile.`,
    },
    {
      q: `How do I contact a school in ${areaName}?`,
      a: `Open any profile and use Request information, or reach out via the phone, WhatsApp or website links shown. Where a school hasn't published contact details, we say so. we never invent numbers.`,
    },
    {
      q: `Do schools in ${areaName} offer daycare?`,
      a: `Some do, some don't. Filter by the Daycare service on the search page, or open individual profiles to see what each school offers.`,
    },
    {
      q: `How can I list my ${areaName} school?`,
      a: `Free. head to /claim to submit or claim your school's profile. You get a dashboard to edit details and receive parent enquiries.`,
    },
  ];
}
