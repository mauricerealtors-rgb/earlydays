import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyIdToken } from "@/lib/verify-id-token";
import { findListing } from "@/lib/query";
import {
  CALL_STATUSES,
  NEXT_ACTIONS,
  type CallStatus,
  type CrmNote,
  type NextAction,
} from "@/lib/crm";

export const runtime = "nodejs";

const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS ?? "stackflown@gmail.com")
    .split(",")
    .map((e) => e.trim().toLowerCase()),
);

const VALID_STATUS = new Set(CALL_STATUSES.map((s) => s.value));
const VALID_ACTION = new Set(NEXT_ACTIONS.map((a) => a.value));

/** Keep the log readable and the document well under Firestore's 1MB cap. */
const MAX_NOTES = 60;
const MAX_NOTE_CHARS = 2000;

/**
 * Record the outcome of a call.
 *
 * Writes go through the Admin SDK rather than from the browser so the call log
 * cannot be rewritten from a console, and so `schoolContacts` stays readable
 * but never client-writable. One school per request, same as outreach.
 */
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") ?? "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 401 });

    const decoded = await verifyIdToken(token);
    if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    const adminEmail = decoded.email;
    if (!ADMIN_EMAILS.has(adminEmail)) {
      return NextResponse.json({ error: "Not an admin" }, { status: 403 });
    }

    const body = (await req.json()) as {
      slug?: string;
      status?: CallStatus;
      note?: string;
      contactName?: string;
      contactRole?: string;
      nextActionAt?: string | null;
      nextActionType?: NextAction | null;
      logContact?: boolean;
    };

    const slug = String(body.slug ?? "").trim();
    if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    if (!findListing(slug)) {
      return NextResponse.json({ error: "Unknown school" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const update: Record<string, unknown> = {
      slug,
      updatedAt: now,
      updatedBy: adminEmail,
    };

    if (body.status !== undefined) {
      if (!VALID_STATUS.has(body.status)) {
        return NextResponse.json({ error: "Unknown status" }, { status: 400 });
      }
      update.status = body.status;
    }

    if (body.contactName !== undefined) {
      update.contactName = String(body.contactName).trim().slice(0, 120);
    }
    if (body.contactRole !== undefined) {
      update.contactRole = String(body.contactRole).trim().slice(0, 120);
    }

    // A cleared date must actually clear, so null is meaningful here.
    if (body.nextActionAt !== undefined) {
      const v = body.nextActionAt;
      if (v === null || v === "") {
        update.nextActionAt = null;
        update.nextActionType = null;
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(String(v))) {
        update.nextActionAt = String(v);
      } else {
        return NextResponse.json({ error: "Date must be YYYY-MM-DD" }, { status: 400 });
      }
    }
    if (body.nextActionType !== undefined && body.nextActionType !== null) {
      if (!VALID_ACTION.has(body.nextActionType)) {
        return NextResponse.json({ error: "Unknown next action" }, { status: 400 });
      }
      update.nextActionType = body.nextActionType;
    }

    if (body.logContact) update.lastContactedAt = now;

    const db = adminDb();
    const ref = db.doc(`schoolContacts/${slug}`);

    const text = String(body.note ?? "").trim();
    if (text) {
      const snap = await ref.get();
      const existing = (snap.data()?.notes ?? []) as CrmNote[];
      const entry: CrmNote = {
        at: now,
        by: adminEmail,
        text: text.slice(0, MAX_NOTE_CHARS),
      };
      if (body.status) entry.status = body.status;
      // Newest first, so the panel does not have to reverse it to show one.
      update.notes = [entry, ...existing].slice(0, MAX_NOTES);
    }

    await ref.set(update, { merge: true });
    const after = await ref.get();
    return NextResponse.json({ ok: true, record: after.data() });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not save" },
      { status: 500 },
    );
  }
}
