import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { findListing } from "@/lib/query";

export const runtime = "nodejs";

const LIMITS = { short: 120, medium: 240 };

function clean(v: unknown, max = LIMITS.short): string {
  return String(v ?? "").trim().slice(0, max);
}

/**
 * Public claim submission (no account required).
 *
 * A claim is a lead, not an identity: we take contact details, ring the
 * school's own switchboard to verify the person really works there, and only
 * then do they create an account. Ownership is attached to that account
 * afterwards from /admin/claims. Creating the Firebase Auth user up front
 * bought us nothing — anyone can self-serve an account — while leaving junk
 * accounts behind for every abandoned or rejected claim.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const slug = clean(body.slug);
    const submittedName = clean(body.submittedName);
    const submittedRole = clean(body.submittedRole);
    const submittedEmail = clean(body.submittedEmail, LIMITS.medium).toLowerCase();
    const submittedPhone = clean(body.submittedPhone);
    const schoolPhone = clean(body.schoolPhone);
    const schoolEmail = clean(body.schoolEmail, LIMITS.medium).toLowerCase();

    if (!slug || !findListing(slug)) {
      return NextResponse.json({ error: "Unknown school" }, { status: 400 });
    }
    if (!submittedName || !submittedRole || !submittedEmail || !submittedPhone || !schoolPhone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(submittedEmail)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (schoolEmail && !/^\S+@\S+\.\S+$/.test(schoolEmail)) {
      return NextResponse.json({ error: "Invalid school email" }, { status: 400 });
    }

    const db = adminDb();

    // One school, one owner — don't take a claim for a listing already assigned.
    const owner = await db.doc(`listingOwners/${slug}`).get();
    if (owner.exists) {
      return NextResponse.json(
        { error: "This school has already been claimed. Contact us if that looks wrong." },
        { status: 409 }
      );
    }

    // Collapse repeat submissions from the same person for the same school
    // rather than making the admin triage duplicates.
    const dupe = await db
      .collection("claims")
      .where("slug", "==", slug)
      .where("submittedEmail", "==", submittedEmail)
      .where("status", "in", ["pending", "verified"])
      .limit(1)
      .get();
    if (!dupe.empty) {
      return NextResponse.json({ ok: true, id: dupe.docs[0].id, duplicate: true });
    }

    const now = new Date().toISOString();
    const ref = await db.collection("claims").add({
      slug,
      submittedName,
      submittedRole,
      submittedEmail,
      submittedPhone,
      schoolPhone,
      schoolEmail: schoolEmail || null,
      // uid is attached later, once they have an account and we assign it.
      uid: null,
      status: "pending",
      createdAt: now,
    });

    return NextResponse.json({ ok: true, id: ref.id });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Submission failed" },
      { status: 500 }
    );
  }
}
