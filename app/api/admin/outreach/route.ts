import { NextResponse } from "next/server";
import { Resend } from "resend";
import { adminDb } from "@/lib/firebase-admin";
import { verifyIdToken } from "@/lib/verify-id-token";
import { findListing } from "@/lib/query";
import {
  DEFAULT_TEMPLATE,
  outreachHtml,
  outreachSubject,
  outreachText,
  type OutreachTemplate,
} from "@/lib/outreach";

export const runtime = "nodejs";

const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS ?? "stackflown@gmail.com")
    .split(",")
    .map((e) => e.trim().toLowerCase())
);

const FROM = process.env.OUTREACH_FROM ?? process.env.INBOUND_FORWARD_FROM ?? "";
const SENDER_NAME = process.env.OUTREACH_SENDER_NAME ?? "Maurice Nyamah";
const REPLY_TO = process.env.OUTREACH_REPLY_TO ?? FROM;

type Action = "send" | "send-bulk" | "save-email" | "skip" | "reset";

/**
 * How many schools one bulk request may touch.
 *
 * Not a performance limit. A new sending domain that suddenly mails fifty
 * strangers gets filtered, and a template mistake found halfway through a
 * blast cannot be recalled, so the cap keeps a bad batch survivable. Send a
 * couple of batches a day rather than the whole list in one go.
 */
const BULK_MAX = 25;

/** Spacing between sends, so a batch does not arrive as one burst. */
const BULK_GAP_MS = 700;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function loadTemplate(
  db: FirebaseFirestore.Firestore,
): Promise<OutreachTemplate> {
  try {
    const snap = await db.doc("settings/outreachTemplate").get();
    const saved = snap.exists ? (snap.data() as OutreachTemplate) : null;
    return saved?.body ? saved : DEFAULT_TEMPLATE;
  } catch {
    return DEFAULT_TEMPLATE;
  }
}

/**
 * School outreach — one school per request, on purpose.
 *
 * There is no bulk send here. A new sending domain that suddenly mails 48
 * strangers gets filtered, and a bad template discovered halfway through a
 * blast cannot be recalled. The admin screen sends one at a time so a mistake
 * costs one school, not the whole list.
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

    const body = await req.json();
    const { slug, action, testTo } = body as {
      slug?: string;
      action?: Action;
      testTo?: string;
    };
    const email = String(body.email ?? "").trim().toLowerCase();

    if (action === "send-bulk") {
      return bulkSend(body.slugs, adminEmail);
    }

    if (!slug || !action) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const listing = findListing(slug);
    if (!listing) return NextResponse.json({ error: "Unknown school" }, { status: 400 });

    const db = adminDb();
    const ref = db.doc(`outreach/${slug}`);
    const now = new Date().toISOString();

    if (action === "save-email") {
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        return NextResponse.json({ error: "Invalid email" }, { status: 400 });
      }
      await ref.set({ slug, email, updatedAt: now, updatedBy: adminEmail }, { merge: true });
      return NextResponse.json({ ok: true, email });
    }

    if (action === "skip") {
      await ref.set(
        { slug, status: "skipped", updatedAt: now, updatedBy: adminEmail },
        { merge: true }
      );
      return NextResponse.json({ ok: true });
    }

    if (action === "reset") {
      await ref.set(
        { slug, status: "pending", updatedAt: now, updatedBy: adminEmail },
        { merge: true }
      );
      return NextResponse.json({ ok: true });
    }

    // send
    if (!process.env.RESEND_API_KEY || !FROM) {
      return NextResponse.json(
        { error: "Sending is not configured. Set RESEND_API_KEY and OUTREACH_FROM." },
        { status: 500 }
      );
    }

    const isTest = Boolean(testTo);
    const snap = await ref.get();
    const stored = snap.data() as { email?: string; status?: string } | undefined;
    const to = isTest ? String(testTo).trim().toLowerCase() : email || stored?.email || "";

    if (!/^\S+@\S+\.\S+$/.test(to)) {
      return NextResponse.json({ error: "No valid email for this school" }, { status: 400 });
    }

    // Guard the irreversible bit: a real school only gets this once unless the
    // admin explicitly resets it first.
    if (!isTest && stored?.status === "sent") {
      return NextResponse.json(
        { error: "Already sent to this school. Reset it first to send again.", code: "ALREADY_SENT" },
        { status: 409 }
      );
    }

    const template = await loadTemplate(db);
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send(
      {
        from: `${SENDER_NAME} <${FROM}>`,
        to,
        replyTo: REPLY_TO,
        subject: outreachSubject(listing, template),
        html: outreachHtml(listing, SENDER_NAME, template),
        text: outreachText(listing, SENDER_NAME, template),
      },
      { idempotencyKey: isTest ? undefined : `outreach_${slug}` }
    );

    if (error) {
      if (!isTest) {
        await ref.set(
          { slug, email: to, status: "failed", error: error.message, updatedAt: now },
          { merge: true }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (isTest) return NextResponse.json({ ok: true, test: true, id: data?.id });

    await ref.set(
      {
        slug,
        email: to,
        status: "sent",
        sentAt: now,
        sentBy: adminEmail,
        messageId: data?.id ?? null,
        error: null,
        updatedAt: now,
      },
      { merge: true }
    );

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Outreach failed" },
      { status: 500 }
    );
  }
}

/**
 * Send to several schools in one request.
 *
 * Sequential, with a gap, and every school reports its own outcome. A batch
 * never fails as a unit: one bad address must not stop the other twenty four,
 * and the caller needs to know exactly which ones went so a retry does not
 * double-send. The already-sent guard still applies per school, so a slug
 * that has had its email simply reports that and is skipped.
 */
async function bulkSend(rawSlugs: unknown, adminEmail: string) {
  if (!process.env.RESEND_API_KEY || !FROM) {
    return NextResponse.json(
      { error: "Sending is not configured. Set RESEND_API_KEY and OUTREACH_FROM." },
      { status: 500 },
    );
  }

  const slugs = Array.isArray(rawSlugs)
    ? [...new Set(rawSlugs.map((s) => String(s)))].slice(0, BULK_MAX)
    : [];
  if (slugs.length === 0) {
    return NextResponse.json({ error: "No schools selected" }, { status: 400 });
  }

  const db = adminDb();
  const template = await loadTemplate(db);
  const resend = new Resend(process.env.RESEND_API_KEY);

  const results: Array<{
    slug: string;
    name: string;
    ok: boolean;
    email?: string;
    reason?: string;
  }> = [];

  for (const [i, slug] of slugs.entries()) {
    const listing = findListing(slug);
    if (!listing) {
      results.push({ slug, name: slug, ok: false, reason: "Unknown school" });
      continue;
    }

    const ref = db.doc(`outreach/${slug}`);
    const snap = await ref.get();
    const stored = snap.data() as { email?: string; status?: string } | undefined;
    const to = (stored?.email || listing.email || "").trim().toLowerCase();
    const now = new Date().toISOString();

    if (stored?.status === "sent") {
      results.push({
        slug,
        name: listing.name,
        ok: false,
        reason: "Already sent, reset it first",
      });
      continue;
    }
    if (!/^\S+@\S+\.\S+$/.test(to)) {
      results.push({ slug, name: listing.name, ok: false, reason: "No email on file" });
      continue;
    }

    if (i > 0) await sleep(BULK_GAP_MS);

    try {
      const { data, error } = await resend.emails.send(
        {
          from: `${SENDER_NAME} <${FROM}>`,
          to,
          replyTo: REPLY_TO,
          subject: outreachSubject(listing, template),
          html: outreachHtml(listing, SENDER_NAME, template),
          text: outreachText(listing, SENDER_NAME, template),
        },
        { idempotencyKey: `outreach_${slug}` },
      );

      if (error) {
        await ref.set(
          { slug, email: to, status: "failed", error: error.message, updatedAt: now },
          { merge: true },
        );
        results.push({ slug, name: listing.name, ok: false, email: to, reason: error.message });
        continue;
      }

      await ref.set(
        {
          slug,
          email: to,
          status: "sent",
          sentAt: now,
          sentBy: adminEmail,
          messageId: data?.id ?? null,
          error: null,
          updatedAt: now,
        },
        { merge: true },
      );
      results.push({ slug, name: listing.name, ok: true, email: to });
    } catch (err) {
      const reason = err instanceof Error ? err.message : "Send failed";
      await ref.set(
        { slug, email: to, status: "failed", error: reason, updatedAt: now },
        { merge: true },
      );
      results.push({ slug, name: listing.name, ok: false, email: to, reason });
    }
  }

  return NextResponse.json({
    ok: true,
    sent: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    results,
  });
}
