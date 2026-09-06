import Link from "next/link";
import { findLocation } from "@/data/locations";
import { findCategoryByType } from "@/data/categories";
import type { Listing } from "@/lib/types";
import { VerifiedBadge } from "./VerifiedBadge";

const decor: Record<string, string> = {
  creche: "linear-gradient(135deg,#FFE1D5,#FFC5B0)",
  preschool: "linear-gradient(135deg,#DDEEFF,#C7E1FF)",
  kindergarten: "linear-gradient(135deg,#FFF3D1,#FFE39B)",
  primary: "linear-gradient(135deg,#EAF6E5,#C9EABD)",
  montessori: "linear-gradient(135deg,#FFE8F1,#FFC5DC)",
  "learning-centre": "linear-gradient(135deg,#DDEEFF,#EAF6E5)",
  "language-centre": "linear-gradient(135deg,#FFE1D5,#FFE8F1)",
  stem: "linear-gradient(135deg,#EAF6E5,#DDEEFF)",
  "activity-centre": "linear-gradient(135deg,#FFF3D1,#FFE1D5)",
};

export function ListingCard({ listing, compact = false }: { listing: Listing; compact?: boolean }) {
  const loc = findLocation(listing.neighbourhood);
  const primaryCategory = findCategoryByType(listing.listingTypes[0]);
  const gradient = decor[listing.listingTypes[0]] ?? decor.preschool;
  return (
    <article
      className="card group flex h-full flex-col"
      itemScope
      itemType="https://schema.org/EducationalOrganization"
    >
      <Link
        href={`/schools/${listing.slug}`}
        className="relative block h-32 w-full overflow-hidden"
        style={{ background: gradient }}
        aria-label={`${listing.name} — view profile`}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.6), transparent 45%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.4), transparent 45%)",
          }}
        />
        <span
          className="absolute left-3 top-3 chip"
          style={{ background: "rgba(255,255,255,0.85)", borderColor: "transparent" }}
        >
          {primaryCategory?.singular ?? "Programme"}
        </span>
        <span
          aria-hidden
          className="absolute -right-6 -bottom-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/60"
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3 3 8l9 5 9-5-9-5Zm0 8-9-5v5l9 5 9-5V6l-9 5Z"
              fill="#0F2A4A"
              opacity=".35"
            />
          </svg>
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-start gap-2">
          <h3
            className="font-display text-[18px] leading-tight tracking-tight text-[color:var(--color-navy)]"
            itemProp="name"
          >
            <Link href={`/schools/${listing.slug}`} className="hover:underline">
              {listing.name}
            </Link>
          </h3>
        </div>

        <p className="mb-3 flex items-center gap-1.5 text-sm text-[color:var(--color-ink-mute)]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 22s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12Z" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.6" />
          </svg>
          <span>
            {loc?.name ?? listing.neighbourhood}, {listing.region}
          </span>
        </p>

        {!compact && (
          <p className="mb-3 text-sm text-[color:var(--color-ink)]">
            {listing.shortDescription}
          </p>
        )}

        <dl className="mb-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
          <div>
            <dt className="font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
              Ages
            </dt>
            <dd className="font-semibold text-[color:var(--color-navy)]">
              {listing.ageBlurb}
            </dd>
          </div>
          <div>
            <dt className="font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
              Approach
            </dt>
            <dd className="font-semibold text-[color:var(--color-navy)]">
              {listing.curriculum.length ? listing.curriculum.slice(0, 2).join(", ") : "Not published"}
            </dd>
          </div>
        </dl>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {listing.listingTypes.slice(0, 3).map((t) => {
            const c = findCategoryByType(t);
            return (
              <span key={t} className="chip">
                {c?.singular ?? t}
              </span>
            );
          })}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2">
          <VerifiedBadge status={listing.verification} />
          <Link
            href={`/schools/${listing.slug}`}
            className="btn btn-ghost text-sm"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
