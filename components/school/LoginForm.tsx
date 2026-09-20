"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "@/lib/firebase";

type Mode = "signin" | "signup";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/school";
  const [mode, setMode] = useState<Mode>(
    searchParams.get("mode") === "signup" ? "signup" : "signin"
  );
  const [name, setName] = useState("");
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
      if (mode === "signup") {
        const cred = await createUserWithEmailAndPassword(auth(), email, password);
        if (name) await updateProfile(cred.user, { displayName: name });
        // The claim was made before this account existed, so it carries no uid.
        // Admin links the two by email, which means the address has to be
        // readable here — hence the users doc, written lowercase to match.
        await setDoc(
          doc(firestore(), "users", cred.user.uid),
          {
            email: email.trim().toLowerCase(),
            displayName: name,
            createdAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } else {
        await signInWithEmailAndPassword(auth(), email, password);
      }
      router.push(next);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
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
      <div className="flex gap-2 text-sm">
        {(["signin", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
            }}
            className={`rounded-full px-3 py-1 ${
              mode === m
                ? "bg-[color:var(--color-navy)] text-white"
                : "border border-[color:var(--color-line)]"
            }`}
          >
            {m === "signin" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      {mode === "signup" && (
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-[color:var(--color-navy)]">
            Your full name
          </span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ama Boateng"
            className="w-full rounded-xl border border-[color:var(--color-line)] bg-white px-4 py-3 text-[15px] outline-none focus:border-[color:var(--color-navy)]"
          />
        </label>
      )}

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
          minLength={mode === "signup" ? 8 : undefined}
          placeholder={mode === "signup" ? "At least 8 characters" : undefined}
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
        {submitting
          ? mode === "signup"
            ? "Creating account…"
            : "Signing in…"
          : mode === "signup"
            ? "Create account"
            : "Sign in"}
      </button>

      {mode === "signup" && (
        <p className="text-center text-xs text-[color:var(--color-ink-mute)]">
          Use the same email you claimed with, so we can match your account to
          your school.
        </p>
      )}

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
