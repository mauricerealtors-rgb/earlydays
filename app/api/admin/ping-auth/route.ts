import { getAuth } from "firebase-admin/auth";

export const runtime = "nodejs";

// Temporary probe: imports firebase-admin/auth and nothing else, to confirm
// whether that import is what kills the admin routes on Vercel.
export function GET() {
  return Response.json({ ok: true, probe: "firebase-admin/auth", loaded: typeof getAuth });
}
