import { SITE } from "@/lib/site";

/**
 * Sent once a claim is verified and the school's profile has been handed over.
 *
 * Two shapes: one for an account we just created for them (carries a temporary
 * password), one for a school that had already signed up. Kept plain for the
 * same deliverability reasons as the outreach email.
 */

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function welcomeSubject(schoolName: string): string {
  return `${schoolName} is yours on EarlyDays — here's how to sign in`;
}

interface WelcomeOpts {
  schoolName: string;
  slug: string;
  email: string;
  tempPassword?: string;
  senderName: string;
}

export function welcomeText(o: WelcomeOpts): string {
  const login = `${SITE.url}/school/login`;
  const creds = o.tempPassword
    ? `We have set up your account:

  Email:    ${o.email}
  Password: ${o.tempPassword}

Please change this password after your first sign-in — there is a
"Reset password" link on the same page.`
    : `Sign in with the email and password you already set up (${o.email}).
If you have forgotten it, use "Reset password" on the sign-in page.`;

  return `Hello,

Thank you for taking the time to speak with us. ${o.schoolName} is now yours to
manage on EarlyDays.

${creds}

Sign in here:
${login}

Once you are in you can:

- Correct your description, contact details and fees guidance
- Upload your own photos
- Update your programmes, age ranges and admissions status
- Read enquiries from parents who found you on EarlyDays
- Get a "Verified on EarlyDays" badge for your own website

Your profile:
${SITE.url}/schools/${o.slug}

If anything looks wrong, reply to this email and we will sort it out.

Warm regards,
${o.senderName}
EarlyDays · ${SITE.domain}
`;
}

export function welcomeHtml(o: WelcomeOpts): string {
  const login = `${SITE.url}/school/login`;
  const body = `font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#22303f;`;
  const creds = o.tempPassword
    ? `<p>We have set up your account:</p>
       <table style="border-collapse:collapse;margin:0 0 8px;">
         <tr><td style="padding:4px 16px 4px 0;color:#6b7a8c;">Email</td>
             <td style="padding:4px 0;"><strong>${esc(o.email)}</strong></td></tr>
         <tr><td style="padding:4px 16px 4px 0;color:#6b7a8c;">Password</td>
             <td style="padding:4px 0;"><code style="background:#f3f0e9;padding:3px 8px;border-radius:6px;font-size:15px;letter-spacing:1px;">${esc(o.tempPassword)}</code></td></tr>
       </table>
       <p style="color:#6b7a8c;font-size:13px;">Please change this password after your first
       sign-in &mdash; there is a &ldquo;Reset password&rdquo; link on the same page.</p>`
    : `<p>Sign in with the email and password you already set up
       (<strong>${esc(o.email)}</strong>). If you have forgotten it, use
       &ldquo;Reset password&rdquo; on the sign-in page.</p>`;

  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#ffffff;">
<div style="${body}max-width:560px;margin:0 auto;padding:24px 20px;">
  <p>Hello,</p>

  <p>Thank you for taking the time to speak with us. <strong>${esc(o.schoolName)}</strong>
  is now yours to manage on EarlyDays.</p>

  ${creds}

  <p style="margin:24px 0;">
    <a href="${login}" style="background:#0f2a4a;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:8px;display:inline-block;font-weight:600;">Sign in to your dashboard</a>
  </p>

  <p>Once you are in you can:</p>
  <ul style="padding-left:20px;margin:0 0 16px;">
    <li>Correct your description, contact details and fees guidance</li>
    <li>Upload your own photos</li>
    <li>Update your programmes, age ranges and admissions status</li>
    <li>Read enquiries from parents who found you on EarlyDays</li>
    <li>Get a &ldquo;Verified on EarlyDays&rdquo; badge for your own website</li>
  </ul>

  <p>Your profile:<br>
  <a href="${SITE.url}/schools/${esc(o.slug)}" style="color:#1f7ad6;">${esc(`${SITE.domain}/schools/${o.slug}`)}</a></p>

  <p>If anything looks wrong, reply to this email and we will sort it out.</p>

  <p style="margin-top:24px;">Warm regards,<br>
  <strong>${esc(o.senderName)}</strong><br>
  <span style="color:#6b7a8c;">EarlyDays &middot; ${SITE.domain}</span></p>
</div>
</body></html>`;
}
