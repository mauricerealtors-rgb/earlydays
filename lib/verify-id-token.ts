/**
 * Verify a Firebase ID token without firebase-admin/auth.
 *
 * Importing firebase-admin/auth kills a Next route on Vercel: the function
 * dies before the handler runs and returns an empty 500, while the same build
 * is fine locally. Isolated with two probe routes — one with no imports
 * returned 200, one importing only firebase-admin/auth returned the empty 500.
 * firebase-admin/firestore is unaffected, so adminDb() stays as it is.
 *
 * Google's identitytoolkit endpoint does the same job over HTTPS: it checks the
 * signature and expiry and hands back the account. The key is the public Web
 * API key, which is safe to hold server-side — it identifies the project, it
 * does not authorise anything on its own.
 */

export interface VerifiedToken {
  uid: string;
  email: string;
  emailVerified: boolean;
}

const ENDPOINT = "https://identitytoolkit.googleapis.com/v1/accounts:lookup";

export async function verifyIdToken(idToken: string): Promise<VerifiedToken | null> {
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!key || !idToken) return null;

  let res: Response;
  try {
    res = await fetch(`${ENDPOINT}?key=${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ idToken }),
      cache: "no-store",
    });
  } catch {
    return null;
  }

  if (!res.ok) return null; // expired, malformed, or from another project
  const data = (await res.json()) as {
    users?: Array<{ localId?: string; email?: string; emailVerified?: boolean }>;
  };
  const user = data.users?.[0];
  if (!user?.localId) return null;

  return {
    uid: user.localId,
    email: (user.email ?? "").toLowerCase(),
    emailVerified: Boolean(user.emailVerified),
  };
}
