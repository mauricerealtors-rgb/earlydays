import { SITE } from "@/lib/site";
import { findLocation } from "@/data/locations";
import { auditPresence } from "@/lib/presence";
import type { Listing } from "@/lib/types";

/**
 * Cold outreach email sent to unclaimed schools.
 *
 * Deliberately close to plain text. A new sending domain mailing schools that
 * never opted in is exactly the profile spam filters distrust, and image-heavy
 * template HTML makes it worse, so this is a few paragraphs, two links, and no
 * tracking pixel or webfont.
 *
 * The hook is "check this is correct", not "claim your free listing": people
 * ignore a free offer but rarely ignore possibly-wrong public information
 * about their own school.
 *
 * The body is now editable from /admin/outreach and stored in Firestore, so
 * what follows is only the default. It is written as plain text with a tiny
 * amount of structure, because the person editing it is selling to schools,
 * not writing HTML, and an editable template that can break the layout is a
 * template that will.
 *
 * It no longer says claiming is free. It was true when this was written and
 * is not any more, and a cold email that promises free access to a page that
 * then asks for GH990 is the worst possible first impression. The hook never
 * needed the word: "your public information may be wrong" is the reason
 * people open it. Terms are disclosed on the claim page, before anyone pays.
 */

export interface OutreachTemplate {
  subject: string;
  body: string;
  updatedAt?: string;
  updatedBy?: string;
}

/**
 * Placeholders available in the subject and the body.
 *
 * {{findings}} expands to the audit list, or to nothing at all when we found
 * too little to be worth saying. Everything else is a plain substitution.
 * {{cta}} becomes a button in the HTML part and a bare URL in the text part,
 * which is why it is a placeholder rather than something the editor types.
 */
export const OUTREACH_PLACEHOLDERS: Array<{ token: string; what: string }> = [
  { token: "{{school}}", what: "The school's name" },
  { token: "{{area}}", what: "Its area, e.g. East Legon" },
  { token: "{{region}}", what: "Its region, e.g. Greater Accra" },
  { token: "{{profileUrl}}", what: "Link to their live profile" },
  { token: "{{claimUrl}}", what: "Link to the claim form" },
  { token: "{{cta}}", what: "The claim button (a link in plain text)" },
  { token: "{{findings}}", what: "What we could not find, as a list. Empty when there is little to say." },
  { token: "{{sender}}", what: "Your name" },
  { token: "{{site}}", what: SITE.domain },
];

export const DEFAULT_TEMPLATE: OutreachTemplate = {
  subject: "{{school}}'s profile on EarlyDays, please check it's correct",
  body: `Hello,

We've built a profile for {{school}} on EarlyDays, a directory helping Ghanaian parents find and compare schools. It's live now:

{{profileUrl}}

We compiled it from publicly available information, so some details may be out of date. We'd rather you correct it than leave parents reading something wrong.

{{findings}}

Claiming the profile lets you:

- Correct your description, fees and contact details
- Add your own photos of the school
- List your programmes, age ranges and admissions status
- Receive enquiries directly from parents viewing your profile

{{cta}}

There's no password to set up. Fill in a short form, and we'll call your office line within one working day to confirm you work at the school before handing over access.

If you'd prefer we remove the listing instead, reply to this email and we'll take it down.

Warm regards,
{{sender}}
EarlyDays · {{site}}

P.S. Parents are searching for schools in {{area}} right now. If anything on your profile is wrong, that's what they're seeing.`,
};

export function outreachPreheader(): string {
  return "Please check your school's details are correct.";
}

function area(listing: Listing): string {
  return findLocation(listing.neighbourhood)?.name ?? listing.neighbourhood;
}

/**
 * The part of the email that is actually about their school.
 *
 * Only the three strongest gaps, phrased as what we could not find rather than
 * what they do not have. The school may well have a Facebook page we never
 * reached, and a cold email that tells a head teacher something untrue about
 * their own school is worse than no email. Schools with little missing get no
 * findings block rather than a stretched one.
 */
function findingsText(listing: Listing): string {
  const found = auditPresence(listing)
    .missing
    // Never tell a school by email that we could not find its email address.
    // The audit is right, the address came from the admin screen rather than
    // the listing, but a head teacher reading it in their inbox only sees
    // that we have not noticed where we are writing.
    .filter((m) => m.key !== "email")
    .slice(0, 3)
    .map((m) => m.finding);
  if (found.length < 2) return "";
  return [
    "While we were putting your profile together, a few things we could not find:",
    "",
    ...found.map((f) => `- ${f}`),
    "",
    "None of that means the school is hard to find in person, only that a parent searching online may not see it.",
  ].join("\n");
}

interface Vars {
  school: string;
  area: string;
  region: string;
  profileUrl: string;
  claimUrl: string;
  findings: string;
  sender: string;
  site: string;
}

function vars(listing: Listing, senderName: string): Vars {
  return {
    school: listing.name,
    area: area(listing),
    region: listing.region,
    profileUrl: `${SITE.url}/schools/${listing.slug}`,
    claimUrl: `${SITE.url}/claim/${listing.slug}`,
    findings: findingsText(listing),
    sender: senderName,
    site: SITE.domain,
  };
}

function substitute(input: string, v: Vars, ctaText: string): string {
  return input
    .replace(/\{\{school\}\}/g, v.school)
    .replace(/\{\{area\}\}/g, v.area)
    .replace(/\{\{region\}\}/g, v.region)
    .replace(/\{\{profileUrl\}\}/g, v.profileUrl)
    .replace(/\{\{claimUrl\}\}/g, v.claimUrl)
    .replace(/\{\{findings\}\}/g, v.findings)
    .replace(/\{\{sender\}\}/g, v.sender)
    .replace(/\{\{site\}\}/g, v.site)
    .replace(/\{\{cta\}\}/g, ctaText)
    // A findings block that expanded to nothing leaves three blank lines
    // behind it. Collapse any run of them so the email never has a hole.
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function outreachSubject(
  listing: Listing,
  template: OutreachTemplate = DEFAULT_TEMPLATE,
): string {
  const v = vars(listing, "");
  return substitute(template.subject, v, v.claimUrl).replace(/\n/g, " ");
}

export function outreachText(
  listing: Listing,
  senderName: string,
  template: OutreachTemplate = DEFAULT_TEMPLATE,
): string {
  const v = vars(listing, senderName);
  return `${substitute(template.body, v, `Review and claim ${v.school}:\n${v.claimUrl}`)}\n`;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** A bare URL on its own line becomes a link; everything else is escaped. */
function inline(line: string): string {
  const trimmed = line.trim();
  if (/^https?:\/\/\S+$/.test(trimmed)) {
    return `<a href="${esc(trimmed)}" style="color:#c2410c;">${esc(
      trimmed.replace(/^https?:\/\//, ""),
    )}</a>`;
  }
  return esc(line);
}

/**
 * Turn the plain-text body into the HTML part.
 *
 * Blank lines separate paragraphs, lines beginning "- " become a list, and the
 * CTA marker becomes a button. That is the whole grammar: enough for the email
 * to look composed, too little for an edit to break the layout.
 */
function bodyToHtml(body: string): string {
  const blocks = body.split(/\n{2,}/);
  const out: string[] = [];

  for (const block of blocks) {
    const lines = block.split("\n").filter((l) => l.trim());
    if (lines.length === 0) continue;

    if (lines[0].startsWith("[[CTA]]")) {
      const url = lines[0].slice("[[CTA]]".length).trim();
      const label = lines[1]?.trim() || "Review and claim your profile";
      out.push(
        `<p style="margin:24px 0;"><a href="${esc(url)}" style="background:#141414;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:8px;display:inline-block;font-weight:700;">${esc(label)}</a></p>`,
      );
      continue;
    }

    if (lines.every((l) => l.trim().startsWith("- "))) {
      out.push(
        `<ul style="padding-left:20px;margin:0 0 16px;">${lines
          .map((l) => `<li>${inline(l.trim().slice(2))}</li>`)
          .join("")}</ul>`,
      );
      continue;
    }

    out.push(`<p>${lines.map(inline).join("<br>")}</p>`);
  }

  return out.join("\n  ");
}

export function outreachHtml(
  listing: Listing,
  senderName: string,
  template: OutreachTemplate = DEFAULT_TEMPLATE,
): string {
  const v = vars(listing, senderName);
  const body = substitute(
    template.body,
    v,
    `[[CTA]]${v.claimUrl}\nReview and claim ${v.school}`,
  );
  const font =
    "font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#141414;";

  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#ffffff;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(outreachPreheader())}</span>
<div style="${font}max-width:560px;margin:0 auto;padding:24px 20px;">
  ${bodyToHtml(body)}
</div>
</body></html>`;
}
