"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";

interface Enquiry {
  id: string;
  parentName: string;
  parentEmail: string;
  parentPhone?: string;
  message: string;
  createdAt: string;
  readAt?: string | null;
}

export function EnquiriesPanel({ slug }: { slug: string }) {
  const [enquiries, setEnquiries] = useState<Enquiry[] | null>(null);

  useEffect(() => {
    const q = query(
      collection(firestore(), "enquiries"),
      where("slug", "==", slug),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const rows: Enquiry[] = [];
      snap.forEach((d) => {
        const data = d.data();
        rows.push({
          id: d.id,
          parentName: data.parentName,
          parentEmail: data.parentEmail,
          parentPhone: data.parentPhone,
          message: data.message,
          createdAt: data.createdAt,
          readAt: data.readAt ?? null,
        });
      });
      setEnquiries(rows);
    });
    return () => unsub();
  }, [slug]);

  async function markRead(id: string) {
    await updateDoc(doc(firestore(), "enquiries", id), {
      readAt: new Date().toISOString(),
    });
  }

  return (
    <div>
      <h2 className="mb-1 font-display text-xl text-[color:var(--color-navy)]">
        Enquiries
      </h2>
      <p className="mb-4 text-sm text-[color:var(--color-ink-mute)]">
        Parent leads that came in through your profile.
      </p>

      {enquiries === null ? (
        <p className="text-sm text-[color:var(--color-ink-mute)]">Loading…</p>
      ) : enquiries.length === 0 ? (
        <div className="card-soft rounded-2xl p-6 text-center">
          <p className="font-semibold text-[color:var(--color-navy)]">
            No enquiries yet.
          </p>
          <p className="mt-1 text-sm text-[color:var(--color-ink-mute)]">
            When parents send a message via your public profile, it will show up here.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {enquiries.map((e) => (
            <li
              key={e.id}
              className={`card-soft rounded-2xl p-4 ${
                !e.readAt ? "border-[color:var(--color-navy)]/30" : ""
              }`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="font-display text-base text-[color:var(--color-navy)]">
                    {e.parentName}{" "}
                    {!e.readAt && <span className="chip chip-coral ml-2">New</span>}
                  </p>
                  <p className="text-xs text-[color:var(--color-ink-mute)]">
                    {new Date(e.createdAt).toLocaleString("en-GB")}
                  </p>
                </div>
                <div className="flex gap-2 text-sm">
                  <a href={`mailto:${e.parentEmail}`} className="btn btn-ghost text-xs">
                    Email
                  </a>
                  {e.parentPhone && (
                    <a
                      href={`https://wa.me/${e.parentPhone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-ghost text-xs"
                    >
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-[color:var(--color-ink)]">
                {e.message}
              </p>
              <div className="mt-3 flex justify-between text-xs text-[color:var(--color-ink-mute)]">
                <span>{e.parentEmail}{e.parentPhone ? ` · ${e.parentPhone}` : ""}</span>
                {!e.readAt && (
                  <button onClick={() => markRead(e.id)} className="underline">
                    Mark as read
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
