import Link from "next/link";
import { findArea } from "@/data/areas";
import { money } from "@/lib/site";
import type { Vendor } from "@/lib/types";

/**
 * Trust signals, in the order a buyer cares about them.
 *
 * Deliberately not a single opaque "verified" tick. Each badge says exactly
 * what was checked, because the one thing that destroys a Ghanaian directory is
 * a trust mark nobody can interrogate — and because the fraud these buyers are
 * exposed to works precisely by borrowing a real business's credibility.
 */
export function TrustBadges({ vendor: v }: { vendor: Vendor }) {
  const badges: { label: string; tone: "verified" | "price" | "photo" }[] = [];
  if (v.contactVerifiedAt) {
    badges.push({ label: "We reached this baker on this number", tone: "verified" });
  }
  if (v.priceList?.length) {
    badges.push({ label: "Publishes prices", tone: "price" });
  }
  if (v.images?.some((i) => i.ownWork)) {
    badges.push({ label: "Photos are their own work", tone: "photo" });
  }
  if (!badges.length) return null;

  const tones: Record<string, string> = {
    verified: "bg-[color:var(--color-verified)] text-white",
    price: "bg-gold-soft text-cocoa",
    photo: "bg-berry-soft text-berry",
  };

  return (
    <ul className="flex flex-wrap gap-2">
      {badges.map((b) => (
        <li
          key={b.label}
          className={`rounded-full px-2.5 py-1 text-xs font-bold ${tones[b.tone]}`}
        >
          {b.label}
        </li>
      ))}
    </ul>
  );
}

function leadTimeLabel(v: Vendor): string | null {
  if (v.leadTimeDays === 0) return "Same-day orders";
  if (v.leadTimeDays === 1) return "24 hours' notice";
  if (v.leadTimeDays) return `${v.leadTimeDays} days' notice`;
  return null;
}

export function VendorCard({ vendor: v }: { vendor: Vendor }) {
  const area = findArea(v.area);
  const photo = v.images?.find((i) => i.ownWork) ?? v.images?.[0];
  const lead = leadTimeLabel(v);

  return (
    <article className="card overflow-hidden transition-transform hover:-translate-y-0.5">
      <Link href={`/bakers/${v.slug}`} className="block">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo.url}
            alt={photo.alt}
            loading="lazy"
            className="h-48 w-full object-cover"
          />
        ) : (
          <div className="flex h-48 w-full items-center justify-center bg-paper-deep px-4 text-center text-sm text-ink-mute">
            No photo we can attribute to this baker yet
          </div>
        )}
        <div className="p-5">
          <h3 className="text-lg">{v.name}</h3>
          <p className="mt-0.5 text-sm text-ink-mute">
            {area?.name ?? v.area}
            {area && area.region !== "accra" ? `, ${v.city}` : ""}
          </p>
          <p className="mt-2 text-sm">{v.shortDescription}</p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            {v.priceFrom ? (
              <span className="font-bold text-cocoa">
                From {money(v.priceFrom)}
              </span>
            ) : (
              <span className="text-ink-mute">Price on request</span>
            )}
            {lead && <span className="text-ink-mute">{lead}</span>}
          </div>

          <div className="mt-3">
            <TrustBadges vendor={v} />
          </div>
        </div>
      </Link>
    </article>
  );
}

export function VendorGrid({ vendors }: { vendors: Vendor[] }) {
  if (!vendors.length) {
    return (
      <p className="card mt-6 p-6 text-ink-mute">
        No bakers here yet that we have been able to verify. If you make cakes,{" "}
        <Link href="/for-bakers" className="font-bold text-rose-deep underline">
          add your business
        </Link>
        .
      </p>
    );
  }
  return (
    <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {vendors.map((v) => (
        <VendorCard key={v.slug} vendor={v} />
      ))}
    </div>
  );
}
