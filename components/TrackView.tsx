"use client";

import { useEffect } from "react";

/**
 * Fires a single "view" event for the given slug per browser session.
 * We use sessionStorage so a parent refreshing the page doesn't inflate
 * the counter; the school view will still show it as one visitor.
 */
export function TrackView({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `edv:${slug}`;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, event: "view" }),
      keepalive: true,
    }).catch(() => {});
  }, [slug]);
  return null;
}
