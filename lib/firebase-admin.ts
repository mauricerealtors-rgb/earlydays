import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

/**
 * Server-only Firebase Admin SDK — used by API routes that must bypass
 * client-side security rules (Paystack webhook, tracking counters,
 * parent enquiry submissions, admin claim approvals).
 *
 * Requires a service-account JSON. On Vercel, paste the JSON contents
 * into FIREBASE_SERVICE_ACCOUNT_JSON as a single-line string.
 */

let cached: App | null = null;

function admin(): App {
  if (cached) return cached;
  if (getApps().length) {
    cached = getApps()[0];
    return cached;
  }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_JSON is not set. Add the service-account " +
        "JSON to Vercel env vars."
    );
  }
  const svc = JSON.parse(raw);
  cached = initializeApp({
    credential: cert({
      projectId: svc.project_id,
      clientEmail: svc.client_email,
      privateKey: svc.private_key.replace(/\\n/g, "\n"),
    }),
  });
  return cached;
}

export function adminDb(): Firestore {
  return getFirestore(admin());
}
