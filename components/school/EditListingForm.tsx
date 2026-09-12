"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";

interface Baseline {
  name: string;
  shortDescription: string;
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  hours: string;
  feesHint: string;
  address: string;
  admissions: "open" | "waitlist" | "closed" | "unknown";
}

type FormState = Omit<Baseline, "name">;

export function EditListingForm({
  slug,
  baseline,
}: {
  slug: string;
  baseline: Baseline;
}) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [ownerCheck, setOwnerCheck] = useState<"pending" | "owner" | "denied">("pending");
  const [form, setForm] = useState<FormState>({
    shortDescription: baseline.shortDescription,
    description: baseline.description,
    phone: baseline.phone,
    whatsapp: baseline.whatsapp,
    email: baseline.email,
    website: baseline.website,
    hours: baseline.hours,
    feesHint: baseline.feesHint,
    address: baseline.address,
    admissions: baseline.admissions,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/school/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const ownerSnap = await getDoc(doc(firestore(), "listingOwners", slug));
      if (!ownerSnap.exists() || ownerSnap.data().uid !== user.uid) {
        setOwnerCheck("denied");
        return;
      }
      setOwnerCheck("owner");
      const overrideSnap = await getDoc(doc(firestore(), "listingOverrides", slug));
      if (overrideSnap.exists()) {
        const data = overrideSnap.data();
        setForm((prev) => ({
          shortDescription: data.shortDescription ?? prev.shortDescription,
          description: data.description ?? prev.description,
          phone: data.phone ?? prev.phone,
          whatsapp: data.whatsapp ?? prev.whatsapp,
          email: data.email ?? prev.email,
          website: data.website ?? prev.website,
          hours: data.hours ?? prev.hours,
          feesHint: data.feesHint ?? prev.feesHint,
          address: data.address ?? prev.address,
          admissions: data.admissions ?? prev.admissions,
        }));
      }
    })();
  }, [user, slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await setDoc(
        doc(firestore(), "listingOverrides", slug),
        {
          ...form,
          updatedAt: new Date().toISOString(),
          updatedBy: user.uid,
        },
        { merge: true }
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  if (loading || ownerCheck === "pending") {
    return <p className="text-sm text-[color:var(--color-ink-mute)]">Loading…</p>;
  }
  if (ownerCheck === "denied") {
    return (
      <div className="card-soft rounded-2xl p-6">
        <p className="font-semibold text-[color:var(--color-navy)]">
          You don't have access to edit this listing.
        </p>
        <p className="mt-1 text-sm text-[color:var(--color-ink-mute)]">
          If you believe this is your school and your claim was approved, contact support.
        </p>
        <Link href="/school" className="mt-4 inline-flex btn btn-ghost text-sm">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <>
      <div className="mb-4">
        <h2 className="font-display text-xl text-[color:var(--color-navy)]">
          Profile
        </h2>
        <p className="text-sm text-[color:var(--color-ink-mute)]">
          Changes go live within a minute of saving.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <TextField label="Short description" hint="One sentence. Shown on cards and search results.">
          <input value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} className={input} maxLength={200} />
        </TextField>

        <TextField label="Full description" hint="1–2 paragraphs. Shown at the top of your profile page.">
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)} className={`${input} min-h-[140px]`} />
        </TextField>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Phone">
            <input value={form.phone} onChange={(e) => set("phone", e.target.value)} className={input} />
          </TextField>
          <TextField label="WhatsApp">
            <input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className={input} />
          </TextField>
          <TextField label="Email">
            <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={input} />
          </TextField>
          <TextField label="Website">
            <input type="url" value={form.website} onChange={(e) => set("website", e.target.value)} className={input} />
          </TextField>
        </div>

        <TextField label="Address">
          <input value={form.address} onChange={(e) => set("address", e.target.value)} className={input} />
        </TextField>

        <TextField label="Hours">
          <input value={form.hours} onChange={(e) => set("hours", e.target.value)} className={input} placeholder="Monday–Friday, 7:30 AM – 4:00 PM" />
        </TextField>

        <TextField label="Fees hint" hint="Optional. e.g. 'from GH₵3,500 per term'.">
          <input value={form.feesHint} onChange={(e) => set("feesHint", e.target.value)} className={input} />
        </TextField>

        <TextField label="Admissions status">
          <select value={form.admissions} onChange={(e) => set("admissions", e.target.value as FormState["admissions"])} className={input}>
            <option value="unknown">Not published</option>
            <option value="open">Open for admissions</option>
            <option value="waitlist">Waitlist only</option>
            <option value="closed">Closed for this year</option>
          </select>
        </TextField>

        {error && <p className="rounded-lg bg-[color:var(--color-coral-soft)] p-3 text-sm text-[color:var(--color-coral)]">{error}</p>}
        {saved && <p className="rounded-lg bg-[color:var(--color-leaf-soft)] p-3 text-sm text-[color:var(--color-navy)]">Saved. Live within a minute.</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn btn-pink">
            {saving ? "Saving…" : "Save changes"}
          </button>
          <Link href={`/schools/${slug}`} className="btn btn-ghost">
            View live page
          </Link>
        </div>
      </form>
    </>
  );
}

const input = "w-full rounded-xl border border-[color:var(--color-line)] bg-white px-4 py-3 text-[15px] outline-none focus:border-[color:var(--color-navy)]";

function TextField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-[color:var(--color-navy)]">
        {label}
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
