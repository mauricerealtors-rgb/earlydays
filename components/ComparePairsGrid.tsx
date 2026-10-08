"use client";

import { useState } from "react";
import Link from "next/link";

export interface PairCard {
  slug: string;
  a: string;
  b: string;
  reason: string;
  areaA: string;
  areaB: string;
}

const PAGE = 24;

/**
 * The comparison index, paginated.
 *
 * It used to render every curated pair — 411 cards, 5.8MB of HTML. Worse, the
 * bottom nav links here from every page, so Next prefetched a 3.1MB RSC
 * payload on every single view whether or not anyone tapped Compare.
 *
 * Cards also carry prefetch={false}: twenty-four comparison pages pulled in
 * advance is not a trade worth making on a Ghanaian mobile connection.
 */
export function ComparePairsGrid({ pairs }: { pairs: PairCard[] }) {
  const [shown, setShown] = useState(PAGE);
  const visible = pairs.slice(0, shown);
  const remaining = pairs.length - visible.length;

  return (
    <>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <Link
            key={p.slug}
            href={`/compare/${p.slug}`}
            prefetch={false}
            className="group rounded-2xl border border-[color:var(--color-line)] bg-white p-5 transition hover:shadow-lg"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
              School vs school
            </p>
            <p className="mt-2 font-display text-[18px] leading-tight text-[color:var(--color-navy)] md:text-[20px]">
              {p.a} <span className="text-[color:var(--color-ink-mute)]">vs</span> {p.b}
            </p>
            <p className="mt-2 text-[12px] text-[color:var(--color-ink-mute)]">
              {p.reason}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="chip chip-sky">{p.areaA}</span>
              <span className="chip chip-sun">{p.areaB}</span>
            </div>
          </Link>
        ))}
      </div>

      {remaining > 0 && (
        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => setShown((n) => n + PAGE)}
            className="btn btn-ghost"
          >
            Show {Math.min(PAGE, remaining)} more
          </button>
          <p className="text-sm text-[color:var(--color-ink-mute)]">
            Showing {visible.length} of {pairs.length}
          </p>
        </div>
      )}
    </>
  );
}
