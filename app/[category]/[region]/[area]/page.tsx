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
import { SITE } from "@/lib/site";

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
  return {
    title: `${c.plural} in ${l.name}, ${r.name}`,
    description: `Discover ${c.plural.toLowerCase()} in ${l.name}, ${r.name}. Compare programmes, ages, curriculum and location.`,
    alternates: { canonical: `${SITE.url}/${c.slug}/${r.slug}/${l.slug}` },
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
  const nearby = LOCATIONS.filter(
    (x) => x.region === r.slug && x.slug !== l.slug
  ).slice(0, 6);

  return (
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

      {nearby.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-3 font-display text-xl">Related areas</h2>
          <div className="flex flex-wrap gap-2">
            {nearby.map((n) => (
              <Link
                key={n.slug}
                href={`/${c.slug}/${r.slug}/${n.slug}`}
                className="chip"
              >
                {n.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-14 card-soft rounded-2xl bg-white p-6 md:p-8">
        <h2 className="font-display text-2xl">
          {c.plural} in {l.name} — quick answer
        </h2>
        <p className="mt-2 text-[color:var(--color-ink)]">
          {results.length === 0
            ? `EarlyDays has no ${c.plural.toLowerCase()} listed in ${l.name} yet.`
            : results.length === 1
              ? `EarlyDays has 1 ${c.singular.toLowerCase()} listed in ${l.name}.`
              : `EarlyDays has ${results.length} ${c.plural.toLowerCase()} listed in ${l.name}.`}{" "}
          Fees, curriculum and admissions windows are shown only when the school
          publishes them.
        </p>
      </section>
    </div>
  );
}
