import Link from "next/link";
import { SITE } from "@/lib/site";

export function Header() {
  return (
    <header className="border-b border-line bg-paper-deep">
      <div className="container-page flex flex-wrap items-center justify-between gap-3 py-5">
        <Link href="/" className="font-display text-2xl font-bold text-berry">
          {SITE.name}
        </Link>
        <nav className="flex items-center gap-4 text-sm font-bold">
          <Link href="/wedding-cakes" className="hover:text-rose-deep">
            Wedding
          </Link>
          <Link href="/birthday-cakes" className="hover:text-rose-deep">
            Birthday
          </Link>
          <Link href="/prices" className="hover:text-rose-deep">
            Prices
          </Link>
          <Link href="/for-bakers" className="chip">
            Are you a baker?
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-paper-deep py-10">
      <div className="container-page text-sm text-ink-mute">
        <p className="font-display text-lg font-bold text-berry">{SITE.name}</p>
        <p className="mt-1">{SITE.tagline}</p>
        <p className="mt-4 max-w-2xl">
          We take no commission on orders and you deal with the baker directly.
          Bakers are listed free. Where a baker publishes prices we show them
          with the date we read them; where they do not, we say so rather than
          guess.
        </p>
        <p className="mt-4">
          <Link href="/for-bakers" className="font-bold text-rose-deep underline">
            Add or correct a listing
          </Link>
        </p>
      </div>
    </footer>
  );
}

export function Breadcrumb({
  trail,
}: {
  trail: { href?: string; label: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="container-page pt-6 text-sm text-ink-mute">
      <ol className="flex flex-wrap items-center gap-2">
        {trail.map((t, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {t.href ? (
              <Link href={t.href} className="hover:text-rose-deep">
                {t.label}
              </Link>
            ) : (
              <span className="text-cocoa">{t.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
