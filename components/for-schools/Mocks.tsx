/**
 * The imagery on this page.
 *
 * A marketing page like this normally runs photographs of children in a
 * classroom. We do not have any we are allowed to use. Borrowing a listed
 * school's photos to sell our own services is a different permission from
 * showing them on that school's own profile, stock photography of foreign
 * children undercuts the one thing we are claiming (that we are here, in
 * Ghana, and we come to your school), and generated images are exactly what
 * we reject when vetting schools' submissions.
 *
 * So the illustrations are the product itself, drawn in markup. No image
 * requests, sharp at any size, and they show the thing being sold rather than
 * decorating around it. They are replaced with real photographs the first time
 * we run a photography day at a school that gives us written permission.
 */

/** A phone showing a school profile, which is what we are selling a place on. */
export function ProfileMock() {
  return (
    <div className="mx-auto w-full max-w-[290px]">
      <div className="rounded-[28px] border-[7px] border-[color:var(--color-ink)] bg-white p-0 shadow-[0_24px_60px_rgba(16,36,59,0.18)]">
        <div className="flex items-center justify-center gap-1 py-1.5">
          <span className="h-1 w-10 rounded-full bg-[color:var(--color-line)]" />
        </div>

        {/* Photo strip. The point of the whole page, so it is labelled. */}
        <div className="relative grid h-[118px] grid-cols-3 gap-0.5 bg-[color:var(--color-sun-soft)] px-0.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="grid place-items-center bg-[color:var(--color-sun)]/25"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect
                  x="3"
                  y="6"
                  width="18"
                  height="14"
                  rx="2.5"
                  stroke="var(--color-coral)"
                  strokeWidth="1.6"
                />
                <circle cx="12" cy="13" r="3.2" stroke="var(--color-coral)" strokeWidth="1.6" />
                <path d="M8.5 6l1-2h5l1 2" stroke="var(--color-coral)" strokeWidth="1.6" />
              </svg>
            </div>
          ))}
          <span className="absolute bottom-1.5 left-1.5 rounded-full bg-[color:var(--color-ink)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
            Your photos
          </span>
        </div>

        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="h-[9px] w-32 rounded-full bg-[color:var(--color-ink)]" />
              <div className="mt-1.5 h-[6px] w-20 rounded-full bg-[color:var(--color-line)]" />
            </div>
            <span className="shrink-0 rounded-full bg-[color:var(--color-leaf-soft)] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[color:var(--color-leaf)]">
              Open
            </span>
          </div>

          <div className="mt-2.5 flex flex-wrap gap-1">
            {[26, 34, 20, 28].map((w, i) => (
              <span
                key={i}
                className="rounded-full border border-[color:var(--color-line)] px-1.5 py-[3px]"
                style={{ width: w + 14 }}
              >
                <span className="block h-[5px] rounded-full bg-[color:var(--color-line)]" />
              </span>
            ))}
          </div>

          <div className="mt-3 space-y-1.5">
            {[100, 92, 70].map((w, i) => (
              <div
                key={i}
                className="h-[5px] rounded-full bg-[color:var(--color-line-2)]"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>

          {/* Fees, because this is the row that gets the call. */}
          <div className="mt-3 flex items-center justify-between rounded-lg bg-[color:var(--color-cream-deep)] px-2 py-1.5">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[color:var(--color-ink-mute)]">
              Fees per term
            </span>
            <span className="h-[7px] w-12 rounded-full bg-[color:var(--color-ink)]" />
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-1.5">
            <span className="grid h-7 place-items-center rounded-lg bg-[color:var(--color-sun)] text-[10px] font-extrabold text-[color:var(--color-ink)]">
              Call school
            </span>
            <span className="grid h-7 place-items-center rounded-lg border border-[color:var(--color-line)] text-[10px] font-extrabold text-[color:var(--color-ink)]">
              WhatsApp
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * A stylised search result, not a copy of Google's page. It illustrates the
 * claim the section makes, which is that the parent lands on our page before
 * they ever reach a school's own website.
 */
export function SearchMock() {
  return (
    <div className="rounded-2xl border border-[color:var(--color-line)] bg-white p-4 md:p-5">
      <div className="flex items-center gap-2 rounded-full border border-[color:var(--color-line)] px-3 py-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="11" cy="11" r="7" stroke="var(--color-ink-mute)" strokeWidth="2" />
          <path
            d="m20 20-3.5-3.5"
            stroke="var(--color-ink-mute)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span className="truncate text-[13px] text-[color:var(--color-ink)]">
          preschools in East Legon Accra
        </span>
      </div>

      <ol className="mt-4 space-y-3">
        <li className="rounded-xl border-2 border-[color:var(--color-sun)] bg-[color:var(--color-sun-soft)]/60 p-3">
          <div className="flex items-center gap-1.5">
            <span className="rounded bg-[color:var(--color-ink)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
              EarlyDays
            </span>
            <span className="truncate text-[10px] text-[color:var(--color-ink-mute)]">
              earlydays.cc
            </span>
          </div>
          <p className="mt-1.5 text-[13px] font-bold leading-snug text-[color:var(--color-coral)]">
            Preschools in East Legon, Accra
          </p>
          <p className="mt-1 text-[11px] leading-snug text-[color:var(--color-ink-mute)]">
            Compare preschools in East Legon. Photos, fees, hours and contact
            details, with your school among them.
          </p>
        </li>
        {[0, 1, 2].map((i) => (
          <li key={i} className="px-3">
            <div className="h-[6px] w-24 rounded-full bg-[color:var(--color-line)]" />
            <div className="mt-2 h-[8px] w-3/4 rounded-full bg-[color:var(--color-line)]" />
            <div className="mt-1.5 h-[5px] w-full rounded-full bg-[color:var(--color-line-2)]" />
          </li>
        ))}
      </ol>
      <p className="mt-4 border-t border-dashed border-[color:var(--color-line)] pt-3 text-[11px] text-[color:var(--color-ink-mute)]">
        An illustration of a real position. Search it yourself before the call.
      </p>
    </div>
  );
}

/** Two columns: what a parent finds now, and what they find after. */
export function BeforeAfterMock() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-cream-deep)] p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
          What a parent finds today
        </p>
        <ul className="mt-3 space-y-2">
          {[
            "A name and a phone number",
            "No photos of the classrooms",
            "No fees anywhere",
            "A Facebook page last posted in 2023",
            "No idea if you are still open",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2 text-[13px] text-[color:var(--color-ink-mute)]">
              <Cross />
              <span className="min-w-0">{t}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border-2 border-[color:var(--color-sun)] bg-white p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-coral)]">
          What they find after
        </p>
        <ul className="mt-3 space-y-2">
          {[
            "Your school on page one of Google",
            "Real photographs of your compound",
            "Your programmes, hours and fees",
            "One tap to call or WhatsApp you",
            "A website that loads on mobile data",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2 text-[13px] font-medium text-[color:var(--color-ink)]">
              <Tick />
              <span className="min-w-0">{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Tick() {
  return (
    <svg
      aria-hidden
      className="mt-[3px] h-4 w-4 shrink-0 text-[color:var(--color-leaf)]"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M4 10.5l4 4 8-9"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Cross() {
  return (
    <svg
      aria-hidden
      className="mt-[3px] h-4 w-4 shrink-0 text-[color:var(--color-ink-mute)]/60"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M5 5l10 10M15 5L5 15"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
