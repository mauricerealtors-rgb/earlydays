"use client";

import Link from "next/link";

/**
 * Blur a paid panel rather than hide it: a school can see the shape of what it
 * is missing, but the numbers are not readable.
 *
 * aria-hidden and inert keep the obscured figures out of the accessibility tree
 * and off the tab order, so a screen reader is not read a wall of numbers the
 * page is pretending to hide.
 *
 * Shared by the overview and analytics panels — both show the same stats, and
 * gating only one of them gave the numbers away on the other.
 */
export function Locked({
  locked,
  slug,
  inline = false,
  children,
}: {
  locked: boolean;
  slug: string;
  inline?: boolean;
  children: React.ReactNode;
}) {
  if (!locked) return <>{children}</>;
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="pointer-events-none select-none blur-[6px]" aria-hidden inert>
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/45 p-2 text-center">
        <Link
          href={`/school/${slug}/billing`}
          className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-navy)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2.2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          {inline ? "Upgrade" : "Upgrade to unlock"}
        </Link>
      </div>
    </div>
  );
}
