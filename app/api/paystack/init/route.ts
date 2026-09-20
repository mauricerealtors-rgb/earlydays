import { NextResponse } from "next/server";
import { SITE } from "@/lib/site";
import { BILLING_MONTHS, findPlan, yearlyAmountPesewas, type Tier } from "@/lib/plans";

export async function POST(req: Request) {
  try {
    const { slug, tier, email, uid } = await req.json();

    if (!slug || !tier || !email || !uid) {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }
    // Prices are quoted per month but taken a year at a time, so the amount
    // here is twelve months — never the headline figure on the card.
    const amount = yearlyAmountPesewas(tier as Tier);
    const plan = findPlan(tier as Tier);
    if (!amount || !plan) {
      return NextResponse.json({ error: "Unknown tier." }, { status: 400 });
    }

    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return NextResponse.json(
        { error: "Payments are not configured yet. Try again shortly." },
        { status: 503 }
      );
    }

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
          billingMonths: BILLING_MONTHS,
          monthlyPrice: plan.monthly,
          product: "earlydays_school_subscription",
        },
        // Setting label for the customer-facing receipt.
        label: `EarlyDays ${plan.name} — ${slug} (12 months)`,
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
