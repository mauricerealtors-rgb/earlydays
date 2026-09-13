#!/usr/bin/env node
/**
 * Submit URLs to IndexNow via the deployed /api/indexnow endpoint.
 *
 * Usage:
 *   INDEXNOW_ADMIN_TOKEN=xxx node scripts/indexnow.mjs
 *   INDEXNOW_ADMIN_TOKEN=xxx node scripts/indexnow.mjs https://earlydays.cc/schools/foo https://earlydays.cc/guides/bar
 *   INDEXNOW_ADMIN_TOKEN=xxx SITE_URL=http://localhost:3000 node scripts/indexnow.mjs
 *
 * With no URL args, submits every canonical URL from the site.
 */

const token = process.env.INDEXNOW_ADMIN_TOKEN;
const site = (process.env.SITE_URL || "https://earlydays.cc").replace(
  /\/$/,
  "",
);

if (!token) {
  console.error("Missing INDEXNOW_ADMIN_TOKEN env var.");
  process.exit(1);
}

const urls = process.argv.slice(2);
const body = urls.length > 0 ? JSON.stringify({ urls }) : "{}";

const res = await fetch(`${site}/api/indexnow`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body,
});

const json = await res.json().catch(() => ({}));
console.log(`HTTP ${res.status}`);
console.log(JSON.stringify(json, null, 2));

process.exit(res.ok ? 0 : 1);
