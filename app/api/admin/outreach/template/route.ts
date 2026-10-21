import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyIdToken } from "@/lib/verify-id-token";
import { DEFAULT_TEMPLATE, type OutreachTemplate } from "@/lib/outreach";

export const runtime = "nodejs";

const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS ?? "stackflown@gmail.com")
    .split(",")
    .map((e) => e.trim().toLowerCase()),
);

const DOC = "settings/outreachTemplate";
const MAX_SUBJECT = 200;
const MAX_BODY = 8000;

/**
 * The editable outreach email.
 *
 * Read and written through this route rather than from the browser, on
 * purpose: the client would otherwise need a rules entry for settings/, and
 * the rules in this repo have never been deployed. Going through the Admin
 * SDK means the editor works today instead of after a deploy nobody has run.
 */

async function requireAdmin(req: Request): Promise<string | null> {
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) return null;
  const decoded = await verifyIdToken(token);
  if (!decoded) return null;
  const email = decoded.email?.toLowerCase() ?? "";
  return ADMIN_EMAILS.has(email) ? email : null;
}

export async function GET(req: Request) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Not an admin" }, { status: 403 });

  try {
    const snap = await adminDb().doc(DOC).get();
    const saved = snap.exists ? (snap.data() as OutreachTemplate) : null;
    return NextResponse.json({
      template: saved?.body ? saved : DEFAULT_TEMPLATE,
      isDefault: !saved?.body,
      default: DEFAULT_TEMPLATE,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not load template" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Not an admin" }, { status: 403 });

  try {
    const body = await req.json();

    if (body.action === "reset") {
      await adminDb().doc(DOC).delete();
      return NextResponse.json({ template: DEFAULT_TEMPLATE, isDefault: true });
    }

    const subject = String(body.subject ?? "").trim().slice(0, MAX_SUBJECT);
    const text = String(body.body ?? "").trim().slice(0, MAX_BODY);

    if (!subject || !text) {
      return NextResponse.json(
        { error: "Subject and body are both required" },
        { status: 400 },
      );
    }
    // The claim link is the only thing the email exists to deliver. Saving a
    // template without it would send a perfectly worded dead end.
    if (!text.includes("{{cta}}") && !text.includes("{{claimUrl}}")) {
      return NextResponse.json(
        {
          error:
            "The body needs {{cta}} or {{claimUrl}} somewhere, otherwise the email has no way to claim.",
        },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();
    await adminDb()
      .doc(DOC)
      .set({ subject, body: text, updatedAt: now, updatedBy: admin });

    return NextResponse.json({
      template: { subject, body: text, updatedAt: now, updatedBy: admin },
      isDefault: false,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not save template" },
      { status: 500 },
    );
  }
}
