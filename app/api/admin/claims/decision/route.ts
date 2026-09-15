import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getApps } from "firebase-admin/app";

export const runtime = "nodejs";

const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS ?? "stackflown@gmail.com")
    .split(",")
    .map((e) => e.trim().toLowerCase())
);

type Action = "verify" | "approve" | "reject";

/**
 * Claim review.
 *
 * Claims arrive with no account attached (see /api/claim), so the lifecycle is
 *   pending  -> verify  -> verified   (we rang the school, the person checks out)
 *   verified -> approve -> approved   (their account now owns the listing)
 * Approving resolves an email to a Firebase Auth user, so it only succeeds once
 * the claimant has actually signed up. `assignEmail` lets the admin point at a
 * different address when someone registers with one we weren't expecting.
 */
export async function POST(req: Request) {
  try {
    // Verify caller is an authenticated admin.
    const authHeader = req.headers.get("authorization") ?? "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 401 });

    // adminDb() initialises the Admin app; getAuth uses the same app.
    adminDb();
    const adminAuth = getAuth(getApps()[0]);
    const decoded = await adminAuth.verifyIdToken(token);
    const email = (decoded.email ?? "").toLowerCase();
    if (!ADMIN_EMAILS.has(email)) {
      return NextResponse.json({ error: "Not an admin" }, { status: 403 });
    }

    const body = await req.json();
    const { claimId, action, notes, assignEmail } = body as {
      claimId?: string;
      action?: Action;
      notes?: string;
      assignEmail?: string;
    };
    if (!claimId || !action) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (!["verify", "approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Bad action" }, { status: 400 });
    }

    const db = adminDb();
    const now = new Date().toISOString();

    const claimRef = db.doc(`claims/${claimId}`);
    const claimSnap = await claimRef.get();
    if (!claimSnap.exists) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }
    const claim = claimSnap.data() as {
      slug?: string;
      submittedEmail?: string;
      submittedName?: string;
      submittedPhone?: string;
    };
    const slug = claim.slug;
    if (!slug) {
      return NextResponse.json({ error: "Claim has no school" }, { status: 400 });
    }

    if (action === "verify") {
      await claimRef.update({
        status: "verified",
        verifiedAt: now,
        verifiedBy: email,
        reviewNotes: notes ?? "",
      });
      return NextResponse.json({ ok: true, status: "verified" });
    }

    if (action === "reject") {
      await claimRef.update({
        status: "rejected",
        reviewedAt: now,
        reviewedBy: email,
        reviewNotes: notes ?? "",
      });
      return NextResponse.json({ ok: true, status: "rejected" });
    }

    // approve — attach the listing to the claimant's account.
    const target = (assignEmail || claim.submittedEmail || "").trim().toLowerCase();
    if (!target) {
      return NextResponse.json({ error: "Claim has no email to assign to" }, { status: 400 });
    }

    let uid: string;
    try {
      uid = (await adminAuth.getUserByEmail(target)).uid;
    } catch {
      return NextResponse.json(
        {
          error: `No EarlyDays account exists for ${target} yet. Ask them to sign up at /school/login, then approve again.`,
          code: "NO_ACCOUNT",
        },
        { status: 409 }
      );
    }

    // One school = one owner.
    const existingOwner = await db.doc(`listingOwners/${slug}`).get();
    if (existingOwner.exists && existingOwner.data()?.uid !== uid) {
      return NextResponse.json(
        { error: "This listing is already owned by another account." },
        { status: 409 }
      );
    }

    await db.doc(`listingOwners/${slug}`).set({
      slug,
      uid,
      ownerEmail: target,
      approvedAt: now,
      approvedBy: email,
    });

    // The account was created after the claim, so it has no profile doc of its
    // own yet — backfill what the claim told us so admin/schools screens match.
    await db.doc(`users/${uid}`).set(
      {
        email: target,
        displayName: claim.submittedName ?? "",
        phone: claim.submittedPhone ?? null,
        updatedAt: now,
      },
      { merge: true }
    );

    await claimRef.update({
      status: "approved",
      uid,
      assignedEmail: target,
      reviewedAt: now,
      reviewedBy: email,
      reviewNotes: notes ?? "",
    });

    // Seed an empty override doc so the school user can write to it.
    // (Rules check that listingOwners exists, so this is safe.)
    await db.doc(`listingOverrides/${slug}`).set(
      { updatedAt: now, updatedBy: uid },
      { merge: true }
    );

    return NextResponse.json({ ok: true, status: "approved", uid });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Decision failed" },
      { status: 500 }
    );
  }
}
