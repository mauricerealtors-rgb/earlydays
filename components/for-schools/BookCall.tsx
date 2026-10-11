"use client";

import { useMemo, useState } from "react";

/**
 * Book a call.
 *
 * This is the booking flow that used to live inside ForSchoolsPricing, lifted
 * out before that component was deleted. Nothing about the parent-facing
 * experience changed: the same two day choices, the same eight time slots, the
 * same single POST. What changed is what it is attached to. It used to be
 * triggered by a price card, so the payload carried a plan key. There are no
 * plans now, so it carries the service the school was reading about when they
 * decided to call, which is the useful thing to know before picking up the
 * phone.
 */

export type Service =
  | "general"
  | "listing"
  | "website"
  | "management"
  | "social"
  | "seo"
  | "ads";

const SERVICE_LABEL: Record<Service, string> = {
  general: "A conversation about your school",
  listing: "EarlyDays listing",
  website: "School website",
  management: "School management system",
  social: "Social media management",
  seo: "Local SEO and Google",
  ads: "Paid ads",
};

export function BookCallButton({
  service = "general",
  label = "Book a call",
  variant = "primary",
  className = "",
}: {
  service?: Service;
  label?: string;
  variant?: "primary" | "ghost" | "quiet";
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const cls =
    variant === "primary"
      ? "btn btn-pink btn-wrap"
      : variant === "ghost"
        ? "btn btn-ghost btn-wrap"
        : "inline-flex items-center gap-1.5 text-[13px] font-bold text-[color:var(--color-coral)] underline decoration-[color:var(--color-sun)] decoration-2 underline-offset-4";

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`${cls} ${className}`}>
        {label}
        {variant === "quiet" && (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
      {open && <BookCallModal service={service} onClose={() => setOpen(false)} />}
    </>
  );
}

function BookCallModal({
  service,
  onClose,
}: {
  service: Service;
  onClose: () => void;
}) {
  const [schoolName, setSchoolName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
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
          service,
          schoolName,
          contactName,
          phone,
          message,
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
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[#10243B]/70 p-0 md:items-center md:p-6"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white md:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-[color:var(--color-line)] bg-white px-5 py-4">
          <div className="min-w-0">
            <p className="truncate text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
              {SERVICE_LABEL[service]}
            </p>
            <p className="text-[18px] font-extrabold leading-tight tracking-tight text-[color:var(--color-ink)]">
              Book a call
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-full p-2 text-[color:var(--color-ink-mute)] hover:bg-[color:var(--color-cream-deep)]"
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
                      className={`min-w-0 rounded-xl border px-3 py-2 text-left text-[13px] transition ${
                        date === opt.value
                          ? "border-[color:var(--color-ink)] bg-[color:var(--color-ink)] text-white"
                          : "border-[color:var(--color-line)] bg-white text-[color:var(--color-ink)] hover:bg-[color:var(--color-cream-deep)]"
                      }`}
                    >
                      <div className="truncate font-semibold">{opt.weekday}</div>
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
                      className={`min-w-0 rounded-xl border px-2 py-2 text-[12px] transition ${
                        time === t.value
                          ? "border-[color:var(--color-ink)] bg-[color:var(--color-ink)] text-white"
                          : "border-[color:var(--color-line)] bg-white text-[color:var(--color-ink)] hover:bg-[color:var(--color-cream-deep)]"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="bc-message"
                  className="block text-[11px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]"
                >
                  Anything we should look at first?{" "}
                  <span className="font-semibold normal-case tracking-normal text-[color:var(--color-ink-mute)]">
                    optional
                  </span>
                </label>
                <textarea
                  id="bc-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                  placeholder="Our website, our Instagram, admissions for next term"
                  className="mt-1 w-full rounded-xl border border-[color:var(--color-line)] bg-white px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-sun)]"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-[color:var(--color-sun-soft)] px-3 py-2 text-[12px] font-semibold text-[color:var(--color-coral)]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-pink w-full text-sm disabled:opacity-60"
              >
                {submitting ? "Sending..." : "Confirm the call"}
              </button>
              <p className="text-center text-[11px] text-[color:var(--color-ink-mute)]">
                Thirty minutes. No obligation. We will not add you to a mailing
                list.
              </p>
            </form>
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[color:var(--color-leaf-soft)] text-[color:var(--color-leaf)]">
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
            <h3 className="mt-3 text-[20px] font-extrabold leading-tight tracking-tight text-[color:var(--color-ink)]">
              Call confirmed
            </h3>
            <p className="mt-2 text-[13px] text-[color:var(--color-ink-mute)]">
              We will call you at the time you picked. Save the number that
              reaches out, that is us.
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
        className="mt-1 w-full rounded-xl border border-[color:var(--color-line)] bg-white px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-sun)]"
      />
    </div>
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
