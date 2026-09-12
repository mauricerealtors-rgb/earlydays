import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export const runtime = "nodejs";

// Basic input sanity limits — protects against runaway payloads.
const LIMITS = {
  name: 120,
  email: 200,
  phone: 40,
  message: 2000,
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const slug = String(body.slug ?? "").trim();
    const parentName = String(body.parentName ?? "").trim().slice(0, LIMITS.name);
    const parentEmail = String(body.parentEmail ?? "").trim().slice(0, LIMITS.email);
    const parentPhone = String(body.parentPhone ?? "").trim().slice(0, LIMITS.phone);
    const message = String(body.message ?? "").trim().slice(0, LIMITS.message);

    if (!slug || !parentName || !parentEmail || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    // Naive email shape check.
    if (!/^\S+@\S+\.\S+$/.test(parentEmail)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const db = adminDb();
    const now = new Date().toISOString();

    // Write the enquiry.
    const ref = await db.collection("enquiries").add({
      slug,
      parentName,
      parentEmail,
      parentPhone: parentPhone || null,
      message,
      createdAt: now,
      readAt: null,
    });

    // Increment the enquiries counter on stats/{slug}.
    await db.doc(`stats/${slug}`).set(
      {
        slug,
        enquiries: FieldValue.increment(1),
        [`daily.${now.slice(0, 10)}.enquiries`]: FieldValue.increment(1),
        updatedAt: now,
      },
      { merge: true }
    );

    return NextResponse.json({ ok: true, id: ref.id });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Enquiry failed" },
      { status: 500 }
    );
  }
}
