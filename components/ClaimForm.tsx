"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "@/lib/firebase";
import { useAuth } from "./AuthProvider";

type Mode = "new" | "existing";

export function ClaimForm({
  slug,
  schoolName,
}: {
  slug: string;
  schoolName: string;
}) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<Mode>("new");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      let uid = user?.uid;

      if (!uid) {
        if (mode === "new") {
          const cred = await createUserWithEmailAndPassword(auth(), email, password);
          if (name) await updateProfile(cred.user, { displayName: name });
          uid = cred.user.uid;
          await setDoc(doc(firestore(), "users", uid), {
            email,
            displayName: name,
            phone: phone || null,
            createdAt: new Date().toISOString(),
          });
        } else {
          const cred = await signInWithEmailAndPassword(auth(), email, password);
          uid = cred.user.uid;
        }
      }

      const claimId = `${slug}_${uid}`;
      await setDoc(doc(firestore(), "claims", claimId), {
        slug,
        uid,
        submittedName: name || user?.displayName || "",
        submittedRole: role,
        submittedEmail: email || user?.email || "",
        submittedPhone: phone || null,
        proofUrl: proofUrl || null,
        status: "pending",
        createdAt: new Date().toISOString(),
      });

      setDone(true);
      setTimeout(() => router.push("/school"), 1400);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="mt-8 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-leaf-soft)] p-6 text-center">
        <p className="font-display text-xl text-[color:var(--color-navy)]">
          Thanks — your claim for {schoolName} is in.
        </p>
        <p className="mt-2 text-sm text-[color:var(--color-ink-mute)]">
          Our team usually reviews within one working day. We'll email you when
          you can start editing.
        </p>
      </div>
    );
  }

  if (authLoading) {
    return <div className="mt-8 text-center text-sm text-[color:var(--color-ink-mute)]">Loading…</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      {!user && (
        <div className="mb-2 flex gap-2 text-sm">
          <button
            type="button"
            onClick={() => setMode("new")}
            className={`rounded-full px-3 py-1 ${mode === "new" ? "bg-[color:var(--color-navy)] text-white" : "border border-[color:var(--color-line)]"}`}
          >
            New school
          </button>
          <button
            type="button"
            onClick={() => setMode("existing")}
            className={`rounded-full px-3 py-1 ${mode === "existing" ? "bg-[color:var(--color-navy)] text-white" : "border border-[color:var(--color-line)]"}`}
          >
            Existing account
          </button>
        </div>
      )}

      {!user && mode === "new" && (
        <Field label="Your full name" required>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
            placeholder="e.g. Ama Boateng"
          />
        </Field>
      )}

      <Field label={`Your role at ${schoolName}`} required>
        <input
          type="text"
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={inputCls}
          placeholder="e.g. Head of School, Admissions Officer, Owner"
        />
      </Field>

      {!user && (
        <Field label="Work email" required>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
            placeholder="you@yourschool.edu.gh"
          />
        </Field>
      )}

      {!user && mode === "new" && (
        <Field label="Phone number">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputCls}
            placeholder="+233 …"
          />
        </Field>
      )}

      {!user && (
        <Field label={mode === "new" ? "Create a password" : "Password"} required>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
            placeholder="At least 8 characters"
          />
        </Field>
      )}

      <Field
        label="Link that proves your role (optional)"
        hint="Your school's staff or contact page, LinkedIn, etc. Helps us verify faster."
      >
        <input
          type="url"
          value={proofUrl}
          onChange={(e) => setProofUrl(e.target.value)}
          className={inputCls}
          placeholder="https://…"
        />
      </Field>

      {error && (
        <p className="rounded-lg bg-[color:var(--color-coral-soft)] p-3 text-sm text-[color:var(--color-coral)]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-pink w-full"
      >
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
