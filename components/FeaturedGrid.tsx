"use client";

import { useState } from "react";
import Link from "next/link";
import { ListingCard } from "./ListingCard";
import type { Listing } from "@/lib/types";

const PAGE = 12;

/**
 * The homepage rail, twelve at a time.
 *
 * Everything is rendered server-side and already in the payload; the button
 * only reveals more. That keeps the whole rail in the HTML for crawlers, and
 * means no spinner and no request when a parent taps it.
 */
export function FeaturedGrid({ listings }: { listings: Listing[] }) {
  const [shown, setShown] = useState(PAGE);
  const visible = listings.slice(0, shown);
  const remaining = listings.length - visible.length;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        {remaining > 0 ? (
          <>
            <button
              type="button"
              onClick={() => setShown((n) => n + PAGE)}
              className="btn btn-ghost"
            >
              Show {Math.min(PAGE, remaining)} more
            </button>
            <p className="text-sm text-[color:var(--color-ink-mute)]">
              Showing {visible.length} of {listings.length}
            </p>
          </>
        ) : (
          <Link href="/schools" className="btn btn-ghost">
            Browse all schools
          </Link>
        )}
      </div>
    </>
  );
}
