import Link from "next/link";

/**
 * The mark.
 *
 * Replaces a raster PNG of a gradient blob with a flat SVG — the last gradient
 * left anywhere on the homepage, and the one thing still signalling the old
 * look even after the palette changed.
 *
 * A sun clearing a horizon, which is what "early days" means, and the only
 * idea the mark needs to carry. Inline rather than a file so it inherits the
 * palette, stays sharp at any size, and costs no request.
 */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2.5"
      aria-label="EarlyDays — home"
    >
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        aria-hidden
        className="h-9 w-9 shrink-0"
      >
        <rect width="36" height="36" rx="9" fill="var(--color-ink)" />
        {/* Sun, clearing the horizon. */}
        <circle cx="18" cy="19" r="7" fill="var(--color-marigold)" />
        <rect x="7" y="22" width="22" height="7" rx="1" fill="var(--color-ink)" />
        <rect
          x="7"
          y="22"
          width="22"
          height="2"
          rx="1"
          fill="var(--color-marigold)"
        />
      </svg>
      {!compact && (
        <span className="font-display text-[19px] font-extrabold tracking-tight text-[color:var(--color-ink)]">
          Early<span className="text-[color:var(--color-coral)]">Days</span>
        </span>
      )}
    </Link>
  );
}
