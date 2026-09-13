"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Plan = "starter" | "professional" | "complete";
type Mode = "book" | "message";

const PLANS: Array<{
  key: Plan;
  name: string;
  tag: string;
  price: string;
  priceNote: string;
  recurring: string;
  summary: string;
  features: string[];
  limits?: string[];
  highlighted?: boolean;
  preview?: { label: string; href: string };
}> = [
  {
    key: "starter",
    name: "Starter",
    tag: "Informational",
    price: "GH₵3,500",
    priceNote: "one-time",
    recurring: "Domain and hosting included for 12 months",
    summary:
      "A clean, mobile-friendly home for schools that just need to look good online.",
    features: [
      "Up to 5 pages",
      "Works well on phone, tablet and laptop",
      "WhatsApp button for parents",
      "Google Maps location",
      "Photo gallery (up to 10 photos)",
      "Your own domain plus hosting for 12 months",
      "Secure padlock in the browser",
      "Listed on Google search",
      "Linked EarlyDays profile",
    ],
    limits: [
      "No online admission form",
      "No programme detail pages",
      "You cannot edit the pages yourself",
    ],
  },
  {
    key: "professional",
    name: "Professional",
    tag: "Most popular",
    price: "GH₵8,500",
    priceNote: "setup",
    recurring: "Plus GH₵500 a month for hosting and support",
    summary:
      "A proper school website with an online admission form, programme pages and a photo gallery.",
    features: [
      "Everything in Starter, plus:",
      "As many pages as you need",
      "Online admission form for parents",
      "A page for each programme or class",
      "Photo and video gallery",
      "News and events page",
      "Google Analytics to see visitors",
      "Set up so parents find you on Google",
      "Edit the pages yourself, no coding needed",
      "Featured spot on EarlyDays",
      "Fast email support",
    ],
    highlighted: true,
    preview: {
      label: "See a live preview →",
      href: "/for-schools/preview/minime-montessori-school",
    },
  },
  {
    key: "complete",
    name: "Complete",
    tag: "Website plus Management",
    price: "From GH₵15,000",
    priceNote: "custom",
    recurring: "Monthly fee agreed with your school. Book a call.",
    summary:
      "Everything in Professional, plus a system to run children, admissions, attendance, fees and parent messages.",
    features: [
      "Everything in Professional, plus:",
      "Records for every child and parent",
      "Admission from first enquiry to first day of school",
      "Daily attendance (morning drop-off and pickup)",
      "Fees and invoices (MoMo, card, bank, cash)",
      "Automatic receipts sent to parents",
      "Staff accounts with roles and permissions",
      "Parent portal for fees, updates and receipts",
      "SMS and WhatsApp messages to parents",
      "Dashboard and simple reports for the head",
    ],
  },
];

export function ForSchoolsPricing() {
  const [openPlan, setOpenPlan] = useState<Plan | null>(null);
  const [mode, setMode] = useState<Mode>("book");

  return (
    <>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => (
          <PlanCard
            key={p.key}
            plan={p}
            onBook={() => {
              setOpenPlan(p.key);
              setMode("book");
            }}
            onMessage={() => {
              setOpenPlan(p.key);
              setMode("message");
            }}
          />
        ))}
      </div>
      <p className="mx-auto mt-8 max-w-3xl text-center text-[12px] text-[color:var(--color-ink-mute)] md:text-[13px]">
        Not sure which plan fits? Start with your free EarlyDays profile. We
        can help you upgrade only when the time is right.
      </p>

      {openPlan && (
        <EnquireModal
          plan={openPlan}
          initialMode={mode}
          onClose={() => setOpenPlan(null)}
        />
      )}
    </>
  );
}

function PlanCard({
  plan,
  onBook,
  onMessage,
}: {
  plan: (typeof PLANS)[number];
  onBook: () => void;
  onMessage: () => void;
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
      {highlighted ? (
        <span className="absolute -top-3 left-6 rounded-full bg-[color:var(--color-pink-hot)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
          {plan.tag}
        </span>
      ) : (
        <span className="mb-3 inline-flex w-fit items-center rounded-full bg-[color:var(--color-cream-deep)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-navy)]">
          {plan.tag}
        </span>
      )}
      <h3 className="font-display text-[22px] leading-tight md:text-[26px]">
        {plan.name}
      </h3>
      <p className="mt-2 text-[13px] leading-relaxed text-[color:var(--color-ink-mute)]">
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
      {plan.limits && plan.limits.length > 0 && (
        <ul className="mt-4 space-y-1.5 border-t border-dashed border-[color:var(--color-line)] pt-4 text-[12px] text-[color:var(--color-ink-mute)]">
          {plan.limits.map((l) => (
            <li key={l} className="flex items-start gap-2">
              <span aria-hidden className="mt-0.5">
                ·
              </span>
              <span>{l}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6 flex-1" />
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onBook}
          className={`btn text-sm ${highlighted ? "btn-pink" : "btn-primary"}`}
        >
          Book a call
        </button>
        <button
          type="button"
          onClick={onMessage}
          className="btn btn-ghost text-sm"
        >
          Send a message
        </button>
      </div>
      {plan.preview && (
        <Link
          href={plan.preview.href}
          className="mt-3 text-center text-[12px] font-semibold text-[color:var(--color-sky-deep)] hover:underline"
        >
          {plan.preview.label}
        </Link>
      )}
    </div>
  );
}

function EnquireModal({
  plan,
  initialMode,
  onClose,
}: {
  plan: Plan;
  initialMode: Mode;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const planMeta = PLANS.find((p) => p.key === plan)!;
  const [schoolName, setSchoolName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
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
    if (mode === "book" && (!date || !time)) {
      setError("Please pick a date and a time for the call.");
      return;
    }
    if (mode === "message" && !message.trim()) {
      setError("Please add a short message.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/for-schools/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          plan,
          schoolName,
          contactName,
          phone,
          email: mode === "message" ? email : "",
          message: mode === "message" ? message : "",
          date: mode === "book" ? date : "",
          time: mode === "book" ? time : "",
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
              {planMeta.name} plan
            </p>
            <p className="font-display text-[18px] leading-tight text-[color:var(--color-navy)]">
              {mode === "book" ? "Book a call" : "Send a message"}
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
            <div className="mb-4 inline-flex rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-cream)] p-1 text-[12px] font-semibold">
              <button
                type="button"
                onClick={() => setMode("book")}
                className={`rounded-full px-3 py-1 ${mode === "book" ? "bg-[color:var(--color-navy)] text-white" : "text-[color:var(--color-navy)]"}`}
              >
                Book a call
              </button>
              <button
                type="button"
                onClick={() => setMode("message")}
                className={`rounded-full px-3 py-1 ${mode === "message" ? "bg-[color:var(--color-navy)] text-white" : "text-[color:var(--color-navy)]"}`}
              >
                Send a message
              </button>
            </div>

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

              {mode === "book" ? (
                <>
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
                </>
              ) : (
                <>
                  <Field
                    label="Email (optional)"
                    value={email}
                    onChange={setEmail}
                    type="email"
                    placeholder="you@school.edu.gh"
                  />
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
                      Your message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="mt-1 w-full rounded-xl border border-[color:var(--color-line)] bg-white px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-sky-deep)]"
                      placeholder="Tell us about your school and what you need."
                    />
                  </div>
                </>
              )}

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
                {submitting
                  ? "Sending..."
                  : mode === "book"
                    ? "Confirm the call"
                    : "Send message"}
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
              {mode === "book" ? "Call confirmed" : "Message received"}
            </h3>
            <p className="mt-2 text-[13px] text-[color:var(--color-ink-mute)]">
              {mode === "book"
                ? "We will call you at the time you picked. Save the number that reaches out."
                : "We will get back on WhatsApp or email within one working day."}
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
