import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { adminDb } from "@/lib/firebase-admin";

/**
 * Paystack sends webhook events (charge.success, subscription.create,
 * subscription.disable, etc.) to this endpoint. Each request is signed
 * with HMAC-SHA512 using the Paystack secret key — we verify before acting.
 *
 * Paystack docs: https://paystack.com/docs/payments/webhooks
 */

export const runtime = "nodejs"; // crypto module needs Node runtime

export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const raw = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  const expected = crypto
    .createHmac("sha512", secret)
    .update(raw)
    .digest("hex");

  if (signature !== expected) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(raw) as {
    event: string;
    data: {
      reference?: string;
      amount?: number;
      customer?: { customer_code?: string; email?: string };
      metadata?: { slug?: string; tier?: string; uid?: string; product?: string };
      subscription_code?: string;
      status?: string;
      next_payment_date?: string;
    };
  };

  const db = adminDb();
  const now = new Date().toISOString();

  const meta = event.data.metadata ?? {};
  const slug = meta.slug;
  if (!slug) {
    // Not an EarlyDays subscription event — acknowledge and ignore.
    return NextResponse.json({ ok: true, ignored: true });
  }

  switch (event.event) {
    case "charge.success": {
      const tier = (meta.tier === "featured" ? "featured" : "verified") as
        | "verified"
        | "featured";
      // Extend by 30 days on each successful charge.
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      await db.doc(`subscriptions/${slug}`).set(
        {
          slug,
          tier,
          status: "active",
          paystackReference: event.data.reference ?? null,
          paystackCustomerCode: event.data.customer?.customer_code ?? null,
          startedAt: now,
          expiresAt,
          updatedAt: now,
        },
        { merge: true }
      );
      break;
    }
    case "subscription.create": {
      await db.doc(`subscriptions/${slug}`).set(
        {
          slug,
          paystackSubscriptionCode: event.data.subscription_code ?? null,
          status: "active",
          expiresAt: event.data.next_payment_date ?? null,
          updatedAt: now,
        },
        { merge: true }
      );
      break;
    }
    case "subscription.disable":
    case "subscription.not_renew":
    case "invoice.payment_failed": {
      await db.doc(`subscriptions/${slug}`).set(
        {
          slug,
          status: event.event === "subscription.disable" ? "cancelled" : "past-due",
          updatedAt: now,
        },
        { merge: true }
      );
      break;
    }
    default:
      // Unhandled — acknowledge so Paystack doesn't retry.
      break;
  }

  return NextResponse.json({ ok: true });
}
