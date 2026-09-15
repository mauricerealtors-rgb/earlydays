import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getAuth } from "firebase-admin/auth";
import { getApps } from "firebase-admin/app";
import { adminDb } from "@/lib/firebase-admin";
import { findListing } from "@/lib/query";
import { outreachHtml, outreachSubject, outreachText } from "@/lib/outreach";

export const runtime = "nodejs";

const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS ?? "stackflown@gmail.com")
    .split(",")
    .map((e) => e.trim().toLowerCase())
);

const FROM = process.env.OUTREACH_FROM ?? process.env.INBOUND_FORWARD_FROM ?? "";
const SENDER_NAME = process.env.OUTREACH_SENDER_NAME ?? "Maurice Nyamah";
const REPLY_TO = process.env.OUTREACH_REPLY_TO ?? FROM;

type Action = "send" | "save-email" | "skip" | "reset";

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

    adminDb();
    const decoded = await getAuth(getApps()[0]).verifyIdToken(token);
    const adminEmail = (decoded.email ?? "").toLowerCase();
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

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send(
      {
        from: `${SENDER_NAME} <${FROM}>`,
        to,
        replyTo: REPLY_TO,
        subject: outreachSubject(listing),
        html: outreachHtml(listing, SENDER_NAME),
        text: outreachText(listing, SENDER_NAME),
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
