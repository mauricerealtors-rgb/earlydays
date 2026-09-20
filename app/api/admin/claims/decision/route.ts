import { NextResponse } from "next/server";
import { Resend } from "resend";
import { adminDb } from "@/lib/firebase-admin";
import { verifyIdToken } from "@/lib/verify-id-token";
import { createAccount, temporaryPassword } from "@/lib/firebase-rest-auth";
import { findListing } from "@/lib/query";
import { welcomeHtml, welcomeSubject, welcomeText } from "@/lib/welcome-email";

export const runtime = "nodejs";

const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS ?? "stackflown@gmail.com")
    .split(",")
    .map((e) => e.trim().toLowerCase())
);

const FROM = process.env.OUTREACH_FROM ?? process.env.INBOUND_FORWARD_FROM ?? "";
const SENDER_NAME = process.env.OUTREACH_SENDER_NAME ?? "Maurice Nyamah";
const REPLY_TO = process.env.OUTREACH_REPLY_TO ?? FROM;

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

    const decoded = await verifyIdToken(token);
    if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    const email = decoded.email;
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

    // Resolved through the users collection rather than firebase-admin/auth,
    // which cannot be imported here (see lib/verify-id-token). Signing up
    // writes users/{uid} with the address, so this is the same lookup.
    const userSnap = await db
      .collection("users")
      .where("email", "==", target)
      .limit(1)
      .get();

    let uid: string;
    let tempPassword: string | undefined;

    if (!userSnap.empty) {
      uid = userSnap.docs[0].id;
    } else {
      // Nobody should have to go and register before they can be handed the
      // profile they already rang us about. Make the account for them and mail
      // the password; they change it from the sign-in page whenever they like.
      const created = await createAccount(target, temporaryPassword());
      if (!created.ok) {
        if (created.reason === "EMAIL_EXISTS") {
          // Registered with Firebase but no users doc — nothing here can map
          // the address to a uid, so it needs doing by hand.
          return NextResponse.json(
            {
              error: `${target} already has a sign-in but no profile record, so it cannot be matched automatically. Ask them to sign in once at /school/login, then assign again.`,
              code: "ORPHAN_ACCOUNT",
            },
            { status: 409 }
          );
        }
        return NextResponse.json(
          { error: `Could not create an account for ${target}: ${created.message}` },
          { status: 500 }
        );
      }
      uid = created.account.uid;
      tempPassword = created.account.password;
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

    // Hand-over email. The assignment above is already committed, so a mail
    // failure is reported rather than thrown — re-sending is a button, redoing
    // the assignment is not.
    let emailed = false;
    let emailError: string | null = null;
    const listing = findListing(slug);
    if (!process.env.RESEND_API_KEY || !FROM) {
      emailError = "Sending is not configured (RESEND_API_KEY / OUTREACH_FROM).";
    } else if (!listing) {
      emailError = "No listing found for this slug.";
    } else {
      const opts = {
        schoolName: listing.name,
        slug,
        email: target,
        tempPassword,
        senderName: SENDER_NAME,
      };
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error: sendError } = await resend.emails.send({
        from: `${SENDER_NAME} <${FROM}>`,
        to: target,
        replyTo: REPLY_TO,
        subject: welcomeSubject(listing.name),
        html: welcomeHtml(opts),
        text: welcomeText(opts),
      });
      if (sendError) emailError = sendError.message;
      else emailed = true;
    }

    await claimRef.update({
      welcomeEmailedAt: emailed ? now : null,
      welcomeEmailError: emailError,
      accountCreated: Boolean(tempPassword),
    });

    return NextResponse.json({
      ok: true,
      status: "approved",
      uid,
      accountCreated: Boolean(tempPassword),
      emailed,
      emailError,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Decision failed" },
      { status: 500 }
    );
  }
}
