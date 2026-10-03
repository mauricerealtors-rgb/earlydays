import type { Vendor, Occasion, CakeKind } from "@/lib/types";

/**
 * The directory.
 *
 * Every entry is traced to a real source and carries its sourceUrls. Nothing
 * here is invented: no guessed phone numbers, no stock photos passed off as a
 * baker's own work, no price we were not told. An empty field is honest; a
 * wrong one costs us the vendor.
 */
export const VENDORS: Vendor[] = [];

export function findVendor(slug: string): Vendor | undefined {
  return VENDORS.find((v) => v.slug === slug);
}

/**
 * Bakers relevant to an area: those based there, plus those who deliver there.
 *
 * A buyer wants the cake delivered, not a tour of the kitchen, so delivery
 * reach counts as presence. Based-here bakers sort first, because collection is
 * cheaper and because a local baker is easier to chase if something goes wrong.
 */
export function vendorsInArea(areaSlug: string): Vendor[] {
  const based = VENDORS.filter((v) => v.area === areaSlug);
  const delivers = VENDORS.filter(
    (v) => v.area !== areaSlug && v.deliversTo?.includes(areaSlug),
  );
  return [...sortForDisplay(based), ...sortForDisplay(delivers)];
}

export function vendorsForOccasion(occasion: Occasion): Vendor[] {
  return sortForDisplay(VENDORS.filter((v) => v.occasions.includes(occasion)));
}

export function vendorsForKind(kind: CakeKind): Vendor[] {
  return sortForDisplay(VENDORS.filter((v) => v.kinds.includes(kind)));
}

/**
 * Display order.
 *
 * Featured first, then verified, then by how complete and checkable the profile
 * is. Note what this deliberately does *not* do: rotate randomly the way
 * Hitched does. Rotation exists to make a paid position worth buying, which
 * means showing a worse baker above a better one. We sell position only once we
 * have enough traffic that the top slot is genuinely scarce, and even then the
 * ordering stays explainable to a buyer.
 */
export function sortForDisplay(list: Vendor[]): Vendor[] {
  return [...list].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    const av = a.verification === "verified" ? 1 : 0;
    const bv = b.verification === "verified" ? 1 : 0;
    if (av !== bv) return bv - av;
    return completeness(b) - completeness(a);
  });
}

/**
 * Cheap proxy for how useful a profile is to a buyer right now.
 *
 * A published price grid with servings outranks everything except a verified
 * contact, because those two are the things no competing Ghanaian directory
 * carries at all, and the two the documented complaints turn on: prepaying a
 * number that turns out not to be the baker, and a cake that serves a quarter
 * of what was expected.
 */
function completeness(v: Vendor): number {
  let n = 0;
  if (v.contactVerifiedAt) n += 5;
  if (v.priceList?.some((r) => r.servesFrom)) n += 5;
  else if (v.priceList?.length) n += 3;
  else if (v.priceFrom) n += 2;
  if (v.images?.some((i) => i.ownWork)) n += 4;
  else if (v.images?.length) n += 2;
  if (v.leadTimeDays) n += 2;
  if (v.whatsapp) n += 2;
  if (v.deliversTo?.length) n += 2;
  if (v.depositNote) n += 1;
  if (v.website) n += 1;
  if (v.instagram) n += 1;
  return n;
}
