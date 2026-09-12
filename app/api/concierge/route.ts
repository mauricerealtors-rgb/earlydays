import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export const runtime = "nodejs";

const LIMITS = {
  short: 120,
  medium: 240,
  long: 2000,
};

function clean(v: unknown, max = LIMITS.short): string {
  return String(v ?? "").trim().slice(0, max);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parentName = clean(body.parentName);
    const parentEmail = clean(body.parentEmail, LIMITS.medium);
    const parentWhatsapp = clean(body.parentWhatsapp);
    const country = clean(body.country);
    const city = clean(body.city);
    const timeframe = clean(body.timeframe);
    const areas = Array.isArray(body.areas) ? body.areas.slice(0, 10).map((a: unknown) => clean(a)) : [];
    const priorities = Array.isArray(body.priorities) ? body.priorities.slice(0, 20).map((p: unknown) => clean(p)) : [];
    const budgetBand = clean(body.budgetBand);
    const children = Array.isArray(body.children)
      ? body.children.slice(0, 6).map((c: { age?: string; notes?: string }) => ({
          age: clean(c?.age),
          notes: clean(c?.notes, LIMITS.medium),
        }))
      : [];
    const notes = clean(body.notes, LIMITS.long);
    const referral = clean(body.referral);

    if (!parentName || !parentEmail || !parentWhatsapp || !country || children.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(parentEmail)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const db = adminDb();
    const now = new Date().toISOString();
    const ref = await db.collection("conciergeRequests").add({
      parentName,
      parentEmail,
      parentWhatsapp,
      country,
      city,
      timeframe,
      areas,
      priorities,
      budgetBand,
      children,
      notes,
      referral,
      status: "new",
      createdAt: now,
    });

    // Aggregate counter for the admin overview.
    await db.doc("stats/concierge").set(
      {
        total: FieldValue.increment(1),
        [`daily.${now.slice(0, 10)}`]: FieldValue.increment(1),
        updatedAt: now,
      },
      { merge: true }
    );

    return NextResponse.json({ ok: true, id: ref.id });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Submission failed" },
      { status: 500 }
    );
  }
}
