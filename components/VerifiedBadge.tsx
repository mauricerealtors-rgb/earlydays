import type { VerificationStatus } from "@/lib/types";

const map: Record<
  VerificationStatus,
  { label: string; className: string; hint: string }
> = {
  unverified: {
    label: "Unverified",
    className: "chip",
    hint: "Publicly discovered listing, not yet confirmed with the school.",
  },
  "info-confirmed": {
    label: "Info confirmed",
    className: "chip chip-sky",
    hint: "Contact details and basic profile have been checked.",
  },
  claimed: {
    label: "Claimed by school",
    className: "chip chip-blossom",
    hint: "A school representative has claimed this profile.",
  },
  verified: {
    label: "Verified",
    className: "chip chip-leaf",
    hint: "Profile information has been verified.",
  },
};

export function VerifiedBadge({ status }: { status: VerificationStatus }) {
  const m = map[status];
  return (
    <span className={m.className} title={m.hint} aria-label={`Verification: ${m.hint}`}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="m4 12 5 5L20 6"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {m.label}
    </span>
  );
}
