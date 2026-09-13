import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export const runtime = "nodejs";

const MAX = { short: 120, medium: 240, long: 2000 };

function clean(v: unknown, max = MAX.short): string {
  return String(v ?? "").trim().slice(0, max);
}

const ALLOWED_PLANS = new Set(["starter", "professional", "complete"]);
const ALLOWED_MODES = new Set(["book", "message"]);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const mode = clean(body.mode);
    const plan = clean(body.plan);
    const schoolName = clean(body.schoolName);
    const contactName = clean(body.contactName);
    const phone = clean(body.phone);
    const email = clean(body.email, MAX.medium);
    const message = clean(body.message, MAX.long);
    const date = clean(body.date);
    const time = clean(body.time);

    if (!ALLOWED_MODES.has(mode)) {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }
    if (!ALLOWED_PLANS.has(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }
    if (!schoolName || !contactName || !phone) {
      return NextResponse.json(
        { error: "School name, contact and phone are required" },
        { status: 400 },
      );
    }
    if (mode === "book" && (!date || !time)) {
      return NextResponse.json(
        { error: "Date and time are required for a call" },
        { status: 400 },
      );
    }
    if (mode === "message" && !message) {
      return NextResponse.json(
        { error: "Please include a short message" },
        { status: 400 },
      );
    }

    const db = adminDb();
    const now = new Date().toISOString();
    const ref = await db.collection("schoolServiceEnquiries").add({
      mode,
      plan,
      schoolName,
      contactName,
      phone,
      email,
      message,
      date,
      time,
      status: "new",
      createdAt: now,
    });

    await db.doc("stats/schoolServiceEnquiries").set(
      {
        total: FieldValue.increment(1),
        [`byPlan.${plan}`]: FieldValue.increment(1),
        [`byMode.${mode}`]: FieldValue.increment(1),
        [`daily.${now.slice(0, 10)}`]: FieldValue.increment(1),
        updatedAt: now,
      },
      { merge: true },
    );

    return NextResponse.json({ ok: true, id: ref.id });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Submission failed" },
      { status: 500 },
    );
  }
}
