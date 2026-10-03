import type { Vendor } from "@/lib/types";

/**
 * Turn whatever a baker published into a WhatsApp link.
 *
 * Bakers publish a number in half a dozen shapes — "0244 885 454",
 * "+233 24 884 1866", or a wa.me link with no plain number anywhere. WhatsApp
 * needs the international form with no punctuation, so local 0-prefixed numbers
 * become 233 + the rest. Returns null rather than guessing at anything that
 * does not look like a Ghanaian mobile.
 */
export function whatsappUrl(vendor: Vendor): string | null {
  const raw = vendor.whatsapp;
  if (!raw) return null;
  if (raw.startsWith("http")) return raw;

  const digits = raw.replace(/\D/g, "");
  let msisdn: string;
  if (digits.startsWith("233")) msisdn = digits;
  else if (digits.startsWith("0")) msisdn = `233${digits.slice(1)}`;
  else if (digits.length === 9) msisdn = `233${digits}`;
  else return null;

  // Ghanaian mobile numbers are 233 plus nine digits.
  if (msisdn.length !== 12) return null;
  return `https://wa.me/${msisdn}`;
}

export function telUrl(raw: string | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("233")) return `tel:+${digits}`;
  if (digits.startsWith("0")) return `tel:+233${digits.slice(1)}`;
  return null;
}

/** Whether a buyer can actually reach this baker from the profile. */
export function isContactable(v: Vendor): boolean {
  return Boolean(v.phone || v.whatsapp || v.instagram || v.facebook || v.email);
}
