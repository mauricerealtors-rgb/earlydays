/**
 * What it costs a school to run its own profile.
 *
 * One place, because the figure appears on the claim confirmation, in the
 * claim record we write to Firestore, and eventually in a Paystack call, and
 * a price that is written out separately in three files is how a price rise
 * ends up charging the old amount.
 *
 * Deliberately NOT exported to any public page. Being listed stays free and
 * always will: we add schools ourselves and nobody pays for that. What is
 * charged for is taking control of the listing, which is a different thing,
 * and the number is shown only once a school has actually asked to do it.
 */

export const MEMBERSHIP = {
  /** Cedis per year. */
  amount: 990,
  currency: "GH₵",
  period: "a year",
} as const;

/** What a school is actually buying. Shown beside the price, never alone. */
export const MEMBERSHIP_INCLUDES = [
  "Edit everything: description, programmes, ages, hours, fees, admissions status",
  "Upload your own photographs, as many as you need",
  "Parent enquiries land in your inbox and on your phone",
  "See who viewed your profile, who called, who tapped WhatsApp",
  "The verified badge, so parents know the school keeps this page itself",
  "Your fees on the page, which is the thing parents search for most",
] as const;

/**
 * Mobile money, until Paystack is wired up.
 *
 * The reference is the school's own name rather than a generated code: a
 * proprietor sending money on a feature phone will type something they
 * already know, and a generated code is one more thing to get wrong.
 */
export const MOMO = {
  number: "0597788056",
  network: "MTN",
  name: "EarlyDays",
} as const;

/** Digits only, for a tel: or wa.me link. */
export function momoWhatsApp(): string {
  return `https://wa.me/233${MOMO.number.replace(/\D/g, "").replace(/^0/, "")}`;
}
