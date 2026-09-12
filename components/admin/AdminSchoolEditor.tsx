"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Script from "next/script";
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
  logoUrl: string;
}

interface Photo {
  url: string;
  alt: string;
  sortOrder: number;
  uploadedAt: string;
}

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (
          error: unknown,
          result: {
            event: string;
            info: { secure_url: string; public_id: string; original_filename?: string };
          }
        ) => void
      ) => { open: () => void };
    };
  }
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

type Tab = "info" | "logo" | "photos";

export function AdminSchoolEditor({
  slug,
  baseline,
}: {
  slug: string;
  baseline: Baseline;
}) {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("info");
  const [form, setForm] = useState<Omit<Baseline, "name">>({
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
    logoUrl: baseline.logoUrl,
  });
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(firestore(), "listingOverrides", slug));
      if (snap.exists()) {
        const data = snap.data();
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
          logoUrl: data.logoUrl ?? prev.logoUrl,
        }));
        if (Array.isArray(data.photos)) {
          setPhotos(
            (data.photos as Photo[])
              .slice()
              .sort((a, b) => a.sortOrder - b.sortOrder)
          );
        }
      }
      setLoading(false);
    })();
  }, [slug]);

  async function saveInfo() {
    if (!user) return;
    setSaving(true);
    setError(null);
    setSaved(false);
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
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function persistPhotos(next: Photo[]) {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      await setDoc(
        doc(firestore(), "listingOverrides", slug),
        {
          photos: next,
          updatedAt: new Date().toISOString(),
          updatedBy: user.uid,
        },
        { merge: true }
      );
      setPhotos(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function openPhotoWidget() {
    if (!window.cloudinary || !CLOUD_NAME || !UPLOAD_PRESET) {
      setError("Cloudinary not configured.");
      return;
    }
    window.cloudinary
      .createUploadWidget(
        {
          cloudName: CLOUD_NAME,
          uploadPreset: UPLOAD_PRESET,
          folder: `earlydays/schools/${slug}`,
          multiple: true,
          maxFiles: 10,
          maxFileSize: 5 * 1024 * 1024,
          clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
          sources: ["local", "url", "camera"],
          cropping: true,
          croppingAspectRatio: 4 / 3,
          theme: "minimal",
        },
        async (err, result) => {
          if (err) return;
          if (result?.event === "success") {
            const next: Photo[] = [
              ...photos,
              {
                url: result.info.secure_url,
                alt: `${baseline.name} — ${result.info.original_filename ?? "photo"}`,
                sortOrder: photos.length,
                uploadedAt: new Date().toISOString(),
              },
            ];
            await persistPhotos(next);
          }
        }
      )
      .open();
  }

  function openLogoWidget() {
    if (!window.cloudinary || !CLOUD_NAME || !UPLOAD_PRESET) {
      setError("Cloudinary not configured.");
      return;
    }
    window.cloudinary
      .createUploadWidget(
        {
          cloudName: CLOUD_NAME,
          uploadPreset: UPLOAD_PRESET,
          folder: `earlydays/schools/${slug}/logo`,
          multiple: false,
          maxFileSize: 2 * 1024 * 1024,
          clientAllowedFormats: ["png", "jpg", "jpeg", "webp", "svg"],
          sources: ["local", "url"],
          cropping: true,
          croppingAspectRatio: 1,
          theme: "minimal",
        },
        async (err, result) => {
          if (err) return;
          if (result?.event === "success") {
            setForm((prev) => ({ ...prev, logoUrl: result.info.secure_url }));
          }
        }
      )
      .open();
  }

  async function removePhoto(i: number) {
    const next = photos.filter((_, idx) => idx !== i).map((p, idx) => ({ ...p, sortOrder: idx }));
    await persistPhotos(next);
  }
  async function movePhoto(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= photos.length) return;
    const next = photos.slice();
    [next[i], next[j]] = [next[j], next[i]];
    await persistPhotos(next.map((p, idx) => ({ ...p, sortOrder: idx })));
  }

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  if (loading) {
    return <p className="text-sm text-white/40">Loading…</p>;
  }

  return (
    <>
      <Script
        src="https://widget.cloudinary.com/v2.0/global/all.js"
        strategy="lazyOnload"
        onLoad={() => setScriptReady(true)}
      />

      {/* Tabs */}
      <div className="mb-4 flex gap-1 border-b border-white/10">
        {(["info", "logo", "photos"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm capitalize ${
              tab === t
                ? "border-white text-white"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            {t}
            {t === "photos" && photos.length > 0 && (
              <span className="ml-2 rounded-full bg-white/10 px-1.5 py-0.5 text-[10px]">
                {photos.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </p>
      )}
      {saved && (
        <p className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
          Saved. Live on the public page within 60 seconds.
        </p>
      )}

      {tab === "info" && (
        <div className="space-y-4">
          <Field label="Short description" hint="1 sentence, appears on cards and search results.">
            <input value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} className={input} maxLength={200} />
          </Field>
          <Field label="Full description" hint="1–2 paragraphs at the top of the profile page.">
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} className={`${input} min-h-[140px]`} />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Phone"><input value={form.phone} onChange={(e) => set("phone", e.target.value)} className={input} /></Field>
            <Field label="WhatsApp"><input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className={input} /></Field>
            <Field label="Email"><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={input} /></Field>
            <Field label="Website"><input type="url" value={form.website} onChange={(e) => set("website", e.target.value)} className={input} /></Field>
          </div>
          <Field label="Address"><input value={form.address} onChange={(e) => set("address", e.target.value)} className={input} /></Field>
          <Field label="Hours"><input value={form.hours} onChange={(e) => set("hours", e.target.value)} className={input} placeholder="Monday–Friday, 7:30 AM – 4:00 PM" /></Field>
          <Field label="Fees hint" hint="Optional. e.g. 'from GH₵3,500 per term'."><input value={form.feesHint} onChange={(e) => set("feesHint", e.target.value)} className={input} /></Field>
          <Field label="Admissions status">
            <select value={form.admissions} onChange={(e) => set("admissions", e.target.value as typeof form.admissions)} className={input}>
              <option value="unknown" className="bg-black">Not published</option>
              <option value="open" className="bg-black">Open for admissions</option>
              <option value="waitlist" className="bg-black">Waitlist only</option>
              <option value="closed" className="bg-black">Closed for this year</option>
            </select>
          </Field>
          <button onClick={saveInfo} disabled={saving} className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-50">
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      )}

      {tab === "logo" && (
        <div className="space-y-4">
          <p className="text-sm text-white/60">
            Small square logo shown alongside the school name. Transparent PNG or SVG works best.
          </p>
          {form.logoUrl ? (
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <Image src={form.logoUrl} alt="Current logo" fill className="object-contain" unoptimized />
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={openLogoWidget} disabled={!scriptReady} className="rounded-lg border border-white/15 px-3 py-1.5 text-sm hover:bg-white/5">
                  Replace logo
                </button>
                <button
                  onClick={() => set("logoUrl", "")}
                  className="text-left text-xs text-red-300 hover:underline"
                >
                  Remove logo
                </button>
              </div>
            </div>
          ) : (
            <button onClick={openLogoWidget} disabled={!scriptReady} className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-50">
              {scriptReady ? "Upload logo" : "Loading…"}
            </button>
          )}
          <div>
            <button onClick={saveInfo} disabled={saving} className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-50">
              {saving ? "Saving…" : "Save logo"}
            </button>
          </div>
        </div>
      )}

      {tab === "photos" && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-white/60">
              {photos.length}/10 uploaded · First photo is the profile hero.
            </p>
            <button
              onClick={openPhotoWidget}
              disabled={!scriptReady || photos.length >= 10}
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-50"
            >
              {scriptReady ? (photos.length >= 10 ? "Max reached" : "Upload photo") : "Loading…"}
            </button>
          </div>
          {photos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-sm text-white/50">
              No photos yet. Upload some to make this profile stand out.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((p, i) => (
                <div key={p.url} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                  <div className="relative aspect-[4/3]">
                    <Image src={p.url} alt={p.alt} fill className="object-cover" unoptimized />
                    {i === 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-white text-black px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest">
                        Hero
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <input
                      value={p.alt}
                      onChange={(e) => {
                        const next = photos.map((q, idx) => (idx === i ? { ...q, alt: e.target.value } : q));
                        setPhotos(next);
                      }}
                      onBlur={() => persistPhotos(photos)}
                      className="w-full rounded-lg border border-white/10 bg-transparent px-2 py-1.5 text-xs text-white outline-none focus:border-white/30"
                    />
                    <div className="mt-2 flex justify-between">
                      <div className="flex gap-1">
                        <button onClick={() => movePhoto(i, -1)} disabled={i === 0 || saving} className="rounded border border-white/10 px-2 py-1 text-xs disabled:opacity-30">↑</button>
                        <button onClick={() => movePhoto(i, 1)} disabled={i === photos.length - 1 || saving} className="rounded border border-white/10 px-2 py-1 text-xs disabled:opacity-30">↓</button>
                      </div>
                      <button onClick={() => removePhoto(i)} disabled={saving} className="text-xs text-red-300 hover:underline">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}

const input =
  "w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30";

function Field({
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
      <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-white/60">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-white/40">{hint}</span>}
    </label>
  );
}
