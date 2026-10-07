/**
 * Call tracking for school outreach.
 *
 * 200 of the 203 schools have a phone number, which makes calling the fastest
 * route to a claimed listing — faster than email, and the only route at all for
 * the 78 schools with no email address. What that needs is somewhere to record
 * who was called, what they said, and when to try again, because the thing that
 * kills phone outreach is not knowing which half of the list you already rang.
 *
 * Deliberately not a general CRM. There is one pipeline, one owner and a few
 * hundred records, so this is a flat document per school with an append-only
 * note log, not contacts, deals and stages.
 */

export type CallStatus =
  | "not-contacted"
  | "no-answer"
  | "wrong-number"
  | "reached"
  | "interested"
  | "callback"
  | "visit-booked"
  | "not-interested"
  | "do-not-contact";

export type NextAction = "call" | "visit" | "whatsapp" | "email";

export interface CrmNote {
  at: string;              // ISO timestamp
  by: string;              // admin email
  text: string;
  status?: CallStatus;     // what the status was set to with this note
}

export interface CrmRecord {
  slug: string;
  status: CallStatus;
  /** Who we actually spoke to, and their role. The reason the next call works. */
  contactName?: string;
  contactRole?: string;
  lastContactedAt?: string;
  /** Date only (YYYY-MM-DD) — a callback or visit is a day, not a minute. */
  nextActionAt?: string;
  nextActionType?: NextAction;
  notes?: CrmNote[];
  updatedAt: string;
  updatedBy: string;
}

export const CALL_STATUSES: { value: CallStatus; label: string }[] = [
  { value: "not-contacted", label: "Not contacted" },
  { value: "no-answer", label: "No answer" },
  { value: "wrong-number", label: "Wrong number" },
  { value: "reached", label: "Spoke to them" },
  { value: "interested", label: "Interested" },
  { value: "callback", label: "Call back" },
  { value: "visit-booked", label: "Visit booked" },
  { value: "not-interested", label: "Not interested" },
  { value: "do-not-contact", label: "Do not contact" },
];

export const STATUS_LABEL: Record<CallStatus, string> = Object.fromEntries(
  CALL_STATUSES.map((s) => [s.value, s.label]),
) as Record<CallStatus, string>;

/** Dark-admin pill classes, matching the outreach screen. */
export const STATUS_TONE: Record<CallStatus, string> = {
  "not-contacted": "bg-white/10 text-white/50",
  "no-answer": "bg-amber-500/15 text-amber-300",
  "wrong-number": "bg-orange-500/15 text-orange-300",
  reached: "bg-sky-500/15 text-sky-300",
  interested: "bg-emerald-500/15 text-emerald-300",
  callback: "bg-violet-500/15 text-violet-300",
  "visit-booked": "bg-emerald-500/20 text-emerald-200",
  "not-interested": "bg-white/10 text-white/40",
  "do-not-contact": "bg-red-500/15 text-red-300",
};

export const NEXT_ACTIONS: { value: NextAction; label: string }[] = [
  { value: "call", label: "Call again" },
  { value: "visit", label: "Visit" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
];

/** Statuses that mean the school is finished with, either way. */
export const CLOSED: ReadonlySet<CallStatus> = new Set<CallStatus>([
  "not-interested",
  "do-not-contact",
]);

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** A callback or visit that has come due, or is overdue. */
export function isDue(rec: CrmRecord | undefined, today = todayISO()): boolean {
  if (!rec?.nextActionAt) return false;
  if (CLOSED.has(rec.status)) return false;
  return rec.nextActionAt <= today;
}

export function isOverdue(rec: CrmRecord | undefined, today = todayISO()): boolean {
  if (!rec?.nextActionAt) return false;
  if (CLOSED.has(rec.status)) return false;
  return rec.nextActionAt < today;
}

/**
 * A Ghanaian number in the shape a phone dialler wants.
 *
 * Listings hold them as "+233 30 233 5061", "0242806227" and a few other
 * shapes. Returns null rather than guessing at anything that is not a
 * recognisable Ghanaian number, so a tel: link never dials something wrong.
 */
export function dialable(raw: string | undefined): string | null {
  if (!raw) return null;
  const d = raw.replace(/\D/g, "");
  if (d.startsWith("233") && d.length === 12) return `+${d}`;
  if (d.startsWith("0") && d.length === 10) return `+233${d.slice(1)}`;
  if (d.length === 9) return `+233${d}`;
  return null;
}

export function whatsappLink(raw: string | undefined): string | null {
  const n = dialable(raw);
  return n ? `https://wa.me/${n.replace("+", "")}` : null;
}
