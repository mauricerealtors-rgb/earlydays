import type { Listing } from "@/lib/types";
import { findLocation } from "@/data/locations";

const CATEGORY_LABELS: Record<string, string> = {
  creche: "Creche",
  preschool: "Preschool",
  kindergarten: "Kindergarten",
  primary: "Primary",
  montessori: "Montessori",
  "learning-centre": "Learning centre",
  "language-centre": "Language programme",
  stem: "STEM",
  "activity-centre": "Activity centre",
};

const SERVICE_ROWS: Array<{ key: string; label: string }> = [
  { key: "Daycare", label: "Daycare / creche" },
  { key: "Full day", label: "Full-day programme" },
  { key: "Half day", label: "Half-day option" },
  { key: "Meals", label: "Meals included" },
  { key: "Transport", label: "School transport" },
  { key: "Outdoor play", label: "Outdoor play space" },
  { key: "After school", label: "After-school care" },
  { key: "Extracurriculars", label: "Extracurriculars" },
  { key: "Weekend programmes", label: "Weekend programmes" },
  { key: "Holiday programmes", label: "Holiday programmes" },
];

export function CompareTable({ a, b }: { a: Listing; b: Listing }) {
  const locA = findLocation(a.neighbourhood);
  const locB = findLocation(b.neighbourhood);

  return (
    <div className="overflow-hidden rounded-3xl border border-[color:var(--color-line)] bg-white">
      {/*
        minmax(0,…) on every column. A bare fr column has min-width:auto, so it
        refuses to shrink below its longest word — and school names here run to
        "De Youngster's International School, Adenta". On a phone that pushed
        the table past the viewport and took the whole page with it, leaving
        the reader scrolled sideways with no way back.
      */}
      <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)] text-[13px] md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] md:text-[14px]">
        <ColumnHeader label="" />
        <ColumnHeader label={a.name} accent="sky" />
        <ColumnHeader label={b.name} accent="coral" />

        <Row label="Location">
          <Cell>{locA?.name ?? a.region}</Cell>
          <Cell>{locB?.name ?? b.region}</Cell>
        </Row>

        <Row label="Programme">
          <Cell>{a.listingTypes.map((t) => CATEGORY_LABELS[t] ?? t).join(", ")}</Cell>
          <Cell>{b.listingTypes.map((t) => CATEGORY_LABELS[t] ?? t).join(", ")}</Cell>
        </Row>

        <Row label="Curriculum">
          <Cell>{a.curriculum.length ? a.curriculum.join(", ") : "—"}</Cell>
          <Cell>{b.curriculum.length ? b.curriculum.join(", ") : "—"}</Cell>
        </Row>

        <Row label="Ages">
          <Cell>{a.ageBlurb}</Cell>
          <Cell>{b.ageBlurb}</Cell>
        </Row>

        <Row label="Opening hours">
          <Cell>{a.hours ?? "—"}</Cell>
          <Cell>{b.hours ?? "—"}</Cell>
        </Row>

        {(a.feesHint || b.feesHint) && (
          <Row label="Fees (school-reported)">
            <Cell>{a.feesHint ?? "Not published"}</Cell>
            <Cell>{b.feesHint ?? "Not published"}</Cell>
          </Row>
        )}

        <Row label="Verification">
          <Cell>{verificationLabel(a.verification)}</Cell>
          <Cell>{verificationLabel(b.verification)}</Cell>
        </Row>

        <SectionHeader label="Services & facilities" />

        {SERVICE_ROWS.map((row) => {
          const hasA = a.services.includes(row.key as Listing["services"][number]);
          const hasB = b.services.includes(row.key as Listing["services"][number]);
          if (!hasA && !hasB) return null;
          return (
            <Row key={row.key} label={row.label}>
              <Cell center>{hasA ? <Tick /> : <Dash />}</Cell>
              <Cell center>{hasB ? <Tick /> : <Dash />}</Cell>
            </Row>
          );
        })}

        <SectionHeader label="Contact" />

        <Row label="Phone">
          <Cell>{a.phone ?? "—"}</Cell>
          <Cell>{b.phone ?? "—"}</Cell>
        </Row>

        <Row label="Website">
          <Cell>
            {a.website ? (
              <a
                href={a.website}
                target="_blank"
                rel="noopener"
                className="text-[color:var(--color-sky-deep)] hover:underline"
              >
                Visit
              </a>
            ) : (
              "—"
            )}
          </Cell>
          <Cell>
            {b.website ? (
              <a
                href={b.website}
                target="_blank"
                rel="noopener"
                className="text-[color:var(--color-sky-deep)] hover:underline"
              >
                Visit
              </a>
            ) : (
              "—"
            )}
          </Cell>
        </Row>
      </div>
    </div>
  );
}

function ColumnHeader({
  label,
  accent,
}: {
  label: string;
  accent?: "sky" | "coral";
}) {
  const bg =
    accent === "sky"
      ? "bg-[color:var(--color-sky-soft)] text-[color:var(--color-sky-deep)]"
      : accent === "coral"
        ? "bg-[color:var(--color-coral-soft)] text-[color:var(--color-coral)]"
        : "bg-[color:var(--color-cream-deep)] text-[color:var(--color-navy)]";
  return (
    <div
      // Sentence case and normal tracking on a phone: uppercase with wide
      // tracking makes "International" wider than the column, so it broke
      // mid-word into "INTERNATI ONAL". Uppercase returns at md.
      className={`${bg} min-w-0 break-words px-2.5 py-3 font-display text-[12px] leading-tight tracking-normal md:px-4 md:text-[14px] md:uppercase md:tracking-widest`}
    >
      {label}
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="min-w-0 break-words border-t border-[color:var(--color-line)] bg-[color:var(--color-cream)] px-3 py-3 text-[10px] font-bold uppercase tracking-wide text-[color:var(--color-ink-mute)] md:px-4 md:text-[12px] md:tracking-widest">
        {label}
      </div>
      {children}
    </>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="col-span-3 border-t border-[color:var(--color-line)] bg-[color:var(--color-navy)] px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-white">
      {label}
    </div>
  );
}

function Cell({
  children,
  center,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div
      className={`min-w-0 break-words border-t border-[color:var(--color-line)] bg-white px-3 py-3 text-[color:var(--color-navy)] md:px-4 ${
        center ? "text-center" : ""
      }`}
    >
      {children}
    </div>
  );
}

function verificationLabel(v: Listing["verification"]): string {
  switch (v) {
    case "verified":
      return "Verified by school";
    case "info-confirmed":
      return "Info confirmed";
    case "claimed":
      return "Claimed";
    default:
      return "Unverified";
  }
}

function Tick() {
  return (
    <svg
      aria-hidden
      className="mx-auto h-4 w-4 text-[color:var(--color-leaf)]"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M4 10.5l4 4 8-9"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Dash() {
  return (
    <span aria-hidden className="text-[color:var(--color-ink-mute)]">
      —
    </span>
  );
}
