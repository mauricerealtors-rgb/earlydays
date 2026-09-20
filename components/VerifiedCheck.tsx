/**
 * Verified seal — a scalloped blue disc with a white tick, the shape people
 * already read as "verified" from social platforms.
 *
 * The lobes are our own geometry rather than another product's path data, and
 * the blue is the site's own (#1F7AD6) rather than Instagram's lighter tone,
 * which does not hold its contrast against the cream background.
 */

import {
  VERIFIED_BLUE,
  VERIFIED_SEAL_PATH,
  VERIFIED_TICK_PATH,
} from "@/lib/verified-seal";

export { VERIFIED_BLUE };

export function VerifiedCheck({
  size = 16,
  className,
  title,
}: {
  size?: number;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={{ flexShrink: 0 }}
    >
      {title && <title>{title}</title>}
      <path d={VERIFIED_SEAL_PATH} fill={VERIFIED_BLUE} />
      <path
        d={VERIFIED_TICK_PATH}
        fill="none"
        stroke="#fff"
        strokeWidth="2.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
