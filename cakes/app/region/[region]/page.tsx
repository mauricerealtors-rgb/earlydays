import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb, Footer, Header } from "@/components/Chrome";
import { VendorGrid } from "@/components/VendorCard";
import { AREAS, REGIONS, areasInRegion, findRegion } from "@/data/areas";
import { VENDORS, areasWithVendors, sortForDisplay } from "@/data/vendors";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  const live = new Set(
    VENDORS.map((v) => AREAS.find((a) => a.slug === v.area)?.region),
  );
  return REGIONS.filter((r) => live.has(r.slug)).map((r) => ({ region: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>;
}): Promise<Metadata> {
  const { region } = await params;
  const r = findRegion(region);
  if (!r) return {};
  const n = VENDORS.filter(
    (v) => AREAS.find((a) => a.slug === v.area)?.region === region,
  ).length;
  return {
    title: `Cake makers in ${r.name}`,
    description: `${n} cake makers across ${r.name}, Ghana. Compare portfolios, lead times and published prices.`,
    alternates: { canonical: `/region/${r.slug}` },
    openGraph: { title: `Cake makers in ${r.name}`, url: `${SITE.url}/region/${r.slug}` },
  };
}

export default async function RegionPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  const r = findRegion(region);
  if (!r) notFound();

  const vendors = sortForDisplay(
    VENDORS.filter((v) => AREAS.find((a) => a.slug === v.area)?.region === region),
  );
  if (!vendors.length) notFound();

  const areas = areasWithVendors(areasInRegion(region).map((a) => a.slug));

  return (
    <>
      <Header />
      <Breadcrumb trail={[{ href: "/", label: "Home" }, { label: r.name }]} />

      <main className="container-page pb-10">
        <h1 className="mt-4 text-3xl md:text-5xl">Cake makers in {r.name}</h1>
        <p className="mt-3 max-w-2xl text-lg text-ink-mute">{r.blurb}</p>
        <p className="mt-4">
          {vendors.length} baker{vendors.length === 1 ? "" : "s"} listed.
        </p>

        {areas.length > 1 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {areas.map((slug) => (
              <Link key={slug} href={`/cakes-in/${slug}`} className="chip">
                {AREAS.find((a) => a.slug === slug)?.name ?? slug}
              </Link>
            ))}
          </div>
        )}

        <VendorGrid vendors={vendors} />
      </main>
      <Footer />
    </>
  );
}
