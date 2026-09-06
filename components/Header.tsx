import Link from "next/link";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md"
      style={{
        background: "rgba(255, 248, 239, 0.85)",
        borderBottom: "1px solid var(--color-line-2)",
      }}
    >
      <div className="container-page flex h-16 items-center gap-4">
        <Logo />
        <nav
          aria-label="Primary"
          className="ml-6 hidden items-center gap-1 md:flex"
        >
          <NavLink href="/schools">Explore</NavLink>
          <NavLink href="/schools/accra">Areas</NavLink>
          <NavLink href="/preschools">Programmes</NavLink>
          <NavLink href="/guides">Guides</NavLink>
          <NavLink href="/for-schools">For schools</NavLink>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/saved"
            className="hidden items-center gap-1.5 rounded-full border border-[color:var(--color-line)] bg-white px-3 py-2 text-sm font-semibold text-[color:var(--color-navy)] md:inline-flex"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 3h12v18l-6-4-6 4V3Z" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            Shortlist
          </Link>
          <Link href="/schools" className="btn btn-primary text-sm">
            Find a place
          </Link>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full px-3 py-2 text-sm font-semibold text-[color:var(--color-navy)] hover:bg-[color:var(--color-cream-deep)]"
    >
      {children}
    </Link>
  );
}
