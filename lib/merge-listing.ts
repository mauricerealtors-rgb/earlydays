import type { Listing } from "./types";
import type { ListingOverride, Subscription } from "./school-types";

/**
 * Merge the TS baseline listing with any Firestore overrides the school owner
 * has published, plus their current subscription tier. This is the single
 * source of truth used by every public page that renders a listing.
 *
 * Rules:
 *  - The baseline slug/id/name/neighbourhood are immutable — the school
 *    cannot change them via the dashboard (renames are admin-only for now).
 *  - An override field replaces the baseline only if non-empty.
 *  - Photos: if the school has uploaded any, they REPLACE the baseline
 *    images. This is deliberate — schools want control over their gallery.
 *  - Verification status upgrades based on subscription tier.
 */
export function mergeListing(
  baseline: Listing,
  override?: ListingOverride | null,
  subscription?: Subscription | null,
  claimed?: boolean
): Listing {
  const merged: Listing = { ...baseline };

  if (override) {
    if (override.shortDescription) merged.shortDescription = override.shortDescription;
    if (override.description) merged.description = override.description;
    if (override.phone) merged.phone = override.phone;
    if (override.phones && override.phones.length) merged.phones = override.phones;
    if (override.whatsapp) merged.whatsapp = override.whatsapp;
    if (override.email) merged.email = override.email;
    if (override.website) merged.website = override.website;
    if (override.hours) merged.hours = override.hours;
    if (override.feesHint) merged.feesHint = override.feesHint;
    if (override.admissions) merged.admissions = override.admissions;
    if (override.address) merged.address = override.address;
    if (override.logoUrl) merged.logoUrl = override.logoUrl;

    if (override.photos && override.photos.length) {
      merged.images = override.photos
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((p) => ({
          url: p.url,
          alt: p.alt,
          credit: `Photo: ${baseline.name} (school-provided)`,
        }));
    }
  }

  if (claimed) merged.claimed = true;

  if (subscription && subscription.status === "active") {
    if (subscription.tier === "verified" || subscription.tier === "featured") {
      merged.verification = "verified";
    }
    if (subscription.tier === "featured") {
      merged.featured = true;
    }
  }

  return merged;
}
