import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { Resend } from "resend";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";

/**
 * Inbound mail forwarder.
 *
 * Resend receives mail for earlydays.cc (root MX) and stores it, but it has no
 * dashboard forwarding — inbound is delivered as an `email.received` webhook and
 * otherwise just sits in their Emails view. This route is the missing hop: it
 * verifies the webhook, then hands the message straight back to Resend's
 * forward() helper, which re-sends it (attachments included) to a real mailbox.
 */

const WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET ?? "";
const FORWARD_TO = process.env.INBOUND_FORWARD_TO ?? "";
const FORWARD_FROM = process.env.INBOUND_FORWARD_FROM ?? `mail@${SITE.domain}`;

// Svix (which Resend uses) signs `${id}.${timestamp}.${body}` with HMAC-SHA256
// keyed on the base64 body of the whsec_ secret.
function verify(raw: string, headers: Headers): boolean {
  const id = headers.get("svix-id");
  const timestamp = headers.get("svix-timestamp");
  const signature = headers.get("svix-signature");
  if (!id || !timestamp || !signature || !WEBHOOK_SECRET) return false;

  // Reject replays. The timestamp is seconds since epoch.
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return false;

  const key = Buffer.from(WEBHOOK_SECRET.replace(/^whsec_/, ""), "base64");
  const expected = crypto
    .createHmac("sha256", key)
    .update(`${id}.${timestamp}.${raw}`)
    .digest("base64");

  // The header carries a space-delimited list of `v1,<sig>` pairs — any may match.
  return signature.split(" ").some((part) => {
    const sig = part.split(",")[1];
    if (!sig) return false;
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  });
}

export async function POST(req: Request) {
  const raw = await req.text();

  if (!verify(raw, req.headers)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  if (!process.env.RESEND_API_KEY || !FORWARD_TO) {
    // Nothing to forward to — accept so Resend stops retrying, but say so.
    return NextResponse.json({ ok: true, skipped: "not configured" });
  }

  let event: { type?: string; data?: { email_id?: string; from?: string } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Bad payload" }, { status: 400 });
  }

  if (event.type !== "email.received") {
    return NextResponse.json({ ok: true, ignored: event.type ?? "unknown" });
  }

  const emailId = event.data?.email_id;
  if (!emailId) {
    return NextResponse.json({ error: "No email_id" }, { status: 400 });
  }

  // Forwarding has to send *from* our own verified domain, so a reply to a
  // forwarded message lands back on this webhook. Dropping anything already
  // from us stops that going round in circles.
  const sender = (event.data?.from ?? "").toLowerCase();
  if (sender.includes(`@${SITE.domain}`)) {
    return NextResponse.json({ ok: true, skipped: "loop guard" });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.receiving.forward(
    {
      emailId,
      to: FORWARD_TO,
      from: FORWARD_FROM,
    },
    // Webhook delivery retries on any non-2xx, so pin the send to the inbound
    // message and let Resend collapse duplicates instead of double-delivering.
    { idempotencyKey: `inbound_${emailId}` }
  );

  if (error) {
    // Non-2xx so the webhook is retried rather than silently dropping mail.
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data?.id });
}
