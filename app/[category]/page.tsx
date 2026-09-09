import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CATEGORIES, findCategory } from "@/data/categories";
import { LOCATIONS } from "@/data/locations";
import { listingsByCategory, listingsByCategoryAndLocation } from "@/lib/query";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeading } from "@/components/PageHeading";
import { ListingCard } from "@/components/ListingCard";
import { EmptyResults } from "@/components/EmptyResults";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { itemListJsonLd, faqJsonLd } from "@/lib/schema";

export const dynamicParams = false;
export const revalidate = 3600;

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const c = findCategory(category);
  if (!c) return {};
  const count = listingsByCategory(c.slug).length;
  return {
    title: `${c.plural} in Accra & Ghana (${count} verified)`,
    description: `${c.plural} across Accra and Ghana on EarlyDays. ${c.blurb} Compare programmes, ages, curriculum and location — parent-first, honest profiles.`,
    alternates: { canonical: `${SITE.url}/${c.slug}` },
    openGraph: {
      title: `${c.plural} in Accra & Ghana`,
      description: c.blurb,
      url: `${SITE.url}/${c.slug}`,
      type: "website",
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const c = findCategory(category);
  if (!c) notFound();

  const results = listingsByCategory(c.slug);
  const canonical = `${SITE.url}/${c.slug}`;

  const areasWithCounts = LOCATIONS.filter((l) => l.region === "accra")
    .map((l) => ({
      loc: l,
      count: listingsByCategoryAndLocation(c.slug, l.slug).length,
    }))
    .filter((x) => x.count > 0);

  const faq = buildCategoryFaq(c, results.length);

  return (
    <>
      <JsonLd data={itemListJsonLd(results, `${c.plural} in Ghana`, canonical)} />
      <JsonLd data={faqJsonLd(faq)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${canonical}#page`,
          name: `${c.plural} in Ghana`,
          url: canonical,
          isPartOf: { "@id": `${SITE.url}#website` },
          about: c.plural,
          inLanguage: "en-GH",
        }}
      />

      <div className="container-page pt-8 md:pt-12">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Schools", href: "/schools" },
            { label: c.plural },
          ]}
        />
        <PageHeading
          eyebrow="Programme"
          title={`${c.plural} in Ghana`}
          subtitle={c.blurb}
        />

        {/* Answer-first: a quotable snippet for AI Overviews */}
        <div className="card-soft mb-8 rounded-2xl bg-white p-5 md:p-6">
          <p className="text-[15px] leading-relaxed text-[color:var(--color-ink)]">
            <strong className="text-[color:var(--color-navy)]">
              {c.plural} on EarlyDays:
            </strong>{" "}
            {results.length === 0
              ? `no ${c.plural.toLowerCase()} are currently listed.`
              : `${results.length} ${results.length === 1 ? c.singular.toLowerCase() : c.plural.toLowerCase()} listed across ${areasWithCounts.length} area${areasWithCounts.length === 1 ? "" : "s"} in Accra`}
            . Every profile is sourced from the school's own website and
            shows a verification state — fees, curriculum and contact
            details appear only when the school itself has published them.
          </p>
        </div>

        {areasWithCounts.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 font-display text-xl">
              {c.plural} by area in Accra
            </h2>
            <div className="flex flex-wrap gap-2">
              {areasWithCounts.map(({ loc, count }) => (
                <Link
                  key={loc.slug}
                  href={`/${c.slug}/${loc.region}/${loc.slug}`}
                  className="chip chip-sky"
                >
                  {c.plural} in {loc.name} · {count}
                </Link>
              ))}
            </div>
          </section>
        )}

        {results.length === 0 ? (
          <EmptyResults />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}

        {/* FAQ block — visible + JSON-LD wired above */}
        <section className="mt-14" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="mb-3 font-display text-2xl">
            {c.plural} — parent questions
          </h2>
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
        </section>
      </div>
    </>
  );
}

function buildCategoryFaq(
  c: ReturnType<typeof findCategory> & object,
  count: number
) {
  const p = c.plural.toLowerCase();
  const s = c.singular.toLowerCase();
  return [
    {
      q: `How many ${p} are listed on EarlyDays?`,
      a: `EarlyDays currently lists ${count} ${count === 1 ? s : p} across Ghana, focused on Greater Accra. We add listings as we can source each school's information from its own website or directly from the school.`,
    },
    {
      q: `How do I contact a ${s} listed on EarlyDays?`,
      a: `Open any profile and use the Request information button, or call / message via the contact details shown. Where a school has not published contact details, we say so — we never invent numbers.`,
    },
    {
      q: `Are the ${p} on EarlyDays verified?`,
      a: `Each listing carries an explicit verification state: unverified, information-confirmed, claimed, or verified. Most current listings are 'information-confirmed' — meaning contact and basic profile were cross-checked from the school's own website. A school representative can claim their profile at any time.`,
    },
    {
      q: `What does it cost to enrol in a ${s} in Ghana?`,
      a: `Fees vary widely by school and are set by each individual ${s}. Some publish fees on their own website; others prefer parents to enquire directly. EarlyDays only displays fees when the school itself has published them.`,
    },
    {
      q: `How do I choose the right ${s} for my child?`,
      a: `Start with location, age range and curriculum. Visit the school in person, ask about daily routines and staff-to-child ratios, and talk to current parents where you can. Our free guides walk through the questions to ask on a visit.`,
    },
    {
      q: `Can my school get listed on EarlyDays?`,
      a: `Yes — free. Schools can claim an existing profile or submit a new one at /claim. Claimed profiles get an edit dashboard and receive parent enquiries directly.`,
    },
  ];
}
