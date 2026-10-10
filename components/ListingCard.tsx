import Image from "next/image";
import Link from "next/link";
import { findLocation } from "@/data/locations";
import { findCategoryByType } from "@/data/categories";
import { VerifiedCheck } from "./VerifiedCheck";
import { schoolInitials } from "@/lib/initials";
import type { Listing } from "@/lib/types";

// One flat surface for every category. Nine pastel gradients meant a grid
// of cards read as a colour chart; the school's name is the thing that
// should distinguish it, not a different shade of peach.
const PLACEHOLDER_BG = "var(--color-paper-deep)";

export function ListingCard({ listing, compact = false }: { listing: Listing; compact?: boolean }) {
  const loc = findLocation(listing.neighbourhood);
  const primaryCategory = findCategoryByType(listing.listingTypes[0]);
  
  const heroImage = listing.images?.[0];
  return (
    <article
      className="card group flex h-full flex-col"
      itemScope
      itemType="https://schema.org/EducationalOrganization"
    >
      <Link
        href={`/schools/${listing.slug}`}
        className="relative block h-40 w-full overflow-hidden"
        style={heroImage ? undefined : { background: PLACEHOLDER_BG }}
        aria-label={`${listing.name} — view profile`}
      >
        {heroImage ? (
          <Image
            src={heroImage.url}
            alt={heroImage.alt}
            fill
            sizes="(min-width: 1280px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <>
            {/* Initials rather than a stock photo. We have no picture of this
                school we can stand behind, and saying so plainly beats
                borrowing someone else's classroom. */}
            <span
              aria-hidden
              className="absolute inset-0 flex items-center justify-center font-display text-5xl font-bold tracking-tight text-[color:var(--color-navy)] opacity-30"
            >
              {schoolInitials(listing.name)}
            </span>
            <span className="absolute bottom-2 right-3 text-[10px] font-semibold text-[color:var(--color-navy)] opacity-45">
              No photo yet
            </span>
          </>
        )}
        <span
          className="absolute left-3 top-3 chip"
          style={{ background: "rgba(255,255,255,0.9)", borderColor: "transparent" }}
        >
          {primaryCategory?.singular ?? "Programme"}
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
          {(listing.claimed || listing.verification === "verified") && (
            <span
              className="mt-0.5 inline-flex shrink-0 items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-[#1F7AD6]"
              title="This school has claimed and verified its profile with EarlyDays."
            >
              <VerifiedCheck size={14} />
              Verified
            </span>
          )}
        </div>

        <p className="mb-3 flex items-center gap-1.5 text-[13px] font-semibold text-[color:var(--color-pink-hot)]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 22s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12Z" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.8" />
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

        {(listing.ageBlurb || listing.curriculum.length > 0) && (
          <dl className="mb-3 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px]">
            {listing.ageBlurb && (
              <div>
                <dt className="text-[9px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
                  Ages
                </dt>
                <dd className="text-[12px] font-semibold text-[color:var(--color-navy)]">
                  {listing.ageBlurb}
                </dd>
              </div>
            )}
            {listing.curriculum.length > 0 && (
              <div>
                <dt className="text-[9px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
                  Approach
                </dt>
                <dd className="text-[12px] font-semibold text-[color:var(--color-navy)]">
                  {listing.curriculum.slice(0, 2).join(", ")}
                </dd>
              </div>
            )}
          </dl>
        )}

        <div className="mb-4 flex flex-wrap gap-1">
          {listing.listingTypes.slice(0, 3).map((t) => {
            const c = findCategoryByType(t);
            return (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded-full bg-[color:var(--color-leaf-soft)] px-2 py-0.5 text-[10px] font-semibold text-[#2F7C25]"
              >
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="m4 12 5 5L20 6" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {c?.singular ?? t}
              </span>
            );
          })}
        </div>

        <div className="mt-auto flex justify-end">
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
