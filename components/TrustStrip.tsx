import { allListings, LOCATIONS } from "@/lib/query";
import { GUIDES } from "@/data/guides";

/**
 * The trust row under the hero.
 *
 * CMG puts Google, Trustpilot and Meta Partner badges here. We have not earned
 * those, and borrowing the shape without the substance is the thing this
 * rebrand is trying to get away from. So this counts what we can actually
 * stand behind, straight from the data, which means it can never drift out of
 * date the way a hand-typed "200+ schools" would.
 *
 * The last item is the one that matters commercially: a parent deals with the
 * school directly and we take nothing from it.
 */
export function TrustStrip() {
  const listings = allListings();
  const schools = listings.length;
  const withPhotos = listings.filter((l) => l.images && l.images.length).length;
  const areas = new Set(listings.map((l) => l.neighbourhood)).size;

  const stats = [
    { value: String(schools), label: "schools listed" },
    { value: String(withPhotos), label: "with photos we checked" },
    { value: String(areas), label: "areas across Ghana" },
    { value: String(GUIDES.length), label: "guides for parents" },
  ];

  return (
    <section
      aria-label="About this directory"
      className="border-y border-[color:var(--color-line)] bg-white"
    >
      <div className="container-page flex flex-wrap items-center justify-between gap-6 py-6">
        <dl className="flex flex-wrap items-center gap-x-10 gap-y-4">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="font-display text-[22px] font-extrabold tracking-tight text-[color:var(--color-ink)]">
                  {s.value}
                </span>{" "}
                <span className="text-[13px] text-[color:var(--color-ink-mute)]">
                  {s.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="text-[13px] font-semibold text-[color:var(--color-ink)]">
          Free to search.{" "}
          <span className="text-[color:var(--color-ink-mute)]">
            You deal with the school directly and we take no commission.
          </span>
        </p>
      </div>
    </section>
  );
}
