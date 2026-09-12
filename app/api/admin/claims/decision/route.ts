import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getApps } from "firebase-admin/app";

export const runtime = "nodejs";

const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS ?? "support@sellquic.com,mauricerealtors@gmail.com")
    .split(",")
    .map((e) => e.trim().toLowerCase())
);

export async function POST(req: Request) {
  try {
    // Verify caller is an authenticated admin.
    const authHeader = req.headers.get("authorization") ?? "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 401 });

    // adminDb() initialises the Admin app; getAuth uses the same app.
    adminDb();
    const decoded = await getAuth(getApps()[0]).verifyIdToken(token);
    const email = (decoded.email ?? "").toLowerCase();
    if (!ADMIN_EMAILS.has(email)) {
      return NextResponse.json({ error: "Not an admin" }, { status: 403 });
    }

    const body = await req.json();
    const { claimId, slug, uid, action, notes } = body as {
      claimId?: string;
      slug?: string;
      uid?: string;
      action?: "approve" | "reject";
      notes?: string;
    };
    if (!claimId || !slug || !uid || !action) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (action !== "approve" && action !== "reject") {
      return NextResponse.json({ error: "Bad action" }, { status: 400 });
    }

    const db = adminDb();
    const now = new Date().toISOString();

    if (action === "approve") {
      // Check for existing owner — one school = one owner.
      const existingOwner = await db.doc(`listingOwners/${slug}`).get();
      if (existingOwner.exists && existingOwner.data()?.uid !== uid) {
        return NextResponse.json(
          { error: "This listing is already owned by another user." },
          { status: 409 }
        );
      }
      await db.doc(`listingOwners/${slug}`).set({
        slug,
        uid,
        approvedAt: now,
        approvedBy: email,
      });
      await db.doc(`claims/${claimId}`).update({
        status: "approved",
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
    } else {
      await db.doc(`claims/${claimId}`).update({
        status: "rejected",
        reviewedAt: now,
        reviewedBy: email,
        reviewNotes: notes ?? "",
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Decision failed" },
      { status: 500 }
    );
  }
}
