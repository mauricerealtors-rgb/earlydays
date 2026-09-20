import { MARK_DATA_URI } from "./brand";
import {
  VERIFIED_BLUE,
  VERIFIED_SEAL_PATH,
  VERIFIED_TICK_PATH,
} from "./verified-seal";

/**
 * Embeddable "Verified on EarlyDays" badge.
 *
 * Schools put this on their own site, so it is a single self-contained SVG: the
 * mark travels as a data URI because an <img>-loaded SVG is not allowed to fetch
 * anything external, and the text uses a system font stack rather than a webfont
 * for the same reason.
 *
 * The wording follows the real state of the listing rather than whatever the
 * school pastes in — an unclaimed profile says "Listed on", not "Verified on".
 */

export type BadgeTheme = "light" | "dark";
export type BadgeSize = "sm" | "md";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const FONT =
  "system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

export function badgeSvg(opts: {
  claimed: boolean;
  theme?: BadgeTheme;
  size?: BadgeSize;
  schoolName?: string;
}): string {
  const theme = opts.theme ?? "light";
  const scale = opts.size === "sm" ? 0.78 : 1;
  const W = Math.round(260 * scale);
  const H = Math.round(68 * scale);

  const dark = theme === "dark";
  const bg = dark ? "#0F2A4A" : "#FFF8EF";
  const border = dark ? "#1d3d63" : "#E8DECF";
  const muted = dark ? "#9db2cc" : "#6b7a8c";
  const primary = dark ? "#FFFFFF" : "#0F2A4A";
  const accent = "#FF7A59";

  const kicker = opts.claimed ? "VERIFIED ON" : "LISTED ON";
  const label = opts.claimed
    ? `Verified on EarlyDays${opts.schoolName ? ` — ${opts.schoolName}` : ""}`
    : `Listed on EarlyDays${opts.schoolName ? ` — ${opts.schoolName}` : ""}`;

  // Laid out at 260x68 and scaled as a whole, so both sizes stay identical.
  const inner = `
    <rect x="0.5" y="0.5" width="259" height="67" rx="14" fill="${bg}" stroke="${border}"/>
    <image href="${MARK_DATA_URI}" x="14" y="14" width="40" height="40"
           preserveAspectRatio="xMidYMid meet"/>
    <text x="68" y="29" font-family="${FONT}" font-size="10" font-weight="700"
          letter-spacing="1.6" fill="${muted}">${kicker}</text>
    <text x="68" y="51" font-family="${FONT}" font-size="20" font-weight="800"
          fill="${primary}">Early<tspan fill="${accent}">Days</tspan></text>
    ${
      opts.claimed
        ? `<g transform="translate(222 22)">
             <path d="${VERIFIED_SEAL_PATH}" fill="${VERIFIED_BLUE}"/>
             <path d="${VERIFIED_TICK_PATH}" stroke="#fff" stroke-width="2.7"
                   stroke-linecap="round" stroke-linejoin="round" fill="none"/>
           </g>`
        : ""
    }`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 260 68" role="img" aria-label="${esc(label)}">
  <title>${esc(label)}</title>
  <g>${inner}</g>
</svg>`;
}

/** The snippet a school pastes into their own site. */
export function badgeEmbedHtml(opts: {
  siteUrl: string;
  slug: string;
  schoolName: string;
  theme?: BadgeTheme;
  size?: BadgeSize;
}): string {
  const q = new URLSearchParams();
  if (opts.theme && opts.theme !== "light") q.set("theme", opts.theme);
  if (opts.size && opts.size !== "md") q.set("size", opts.size);
  const suffix = q.toString() ? `?${q}` : "";
  const alt = `Verified on EarlyDays — ${opts.schoolName}`;
  return `<a href="${opts.siteUrl}/schools/${opts.slug}" target="_blank" rel="noopener">
  <img src="${opts.siteUrl}/badge/${opts.slug}${suffix}"
       alt="${esc(alt)}" width="260" height="68" loading="lazy" />
</a>`;
}
