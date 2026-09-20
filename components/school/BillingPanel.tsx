"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { BILLING_MONTHS, PLANS, money, yearlyTotal, type Tier } from "@/lib/plans";

interface Subscription {
  tier: Tier;
  status: "active" | "past-due" | "cancelled";
  expiresAt?: string;
  paystackReference?: string;
}



export function BillingPanel({ slug }: { slug: string }) {
  const { user } = useAuth();
  const [sub, setSub] = useState<Subscription | null>(null);
  const [starting, setStarting] = useState<Tier | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(firestore(), "subscriptions", slug), (snap) => {
      const data = snap.data();
      if (!data) {
        setSub({ tier: "free", status: "active" });
        return;
      }
      setSub({
        tier: data.tier ?? "free",
        status: data.status ?? "active",
        expiresAt: data.expiresAt,
        paystackReference: data.paystackReference,
      });
    });
    return () => unsub();
  }, [slug]);

  async function subscribe(tier: Tier) {
    if (!user) return;
    if (tier === "free") return;
    setStarting(tier);
    setError(null);
    try {
      const res = await fetch("/api/paystack/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          tier,
          email: user.email,
          uid: user.uid,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not start checkout.");
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
      setStarting(null);
    }
  }

  const currentTier = sub?.tier ?? "free";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl text-[color:var(--color-navy)]">
          Billing
        </h2>
        <p className="text-sm text-[color:var(--color-ink-mute)]">
          Powered by Paystack. Pay by MoMo, card or bank transfer in GH₵. Plans are priced per month and billed twelve months at a time.
        </p>
      </div>

      {/* Current status */}
      <div className="card-soft rounded-2xl p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
          Current plan
        </p>
        <p className="mt-1 font-display text-xl capitalize text-[color:var(--color-navy)]">
          {currentTier}
          {sub?.status === "past-due" && (
            <span className="chip chip-coral ml-2 text-xs">Payment failed</span>
          )}
          {sub?.status === "cancelled" && (
            <span className="chip ml-2 text-xs">Cancelled</span>
          )}
        </p>
        {sub?.expiresAt && (
          <p className="mt-1 text-xs text-[color:var(--color-ink-mute)]">
            Renews on {new Date(sub.expiresAt).toLocaleDateString("en-GB")}
          </p>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-[color:var(--color-coral-soft)] p-3 text-sm text-[color:var(--color-coral)]">
          {error}
        </p>
      )}

      {/* Plans */}
      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => {
          const isCurrent = currentTier === p.tier;
          return (
            <div
              key={p.tier}
              className={`card-soft rounded-2xl p-5 ${p.highlight ? "border-[color:var(--color-navy)]/30" : ""}`}
              style={
                p.highlight
                  ? { background: "linear-gradient(160deg,#FFE4EF 0%,#ffffff 55%)" }
                  : undefined
              }
            >
              <div className="flex items-baseline justify-between">
                <p className="font-display text-lg text-[color:var(--color-navy)]">
                  {p.name}
                </p>
                {p.highlight && <span className="chip chip-blossom text-[10px]">Recommended</span>}
              </div>
              <p className="mt-2 font-display text-[28px] text-[color:var(--color-navy)]">
                {p.monthly === 0 ? (
                  "Free"
                ) : (
                  <>
                    {money(p.monthly)}
                    <span className="text-sm text-[color:var(--color-ink-mute)]">/mo</span>
                  </>
                )}
              </p>
              {p.monthly > 0 && (
                // Said plainly on the card, not buried in the small print —
                // nobody should reach Paystack and be surprised by the total.
                <p className="text-xs font-semibold text-[color:var(--color-ink-mute)]">
                  {money(yearlyTotal(p.monthly))} billed yearly
                </p>
              )}
              <ul className="mt-3 space-y-1.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-1 text-[color:var(--color-leaf)]">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                {isCurrent ? (
                  <span className="chip w-full justify-center">Current plan</span>
                ) : p.tier === "free" ? (
                  <button className="btn btn-ghost w-full text-sm" disabled>
                    Downgrade coming soon
                  </button>
                ) : (
                  <button
                    onClick={() => subscribe(p.tier)}
                    disabled={starting !== null}
                    className={`w-full text-sm ${p.highlight ? "btn btn-pink" : "btn btn-ghost"}`}
                  >
                    {starting === p.tier
                      ? "Redirecting…"
                      : `Upgrade — ${money(yearlyTotal(p.monthly))}/year`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-[color:var(--color-ink-mute)]">
        Prices are shown in Ghana Cedis per month and charged as one payment
        covering {BILLING_MONTHS} months. VAT included where applicable. Cancel
        any time — your Verified/Featured status runs to the end of the period
        you have already paid for.
      </p>
    </div>
  );
}
