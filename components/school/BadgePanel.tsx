"use client";

import { useMemo, useState } from "react";
import { badgeEmbedHtml, type BadgeSize, type BadgeTheme } from "@/lib/badge";
import { SITE } from "@/lib/site";

export function BadgePanel({
  slug,
  schoolName,
}: {
  slug: string;
  schoolName: string;
}) {
  const [theme, setTheme] = useState<BadgeTheme>("light");
  const [size, setSize] = useState<BadgeSize>("md");
  const [copied, setCopied] = useState(false);

  const src = `${SITE.url}/badge/${slug}${
    theme === "dark" || size === "sm"
      ? `?${[theme === "dark" ? "theme=dark" : "", size === "sm" ? "size=sm" : ""]
          .filter(Boolean)
          .join("&")}`
      : ""
  }`;

  const snippet = useMemo(
    () => badgeEmbedHtml({ siteUrl: SITE.url, slug, schoolName, theme, size }),
    [slug, schoolName, theme, size]
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="pb-16">
      <div className="mb-6">
        <span className="chip chip-leaf">Verified badge</span>
        <h1 className="mt-2 font-display text-[28px] leading-tight md:text-[36px]">
          Show parents {schoolName} is verified.
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[color:var(--color-ink-mute)]">
          Add this badge to your website — the footer or your About page works
          well. It links to your EarlyDays profile, so parents who spot it can
          read your full listing and enquire.
        </p>
      </div>

      {/* Preview */}
      <div className="card-soft rounded-2xl p-6">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
          Preview
        </p>
        <div
          className={`mt-3 flex items-center justify-center rounded-xl p-8 ${
            theme === "dark" ? "bg-[#0b1b2e]" : "bg-white"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`Verified on EarlyDays — ${schoolName}`}
            width={size === "sm" ? 203 : 260}
            height={size === "sm" ? 53 : 68}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          <Choice label="Style">
            {(["light", "dark"] as const).map((t) => (
              <Pill key={t} active={theme === t} onClick={() => setTheme(t)}>
                {t}
              </Pill>
            ))}
          </Choice>
          <Choice label="Size">
            {(["md", "sm"] as const).map((s) => (
              <Pill key={s} active={size === s} onClick={() => setSize(s)}>
                {s === "md" ? "Standard" : "Small"}
              </Pill>
            ))}
          </Choice>
        </div>
      </div>

      {/* Snippet */}
      <div className="card-soft mt-4 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
            Copy this into your website
          </p>
          <button onClick={copy} className="btn btn-pink text-sm">
            {copied ? "Copied" : "Copy code"}
          </button>
        </div>
        <pre className="mt-3 overflow-x-auto rounded-xl bg-[color:var(--color-navy)] p-4 text-[12px] leading-relaxed text-white/90">
          <code>{snippet}</code>
        </pre>
        <p className="mt-3 text-xs text-[color:var(--color-ink-mute)]">
          Paste it wherever you can add HTML. On WordPress, Wix or Squarespace
          use an &ldquo;Embed&rdquo; or &ldquo;Custom HTML&rdquo; block. If your
          site builder will not accept HTML, ask whoever maintains your site to
          add it.
        </p>
      </div>

      <p className="mt-4 text-xs text-[color:var(--color-ink-mute)]">
        The badge reflects your real status. While a profile is unclaimed it
        reads &ldquo;Listed on EarlyDays&rdquo;; once we have verified you it
        switches to &ldquo;Verified&rdquo; automatically, with no change needed
        on your side.
      </p>
    </div>
  );
}

function Choice({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold text-[color:var(--color-navy)]">{label}</p>
      <div className="flex gap-1">{children}</div>
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs capitalize ${
        active
          ? "bg-[color:var(--color-navy)] text-white"
          : "border border-[color:var(--color-line)] text-[color:var(--color-navy)]"
      }`}
    >
      {children}
    </button>
  );
}
