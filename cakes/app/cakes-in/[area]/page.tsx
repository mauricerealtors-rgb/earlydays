import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb, Footer, Header } from "@/components/Chrome";
import { VendorGrid } from "@/components/VendorCard";
import { AREAS, findArea } from "@/data/areas";
import { areasWithVendors, vendorsInArea, VENDORS } from "@/data/vendors";
import { SITE, money } from "@/lib/site";

export function generateStaticParams() {
  return areasWithVendors(AREAS.map((a) => a.slug)).map((area) => ({ area }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ area: string }>;
}): Promise<Metadata> {
  const { area } = await params;
  const a = findArea(area);
  if (!a) return {};
  const n = vendorsInArea(area).length;
  return {
    title: `Cake makers in ${a.name}`,
    description: `${n} cake maker${n === 1 ? "" : "s"} in and delivering to ${a.name}, ${a.regionName}. Compare portfolios, lead times and published prices.`,
    alternates: { canonical: `/cakes-in/${a.slug}` },
    openGraph: {
      title: `Cake makers in ${a.name}`,
      url: `${SITE.url}/cakes-in/${a.slug}`,
    },
  };
}

export default async function AreaPage({
  params,
}: {
  params: Promise<{ area: string }>;
}) {
  const { area } = await params;
  const a = findArea(area);
  if (!a) notFound();

  const all = vendorsInArea(area);
  if (!all.length) notFound();

  const based = all.filter((v) => v.area === area);
  const delivering = all.filter((v) => v.area !== area);
  const cheapest = all
    .map((v) => v.priceFrom)
    .filter((n): n is number => typeof n === "number")
    .sort((x, y) => x - y)[0];

  return (
    <>
      <Header />
      <Breadcrumb
        trail={[
          { href: "/", label: "Home" },
          { href: `/region/${a.region}`, label: a.regionName },
          { label: a.name },
        ]}
      />

      <main className="container-page pb-10">
        <h1 className="mt-4 text-3xl md:text-5xl">Cake makers in {a.name}</h1>
        <p className="mt-3 max-w-2xl text-lg text-ink-mute">{a.blurb}</p>
        <p className="mt-4 max-w-2xl">
          {based.length > 0 && delivering.length > 0 ? (
            <>
              {based.length} baker{based.length === 1 ? "" : "s"} based in{" "}
              {a.name}, and {delivering.length} more who deliver here.
            </>
          ) : based.length > 0 ? (
            <>
              {based.length} baker{based.length === 1 ? "" : "s"} based in{" "}
              {a.name}.
            </>
          ) : (
            <>
              No baker is based in {a.name} that we can verify, but{" "}
              {delivering.length} deliver here.
            </>
          )}
          {cheapest ? <> Prices start at {money(cheapest)}.</> : null}
        </p>

        {based.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl">Based in {a.name}</h2>
            <p className="mt-1 text-sm text-ink-mute">
              Usually cheaper to collect from, and easier to chase if something
              goes wrong.
            </p>
            <VendorGrid vendors={based} />
          </section>
        )}

        {delivering.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl">Delivering to {a.name}</h2>
            <p className="mt-1 text-sm text-ink-mute">
              Based elsewhere but covering this area. Confirm the delivery fee
              when you order — most bakers quote it by distance.
            </p>
            <VendorGrid vendors={delivering} />
          </section>
        )}

        <p className="mt-12 text-sm text-ink-mute">
          {VENDORS.length} bakers listed across Ghana.
        </p>
      </main>
      <Footer />
    </>
  );
}
