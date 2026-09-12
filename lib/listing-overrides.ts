import { adminDb } from "./firebase-admin";
import type { ListingOverride, Subscription } from "./school-types";
import { mergeListing } from "./merge-listing";
import type { Listing } from "./types";

/**
 * Server-side helper that reads Firestore overrides + subscription for a
 * given listing slug. Called from ISR-cached pages (revalidate=60) so
 * schools' edits appear on the public site within a minute of saving.
 *
 * All reads are via the Admin SDK — no auth handshake and rules are
 * bypassed. This keeps every render fast.
 */
export async function fetchListingSideData(slug: string): Promise<{
  override: ListingOverride | null;
  subscription: Subscription | null;
  claimed: boolean;
}> {
  try {
    const db = adminDb();
    const [overrideSnap, subSnap, ownerSnap] = await Promise.all([
      db.doc(`listingOverrides/${slug}`).get(),
      db.doc(`subscriptions/${slug}`).get(),
      db.doc(`listingOwners/${slug}`).get(),
    ]);
    return {
      override: overrideSnap.exists ? (overrideSnap.data() as ListingOverride) : null,
      subscription: subSnap.exists ? (subSnap.data() as Subscription) : null,
      claimed: ownerSnap.exists,
    };
  } catch {
    // If Firebase Admin isn't configured yet (missing env var during first
    // deploy), fall back to no overrides — public pages keep working from
    // the TS baseline alone.
    return { override: null, subscription: null, claimed: false };
  }
}

/**
 * Batch variant — reads overrides+subs+ownership for many slugs in one call.
 * Used by category, area, and combo pages to sort and merge many listings
 * per render without N sequential fetches.
 */
export async function fetchListingSideDataMany(
  slugs: string[]
): Promise<
  Map<
    string,
    { override: ListingOverride | null; subscription: Subscription | null; claimed: boolean }
  >
> {
  const map = new Map<
    string,
    { override: ListingOverride | null; subscription: Subscription | null; claimed: boolean }
  >();
  if (slugs.length === 0) return map;
  try {
    const db = adminDb();
    const overrideRefs = slugs.map((s) => db.doc(`listingOverrides/${s}`));
    const subRefs = slugs.map((s) => db.doc(`subscriptions/${s}`));
    const ownerRefs = slugs.map((s) => db.doc(`listingOwners/${s}`));
    const [overrideSnaps, subSnaps, ownerSnaps] = await Promise.all([
      db.getAll(...overrideRefs),
      db.getAll(...subRefs),
      db.getAll(...ownerRefs),
    ]);
    slugs.forEach((slug, i) => {
      map.set(slug, {
        override: overrideSnaps[i].exists ? (overrideSnaps[i].data() as ListingOverride) : null,
        subscription: subSnaps[i].exists ? (subSnaps[i].data() as Subscription) : null,
        claimed: ownerSnaps[i].exists,
      });
    });
  } catch {
    // Fall back to empty map on any Firestore error.
    slugs.forEach((s) => map.set(s, { override: null, subscription: null, claimed: false }));
  }
  return map;
}

/**
 * Convenience: batch-fetch side data for a list of baseline listings and
 * return them fully merged. Use this on every page that renders lists of
 * ListingCards so schools' edits + uploaded photos appear on the discovery
 * surfaces (homepage featured, category pages, area lists, etc.), not just
 * on the individual school profile.
 */
export async function mergeManyListings(baseline: Listing[]): Promise<Listing[]> {
  if (baseline.length === 0) return [];
  const sideDataMap = await fetchListingSideDataMany(baseline.map((l) => l.slug));
  return baseline.map((listing) => {
    const side = sideDataMap.get(listing.slug);
    return mergeListing(listing, side?.override, side?.subscription, side?.claimed);
  });
}
