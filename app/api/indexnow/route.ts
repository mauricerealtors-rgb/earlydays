import { NextResponse } from "next/server";
import { SITE } from "@/lib/site";
import { allSiteUrls } from "@/lib/all-urls";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const INDEXNOW_KEY = "876685ff16541a4dd7974436e532de6a";
const INDEXNOW_HOST = "earlydays.cc";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const KEY_LOCATION = `${SITE.url}/${INDEXNOW_KEY}.txt`;

/**
 * Submits URLs to IndexNow (Bing/Yandex/Naver/Seznam/Yep).
 *
 * Usage:
 *   POST /api/indexnow
 *     Header: Authorization: Bearer <INDEXNOW_ADMIN_TOKEN>
 *     Body:   { urls?: string[] }   // optional; defaults to all site URLs
 *
 * If no urls are provided, submits every canonical URL from
 * lib/all-urls.ts. IndexNow accepts up to 10,000 URLs per request.
 */
export async function POST(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "").trim();
  const expected = process.env.INDEXNOW_ADMIN_TOKEN;
  if (!expected || token !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { urls?: string[] } = {};
  try {
    body = await req.json();
  } catch {
    // no body is fine — we'll default to all URLs
  }

  const urls =
    Array.isArray(body.urls) && body.urls.length > 0
      ? body.urls.filter((u) => typeof u === "string" && u.startsWith(SITE.url))
      : allSiteUrls();

  if (urls.length === 0) {
    return NextResponse.json({ error: "No URLs to submit" }, { status: 400 });
  }

  const payload = {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls.slice(0, 10000),
  };

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  const text = await res.text().catch(() => "");
  return NextResponse.json(
    {
      ok: res.ok,
      status: res.status,
      submitted: urls.length,
      indexNowResponse: text || null,
    },
    { status: res.ok ? 200 : 502 },
  );
}

export async function GET() {
  return NextResponse.json({
    keyLocation: KEY_LOCATION,
    totalUrls: allSiteUrls().length,
    hint: "POST with Bearer INDEXNOW_ADMIN_TOKEN to submit.",
  });
}
