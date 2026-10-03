import { money } from "@/lib/site";
import type { PriceRow, Vendor } from "@/lib/types";

function serves(r: PriceRow): string | null {
  if (!r.servesFrom) return null;
  if (r.servesTo && r.servesTo !== r.servesFrom) {
    return `${r.servesFrom}–${r.servesTo} people`;
  }
  return r.servesFrom === 1 ? "1 person" : `${r.servesFrom} people`;
}

/**
 * A baker's published prices.
 *
 * The servings column is the point. The sharpest documented complaint about
 * Ghanaian cake orders is a cake sold as serving eight that served two, and no
 * other directory in the country shows a price at all, let alone next to how
 * many people it feeds.
 *
 * The date is shown because a price goes stale and pretending otherwise would
 * put us in the same position as the sites still circulating 2018 figures.
 */
export function PriceTable({ vendor: v }: { vendor: Vendor }) {
  if (!v.priceList?.length) return null;
  const anyServings = v.priceList.some((r) => r.servesFrom);

  return (
    <section className="mt-10">
      <h2 className="text-2xl">Prices</h2>
      <p className="mt-2 max-w-2xl text-sm text-ink-mute">
        Published by {v.name} themselves. We read this list on{" "}
        {v.priceListSeenAt}
        {v.priceListSourceUrl ? (
          <>
            {" "}
            from{" "}
            <a
              href={v.priceListSourceUrl}
              rel="nofollow noopener"
              className="underline hover:text-rose-deep"
            >
              their own page
            </a>
          </>
        ) : null}
        . Confirm the current price when you order.
      </p>

      <div className="card mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-paper-deep">
            <tr>
              <th scope="col" className="px-4 py-3 font-bold">
                Cake
              </th>
              {anyServings && (
                <th scope="col" className="px-4 py-3 font-bold">
                  Serves
                </th>
              )}
              <th scope="col" className="px-4 py-3 text-right font-bold">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {v.priceList.map((r, i) => (
              <tr key={i} className="border-b border-line-2 last:border-0">
                <td className="px-4 py-3">
                  {r.label}
                  {r.note && (
                    <span className="block text-xs text-ink-mute">{r.note}</span>
                  )}
                </td>
                {anyServings && (
                  <td className="px-4 py-3 text-ink-mute">{serves(r) ?? "—"}</td>
                )}
                <td className="px-4 py-3 text-right font-bold text-cocoa">
                  {money(r.cedis)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {v.depositNote && (
        <p className="mt-3 text-sm text-ink-mute">
          <strong className="text-cocoa">Deposit:</strong> {v.depositNote}
        </p>
      )}
    </section>
  );
}
