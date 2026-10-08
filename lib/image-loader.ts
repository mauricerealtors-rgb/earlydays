"use client";

/**
 * Image loader.
 *
 * Why a custom loader at all: Next's built-in optimiser only accepts hosts
 * listed in images.remotePatterns, and that array is capped at 50. Our photos
 * come from 126 hosts — 124 of which serve exactly one image, because every
 * school has its own domain — so an allowlist cannot work and wildcards do not
 * help. That cap is why images.unoptimized was switched on, and why one
 * listing page pulls a 9.7MB JPEG to fill a 160px card.
 *
 * A custom loader bypasses remotePatterns entirely, so any host works.
 *
 * It is OFF by default. Set NEXT_PUBLIC_CLOUDINARY_FETCH=1 to enable it, and
 * only after enabling remote fetch in the Cloudinary console — without that,
 * Cloudinary answers 401 and every image on the site breaks. Disabled, this
 * returns the URL untouched, which is exactly today's behaviour.
 */

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
const ENABLED = process.env.NEXT_PUBLIC_CLOUDINARY_FETCH === "1" && CLOUD !== "";
const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://earlydays.cc").replace(/\/$/, "");

interface LoaderArgs {
  src: string;
  width: number;
  quality?: number;
}

export default function imageLoader({ src, width, quality }: LoaderArgs): string {
  if (!ENABLED) return src;

  // c_limit never enlarges: a small source stays its own size rather than
  // being upscaled into a bigger, blurrier file.
  const t = `f_auto,q_${quality ?? "auto"},w_${width},c_limit`;

  // Already ours on Cloudinary — transform in place rather than fetching our
  // own CDN through itself.
  const ownUpload = `res.cloudinary.com/${CLOUD}/image/upload/`;
  if (src.includes(ownUpload)) {
    return src.replace("/image/upload/", `/image/upload/${t}/`);
  }

  // Files we serve ourselves. Cloudinary has to fetch these over the public
  // internet, so it cannot reach a dev server — leave those alone.
  if (src.startsWith("/")) {
    if (process.env.NODE_ENV !== "production") return src;
    return `https://res.cloudinary.com/${CLOUD}/image/fetch/${t}/${encodeURIComponent(SITE + src)}`;
  }

  if (!/^https?:\/\//.test(src)) return src;

  return `https://res.cloudinary.com/${CLOUD}/image/fetch/${t}/${encodeURIComponent(src)}`;
}
