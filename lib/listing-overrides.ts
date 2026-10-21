import { adminDb } from "./firebase-admin";
import type { ListingOverride, Subscription } from "./school-types";
import { mergeListing } from "./merge-listing";
import type { Listing } from "./types";

/**
 * Server-side reads of the Firestore side data: a school's published
 * overrides, its subscription and whether anyone owns it.
 *
 * Read the whole collection once, not a document per slug.
 *
 * This used to call db.doc(`listingOverrides/${slug}`).get() for every slug on
 * every page, three collections deep. A get() on a document that does not
 * exist still costs a read, and almost none of these documents exist: a
 * listing only has an override once a school has claimed it and edited
 * something. So a category page rendering 60 schools paid 180 reads to learn
 * that 180 documents were missing.
 *
 * Across a production build that came to about 9,300 reads, against a free
 * tier of 50,000 a day. Five deploys exhausted the quota, and the next write
 * anywhere in the app failed with RESOURCE_EXHAUSTED — which surfaced as the
 * outreach email endpoint returning 500, nowhere near the actual cause.
 *
 * A collection query returns only the documents that exist, so the same work
 * is three reads instead of thousands. The result is cached for the process,
 * which during a build means once per worker rather than once per page.
 */

interface SideData {
  override: ListingOverride | null;
  subscription: Subscription | null;
  claimed: boolean;
}

const EMPTY: SideData = { override: null, subscription: null, claimed: false };

interface Snapshot {
  overrides: Map<string, ListingOverride>;
  subscriptions: Map<string, Subscription>;
  owners: Set<string>;
}

/**
 * Short, because pages are ISR-cached at 60 to 300 seconds and a school that
 * saves an edit expects to see it. Long enough that one build worker rendering
 * hundreds of pages reads Firestore once.
 */
const TTL_MS = 30_000;

const EMPTY_SNAPSHOT: Snapshot = {
  overrides: new Map(),
  subscriptions: new Map(),
  owners: new Set(),
};

let cache: { at: number; data: Snapshot } | null = null;
let inFlight: Promise<Snapshot> | null = null;

async function loadSnapshot(): Promise<Snapshot> {
  const db = adminDb();
  const [overrideSnap, subSnap, ownerSnap] = await Promise.all([
    db.collection("listingOverrides").get(),
    db.collection("subscriptions").get(),
    db.collection("listingOwners").get(),
  ]);

  const overrides = new Map<string, ListingOverride>();
  overrideSnap.forEach((d) => overrides.set(d.id, d.data() as ListingOverride));

  const subscriptions = new Map<string, Subscription>();
  subSnap.forEach((d) => subscriptions.set(d.id, d.data() as Subscription));

  const owners = new Set<string>();
  ownerSnap.forEach((d) => owners.add(d.id));

  return { overrides, subscriptions, owners };
}

async function snapshot(): Promise<Snapshot | null> {
  const now = Date.now();
  if (cache && now - cache.at < TTL_MS) return cache.data;

  // Collapse a stampede: a build worker rendering pages in parallel would
  // otherwise fire one collection query per page while the first is still
  // open, which is the problem this function exists to solve.
  if (!inFlight) {
    inFlight = loadSnapshot()
      .then((data) => {
        cache = { at: Date.now(), data };
        return data;
      })
      .finally(() => {
        inFlight = null;
      });
  }

  try {
    return await inFlight;
  } catch {
    // Firebase Admin not configured yet, or the quota is gone. Public pages
    // keep working from the TS baseline alone rather than failing the build.
    //
    // The failure is cached for the same TTL, and this matters more than the
    // success path. Without it, a build that cannot reach Firestore retries
    // on every one of ~700 pages, so the moment the quota runs out the app
    // starts hammering the service that just refused it. A stale snapshot, if
    // we have one, beats an empty one.
    if (!cache) cache = { at: Date.now(), data: EMPTY_SNAPSHOT };
    return cache.data;
  }
}

function pick(snap: Snapshot | null, slug: string): SideData {
  if (!snap) return EMPTY;
  return {
    override: snap.overrides.get(slug) ?? null,
    subscription: snap.subscriptions.get(slug) ?? null,
    claimed: snap.owners.has(slug),
  };
}

/** Side data for one listing. */
export async function fetchListingSideData(slug: string): Promise<SideData> {
  return pick(await snapshot(), slug);
}

/** Side data for many listings, in one pass. */
export async function fetchListingSideDataMany(
  slugs: string[],
): Promise<Map<string, SideData>> {
  const map = new Map<string, SideData>();
  if (slugs.length === 0) return map;
  const snap = await snapshot();
  for (const slug of slugs) map.set(slug, pick(snap, slug));
  return map;
}

/**
 * Batch-fetch side data for a list of baseline listings and return them fully
 * merged. Use this on every page that renders ListingCards so schools' edits
 * and uploaded photos appear on the discovery surfaces, not only on the
 * individual school profile.
 */
export async function mergeManyListings(baseline: Listing[]): Promise<Listing[]> {
  if (baseline.length === 0) return [];
  const sideDataMap = await fetchListingSideDataMany(baseline.map((l) => l.slug));
  return baseline.map((listing) => {
    const side = sideDataMap.get(listing.slug);
    return mergeListing(listing, side?.override, side?.subscription, side?.claimed);
  });
}
