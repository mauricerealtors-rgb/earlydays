"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Guide } from "@/data/guides";

const ALL = "All";

export function GuidesFilter({ guides }: { guides: Guide[] }) {
  const tags = useMemo(() => {
    const set = new Set<string>();
    for (const g of guides) set.add(g.tag);
    return [ALL, ...Array.from(set).sort()];
  }, [guides]);

  const [active, setActive] = useState<string>(ALL);

  const filtered = useMemo(
    () => (active === ALL ? guides : guides.filter((g) => g.tag === active)),
    [active, guides],
  );

  return (
    <>
      <div className="mb-6 -mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
        <div className="flex gap-2 pb-2">
          {tags.map((t) => {
            const on = active === t;
            const count =
              t === ALL
                ? guides.length
                : guides.filter((g) => g.tag === t).length;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setActive(t)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-semibold transition whitespace-nowrap ${
                  on
                    ? "border-[color:var(--color-navy)] bg-[color:var(--color-navy)] text-white"
                    : "border-[color:var(--color-line)] bg-white text-[color:var(--color-navy)] hover:bg-[color:var(--color-cream-deep)]"
                }`}
              >
                <span>{t}</span>
                <span
                  className={`text-[11px] ${on ? "text-white/70" : "text-[color:var(--color-ink-mute)]"}`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[color:var(--color-line)] bg-white p-6 text-center text-sm text-[color:var(--color-ink-mute)]">
          No guides in this category yet.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="card p-5 hover:shadow-lg"
            >
              <span className="chip">{g.tag}</span>
              <h2 className="mt-3 font-display text-xl leading-tight text-[color:var(--color-navy)]">
                {g.title}
              </h2>
              <p className="mt-2 text-sm text-[color:var(--color-ink-mute)]">
                {g.dek}
              </p>
              <p className="mt-3 text-xs text-[color:var(--color-ink-mute)]">
                {g.readingMinutes} min read
              </p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
