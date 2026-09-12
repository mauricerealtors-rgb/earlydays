"use client";

import { useState } from "react";

export function EnquiryForm({
  slug,
  schoolName,
}: {
  slug: string;
  schoolName: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          parentName: name,
          parentEmail: email,
          parentPhone: phone,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Couldn't send. Try again.");
      setSent(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div id="enquire" className="card-soft rounded-2xl bg-[color:var(--color-leaf-soft)] p-5">
        <p className="font-display text-lg text-[color:var(--color-navy)]">
          Sent — {schoolName} will be in touch.
        </p>
        <p className="mt-1 text-sm text-[color:var(--color-ink-mute)]">
          Most schools reply within 1–2 working days. Check your inbox (and spam).
        </p>
      </div>
    );
  }

  return (
    <form
      id="enquire"
      onSubmit={handleSubmit}
      className="card-soft rounded-2xl bg-white p-5 md:p-6"
    >
      <h3 className="font-display text-lg text-[color:var(--color-navy)]">
        Request information from {schoolName}
      </h3>
      <p className="mt-1 text-sm text-[color:var(--color-ink-mute)]">
        Your details go straight to the school. EarlyDays never uses them for
        anything else.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block sm:col-span-1">
          <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
            Your name *
          </span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={input}
            placeholder="Ama Boateng"
          />
        </label>
        <label className="block sm:col-span-1">
          <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
            Email *
          </span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={input}
            placeholder="you@example.com"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
            Phone or WhatsApp
          </span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={input}
            placeholder="+233 …"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
            Message *
          </span>
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${input} min-h-[100px]`}
            placeholder={`Hello ${schoolName}, I'm looking for a place for my child (age …). Could I arrange a visit?`}
          />
        </label>
      </div>

      {error && (
        <p className="mt-3 rounded-lg bg-[color:var(--color-coral-soft)] p-3 text-sm text-[color:var(--color-coral)]">
          {error}
        </p>
      )}

      <button type="submit" disabled={sending} className="btn btn-pink mt-4 w-full sm:w-auto">
        {sending ? "Sending…" : `Send to ${schoolName}`}
      </button>
    </form>
  );
}

const input =
  "w-full rounded-xl border border-[color:var(--color-line)] bg-white px-3 py-2 text-[15px] outline-none focus:border-[color:var(--color-navy)]";
