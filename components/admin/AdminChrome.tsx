"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

const ADMIN_EMAIL = "stackflown@gmail.com";

const NAV = [
  { href: "/admin", label: "Overview", icon: OverviewIcon },
  { href: "/admin/claims", label: "Claims", icon: ClaimsIcon },
  { href: "/admin/schools", label: "Schools", icon: SchoolsIcon },
  { href: "/admin/enquiries", label: "Enquiries", icon: EnquiriesIcon },
  { href: "/admin/analytics", label: "Analytics", icon: AnalyticsIcon },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: BillingIcon },
];

export function AdminChrome({ children }: { children: ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace(`/school/login?next=${pathname}`);
  }, [loading, user, router, pathname]);

  useEffect(() => setMobileOpen(false), [pathname]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black p-10 text-white/60">Loading…</div>
    );
  }
  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-black p-10 text-white">
        <div className="mx-auto max-w-md text-center">
          <span className="inline-flex rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
            Access denied
          </span>
          <p className="mt-4 font-display text-2xl">Admins only.</p>
          <p className="mt-2 text-sm text-white/60">
            You're signed in as {user.email}.
          </p>
          <button
            onClick={() => signOut().then(() => router.push("/"))}
            className="mt-4 rounded-lg border border-white/15 px-4 py-2 text-sm hover:bg-white/5"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      {/* Top bar (mobile) */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#0A0A0B]/95 px-4 py-3 backdrop-blur md:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <BrandDot />
          <span className="font-display text-lg">EarlyDays</span>
          <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest">
            Admin
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="rounded-lg border border-white/10 p-2"
          aria-label="Toggle menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      <div className="md:flex">
        {/* Sidebar */}
        <aside
          className={`${
            mobileOpen ? "block" : "hidden"
          } border-b border-white/10 bg-[#0A0A0B] md:block md:h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r md:sticky md:top-0`}
        >
          <div className="hidden items-center gap-2 px-6 py-6 md:flex">
            <BrandDot />
            <span className="font-display text-lg">EarlyDays</span>
            <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest">
              Admin
            </span>
          </div>

          <nav className="px-3 pb-4">
            <ul className="space-y-0.5">
              {NAV.map((n) => {
                const active = pathname === n.href;
                const Icon = n.icon;
                return (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                        active
                          ? "bg-white text-black shadow"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon active={active} />
                      <span>{n.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 border-t border-white/10 pt-4">
              <div className="rounded-lg bg-white/5 p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                  Signed in
                </p>
                <p className="mt-1 truncate text-sm">{user.email}</p>
                <button
                  onClick={() => signOut().then(() => router.push("/"))}
                  className="mt-2 text-xs text-white/60 hover:text-white"
                >
                  Sign out
                </button>
              </div>
              <Link
                href="/"
                target="_blank"
                className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/50 hover:text-white"
              >
                <span>Open live site</span>
                <span aria-hidden>↗</span>
              </Link>
            </div>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <div className="admin-fade-in mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function BrandDot() {
  return (
    <span
      aria-hidden
      className="inline-flex h-7 w-7 items-center justify-center rounded-lg"
      style={{ background: "linear-gradient(135deg, #FFC845 0%, #FF7A59 55%, #FF9FC0 100%)" }}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
        <path
          d="M4 12c2 0 3-1.6 3-3.5S6 5 4 5v7Zm16 0c-2 0-3-1.6-3-3.5S18 5 20 5v7ZM6 15c0 2.8 2.7 5 6 5s6-2.2 6-5H6Z"
          fill="#0F2A4A"
        />
      </svg>
    </span>
  );
}

function OverviewIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={active ? "text-black" : "text-white/60 group-hover:text-white"}>
      <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
function ClaimsIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={active ? "text-black" : "text-white/60 group-hover:text-white"}>
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 3 4 6v6c0 5 4 9 8 9s8-4 8-9V6l-8-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
function SchoolsIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={active ? "text-black" : "text-white/60 group-hover:text-white"}>
      <path d="m3 10 9-5 9 5-9 5-9-5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M6 12v5c0 1 3 3 6 3s6-2 6-3v-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function EnquiriesIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={active ? "text-black" : "text-white/60 group-hover:text-white"}>
      <path d="M5 5h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-5 4v-4H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
function AnalyticsIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={active ? "text-black" : "text-white/60 group-hover:text-white"}>
      <path d="M4 20V10M10 20V4M16 20v-6M22 20H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function BillingIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={active ? "text-black" : "text-white/60 group-hover:text-white"}>
      <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 10h18M7 15h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
