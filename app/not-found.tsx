import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page pt-20 pb-32 text-center">
      <span className="chip">404</span>
      <h1 className="mt-3 font-display text-4xl md:text-6xl">
        We couldn't find that page.
      </h1>
      <p className="mx-auto mt-3 max-w-md text-[color:var(--color-ink-mute)]">
        The page you were looking for doesn't exist — or a listing may have
        moved. Try searching or browse popular starting points.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link href="/" className="btn btn-primary">Home</Link>
        <Link href="/schools" className="btn btn-ghost">Search schools</Link>
        <Link href="/preschools/accra" className="btn btn-ghost">Preschools in Accra</Link>
      </div>
    </div>
  );
}
