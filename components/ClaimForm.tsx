"use client";

import { useState } from "react";
import { ClaimSubmitted } from "./ClaimSubmitted";

export function ClaimForm({
  slug,
  schoolName,
}: {
  slug: string;
  schoolName: string;
}) {
  const [submittedName, setSubmittedName] = useState("");
  const [submittedRole, setSubmittedRole] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [submittedPhone, setSubmittedPhone] = useState("");
  const [schoolPhone, setSchoolPhone] = useState("");
  const [schoolEmail, setSchoolEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          submittedName,
          submittedRole,
          submittedEmail,
          submittedPhone,
          schoolPhone,
          schoolEmail,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong. Try again.");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <ClaimSubmitted
        schoolName={schoolName}
        schoolPhone={schoolPhone}
        submittedEmail={submittedEmail}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div className="rounded-2xl border-2 border-[color:var(--color-ink)] bg-[color:var(--color-cream)] p-4">
        <p className="text-[14px] leading-relaxed text-[color:var(--color-text-body)]">
          We ring the school&rsquo;s own line to check you work there, then
          email your login. No account to set up today.
        </p>
      </div>

      <Field label="Your full name" required>
        <input
          type="text"
          required
          value={submittedName}
          onChange={(e) => setSubmittedName(e.target.value)}
          className={inputCls}
          placeholder="e.g. Ama Boateng"
        />
      </Field>

      <Field label={`Your role at ${schoolName}`} required>
        <input
          type="text"
          required
          value={submittedRole}
          onChange={(e) => setSubmittedRole(e.target.value)}
          className={inputCls}
          placeholder="e.g. Head of School, Admissions Officer, Owner"
        />
      </Field>

      <Field
        label="Your email"
        required
        hint="Where we send your login link once the school confirms you."
      >
        <input
          type="email"
          required
          value={submittedEmail}
          onChange={(e) => setSubmittedEmail(e.target.value)}
          className={inputCls}
          placeholder="you@yourschool.edu.gh"
        />
      </Field>

      <Field label="Your phone number" required>
        <input
          type="tel"
          required
          value={submittedPhone}
          onChange={(e) => setSubmittedPhone(e.target.value)}
          className={inputCls}
          placeholder="+233 …"
        />
      </Field>

      <Field
        label={`${schoolName}'s official phone number`}
        required
        hint="We call this number within one working day to verify your claim. It should be the school's own line, not your mobile."
      >
        <input
          type="tel"
          required
          value={schoolPhone}
          onChange={(e) => setSchoolPhone(e.target.value)}
          className={inputCls}
          placeholder="e.g. 0302 000 000"
        />
      </Field>

      <Field
        label={`${schoolName}'s official email address`}
        hint="Optional. The school's main email, not a personal one."
      >
        <input
          type="email"
          value={schoolEmail}
          onChange={(e) => setSchoolEmail(e.target.value)}
          className={inputCls}
          placeholder="info@yourschool.edu.gh"
        />
      </Field>

      {error && (
        <p className="rounded-lg border-2 border-[color:var(--color-ink)] bg-[color:var(--color-peach)] p-3 text-sm font-semibold text-[color:var(--color-ink)]">
          {error}
        </p>
      )}

      <button type="submit" disabled={submitting} className="btn btn-pink w-full">
        {submitting ? "Submitting…" : `Submit claim for ${schoolName}`}
      </button>

      {/* The one line that stops this being a bait and switch. The box that
          used to carry it said the same thing in a paragraph. */}
      <p className="text-center text-[13px] text-[color:var(--color-text-body)]">
        Listing is free. Managing it is a yearly plan, and we show the cost on
        the next screen.
      </p>

      <p className="text-center text-xs text-[color:var(--color-ink-mute)]">
        By claiming you agree to the EarlyDays{" "}
        <a href="/terms" className="underline">terms</a> and{" "}
        <a href="/privacy" className="underline">privacy policy</a>.
      </p>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border-2 border-[color:var(--color-ink)] bg-white px-4 py-3 text-[15px] outline-none focus:shadow-[var(--shadow-hard-sm)]";

function Field({
  label,
  children,
  required,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-[color:var(--color-ink)]">
        {label} {required && <span className="text-[color:var(--color-brand)]">*</span>}
      </span>
      {children}
      {hint && (
        <span className="mt-1 block text-xs leading-snug text-[color:var(--color-text-muted)]">
          {hint}
        </span>
      )}
    </label>
  );
}
