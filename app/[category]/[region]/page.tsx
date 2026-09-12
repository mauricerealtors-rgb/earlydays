import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CATEGORIES, findCategory } from "@/data/categories";
import {
  REGIONS,
  LOCATIONS,
  findRegion,
  listingsByCategoryAndRegion,
  listingsByCategoryAndLocation,
} from "@/lib/query";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeading } from "@/components/PageHeading";
import { ListingCard } from "@/components/ListingCard";
import { EmptyResults } from "@/components/EmptyResults";
import { SITE } from "@/lib/site";

export const dynamicParams = false;
export const revalidate = 3600;

export async function generateStaticParams() {
  const out: { category: string; region: string }[] = [];
  for (const c of CATEGORIES) {
    for (const r of REGIONS) {
      if (listingsByCategoryAndRegion(c.slug, r.slug).length >= 1) {
        out.push({ category: c.slug, region: r.slug });
      }
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; region: string }>;
}): Promise<Metadata> {
  const { category, region } = await params;
  const c = findCategory(category);
  const r = findRegion(region);
  if (!c || !r) return {};
  return {
    title: `${c.plural} in ${r.name}`,
    description: `Discover ${c.plural.toLowerCase()} in ${r.name}, Ghana. ${c.blurb}`,
    alternates: { canonical: `${SITE.url}/${c.slug}/${r.slug}` },
  };
}

export default async function CategoryRegionPage({
  params,
}: {
  params: Promise<{ category: string; region: string }>;
}) {
  const { category, region } = await params;
  const c = findCategory(category);
  const r = findRegion(region);
  if (!c || !r) notFound();

  const results = listingsByCategoryAndRegion(c.slug, r.slug);
  const areas = LOCATIONS.filter((l) => l.region === r.slug)
    .map((l) => ({
      loc: l,
      count: listingsByCategoryAndLocation(c.slug, l.slug).length,
    }))
    .filter((x) => x.count > 0);

  return (
    <div className="container-page pt-8 md:pt-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: c.plural, href: `/${c.slug}` },
          { label: r.name },
        ]}
      />
      <PageHeading
        eyebrow="Programme · Region"
        title={`${c.plural} in ${r.name}`}
        subtitle={c.blurb}
      />

      {areas.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 font-display text-xl">
            {c.plural} in {r.name}. by area
          </h2>
          <div className="flex flex-wrap gap-2">
            {areas.map(({ loc, count }) => (
              <Link
                key={loc.slug}
                href={`/${c.slug}/${r.slug}/${loc.slug}`}
                className="chip chip-sky"
              >
                {loc.name} · {count}
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
    </div>
  );
}
