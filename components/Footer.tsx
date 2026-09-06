import Link from "next/link";
import { CATEGORIES } from "@/data/categories";
import { LOCATIONS } from "@/data/locations";
import { Logo } from "./Logo";

export function Footer() {
  const topLocations = LOCATIONS.filter((l) => l.region === "accra").slice(0, 8);
  return (
    <footer
      className="mt-24"
      style={{
        background: "linear-gradient(180deg, transparent, #FBEFDD 40%, #F6E6CE)",
        borderTop: "1px solid var(--color-line-2)",
      }}
    >
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo />
            <p className="mt-3 max-w-sm text-sm text-[color:var(--color-ink-mute)]">
              A parent-first directory for children's schools, learning centres
              and activities across Ghana.
            </p>
            <p className="mt-4 text-xs text-[color:var(--color-ink-mute)]">
              Every profile shows its verification state. Fees, curriculum and
              contact details are shown only when we can source them from the
              school itself.
            </p>
          </div>
          <FooterCol title="Programmes">
            {CATEGORIES.slice(0, 6).map((c) => (
              <FooterLink key={c.slug} href={`/${c.slug}`}>{c.plural}</FooterLink>
            ))}
          </FooterCol>
          <FooterCol title="Areas">
            {topLocations.map((l) => (
              <FooterLink key={l.slug} href={`/schools/accra/${l.slug}`}>
                {l.name}
              </FooterLink>
            ))}
          </FooterCol>
          <FooterCol title="EarlyDays">
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="/guides">Parent guides</FooterLink>
            <FooterLink href="/for-schools">For schools</FooterLink>
            <FooterLink href="/claim">Claim a listing</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
            <FooterLink href="/privacy">Privacy</FooterLink>
            <FooterLink href="/terms">Terms</FooterLink>
          </FooterCol>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-[color:var(--color-line)] pt-6 text-xs text-[color:var(--color-ink-mute)] md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} EarlyDays. Made for Ghanaian families.</p>
          <p>Independent directory. Not a government or regulatory body.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="md:col-span-2">
      <h3 className="mb-3 font-sans text-xs font-bold uppercase tracking-widest text-[color:var(--color-navy)]">
        {title}
      </h3>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-[color:var(--color-ink-mute)] hover:text-[color:var(--color-navy)]"
      >
        {children}
      </Link>
    </li>
  );
}
