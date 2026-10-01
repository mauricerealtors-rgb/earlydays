import type { Listing } from "@/lib/types";

/**
 * Online presence audit for a school.
 *
 * Built from what we could actually find while compiling the directory, which
 * is deliberately narrower than what the school has. A school may well have
 * photos on a Facebook page we never reached. So every finding is phrased as
 * "we could not find", never "you do not have" — that is both honest and the
 * only version that survives a parent or head teacher checking it.
 *
 * This is the evidence behind the Get Found pitch: 72 of the 203 schools in
 * the directory have no website at all, and 64 have nothing beyond a phone
 * number.
 */

export interface PresenceCheck {
  key: string;
  label: string;
  ok: boolean;
  /** Written for the school to read, in the email. */
  finding: string;
  /** Weight — the things a parent actually needs come first. */
  weight: number;
}

export interface PresenceAudit {
  score: number;
  max: number;
  percent: number;
  checks: PresenceCheck[];
  missing: PresenceCheck[];
  /** Nothing but a phone number — the strongest Get Found case. */
  phoneOnly: boolean;
}

export function auditPresence(l: Listing): PresenceAudit {
  const hasPhotos = Boolean(l.images && l.images.length);
  const checks: PresenceCheck[] = [
    {
      key: "website",
      label: "Website",
      ok: Boolean(l.website),
      weight: 3,
      finding: "We could not find a website for your school.",
    },
    {
      key: "photos",
      label: "Photos",
      ok: hasPhotos,
      weight: 3,
      finding: "We could not find photos of your school online.",
    },
    {
      key: "email",
      label: "Email",
      ok: Boolean(l.email),
      weight: 2,
      finding: "We could not find an email address for your school.",
    },
    {
      key: "hours",
      label: "Opening hours",
      ok: Boolean(l.hours),
      weight: 2,
      finding: "Your opening and closing times are not published anywhere we could find.",
    },
    {
      key: "fees",
      label: "Fees guidance",
      ok: Boolean(l.feesHint),
      weight: 2,
      finding: "There is no fees guidance online, so parents have to call to ask.",
    },
    {
      key: "curriculum",
      label: "Curriculum",
      ok: Boolean(l.curriculum && l.curriculum.length),
      weight: 1,
      finding: "The curriculum your school follows is not stated anywhere we could find.",
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      ok: Boolean(l.whatsapp),
      weight: 1,
      finding: "There is no WhatsApp number for parents to message you on.",
    },
    {
      key: "address",
      label: "Street address",
      ok: Boolean(l.address),
      weight: 1,
      finding: "We could not find a street address, so parents cannot work out where you are.",
    },
  ];

  const max = checks.reduce((n, c) => n + c.weight, 0);
  const score = checks.filter((c) => c.ok).reduce((n, c) => n + c.weight, 0);
  const missing = checks.filter((c) => !c.ok).sort((a, b) => b.weight - a.weight);

  return {
    score,
    max,
    percent: Math.round((score / max) * 100),
    checks,
    missing,
    phoneOnly: Boolean(l.phone) && !l.website && !l.email && !hasPhotos,
  };
}

/** Short label for the admin list. */
export function presenceBand(percent: number): "weak" | "partial" | "good" {
  if (percent < 40) return "weak";
  if (percent < 75) return "partial";
  return "good";
}
