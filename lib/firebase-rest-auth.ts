import { randomInt } from "node:crypto";

/**
 * Account creation over Google's identitytoolkit REST API.
 *
 * firebase-admin/auth cannot be imported in a route here — it kills the
 * function on Vercel before the handler runs (see lib/verify-id-token). This
 * covers the one thing we need from it: making an account for a school once we
 * have verified them by phone, so they never have to sign themselves up.
 */

const SIGNUP = "https://identitytoolkit.googleapis.com/v1/accounts:signUp";

export interface CreatedAccount {
  uid: string;
  password: string;
}

/**
 * Readable temporary password: no ambiguous characters, grouped so it can be
 * dictated over the phone if the email goes astray.
 */
export function temporaryPassword(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I, O, 0, 1
  const pick = () => alphabet[randomInt(0, alphabet.length)];
  const group = () => Array.from({ length: 4 }, pick).join("");
  return `${group()}-${group()}-${group()}`;
}

export type CreateAccountResult =
  | { ok: true; account: CreatedAccount }
  | { ok: false; reason: "EMAIL_EXISTS" | "NOT_CONFIGURED" | "FAILED"; message: string };

export async function createAccount(
  email: string,
  password: string
): Promise<CreateAccountResult> {
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!key) {
    return { ok: false, reason: "NOT_CONFIGURED", message: "Firebase API key is not set." };
  }

  let res: Response;
  try {
    res = await fetch(`${SIGNUP}?key=${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      // returnSecureToken:false — we only want the account, never a session.
      body: JSON.stringify({ email, password, returnSecureToken: false }),
      cache: "no-store",
    });
  } catch (err) {
    return { ok: false, reason: "FAILED", message: err instanceof Error ? err.message : "Network error" };
  }

  const data = (await res.json().catch(() => ({}))) as {
    localId?: string;
    error?: { message?: string };
  };

  if (!res.ok) {
    const code = data.error?.message ?? "FAILED";
    if (code.startsWith("EMAIL_EXISTS")) {
      return { ok: false, reason: "EMAIL_EXISTS", message: "An account already exists for that email." };
    }
    return { ok: false, reason: "FAILED", message: code };
  }
  if (!data.localId) {
    return { ok: false, reason: "FAILED", message: "No account id returned." };
  }

  return { ok: true, account: { uid: data.localId, password } };
}
