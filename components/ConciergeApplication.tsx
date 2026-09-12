"use client";

import { useState } from "react";

interface Child {
  age: string;
  notes: string;
}

type ShortlistSize = "3" | "5" | "7";

interface Answers {
  parentName: string;
  parentEmail: string;
  parentWhatsapp: string;
  country: string;
  city: string;
  children: Child[];
  timeframe: string;
  areas: string[];
  priorities: string[];
  shortlistSize: ShortlistSize;
  budgetBand: string;
  notes: string;
  referral: string;
}

const initial: Answers = {
  parentName: "",
  parentEmail: "",
  parentWhatsapp: "",
  country: "",
  city: "",
  children: [{ age: "", notes: "" }],
  timeframe: "",
  areas: [],
  priorities: [],
  shortlistSize: "3",
  budgetBand: "",
  notes: "",
  referral: "",
};

/**
 * Pricing model (transparent, shown live from step "children" onwards).
 *   Base per family, scales with children count:
 *     1 child  → $200
 *     2 kids   → $350
 *     3+ kids  → $500
 *   Shortlist depth add-on:
 *     3 schools → included
 *     5 schools → +$100
 *     7 schools → +$200
 */
function baseFee(childrenCount: number): number {
  if (childrenCount <= 1) return 200;
  if (childrenCount === 2) return 350;
  return 500;
}
function shortlistAddon(size: ShortlistSize): number {
  if (size === "5") return 100;
  if (size === "7") return 200;
  return 0;
}
function computeFee(answers: Answers): { total: number; base: number; addon: number } {
  const base = baseFee(answers.children.length);
  const addon = shortlistAddon(answers.shortlistSize);
  return { total: base + addon, base, addon };
}

const TIMEFRAMES = [
  "Detty December this year (visiting soon)",
  "January – February 2027 start",
  "May 2027 start",
  "September 2027 start",
  "Later in 2027",
  "Still exploring, no fixed date",
];

const AREAS = [
  "East Legon",
  "East Legon Hills",
  "Adjiringanor",
  "Airport Residential",
  "Cantonments",
  "Osu / Ridge",
  "Labone",
  "Spintex",
  "East Airport",
  "Tema",
  "Not sure — help me pick",
];

const PRIORITIES = [
  "British / UK National Curriculum",
  "Cambridge",
  "IB (International Baccalaureate)",
  "Ghana Education Service",
  "EYFS",
  "Montessori",
  "American / US curriculum",
  "French bilingual",
  "Small class sizes",
  "School transport / bus",
  "Meals included",
  "Faith-based (Christian)",
  "Faith-based (Islamic)",
  "Boarding option",
  "Special needs support",
  "Strong sports / extracurriculars",
];

const BUDGETS = [
  { value: "under-3k", label: "Under GH₵3,000 per term (~$250)" },
  { value: "3-8k", label: "GH₵3,000 – 8,000 per term (~$250–650)" },
  { value: "8-15k", label: "GH₵8,000 – 15,000 per term (~$650–1,200)" },
  { value: "15-30k", label: "GH₵15,000 – 30,000 per term (~$1,200–2,400)" },
  { value: "30k+", label: "GH₵30,000+ per term (~$2,400+)" },
  { value: "flexible", label: "Not a hard constraint — quality first" },
];

const STEPS = [
  "welcome",
  "about-you",
  "your-location",
  "your-children",
  "timeframe",
  "areas",
  "priorities",
  "budget",
  "notes",
  "shortlist-size",
  "review",
  "done",
] as const;
type Step = (typeof STEPS)[number];

export function ConciergeApplication() {
  const [step, setStep] = useState<Step>("welcome");
  const [answers, setAnswers] = useState<Answers>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stepIndex = STEPS.indexOf(step);
  const progressSteps = STEPS.slice(1, -1); // exclude welcome + done
  const isFormStep = stepIndex > 0 && step !== "done";

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) =>
    setAnswers((prev) => ({ ...prev, [k]: v }));

  function next() {
    const i = STEPS.indexOf(step);
    if (i < STEPS.length - 1) setStep(STEPS[i + 1]);
  }
  function back() {
    const i = STEPS.indexOf(step);
    if (i > 0) setStep(STEPS[i - 1]);
  }

  function updateChild(i: number, patch: Partial<Child>) {
    setAnswers((prev) => ({
      ...prev,
      children: prev.children.map((c, idx) => (idx === i ? { ...c, ...patch } : c)),
    }));
  }
  function addChild() {
    if (answers.children.length >= 6) return;
    setAnswers((prev) => ({ ...prev, children: [...prev.children, { age: "", notes: "" }] }));
  }
  function removeChild(i: number) {
    if (answers.children.length <= 1) return;
    setAnswers((prev) => ({ ...prev, children: prev.children.filter((_, idx) => idx !== i) }));
  }

  function toggleArea(a: string) {
    setAnswers((prev) => ({
      ...prev,
      areas: prev.areas.includes(a) ? prev.areas.filter((x) => x !== a) : [...prev.areas, a],
    }));
  }
  function togglePriority(p: string) {
    setAnswers((prev) => ({
      ...prev,
      priorities: prev.priorities.includes(p)
        ? prev.priorities.filter((x) => x !== p)
        : [...prev.priorities, p],
    }));
  }

  const validators: Record<Step, () => boolean> = {
    welcome: () => true,
    "about-you": () =>
      Boolean(answers.parentName.trim() && answers.parentEmail.trim() && answers.parentWhatsapp.trim()),
    "your-location": () => Boolean(answers.country.trim()),
    "your-children": () => answers.children.length > 0 && answers.children.every((c) => c.age.trim()),
    "shortlist-size": () => Boolean(answers.shortlistSize),
    timeframe: () => Boolean(answers.timeframe),
    areas: () => true,
    priorities: () => true,
    budget: () => Boolean(answers.budgetBand),
    notes: () => true,
    review: () => true,
    done: () => true,
  };

  const fee = computeFee(answers);
  const showPricePanel =
    stepIndex >= STEPS.indexOf("shortlist-size") && step !== "done";

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, quotedFeeUsd: fee.total }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress bar */}
      {isFormStep && (
        <div className="mb-6 flex items-center gap-1.5">
          {progressSteps.map((s, i) => {
            const idx = STEPS.indexOf(s);
            const active = idx <= stepIndex;
            return (
              <span
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  active ? "bg-[color:var(--color-pink-hot)]" : "bg-[color:var(--color-line)]"
                }`}
              />
            );
          })}
        </div>
      )}

      {/* Live price panel — sticky visible from shortlist-size onwards */}
      {showPricePanel && (
        <div className="mb-6 rounded-2xl border border-[color:var(--color-pink-hot)]/20 bg-gradient-to-br from-[color:var(--color-blossom-soft)] to-white p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-pink-hot-deep)]">
                Your estimated fee
              </p>
              <p className="mt-1 font-display text-[32px] leading-none text-[color:var(--color-navy)]">
                ${fee.total}
              </p>
            </div>
            <div className="text-right text-[11px] text-[color:var(--color-ink-mute)]">
              <div>
                Base ({answers.children.length} child{answers.children.length === 1 ? "" : "ren"}): ${fee.base}
              </div>
              <div>Shortlist ({answers.shortlistSize} schools): +${fee.addon}</div>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-[color:var(--color-ink-mute)]">
            Paid upfront to begin work. School fees themselves are separate.
          </p>
        </div>
      )}

      <div key={step} className="concierge-step">
        {step === "welcome" && (
          <StepShell
            eyebrow="Hi there"
            title={<>Let's find the right school for your child. <span className="text-[color:var(--color-pink-hot)]">Together.</span></>}
            body={
              <>
                I'm the EarlyDays concierge. In the next 90 seconds I'll ask a
                few things about your family, and we'll come back to you within
                one working day with a shortlist of schools that actually fit
                what you need. Your fee is shown at the last step, before you commit.
                Fee is settled upfront so we can start work right away.
              </>
            }
          >
            <button onClick={next} className="btn btn-pink text-base">
              Let's start →
            </button>
          </StepShell>
        )}

        {step === "about-you" && (
          <StepShell
            eyebrow="Step 1"
            title="First, who am I speaking with?"
            body="So we can reach you back on the channel you actually check."
          >
            <div className="space-y-3">
              <Field label="Your name">
                <input
                  autoFocus
                  value={answers.parentName}
                  onChange={(e) => set("parentName", e.target.value)}
                  className={input}
                  placeholder="e.g. Ama Boateng"
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  value={answers.parentEmail}
                  onChange={(e) => set("parentEmail", e.target.value)}
                  className={input}
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="WhatsApp number (include country code)">
                <input
                  type="tel"
                  value={answers.parentWhatsapp}
                  onChange={(e) => set("parentWhatsapp", e.target.value)}
                  className={input}
                  placeholder="+44 7… or +1 917… or +233 20…"
                />
              </Field>
            </div>
            <NavRow onBack={back} onNext={next} nextDisabled={!validators[step]()} />
          </StepShell>
        )}

        {step === "your-location" && (
          <StepShell
            eyebrow="Step 2"
            title="Where are you based right now?"
            body="Helps us understand timing, admissions logistics and whether you'll be visiting soon."
          >
            <div className="space-y-3">
              <Field label="Country">
                <input
                  autoFocus
                  value={answers.country}
                  onChange={(e) => set("country", e.target.value)}
                  className={input}
                  placeholder="e.g. United Kingdom, USA, Nigeria, UAE, Canada"
                />
              </Field>
              <Field label="City (optional)">
                <input
                  value={answers.city}
                  onChange={(e) => set("city", e.target.value)}
                  className={input}
                  placeholder="e.g. London, Houston, Lagos, Dubai"
                />
              </Field>
            </div>
            <NavRow onBack={back} onNext={next} nextDisabled={!validators[step]()} />
          </StepShell>
        )}

        {step === "your-children" && (
          <StepShell
            eyebrow="Step 3"
            title="Tell me about your child (or children)."
            body="Ages help us match year groups. Any specific needs, drop them in the notes."
          >
            <div className="space-y-4">
              {answers.children.map((c, i) => (
                <div key={i} className="rounded-2xl border border-[color:var(--color-line)] p-4">
                  <div className="mb-2 flex items-baseline justify-between">
                    <span className="font-semibold text-[color:var(--color-navy)]">
                      Child {i + 1}
                    </span>
                    {answers.children.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeChild(i)}
                        className="text-xs text-[color:var(--color-coral)] hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Field label="Age (or age at start date)">
                      <input
                        value={c.age}
                        onChange={(e) => updateChild(i, { age: e.target.value })}
                        className={input}
                        placeholder="e.g. 4 years, 18 months"
                      />
                    </Field>
                    <Field label="Anything specific? (optional)">
                      <input
                        value={c.notes}
                        onChange={(e) => updateChild(i, { notes: e.target.value })}
                        className={input}
                        placeholder="e.g. currently in Reception, mild dyslexia"
                      />
                    </Field>
                  </div>
                </div>
              ))}
              {answers.children.length < 6 && (
                <button
                  type="button"
                  onClick={addChild}
                  className="w-full rounded-xl border border-dashed border-[color:var(--color-line)] px-4 py-2.5 text-sm text-[color:var(--color-navy)] hover:border-[color:var(--color-navy)]/30"
                >
                  + Add another child
                </button>
              )}
            </div>
            <NavRow onBack={back} onNext={next} nextDisabled={!validators[step]()} />
          </StepShell>
        )}

        {step === "shortlist-size" && (
          <StepShell
            eyebrow="Last step"
            title="How deep a shortlist do you want?"
            body="Nearly there. More candidates means more visits and more comparison. Most families are happy with three."
          >
            <div className="space-y-2">
              <ShortlistOption
                value="3"
                title="3 schools"
                body="Standard shortlist. Enough to compare without overwhelming you."
                priceLabel="Included"
                checked={answers.shortlistSize === "3"}
                onChange={() => set("shortlistSize", "3")}
              />
              <ShortlistOption
                value="5"
                title="5 schools"
                body="Wider net. Good when you're picking between quite different areas or curricula."
                priceLabel="+$100"
                checked={answers.shortlistSize === "5"}
                onChange={() => set("shortlistSize", "5")}
              />
              <ShortlistOption
                value="7"
                title="7 schools"
                body="Full exploration. For picky families or complex requirements (e.g. multiple children, special needs)."
                priceLabel="+$200"
                checked={answers.shortlistSize === "7"}
                onChange={() => set("shortlistSize", "7")}
              />
            </div>
            <NavRow onBack={back} onNext={next} nextDisabled={!validators[step]()} />
          </StepShell>
        )}

        {step === "timeframe" && (
          <StepShell
            eyebrow="Step 4"
            title="When are you looking to start?"
            body="Ghanaian schools work three terms: January, May, and September starts. Tell me what you're planning around."
          >
            <div className="space-y-2">
              {TIMEFRAMES.map((tf) => (
                <RadioChip
                  key={tf}
                  label={tf}
                  checked={answers.timeframe === tf}
                  onChange={() => set("timeframe", tf)}
                />
              ))}
            </div>
            <NavRow onBack={back} onNext={next} nextDisabled={!validators[step]()} />
          </StepShell>
        )}

        {step === "areas" && (
          <StepShell
            eyebrow="Step 5"
            title="Any preferred Accra areas?"
            body="Pick as many as you like. If you're not sure, tick the last option and we'll suggest based on your budget and priorities."
          >
            <div className="grid grid-cols-2 gap-2">
              {AREAS.map((a) => (
                <ToggleChip
                  key={a}
                  label={a}
                  checked={answers.areas.includes(a)}
                  onChange={() => toggleArea(a)}
                />
              ))}
            </div>
            <NavRow onBack={back} onNext={next} />
          </StepShell>
        )}

        {step === "priorities" && (
          <StepShell
            eyebrow="Step 6"
            title="What matters most?"
            body="Pick everything that's genuinely important — we'll weight the shortlist by these."
          >
            <div className="grid gap-2 sm:grid-cols-2">
              {PRIORITIES.map((p) => (
                <ToggleChip
                  key={p}
                  label={p}
                  checked={answers.priorities.includes(p)}
                  onChange={() => togglePriority(p)}
                />
              ))}
            </div>
            <NavRow onBack={back} onNext={next} />
          </StepShell>
        )}

        {step === "budget" && (
          <StepShell
            eyebrow="Step 7"
            title="What's your budget per term?"
            body="Approximate ranges — schools set their own fees and change them yearly. We show USD conversions as a rough guide."
          >
            <div className="space-y-2">
              {BUDGETS.map((b) => (
                <RadioChip
                  key={b.value}
                  label={b.label}
                  checked={answers.budgetBand === b.value}
                  onChange={() => set("budgetBand", b.value)}
                />
              ))}
            </div>
            <NavRow onBack={back} onNext={next} nextDisabled={!validators[step]()} />
          </StepShell>
        )}

        {step === "notes" && (
          <StepShell
            eyebrow="Step 8"
            title="Anything else I should know?"
            body="Existing schools you already like or want to avoid, family circumstances, timelines, questions. All optional — write as much or as little as you want."
          >
            <div className="space-y-3">
              <textarea
                value={answers.notes}
                onChange={(e) => set("notes", e.target.value)}
                className={`${input} min-h-[140px]`}
                placeholder="e.g. My cousin's kids go to X and love it. I'm coming for two weeks starting 15 December and want to tour on the 18th, 19th and 22nd. Boarding is a hard no."
              />
              <Field label="How did you hear about EarlyDays? (optional)">
                <input
                  value={answers.referral}
                  onChange={(e) => set("referral", e.target.value)}
                  className={input}
                  placeholder="e.g. Google, Instagram, a friend, a school website"
                />
              </Field>
            </div>
            <NavRow onBack={back} onNext={next} />
          </StepShell>
        )}

        {step === "review" && (
          <StepShell
            eyebrow="Almost done"
            title="Quick check — does this look right?"
            body="Anything wrong, tap Back. Otherwise send it over and I'll be in touch within one working day with payment details, and we start as soon as the fee is settled."
          >
            <ReviewList answers={answers} fee={fee.total} />
            {error && (
              <p className="mt-3 rounded-lg bg-[color:var(--color-coral-soft)] p-3 text-sm text-[color:var(--color-coral)]">
                {error}
              </p>
            )}
            <div className="mt-6 flex gap-2">
              <button onClick={back} className="btn btn-ghost text-sm">
                Back
              </button>
              <button
                onClick={submit}
                disabled={submitting}
                className="btn btn-pink flex-1"
              >
                {submitting ? "Sending…" : "Send my request"}
              </button>
            </div>
          </StepShell>
        )}

        {step === "done" && (
          <StepShell
            eyebrow="Received"
            title={<>Thanks, {answers.parentName || "friend"}. Talk soon.</>}
            body={
              <>
                We've got your details and your quoted fee of{" "}
                <strong>${fee.total}</strong>. We'll come back to you on
                WhatsApp <strong>{answers.parentWhatsapp}</strong> and email{" "}
                <strong>{answers.parentEmail}</strong> within one working day
                with payment details. Once the fee is settled we begin work
                immediately, with a shortlist typically in your inbox within
                3–5 working days.
              </>
            }
          >
            <div className="mt-2 flex flex-wrap gap-2">
              <a href="/schools" className="btn btn-ghost text-sm">
                Browse schools while you wait
              </a>
              <a href="/guides" className="btn btn-ghost text-sm">
                Read our parent guides
              </a>
            </div>
          </StepShell>
        )}
      </div>
    </div>
  );
}

/* ─── UI helpers ──────────────────────────────────────────── */

function StepShell({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-pink-hot)]">
        {eyebrow}
      </span>
      <h2 className="mt-2 font-display text-[28px] leading-tight tracking-tight md:text-[36px]">
        {title}
      </h2>
      {body && (
        <p className="mt-3 text-sm text-[color:var(--color-ink-mute)] md:text-[15px]">
          {body}
        </p>
      )}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-[color:var(--color-navy)]">
        {label}
      </span>
      {children}
    </label>
  );
}

function RadioChip({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
        checked
          ? "border-[color:var(--color-pink-hot)] bg-[color:var(--color-blossom-soft)] text-[color:var(--color-navy)]"
          : "border-[color:var(--color-line)] bg-white text-[color:var(--color-navy)] hover:border-[color:var(--color-navy)]/30"
      }`}
    >
      <span className="mr-2 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 align-middle">
        {checked && <span className="h-2 w-2 rounded-full bg-[color:var(--color-pink-hot)]" />}
      </span>
      {label}
    </button>
  );
}

function ToggleChip({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
        checked
          ? "border-[color:var(--color-pink-hot)] bg-[color:var(--color-blossom-soft)] text-[color:var(--color-navy)]"
          : "border-[color:var(--color-line)] bg-white text-[color:var(--color-navy)] hover:border-[color:var(--color-navy)]/30"
      }`}
    >
      <span className="mr-2 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 align-middle">
        {checked && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="m4 12 5 5L20 6" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {label}
    </button>
  );
}

function NavRow({
  onBack,
  onNext,
  nextDisabled,
}: {
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
}) {
  return (
    <div className="mt-6 flex justify-between gap-2">
      <button onClick={onBack} type="button" className="btn btn-ghost text-sm">
        ← Back
      </button>
      <button
        onClick={onNext}
        type="button"
        disabled={nextDisabled}
        className="btn btn-pink text-sm disabled:opacity-50"
      >
        Continue →
      </button>
    </div>
  );
}

function ReviewList({ answers, fee }: { answers: Answers; fee: number }) {
  return (
    <dl className="divide-y divide-[color:var(--color-line-2)] rounded-2xl border border-[color:var(--color-line)] bg-white">
      <Row label="Name" value={answers.parentName} />
      <Row label="Email" value={answers.parentEmail} />
      <Row label="WhatsApp" value={answers.parentWhatsapp} />
      <Row label="Based in" value={[answers.country, answers.city].filter(Boolean).join(", ")} />
      <Row
        label={`Children (${answers.children.length})`}
        value={answers.children
          .map((c, i) => `Child ${i + 1}: ${c.age}${c.notes ? ` (${c.notes})` : ""}`)
          .join(" · ")}
      />
      <Row label="Shortlist size" value={`${answers.shortlistSize} schools`} />
      <Row label="Timeframe" value={answers.timeframe} />
      <Row label="Areas" value={answers.areas.length ? answers.areas.join(", ") : "Open to suggestions"} />
      <Row label="Priorities" value={answers.priorities.length ? answers.priorities.join(", ") : "No specific priorities"} />
      <Row label="Budget" value={BUDGETS.find((b) => b.value === answers.budgetBand)?.label ?? ""} />
      {answers.notes && <Row label="Notes" value={answers.notes} />}
      {answers.referral && <Row label="Heard about us via" value={answers.referral} />}
      <Row label="Concierge fee" value={`$${fee} USD (paid upfront to start)`} />
    </dl>
  );
}

function ShortlistOption({
  value,
  title,
  body,
  priceLabel,
  checked,
  onChange,
}: {
  value: string;
  title: string;
  body: string;
  priceLabel: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${
        checked
          ? "border-[color:var(--color-pink-hot)] bg-[color:var(--color-blossom-soft)]"
          : "border-[color:var(--color-line)] bg-white hover:border-[color:var(--color-navy)]/30"
      }`}
    >
      <span className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2">
        {checked && <span className="h-2 w-2 rounded-full bg-[color:var(--color-pink-hot)]" />}
      </span>
      <span className="flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span className="font-display text-lg text-[color:var(--color-navy)]">{title}</span>
          <span className={`text-xs font-bold uppercase tracking-widest ${checked ? "text-[color:var(--color-pink-hot-deep)]" : "text-[color:var(--color-ink-mute)]"}`}>
            {priceLabel}
          </span>
        </span>
        <span className="mt-1 block text-[13px] text-[color:var(--color-ink-mute)]">{body}</span>
      </span>
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 p-3 sm:grid-cols-[140px_1fr]">
      <dt className="text-xs font-semibold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
        {label}
      </dt>
      <dd className="text-sm text-[color:var(--color-navy)]">{value}</dd>
    </div>
  );
}

const input =
  "w-full rounded-xl border border-[color:var(--color-line)] bg-white px-4 py-3 text-[15px] outline-none focus:border-[color:var(--color-pink-hot)]";
