"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";

interface Photo {
  url: string;
  alt: string;
  sortOrder: number;
  uploadedAt: string;
}

declare global {
  interface Window {
    // Loaded by Cloudinary's upload-widget script.
    cloudinary?: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (
          error: unknown,
          result: { event: string; info: { secure_url: string; public_id: string; original_filename?: string } }
        ) => void
      ) => { open: () => void };
    };
  }
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export function PhotoManager({
  slug,
  listingName,
}: {
  slug: string;
  listingName: string;
}) {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(firestore(), "listingOverrides", slug));
      const data = snap.data();
      if (data?.photos && Array.isArray(data.photos)) {
        setPhotos(
          data.photos
            .slice()
            .sort((a: Photo, b: Photo) => a.sortOrder - b.sortOrder)
        );
      }
      setLoading(false);
    })();
  }, [slug]);

  async function persist(next: Photo[]) {
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

  function openWidget() {
    if (!window.cloudinary) {
      setError("Upload widget not ready yet. Give it a second.");
      return;
    }
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setError("Cloudinary is not configured. Ask an admin.");
      return;
    }
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
        folder: `earlydays/schools/${slug}`,
        multiple: true,
        maxFiles: 8,
        maxFileSize: 5 * 1024 * 1024,
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
        sources: ["local", "camera", "url"],
        cropping: true,
        croppingAspectRatio: 4 / 3,
        showAdvancedOptions: false,
        theme: "minimal",
      },
      async (err, result) => {
        if (err) {
          setError("Upload cancelled or failed.");
          return;
        }
        if (result?.event === "success") {
          const next: Photo[] = [
            ...photos,
            {
              url: result.info.secure_url,
              alt: `${listingName} — ${result.info.original_filename ?? "photo"}`,
              sortOrder: photos.length,
              uploadedAt: new Date().toISOString(),
            },
          ];
          await persist(next);
        }
      }
    );
    widget.open();
  }

  async function remove(i: number) {
    const next = photos
      .filter((_, idx) => idx !== i)
      .map((p, idx) => ({ ...p, sortOrder: idx }));
    await persist(next);
  }

  async function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= photos.length) return;
    const next = photos.slice();
    [next[i], next[j]] = [next[j], next[i]];
    const withOrder = next.map((p, idx) => ({ ...p, sortOrder: idx }));
    await persist(withOrder);
  }

  async function updateAlt(i: number, alt: string) {
    const next = photos.map((p, idx) => (idx === i ? { ...p, alt } : p));
    setPhotos(next); // optimistic
  }

  async function saveAlt() {
    await persist(photos);
  }

  if (loading) {
    return <p className="text-sm text-[color:var(--color-ink-mute)]">Loading photos…</p>;
  }

  return (
    <>
      <Script
        src="https://widget.cloudinary.com/v2.0/global/all.js"
        strategy="lazyOnload"
        onLoad={() => setScriptReady(true)}
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl text-[color:var(--color-navy)]">
            Photos
          </h2>
          <p className="text-sm text-[color:var(--color-ink-mute)]">
            {photos.length}/8 uploaded · First photo is your profile hero.
          </p>
        </div>
        <button
          onClick={openWidget}
          disabled={photos.length >= 8 || !scriptReady}
          className="btn btn-pink text-sm"
        >
          {scriptReady ? (photos.length >= 8 ? "Max reached" : "Upload photo") : "Loading…"}
        </button>
      </div>

      {error && (
        <p className="mb-3 rounded-lg bg-[color:var(--color-coral-soft)] p-3 text-sm text-[color:var(--color-coral)]">
          {error}
        </p>
      )}

      {photos.length === 0 ? (
        <div className="card-soft rounded-2xl p-8 text-center">
          <p className="font-semibold text-[color:var(--color-navy)]">
            No photos yet.
          </p>
          <p className="mt-1 text-sm text-[color:var(--color-ink-mute)]">
            Upload your own — building, classrooms, activities. Parents pick
            profiles with real photos every time.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {photos.map((p, i) => (
            <div
              key={p.url}
              className="card-soft overflow-hidden rounded-2xl"
            >
              <div className="relative aspect-[4/3] bg-[color:var(--color-cream)]">
                <Image
                  src={p.url}
                  alt={p.alt}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                  unoptimized
                />
                {i === 0 && (
                  <span className="chip chip-sky absolute left-2 top-2">
                    Hero
                  </span>
                )}
              </div>
              <div className="p-3">
                <input
                  type="text"
                  value={p.alt}
                  onChange={(e) => updateAlt(i, e.target.value)}
                  onBlur={saveAlt}
                  className="w-full rounded-lg border border-[color:var(--color-line)] bg-white px-3 py-2 text-sm outline-none focus:border-[color:var(--color-navy)]"
                  placeholder="Describe the photo…"
                />
                <div className="mt-2 flex justify-between gap-2">
                  <div className="flex gap-1">
                    <button
                      onClick={() => move(i, -1)}
                      disabled={i === 0 || saving}
                      className="btn btn-ghost px-2 py-1 text-xs"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => move(i, 1)}
                      disabled={i === photos.length - 1 || saving}
                      className="btn btn-ghost px-2 py-1 text-xs"
                    >
                      ↓
                    </button>
                  </div>
                  <button
                    onClick={() => remove(i)}
                    disabled={saving}
                    className="text-xs font-semibold text-[color:var(--color-coral)] hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
