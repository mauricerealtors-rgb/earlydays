"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/school";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth(), email, password);
      router.push(next);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign-in failed.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReset() {
    if (!email) {
      setError("Enter your email above first, then tap Reset password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth(), email);
      setResetSent(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset email failed.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-[color:var(--color-navy)]">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-[color:var(--color-line)] bg-white px-4 py-3 text-[15px] outline-none focus:border-[color:var(--color-navy)]"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-[color:var(--color-navy)]">Password</span>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-[color:var(--color-line)] bg-white px-4 py-3 text-[15px] outline-none focus:border-[color:var(--color-navy)]"
        />
      </label>

      {resetSent && (
        <p className="rounded-lg bg-[color:var(--color-leaf-soft)] p-3 text-sm text-[color:var(--color-navy)]">
          Reset email sent — check your inbox.
        </p>
      )}
      {error && (
        <p className="rounded-lg bg-[color:var(--color-coral-soft)] p-3 text-sm text-[color:var(--color-coral)]">
          {error}
        </p>
      )}

      <button type="submit" disabled={submitting} className="btn btn-pink w-full">
        {submitting ? "Signing in…" : "Sign in"}
      </button>

      <div className="flex justify-between text-sm">
        <button type="button" onClick={handleReset} className="text-[color:var(--color-navy)] underline">
          Reset password
        </button>
        <Link href="/schools" className="text-[color:var(--color-ink-mute)] underline">
          Claim a school instead
        </Link>
      </div>
    </form>
  );
}
