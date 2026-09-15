import { SITE } from "@/lib/site";
import { findLocation } from "@/data/locations";
import type { Listing } from "@/lib/types";

/**
 * Cold outreach email sent to unclaimed schools.
 *
 * Deliberately close to plain text. A new sending domain mailing schools that
 * never opted in is exactly the profile spam filters distrust, and image-heavy
 * template HTML makes it worse — so this is a few paragraphs, two links, and no
 * tracking pixel or webfont.
 *
 * The hook is "check this is correct", not "claim your free listing": people
 * ignore a free offer but rarely ignore possibly-wrong public information about
 * their own school.
 */

export function outreachSubject(listing: Listing): string {
  return `${listing.name}'s profile on EarlyDays — please check it's correct`;
}

export function outreachPreheader(): string {
  return "Free to claim. Takes about a minute — no account needed.";
}

function area(listing: Listing): string {
  return findLocation(listing.neighbourhood)?.name ?? listing.neighbourhood;
}

export function outreachText(listing: Listing, senderName: string): string {
  const profile = `${SITE.url}/schools/${listing.slug}`;
  const claim = `${SITE.url}/claim/${listing.slug}`;
  return `Hello,

We've built a profile for ${listing.name} on EarlyDays, a directory helping Ghanaian parents find and compare schools. It's live now:

${profile}

We compiled it from publicly available information, so some details may be out of date. We'd rather you correct it than leave parents reading something wrong.

Claiming the profile is free and lets you:

- Correct your description, fees guidance, and contact details
- Add your own photos of the school
- List your programmes, age ranges, and admissions status
- Receive enquiries directly from parents viewing your profile

Review and claim ${listing.name}:
${claim}

There's no password to set up. Fill in a short form, and we'll call your office line within one working day to confirm you work at the school before handing over access.

If you'd prefer we remove the listing instead, reply to this email and we'll take it down.

Warm regards,
${senderName}
EarlyDays · ${SITE.domain}

P.S. Parents are searching for schools in ${area(listing)} right now. If anything on your profile is wrong, that's what they're seeing.
`;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function outreachHtml(listing: Listing, senderName: string): string {
  const profile = `${SITE.url}/schools/${listing.slug}`;
  const claim = `${SITE.url}/claim/${listing.slug}`;
  const name = esc(listing.name);
  const body = `font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#22303f;`;

  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#ffffff;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(outreachPreheader())}</span>
<div style="${body}max-width:560px;margin:0 auto;padding:24px 20px;">
  <p>Hello,</p>

  <p>We&rsquo;ve built a profile for <strong>${name}</strong> on EarlyDays, a directory
  helping Ghanaian parents find and compare schools. It&rsquo;s live now:</p>

  <p><a href="${profile}" style="color:#1f7ad6;">${esc(`${SITE.domain}/schools/${listing.slug}`)}</a></p>

  <p>We compiled it from publicly available information, so some details may be
  out of date. We&rsquo;d rather you correct it than leave parents reading
  something wrong.</p>

  <p>Claiming the profile is free and lets you:</p>

  <ul style="padding-left:20px;margin:0 0 16px;">
    <li>Correct your description, fees guidance, and contact details</li>
    <li>Add your own photos of the school</li>
    <li>List your programmes, age ranges, and admissions status</li>
    <li>Receive enquiries directly from parents viewing your profile</li>
  </ul>

  <p style="margin:24px 0;">
    <a href="${claim}" style="background:#0f2a4a;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:8px;display:inline-block;font-weight:600;">Review &amp; claim ${name}</a>
  </p>

  <p>There&rsquo;s no password to set up. Fill in a short form, and we&rsquo;ll call
  your office line within one working day to confirm you work at the school
  before handing over access.</p>

  <p>If you&rsquo;d prefer we remove the listing instead, reply to this email and
  we&rsquo;ll take it down.</p>

  <p style="margin-top:24px;">Warm regards,<br>
  <strong>${esc(senderName)}</strong><br>
  <span style="color:#6b7a8c;">EarlyDays &middot; ${SITE.domain}</span></p>

  <p style="color:#6b7a8c;font-size:13px;border-top:1px solid #e6ebf0;padding-top:16px;margin-top:24px;">
    P.S. Parents are searching for schools in ${esc(area(listing))} right now.
    If anything on your profile is wrong, that&rsquo;s what they&rsquo;re seeing.
  </p>
</div>
</body></html>`;
}
