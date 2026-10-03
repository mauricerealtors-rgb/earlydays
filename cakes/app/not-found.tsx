import Link from "next/link";
import { Footer, Header } from "@/components/Chrome";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="container-page py-20">
        <h1 className="text-3xl md:text-5xl">We could not find that page</h1>
        <p className="mt-4 max-w-xl text-lg text-ink-mute">
          It may have moved, or we may not have any bakers in that area yet. We
          only publish an area once there is someone real to show.
        </p>
        <p className="mt-6 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary">Browse bakers</Link>
          <Link href="/prices" className="btn btn-ghost">Cake prices in Ghana</Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
