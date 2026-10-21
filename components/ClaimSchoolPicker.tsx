"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

/**
 * Find your school, then claim it.
 *
 * This page used to carry its own form with a free-text "School name" field,
 * no submit handler and no request: pressing the button reloaded the page and
 * threw the answers away. Every claim entered here since it shipped was lost,
 * and six CTAs across the site point at it.
 *
 * A free-text school name could not have worked anyway. Ownership attaches to
 * a listing, /api/claim rejects anything that is not a known slug, and
 * "Teltub" typed by hand matches nothing. So the job of this page is to turn
 * a name a person remembers into the slug the claim flow needs, and then get
 * out of the way.
 */

export interface SchoolIndexEntry {
  slug: string;
  name: string;
  area: string;
  region: string;
}

const MAX_RESULTS = 8;

export function ClaimSchoolPicker({ schools }: { schools: SchoolIndexEntry[] }) {
  const [q, setQ] = useState("");

  const term = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (term.length < 2) return [];
    const scored = schools
      .map((s) => {
        const name = s.name.toLowerCase();
        const area = s.area.toLowerCase();
        // A name that starts with what was typed beats one that merely
        // contains it, so "st" finds St Peter's before Montessori.
        let score = -1;
        if (name.startsWith(term)) score = 0;
        else if (name.includes(term)) score = 1;
        else if (area.startsWith(term)) score = 2;
        else if (area.includes(term)) score = 3;
        return { s, score };
      })
      .filter((r) => r.score >= 0)
      .sort((a, b) => a.score - b.score || a.s.name.localeCompare(b.s.name));
    return scored.slice(0, MAX_RESULTS).map((r) => r.s);
  }, [schools, term]);

  const tooShort = term.length > 0 && term.length < 2;
  const noMatch = term.length >= 2 && results.length === 0;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border-2 border-[color:var(--color-ink)] bg-white p-5 shadow-[var(--shadow-hard)] md:p-6">
        <label
          htmlFor="claim-search"
          className="block text-[11px] font-extrabold uppercase tracking-[0.1em] text-[color:var(--color-text-muted)]"
        >
          Your school&rsquo;s name
        </label>
        <div className="mt-2 flex items-center gap-2 rounded-xl border-2 border-[color:var(--color-ink)] px-3 py-2.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="11" cy="11" r="7" stroke="var(--color-ink)" strokeWidth="2" />
            <path
              d="m20 20-3.5-3.5"
              stroke="var(--color-ink)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input
            id="claim-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoComplete="off"
            placeholder="Start typing, e.g. Teltub, or your area"
            className="w-full min-w-0 bg-transparent text-[16px] font-semibold outline-none placeholder:font-normal placeholder:text-[color:var(--color-text-muted)]"
          />
        </div>

        {term.length === 0 && (
          <p className="mt-3 text-[13px] leading-relaxed text-[color:var(--color-text-muted)]">
            We have {schools.length} schools listed across Ghana. Yours is
            probably already one of them.
          </p>
        )}
        {tooShort && (
          <p className="mt-3 text-[13px] text-[color:var(--color-text-muted)]">
            Keep typing.
          </p>
        )}

        {results.length > 0 && (
          <ul className="mt-4 space-y-2">
            {results.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/claim/${s.slug}`}
                  className="flex items-center justify-between gap-3 rounded-xl border-2 border-[color:var(--color-ink)] bg-white px-4 py-3 transition hover:-translate-y-0.5 hover:bg-[color:var(--color-butter)] hover:shadow-[var(--shadow-hard-sm)]"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-display text-[16px] leading-tight">
                      {s.name}
                    </span>
                    <span className="mt-0.5 block truncate text-[12px] text-[color:var(--color-text-muted)]">
                      {s.area}, {s.region}
                    </span>
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                    className="shrink-0"
                  >
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="var(--color-ink)"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {noMatch && (
          <div className="mt-4 rounded-xl border-2 border-dashed border-[color:var(--color-ink)]/40 p-4">
            <p className="font-display text-[15px] leading-tight">
              Nothing matching &ldquo;{q.trim()}&rdquo;
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[color:var(--color-text-body)]">
              Try the area instead of the name, or a shorter version of the
              name. If your school really is not here yet,{" "}
              <Link href="/contact" className="font-bold underline decoration-2 underline-offset-2">
                tell us and we will add it
              </Link>
              . Adding a school is free.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
