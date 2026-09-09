import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CATEGORIES,
  findCategory,
} from "@/data/categories";
import {
  LOCATIONS,
  findLocation,
  findRegion,
  listingsByCategoryAndLocation,
} from "@/lib/query";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeading } from "@/components/PageHeading";
import { ListingCard } from "@/components/ListingCard";
import { EmptyResults } from "@/components/EmptyResults";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { itemListJsonLd, faqJsonLd } from "@/lib/schema";

export const dynamicParams = false;
export const revalidate = 3600;

/**
 * Programmatic SEO rule (guide §16):
 * only generate a category+area page if it has at least one useful listing.
 */
export async function generateStaticParams() {
  const combos: { category: string; region: string; area: string }[] = [];
  for (const c of CATEGORIES) {
    for (const l of LOCATIONS) {
      const count = listingsByCategoryAndLocation(c.slug, l.slug).length;
      if (count >= 1) {
        combos.push({ category: c.slug, region: l.region, area: l.slug });
      }
    }
  }
  return combos;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; region: string; area: string }>;
}): Promise<Metadata> {
  const { category, region, area } = await params;
  const c = findCategory(category);
  const r = findRegion(region);
  const l = findLocation(area);
  if (!c || !r || !l) return {};
  const count = listingsByCategoryAndLocation(c.slug, l.slug).length;
  return {
    title: `${c.plural} in ${l.name}, ${r.name} (${count} listed)`,
    description: `${count} ${count === 1 ? c.singular.toLowerCase() : c.plural.toLowerCase()} in ${l.name}, ${r.name} on EarlyDays. ${c.blurb}`,
    alternates: { canonical: `${SITE.url}/${c.slug}/${r.slug}/${l.slug}` },
    openGraph: {
      title: `${c.plural} in ${l.name}, ${r.name}`,
      description: `${c.plural} in ${l.name}. ${c.blurb}`,
      url: `${SITE.url}/${c.slug}/${r.slug}/${l.slug}`,
      type: "website",
    },
  };
}

export default async function CategoryAreaPage({
  params,
}: {
  params: Promise<{ category: string; region: string; area: string }>;
}) {
  const { category, region, area } = await params;
  const c = findCategory(category);
  const r = findRegion(region);
  const l = findLocation(area);
  if (!c || !r || !l) notFound();

  const results = listingsByCategoryAndLocation(c.slug, l.slug);
  const canonical = `${SITE.url}/${c.slug}/${r.slug}/${l.slug}`;
  const nearby = LOCATIONS.filter(
    (x) => x.region === r.slug && x.slug !== l.slug
  ).slice(0, 6);
  const otherCatsHere = CATEGORIES.filter((cc) => cc.slug !== c.slug).filter(
    (cc) => listingsByCategoryAndLocation(cc.slug, l.slug).length > 0
  );

  const faq = buildComboFaq(c.plural, c.singular, l.name, r.name, results.length);

  return (
    <>
      <JsonLd
        data={itemListJsonLd(
          results,
          `${c.plural} in ${l.name}, ${r.name}`,
          canonical
        )}
      />
      <JsonLd data={faqJsonLd(faq)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${canonical}#page`,
          name: `${c.plural} in ${l.name}, ${r.name}`,
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
            { label: c.plural, href: `/${c.slug}` },
            { label: r.name, href: `/schools/${r.slug}` },
            { label: l.name },
          ]}
        />
        <PageHeading
          eyebrow={`${c.singular} · ${r.name}`}
          title={`${c.plural} in ${l.name}`}
          subtitle={<>{l.blurb} {c.blurb}</>}
        />

        {/* Answer-first snippet */}
        <div className="card-soft mb-8 rounded-2xl bg-white p-5 md:p-6">
          <p className="text-[15px] leading-relaxed text-[color:var(--color-ink)]">
            <strong className="text-[color:var(--color-navy)]">
              {c.plural} in {l.name}:
            </strong>{" "}
            {results.length === 0
              ? `EarlyDays has no ${c.plural.toLowerCase()} listed in ${l.name} yet.`
              : results.length === 1
                ? `EarlyDays lists 1 ${c.singular.toLowerCase()} in ${l.name}, ${r.name}.`
                : `EarlyDays lists ${results.length} ${c.plural.toLowerCase()} in ${l.name}, ${r.name}.`}{" "}
            Fees, curriculum and admissions windows are shown only when the
            school has published them.
          </p>
        </div>

        {results.length === 0 ? (
          <EmptyResults
            title={`No ${c.plural.toLowerCase()} in ${l.name} yet.`}
            nearby={nearby.map((n) => ({
              href: `/${c.slug}/${r.slug}/${n.slug}`,
              label: `${c.plural} in ${n.name}`,
            }))}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((x) => (
              <ListingCard key={x.id} listing={x} />
            ))}
          </div>
        )}

        {/* Cross-linking to other programmes in the same area */}
        {otherCatsHere.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-3 font-display text-xl">
              Other programmes in {l.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {otherCatsHere.map((cc) => (
                <Link
                  key={cc.slug}
                  href={`/${cc.slug}/${r.slug}/${l.slug}`}
                  className="chip chip-sky"
                >
                  {cc.plural} in {l.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Same programme in nearby areas */}
        {nearby.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-3 font-display text-xl">
              {c.plural} in nearby areas
            </h2>
            <div className="flex flex-wrap gap-2">
              {nearby.map((n) => (
                <Link
                  key={n.slug}
                  href={`/${c.slug}/${r.slug}/${n.slug}`}
                  className="chip"
                >
                  {c.plural} in {n.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="mt-14" aria-labelledby="combo-faq">
          <h2 id="combo-faq" className="mb-3 font-display text-2xl">
            Parent questions
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

function buildComboFaq(
  plural: string,
  singular: string,
  area: string,
  region: string,
  count: number
) {
  const p = plural.toLowerCase();
  const s = singular.toLowerCase();
  return [
    {
      q: `How many ${p} are there in ${area}?`,
      a: `EarlyDays currently lists ${count} ${count === 1 ? s : p} in ${area}, ${region}. We add listings as we can source each school's own information.`,
    },
    {
      q: `What should I look for in a ${s} in ${area}?`,
      a: `The essentials: age range, curriculum (Montessori, EYFS, Cambridge, GES, British, etc.), staff-to-child ratio, meals, outdoor play and daily hours. Visit in person before deciding.`,
    },
    {
      q: `How much does a ${s} cost in ${area}?`,
      a: `Fees vary widely by school and are set by each one individually. EarlyDays only displays fees when the school has published them — otherwise, use Request information to ask directly.`,
    },
    {
      q: `Can I visit these ${p} before enrolling?`,
      a: `Almost all schools welcome parent visits. Use the contact actions on each profile to arrange a tour — good schools respond warmly and promptly, which is itself a useful signal.`,
    },
  ];
}
