import { findListing } from "@/lib/query";
import { fetchListingSideData } from "@/lib/listing-overrides";
import { badgeSvg, type BadgeSize, type BadgeTheme } from "@/lib/badge";

export const runtime = "nodejs";
// Served from other people's websites, so it is cached hard rather than
// re-resolved per visitor; claiming a profile flips the wording within the hour.
export const revalidate = 3600;

export async function GET(
  req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;
  const listing = findListing(slug);
  if (!listing) {
    return new Response("Not found", { status: 404 });
  }

  const url = new URL(req.url);
  const theme: BadgeTheme = url.searchParams.get("theme") === "dark" ? "dark" : "light";
  const size: BadgeSize = url.searchParams.get("size") === "sm" ? "sm" : "md";

  // The badge states the real status: hotlinking it for an unclaimed profile
  // gets "Listed on", not "Verified on".
  let claimed = listing.claimed;
  try {
    const side = await fetchListingSideData(slug);
    claimed = claimed || side.claimed;
  } catch {
    // Firestore unavailable — fall back to the static flag rather than 500,
    // since this renders inside someone else's page.
  }

  return new Response(badgeSvg({ claimed, theme, size, schoolName: listing.name }), {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      // It is an image for other sites to embed.
      "access-control-allow-origin": "*",
    },
  });
}
