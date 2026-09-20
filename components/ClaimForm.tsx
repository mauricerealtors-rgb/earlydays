"use client";

import { useState } from "react";

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
      <div className="mt-8 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-leaf-soft)] p-6">
        <p className="font-display text-xl text-[color:var(--color-navy)]">
          Thanks. Your claim for {schoolName} is in.
        </p>
        <ol className="mt-4 space-y-3 text-sm text-[color:var(--color-ink-mute)]">
          <Step n={1}>
            We call {schoolPhone || "the school number you gave us"} within one
            working day to check you work at {schoolName}.
          </Step>
          <Step n={2}>
            Once that call goes through, we set up your account and email your
            login to{" "}
            <span className="font-semibold text-[color:var(--color-navy)]">
              {submittedEmail}
            </span>
            . You can change the password once you are in.
          </Step>
          <Step n={3}>
            {schoolName} is attached to that account, so you can edit your
            profile straight away.
          </Step>
        </ol>
        <p className="mt-4 text-xs text-[color:var(--color-ink-mute)]">
          Nothing to do until you hear from us. There is no password to
          remember yet.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-cream)] p-4">
        <p className="text-sm text-[color:var(--color-ink-mute)]">
          No account needed yet. Tell us how to reach you and how to reach{" "}
          {schoolName}. We verify by phone first, then help you set up a login.
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
        <p className="rounded-lg bg-[color:var(--color-coral-soft)] p-3 text-sm text-[color:var(--color-coral)]">
          {error}
        </p>
      )}

      <button type="submit" disabled={submitting} className="btn btn-pink w-full">
        {submitting ? "Submitting…" : `Submit claim for ${schoolName}`}
      </button>

      <p className="text-center text-xs text-[color:var(--color-ink-mute)]">
        By claiming you agree to the EarlyDays{" "}
        <a href="/terms" className="underline">terms</a> and{" "}
        <a href="/privacy" className="underline">privacy policy</a>.
      </p>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border border-[color:var(--color-line)] bg-white px-4 py-3 text-[15px] outline-none focus:border-[color:var(--color-navy)]";

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-navy)] text-[11px] font-bold text-white">
        {n}
      </span>
      <span>{children}</span>
    </li>
  );
}

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
      <span className="mb-1 block text-sm font-semibold text-[color:var(--color-navy)]">
        {label} {required && <span className="text-[color:var(--color-coral)]">*</span>}
      </span>
      {children}
      {hint && (
        <span className="mt-1 block text-xs text-[color:var(--color-ink-mute)]">
          {hint}
        </span>
      )}
    </label>
  );
}
