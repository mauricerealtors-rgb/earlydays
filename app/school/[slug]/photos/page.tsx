import { redirect } from "next/navigation";

export default async function PhotosPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Photos are now managed inside the tabbed profile editor.
  redirect(`/school/${slug}/edit`);
}
