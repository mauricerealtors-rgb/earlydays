"use client";

import { useState } from "react";

export function ShareRow({ url, text }: { url: string; text: string }) {
  const [copied, setCopied] = useState(false);

  const wa = `https://wa.me/?text=${encodeURIComponent(`${text}\n\n${url}`)}`;
  const x = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="text-[11px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
        Share
      </span>
      <a
        href={wa}
        target="_blank"
        rel="noopener"
        className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-1.5 text-[12px] font-semibold text-white hover:brightness-105"
      >
        WhatsApp
      </a>
      <a
        href={x}
        target="_blank"
        rel="noopener"
        className="inline-flex items-center gap-1.5 rounded-full bg-black px-3 py-1.5 text-[12px] font-semibold text-white hover:brightness-125"
      >
        X / Twitter
      </a>
      <a
        href={fb}
        target="_blank"
        rel="noopener"
        className="inline-flex items-center gap-1.5 rounded-full bg-[#1877F2] px-3 py-1.5 text-[12px] font-semibold text-white hover:brightness-105"
      >
        Facebook
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-line)] bg-white px-3 py-1.5 text-[12px] font-semibold text-[color:var(--color-navy)] hover:bg-[color:var(--color-cream-deep)]"
      >
        {copied ? "Link copied" : "Copy link"}
      </button>
    </div>
  );
}
