import { getSchoolsCrm } from "@/lib/admin-data";
import { SchoolsTable } from "@/components/admin/SchoolsTable";

export const dynamic = "force-dynamic";

export default async function AdminSchoolsPage() {
  const rows = await getSchoolsCrm();
  return (
    <>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">
            CRM
          </p>
          <h1 className="mt-1 font-display text-3xl md:text-4xl">Schools</h1>
          <p className="mt-1 text-sm text-white/60">
            {rows.length} listed · {rows.filter((r) => r.claimed).length} claimed ·{" "}
            {rows.filter((r) => r.tier !== "free").length} paying
          </p>
        </div>
      </header>
      <SchoolsTable rows={rows} />
    </>
  );
}
