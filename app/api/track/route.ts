import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

type Event = "view" | "call" | "whatsapp" | "website" | "email";

const EVENT_TO_COUNTER: Record<Event, string> = {
  view: "views",
  call: "calls",
  whatsapp: "whatsapps",
  website: "websiteClicks",
  email: "emails",
};

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { slug, event } = (await req.json()) as { slug?: string; event?: Event };
    if (!slug || !event || !(event in EVENT_TO_COUNTER)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const counter = EVENT_TO_COUNTER[event];
    const today = new Date().toISOString().slice(0, 10);
    const dailyKey = event === "view" ? "views" : "contacts";

    await adminDb().doc(`stats/${slug}`).set(
      {
        slug,
        [counter]: FieldValue.increment(1),
        [`daily.${today}.${dailyKey}`]: FieldValue.increment(1),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Track failed" },
      { status: 500 }
    );
  }
}
