import { NextResponse } from "next/server";
import { SITE } from "@/lib/site";

const PLAN_AMOUNTS: Record<string, number> = {
  verified: 20000, // GH₵200.00 in pesewas
  featured: 50000, // GH₵500.00 in pesewas
};

export async function POST(req: Request) {
  try {
    const { slug, tier, email, uid } = await req.json();

    if (!slug || !tier || !email || !uid) {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }
    if (!(tier in PLAN_AMOUNTS)) {
      return NextResponse.json({ error: "Unknown tier." }, { status: 400 });
    }

    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return NextResponse.json(
        { error: "Payments are not configured yet. Try again shortly." },
        { status: 503 }
      );
    }

    const amount = PLAN_AMOUNTS[tier];
    const callbackUrl = `${SITE.url}/school/${slug}/billing?checkout=return`;

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount,
        currency: "GHS",
        callback_url: callbackUrl,
        metadata: {
          slug,
          tier,
          uid,
          product: "earlydays_school_subscription",
        },
        // Setting label for the customer-facing receipt.
        label: `EarlyDays ${tier} — ${slug}`,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.status) {
      return NextResponse.json(
        { error: data.message ?? "Paystack rejected the request." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      authorizationUrl: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error." },
      { status: 500 }
    );
  }
}
