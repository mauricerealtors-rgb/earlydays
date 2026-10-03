import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb, Footer, Header } from "@/components/Chrome";
import { findArea } from "@/data/areas";
import { VENDORS } from "@/data/vendors";
import { SITE, money } from "@/lib/site";
import type { PriceRow, Vendor } from "@/lib/types";

export const metadata: Metadata = {
  title: "Cake prices in Ghana",
  description:
    "What cakes actually cost in Ghana, taken from bakers' own published price lists. Birthday, wedding and cupcake prices by size, tier and how many people they serve.",
  alternates: { canonical: "/prices" },
  openGraph: { title: "Cake prices in Ghana", url: `${SITE.url}/prices` },
};

interface Row {
  vendor: Vendor;
  row: PriceRow;
}

function allRows(): Row[] {
  const out: Row[] = [];
  for (const vendor of VENDORS) {
    for (const row of vendor.priceList ?? []) out.push({ vendor, row });
  }
  return out;
}

function Band({
  heading,
  note,
  rows,
}: {
  heading: string;
  note: string;
  rows: Row[];
}) {
  if (!rows.length) return null;
  const sorted = [...rows].sort((a, b) => a.row.cedis - b.row.cedis);
  const anyServings = sorted.some((r) => r.row.servesFrom);

  return (
    <section className="mt-12">
      <h2 className="text-2xl">{heading}</h2>
      <p className="mt-2 max-w-3xl text-ink-mute">{note}</p>
      <div className="card mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-paper-deep">
            <tr>
              <th scope="col" className="px-4 py-3 font-bold">Cake</th>
              <th scope="col" className="px-4 py-3 font-bold">Baker</th>
              <th scope="col" className="px-4 py-3 font-bold">Area</th>
              {anyServings && (
                <th scope="col" className="px-4 py-3 font-bold">Serves</th>
              )}
              <th scope="col" className="px-4 py-3 text-right font-bold">Price</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(({ vendor, row }, i) => (
              <tr key={i} className="border-b border-line-2 last:border-0">
                <td className="px-4 py-3">{row.label}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/bakers/${vendor.slug}`}
                    className="font-bold text-rose-deep hover:underline"
                  >
                    {vendor.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-mute">
                  {findArea(vendor.area)?.name ?? vendor.area}
                </td>
                {anyServings && (
                  <td className="px-4 py-3 text-ink-mute">
                    {row.servesFrom
                      ? row.servesTo && row.servesTo !== row.servesFrom
                        ? `${row.servesFrom}–${row.servesTo}`
                        : row.servesFrom
                      : "—"}
                  </td>
                )}
                <td className="px-4 py-3 text-right font-bold text-cocoa">
                  {money(row.cedis)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function PricesPage() {
  const rows = allRows();
  const bakers = new Set(rows.map((r) => r.vendor.slug)).size;

  const isWedding = (r: Row) => /wedding/i.test(r.row.label) || Boolean(r.row.tiers);
  const isCupcake = (r: Row) => /cupcake|cookie/i.test(r.row.label);
  const isAddOn = (r: Row) => /^add-on/i.test(r.row.label);
  const wedding = rows.filter(isWedding);
  const cupcakes = rows.filter((r) => !isWedding(r) && isCupcake(r));
  const addOns = rows.filter(isAddOn);
  const cakes = rows.filter(
    (r) => !isWedding(r) && !isCupcake(r) && !isAddOn(r),
  );

  const cheapest = Math.min(...rows.map((r) => r.row.cedis));
  const dearest = Math.max(...rows.map((r) => r.row.cedis));

  return (
    <>
      <Header />
      <Breadcrumb trail={[{ href: "/", label: "Home" }, { label: "Prices" }]} />

      <main className="container-page pb-10">
        <h1 className="mt-4 text-3xl md:text-5xl">Cake prices in Ghana</h1>
        <p className="mt-4 max-w-3xl text-lg">
          Every figure on this page was published by the baker themselves. We
          have not estimated, averaged or guessed a single one, and each links
          back to the baker whose list it came from.
        </p>
        <p className="mt-4 max-w-3xl text-ink-mute">
          {rows.length} prices from {bakers} bakers, ranging from{" "}
          {money(cheapest)} to {money(dearest)}. Most Ghanaian bakers quote on
          request rather than publish, so this is a sample of the market, not all
          of it — but it is more than you will find anywhere else, and it is
          enough to tell whether a quote you have been given is reasonable.
        </p>

        <div className="card mt-8 max-w-3xl p-6">
          <h2 className="text-xl">Two things worth knowing before you compare</h2>
          <p className="mt-3">
            <strong className="text-cocoa">Size is not servings.</strong> The
            same nominal size can cost four times as much from one baker as
            another, and a cake described by inches tells you nothing about how
            many people it feeds. Where a baker publishes servings we show them,
            and if yours does not, ask — a cake sold as serving eight that serves
            two is the most common complaint in this trade.
          </p>
          <p className="mt-3">
            <strong className="text-cocoa">Prices go stale.</strong> Several
            pages still circulating online quote Ghanaian cake prices from 2018,
            which are a fraction of today&rsquo;s. Every price here carries the
            date we read it, on the baker&rsquo;s own profile.
          </p>
        </div>

        <Band
          heading="Birthday and celebration cakes"
          note="Priced by size and by how many layers. Where a baker publishes servings, that column is the one to compare on."
          rows={cakes}
        />
        <Band
          heading="Wedding cakes"
          note="Priced by tier. Ask whether setup at the venue is included, because that varies more between bakers than the cake price does."
          rows={wedding}
        />
        <Band
          heading="Cupcakes and cookies"
          note="Usually sold by the dozen, and the one product where bakers will often quote a firm price up front."
          rows={cupcakes}
        />
        <Band
          heading="Add-ons"
          note="Toppers, sparklers, edible prints and characters are priced separately by most bakers."
          rows={addOns}
        />

        <section className="mt-12 max-w-3xl">
          <h2 className="text-2xl">Why most bakers do not publish prices</h2>
          <p className="mt-3">
            A cake is quoted on tiers, servings and design, so many bakers
            reasonably prefer to see what you want before naming a figure. Others
            simply never put a list online. Either way, it leaves buyers unable
            to tell a fair quote from a high one, which is why we publish every
            figure we can verify rather than hiding them behind an enquiry form.
          </p>
          <p className="mt-3">
            If you are a baker and would like your prices here,{" "}
            <Link href="/for-bakers" className="font-bold text-rose-deep underline">
              claim your listing
            </Link>{" "}
            and add them. Buyers searching for prices are the most likely to
            order.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
