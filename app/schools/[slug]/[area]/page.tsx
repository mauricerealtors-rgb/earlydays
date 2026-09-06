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
import { CATEGORIES } from "@/data/categories";
import { SITE } from "@/lib/site";

export const dynamicParams = false;
export const revalidate = 3600;

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
  return {
    title: `Schools & learning centres in ${l.name}, ${r.name}`,
    description: `Discover schools and children's learning centres in ${l.name}, ${r.name}. Compare programmes, ages, curriculum and location.`,
    alternates: { canonical: `${SITE.url}/schools/${r.slug}/${l.slug}` },
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

  const results = listingsByLocation(l.slug);
  const nearby = LOCATIONS.filter(
    (x) => x.region === r.slug && x.slug !== l.slug
  ).slice(0, 5);

  return (
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

      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.slice(0, 6).map((c) => (
          <Link
            key={c.slug}
            href={`/${c.slug}/${r.slug}/${l.slug}`}
            className="chip chip-sky"
          >
            {c.plural} in {l.name}
          </Link>
        ))}
      </div>

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
  );
}
