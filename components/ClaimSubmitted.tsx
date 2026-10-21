"use client";

import { useState } from "react";
import { MEMBERSHIP, MEMBERSHIP_INCLUDES, MOMO, momoWhatsApp } from "@/lib/membership";

/**
 * What a school sees the moment its claim goes in.
 *
 * This is the only surface on the site that carries a price. Being listed is
 * free and the public pages say so truthfully; running the listing yourself
 * is the paid part, and a school only reads the number once it has asked to
 * do that. No price list, no plans page, no upsell anywhere else.
 *
 * The order matters. Verification comes first, payment second, because a
 * proprietor who is asked for money before anyone has spoken to them assumes
 * a scam, and in Ghana they are usually right. So the panel says plainly that
 * the call comes first and that nothing is lost by waiting for it.
 */
export function ClaimSubmitted({
  schoolName,
  schoolPhone,
  submittedEmail,
}: {
  schoolName: string;
  schoolPhone: string;
  submittedEmail: string;
}) {
  return (
    <div className="mt-8 space-y-4">
      {/* Receipt */}
      <div className="rounded-2xl border-2 border-[color:var(--color-ink)] bg-[color:var(--color-mint)] p-5 shadow-[var(--shadow-hard)] md:p-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-[color:var(--color-ink)] bg-white">
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
              <path
                d="M4 10.5l4 4 8-9"
                stroke="var(--color-ink)"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-[20px] leading-tight md:text-[24px]">
              Your claim for {schoolName} is in.
            </h2>
            <p className="mt-1 text-[14px] leading-relaxed text-[color:var(--color-text-body)]">
              We call you first. Nothing to do this minute.
            </p>
          </div>
        </div>
      </div>

      {/* What happens, in order */}
      <section className="rounded-2xl border-2 border-[color:var(--color-ink)] bg-white p-5 md:p-6">
        <h3 className="font-display text-[18px] leading-tight md:text-[20px]">
          What happens next
        </h3>
        <ol className="mt-4 space-y-4">
          <Step n={1} title="We ring the school, not you">
            Within one working day we call{" "}
            <Strong>{schoolPhone || "the school number you gave us"}</Strong> and
            ask for you by name.
          </Step>
          <Step n={2} title="You pay for the year">
            Send the mobile money below, before or after the call. If we cannot
            verify you, you get every pesewa back.
          </Step>
          <Step n={3} title="Your account opens">
            We email your login to <Strong>{submittedEmail}</Strong>. You can
            edit the page the same day.
          </Step>
        </ol>
      </section>

      {/* The money */}
      <PaymentPanel schoolName={schoolName} />

      {/* What the money buys */}
      <section className="rounded-2xl border-2 border-[color:var(--color-ink)] bg-[color:var(--color-cream)] p-5 md:p-6">
        <h3 className="font-display text-[18px] leading-tight md:text-[20px]">
          What you get for it
        </h3>
        <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {MEMBERSHIP_INCLUDES.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <svg
                viewBox="0 0 20 20"
                className="mt-[3px] h-4 w-4 shrink-0"
                fill="none"
                aria-hidden
              >
                <path
                  d="M4 10.5l4 4 8-9"
                  stroke="var(--color-leaf)"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="min-w-0 text-[14px] leading-snug text-[color:var(--color-text-body)]">
                {item}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t-2 border-dashed border-[color:var(--color-line)] pt-3 text-[13px] leading-relaxed text-[color:var(--color-text-muted)]">
          {schoolName} stays listed whether you pay or not. The year buys you
          control of the page.
        </p>
      </section>
    </div>
  );
}

function PaymentPanel({ schoolName }: { schoolName: string }) {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      // Clipboard is blocked in some in-app browsers. The value is on screen
      // and selectable, so there is nothing to recover from.
    }
  }

  return (
    <section className="rounded-2xl border-2 border-[color:var(--color-ink)] bg-white p-5 shadow-[var(--shadow-hard)] md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="inline-block rounded-md bg-[color:var(--color-sun)] px-2 py-1 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[color:var(--color-ink)]">
            Pay by mobile money
          </span>
          <h3 className="mt-3 font-display text-[18px] leading-tight md:text-[20px]">
            Send {MEMBERSHIP.currency}
            {MEMBERSHIP.amount.toLocaleString("en-GH")} to activate the year
          </h3>
        </div>
        <span className="-rotate-2 rounded-lg border-2 border-[color:var(--color-ink)] bg-[color:var(--color-sun)] px-3 py-2 shadow-[var(--shadow-hard-sm)]">
          <span className="block font-display text-[24px] leading-none text-[color:var(--color-ink)]">
            {MEMBERSHIP.currency}
            {MEMBERSHIP.amount.toLocaleString("en-GH")}
          </span>
          <span className="mt-0.5 block text-[11px] font-bold text-[color:var(--color-ink)]">
            for {MEMBERSHIP.period}
          </span>
        </span>
      </div>

      <dl className="mt-5 divide-y-2 divide-[color:var(--color-line)] border-y-2 border-[color:var(--color-line)]">
        <PayRow label="Network" value={MOMO.network} />
        <PayRow
          label="Number"
          value={MOMO.number}
          mono
          onCopy={() => copy("number", MOMO.number)}
          copied={copied === "number"}
        />
        <PayRow label="Account name" value={MOMO.name} />
        <PayRow
          label="Reference"
          value={schoolName}
          hint="Type your school name exactly. It is how we match the payment to your claim."
          onCopy={() => copy("reference", schoolName)}
          copied={copied === "reference"}
        />
      </dl>

      <a
        href={momoWhatsApp()}
        target="_blank"
        rel="noreferrer"
        className="btn btn-pink btn-wrap mt-5 w-full text-[15px]"
      >
        Send the screenshot on WhatsApp
      </a>
      <p className="mt-2.5 text-center text-[13px] leading-relaxed text-[color:var(--color-text-muted)]">
        After you send the money, WhatsApp us the confirmation screenshot so we
        can open your account the same day.
      </p>
    </section>
  );
}

function PayRow({
  label,
  value,
  hint,
  mono,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  hint?: string;
  mono?: boolean;
  onCopy?: () => void;
  copied?: boolean;
}) {
  return (
    <div className="grid grid-cols-[minmax(90px,110px)_minmax(0,1fr)] items-start gap-3 py-3">
      <dt className="text-[11px] font-bold uppercase tracking-[0.08em] text-[color:var(--color-text-muted)]">
        {label}
      </dt>
      <dd className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`min-w-0 break-words text-[16px] font-bold text-[color:var(--color-ink)] ${
              mono ? "tracking-[0.06em] tabular-nums" : ""
            }`}
          >
            {value}
          </span>
          {onCopy && (
            <button
              type="button"
              onClick={onCopy}
              className="shrink-0 rounded-md border-2 border-[color:var(--color-ink)] bg-white px-2 py-0.5 text-[11px] font-bold hover:bg-[color:var(--color-butter)]"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          )}
        </div>
        {hint && (
          <p className="mt-1 text-[12px] leading-snug text-[color:var(--color-text-muted)]">
            {hint}
          </p>
        )}
      </dd>
    </div>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-[color:var(--color-ink)] bg-[color:var(--color-sun)] font-display text-[13px] text-[color:var(--color-ink)]">
        {n}
      </span>
      <div className="min-w-0">
        <p className="font-display text-[15px] leading-tight md:text-[16px]">
          {title}
        </p>
        <p className="mt-1 text-[14px] leading-relaxed text-[color:var(--color-text-body)]">
          {children}
        </p>
      </div>
    </li>
  );
}

function Strong({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-bold text-[color:var(--color-ink)]">{children}</span>
  );
}
