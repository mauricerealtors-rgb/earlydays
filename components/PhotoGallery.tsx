import Image from "next/image";
import type { ListingImage } from "@/lib/types";

/**
 * Expandable photo gallery. Uses native <details> element so it works
 * without JavaScript — matches the guide's rule 5 (don't render critical
 * content only after client-side JS).
 */
export function PhotoGallery({
  images,
  heroCount = 2,
  schoolName,
}: {
  images: ListingImage[];
  heroCount?: number;
  schoolName: string;
}) {
  const remaining = images.slice(heroCount);
  if (remaining.length === 0) return null;
  const label =
    remaining.length === 1
      ? "See 1 more photo"
      : `See all ${images.length} photos`;
  return (
    <section className="mt-10" aria-labelledby="gallery-heading">
      <details className="group">
        <summary
          className="btn btn-ghost cursor-pointer list-none text-sm"
          role="button"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            className="transition-transform group-open:rotate-180"
          >
            <path
              d="m6 9 6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="ml-1">{label}</span>
        </summary>
        <h2 id="gallery-heading" className="sr-only">
          Photos of {schoolName}
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {remaining.map((img, i) => (
            <figure
              key={`${img.url}-${i}`}
              className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[color:var(--color-cream-deep)]"
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
                unoptimized
              />
              <figcaption className="sr-only">{img.alt}</figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-3 text-xs text-[color:var(--color-ink-mute)]">
          Photos from {schoolName}'s official website.
        </p>
      </details>
    </section>
  );
}
