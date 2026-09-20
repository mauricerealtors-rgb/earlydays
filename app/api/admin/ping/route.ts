export const runtime = "nodejs";

// Temporary probe: zero imports. If this 500s, the problem is the /api/admin
// path or the deployment, not anything the route imports.
export function GET() {
  return Response.json({ ok: true, probe: "no-imports" });
}
