"use client";

import { useMemo, useState } from "react";

type Plan = "starter" | "professional" | "complete";

const PLANS: Array<{
  key: Plan;
  tier: string;
  name: string;
  summary: string;
  price: string;
  priceNote: string;
  recurring: string;
  features: string[];
  bestFor: string;
  highlighted?: boolean;
  badge?: string;
}> = [
  {
    key: "starter",
    tier: "Starter",
    name: "Be Found",
    summary: "A simple, professional online home for your school.",
    price: "GH₵3,500",
    priceNote: "one-time",
    recurring: "Domain and hosting included for 12 months",
    features: [
      "A clean website that makes a good first impression",
      "Your school, classes and contact details in one place",
      "Parents can find you on Google",
      "One tap to contact you on WhatsApp",
      "Your location clearly shown on Google Maps",
      "Your best school photos displayed properly",
      "Your own domain name",
      "Works beautifully on phones",
      "Linked to your EarlyDays profile",
      "We handle the technical setup for you",
    ],
    bestFor:
      "Best for schools that mainly need a professional online presence.",
  },
  {
    key: "professional",
    tier: "Professional",
    name: "Get Enquiries",
    summary:
      "A complete school website that helps parents understand your school and take the next step.",
    price: "GH₵8,500",
    priceNote: "setup",
    recurring: "Plus GH₵500 a month for hosting and support",
    features: [
      "Everything in Be Found, plus:",
      "A page for every programme or class",
      "Clear admissions information",
      "Parents can send an admission enquiry online",
      "Proper photo and video galleries",
      "Tell parents what makes your school different",
      "News, events and school updates",
      "Help parents find you on Google",
      "See how many people visit your website",
      "Update your content without calling a developer",
      "Featured school profile on EarlyDays",
      "Fast support when you need us",
    ],
    bestFor:
      "Best for schools that want their website to help bring in enquiries, not just display information.",
    highlighted: true,
    badge: "Most popular",
  },
  {
    key: "complete",
    tier: "Complete",
    name: "Run Your School",
    summary:
      "Your website plus the tools your team needs to manage the school.",
    price: "From GH₵15,000",
    priceNote: "custom",
    recurring: "Management system priced according to your school's needs",
    features: [
      "Everything in Get Enquiries, plus:",
      "Keep every child's information in one place",
      "Track a child from first enquiry to enrolment",
      "Know who is in school each day",
      "Keep parent and guardian information organised",
      "Create fees and invoices",
      "Record payments and send receipts",
      "See what has been paid and what is still outstanding",
      "Give staff access based on their role",
      "Give parents their own place to see fees, updates and receipts",
      "Send important messages to parents",
      "See what is happening across the school from one dashboard",
      "Simple reports for the school owner or head",
    ],
    bestFor:
      "Best for schools ready to replace scattered paperwork, spreadsheets and WhatsApp with one system.",
  },
];

export function ForSchoolsPricing() {
  const [openPlan, setOpenPlan] = useState<Plan | null>(null);

  return (
    <>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => (
          <PlanCard
            key={p.key}
            plan={p}
            onBook={() => setOpenPlan(p.key)}
          />
        ))}
      </div>

      {openPlan && (
        <EnquireModal plan={openPlan} onClose={() => setOpenPlan(null)} />
      )}
    </>
  );
}

function PlanCard({
  plan,
  onBook,
}: {
  plan: (typeof PLANS)[number];
  onBook: () => void;
}) {
  const highlighted = plan.highlighted;
  return (
    <div
      className={`relative flex h-full flex-col rounded-3xl border p-6 md:p-8 ${
        highlighted
          ? "border-[color:var(--color-pink-hot)] bg-white shadow-[0_20px_60px_rgba(236,30,122,0.12)] ring-1 ring-[color:var(--color-pink-hot)]/30"
          : "border-[color:var(--color-line)] bg-white"
      }`}
    >
      {highlighted && plan.badge && (
        <span className="absolute -top-3 left-6 rounded-full bg-[color:var(--color-pink-hot)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
          {plan.badge}
        </span>
      )}
      <span className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
        {plan.tier}
      </span>
      <h3 className="mt-1 font-display text-[26px] leading-tight text-[color:var(--color-navy)] md:text-[30px]">
        {plan.name}
      </h3>
      <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--color-navy-2)] md:text-[15px]">
        {plan.summary}
      </p>
      <div className="mt-5">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-[28px] leading-none text-[color:var(--color-navy)] md:text-[32px]">
            {plan.price}
          </span>
          <span className="text-[12px] text-[color:var(--color-ink-mute)]">
            {plan.priceNote}
          </span>
        </div>
        <p className="mt-1 text-[12px] text-[color:var(--color-ink-mute)]">
          {plan.recurring}
        </p>
      </div>
      <ul className="mt-6 space-y-2 text-[13px]">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Tick />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <p className="mt-5 border-t border-dashed border-[color:var(--color-line)] pt-4 text-[12px] italic text-[color:var(--color-ink-mute)]">
        {plan.bestFor}
      </p>
      <div className="mt-6 flex-1" />
      <button
        type="button"
        onClick={onBook}
        className={`btn text-sm ${highlighted ? "btn-pink" : "btn-primary"}`}
      >
        Book a call
      </button>
    </div>
  );
}

function EnquireModal({
  plan,
  onClose,
}: {
  plan: Plan;
  onClose: () => void;
}) {
  const planMeta = PLANS.find((p) => p.key === plan)!;
  const [schoolName, setSchoolName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const dateOptions = useMemo(() => buildDateOptions(), []);
  const timeOptions = useMemo(() => buildTimeOptions(), []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!schoolName.trim() || !contactName.trim() || !phone.trim()) {
      setError("Please fill school name, your name and phone.");
      return;
    }
    if (!date || !time) {
      setError("Please pick a day and a time for the call.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/for-schools/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "book",
          plan,
          schoolName,
          contactName,
          phone,
          date,
          time,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Could not send. Please try again.");
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[color:var(--color-navy)]/70 p-0 md:items-center md:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-t-3xl bg-white md:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[color:var(--color-line)] px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
              {planMeta.tier} · {planMeta.name}
            </p>
            <p className="font-display text-[18px] leading-tight text-[color:var(--color-navy)]">
              Book a call
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-[color:var(--color-ink-mute)] hover:bg-[color:var(--color-cream-deep)]"
          >
            <svg
              viewBox="0 0 20 20"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            >
              <path d="M4 4l12 12M16 4L4 16" />
            </svg>
          </button>
        </div>

        {!success ? (
          <div className="p-5">
            <form onSubmit={submit} className="space-y-3">
              <Field
                label="School name"
                value={schoolName}
                onChange={setSchoolName}
                placeholder="e.g. Little Stars Preschool"
              />
              <Field
                label="Your name"
                value={contactName}
                onChange={setContactName}
                placeholder="Head, Proprietor, Administrator"
              />
              <Field
                label="Phone or WhatsApp"
                value={phone}
                onChange={setPhone}
                type="tel"
                placeholder="0244 000 000"
              />

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
                  Pick a day
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {dateOptions.map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setDate(opt.value)}
                      className={`rounded-xl border px-3 py-2 text-left text-[13px] transition ${
                        date === opt.value
                          ? "border-[color:var(--color-navy)] bg-[color:var(--color-navy)] text-white"
                          : "border-[color:var(--color-line)] bg-white text-[color:var(--color-navy)] hover:bg-[color:var(--color-cream-deep)]"
                      }`}
                    >
                      <div className="font-semibold">{opt.weekday}</div>
                      <div
                        className={`text-[11px] ${date === opt.value ? "text-white/80" : "text-[color:var(--color-ink-mute)]"}`}
                      >
                        {opt.pretty}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
                  Pick a time
                </label>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {timeOptions.map((t) => (
                    <button
                      type="button"
                      key={t.value}
                      onClick={() => setTime(t.value)}
                      className={`rounded-xl border px-2 py-2 text-[12px] transition ${
                        time === t.value
                          ? "border-[color:var(--color-navy)] bg-[color:var(--color-navy)] text-white"
                          : "border-[color:var(--color-line)] bg-white text-[color:var(--color-navy)] hover:bg-[color:var(--color-cream-deep)]"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p className="rounded-lg bg-[color:var(--color-coral-soft)] px-3 py-2 text-[12px] text-[color:var(--color-coral)]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary w-full text-sm disabled:opacity-60"
              >
                {submitting ? "Sending..." : "Confirm the call"}
              </button>
            </form>
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[color:var(--color-leaf-soft)] text-[#2F7C25]">
              <svg
                viewBox="0 0 20 20"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 10.5l4 4 8-9" />
              </svg>
            </div>
            <h3 className="mt-3 font-display text-[20px] leading-tight">
              Call confirmed
            </h3>
            <p className="mt-2 text-[13px] text-[color:var(--color-ink-mute)]">
              We will call you at the time you picked. Save the number that
              reaches out.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost mt-5 text-sm"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-[color:var(--color-line)] bg-white px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-sky-deep)]"
      />
    </div>
  );
}

function Tick() {
  return (
    <svg
      aria-hidden
      className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-leaf)]"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M4 10.5l4 4 8-9"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function buildDateOptions() {
  const options: Array<{ value: string; weekday: string; pretty: string }> = [];
  const now = new Date();
  for (let i = 1; i <= 2; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const value = `${yyyy}-${mm}-${dd}`;
    const weekday = d.toLocaleDateString("en-GB", { weekday: "long" });
    const pretty = d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
    options.push({ value, weekday, pretty });
  }
  return options;
}

function buildTimeOptions() {
  return [
    { value: "09:00", label: "9 AM" },
    { value: "10:00", label: "10 AM" },
    { value: "11:00", label: "11 AM" },
    { value: "13:00", label: "1 PM" },
    { value: "14:00", label: "2 PM" },
    { value: "15:00", label: "3 PM" },
    { value: "16:00", label: "4 PM" },
    { value: "17:00", label: "5 PM" },
  ];
}
