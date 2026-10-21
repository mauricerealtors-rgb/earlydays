"use client";

import { useEffect, useState } from "react";
import { OUTREACH_PLACEHOLDERS, type OutreachTemplate } from "@/lib/outreach";
import { useAuth } from "@/components/AuthProvider";

/**
 * Edit the email schools actually receive.
 *
 * Plain text, not HTML. The person writing this is selling to school heads,
 * and an editor that can break the layout is an editor that will: blank lines
 * make paragraphs, lines starting "- " make a list, {{cta}} becomes the
 * button, and that is the whole grammar.
 *
 * Loaded and saved through the API rather than Firestore directly, because
 * the client has no rules entry for settings/ and the rules in this repo have
 * never been deployed.
 */
export function OutreachTemplateEditor({
  onSaved,
}: {
  onSaved?: (t: OutreachTemplate) => void;
}) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [isDefault, setIsDefault] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !open || loaded) return;
    (async () => {
      try {
        const res = await fetch("/api/admin/outreach/template", {
          headers: { Authorization: `Bearer ${await user.getIdToken()}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
        setSubject(data.template.subject);
        setBody(data.template.body);
        setIsDefault(data.isDefault);
        setLoaded(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load the template");
      }
    })();
  }, [user, open, loaded]);

  async function save(action?: "reset") {
    if (!user) return;
    if (action === "reset" && !window.confirm("Throw away your edits and go back to the default email?")) {
      return;
    }
    setBusy(true);
    setError(null);
    setNote(null);
    try {
      const res = await fetch("/api/admin/outreach/template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify(action === "reset" ? { action } : { subject, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setSubject(data.template.subject);
      setBody(data.template.body);
      setIsDefault(data.isDefault);
      setDirty(false);
      setNote(action === "reset" ? "Back to the default email." : "Saved. The next send uses this.");
      onSaved?.(data.template);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="admin-card mb-4 rounded-2xl border border-white/10 bg-white/[0.02]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left"
      >
        <span className="min-w-0">
          <span className="block font-display text-lg">The email</span>
          <span className="block text-xs text-white/50">
            {isDefault ? "Using the default wording" : "Edited"}
            {dirty && " · unsaved changes"}
          </span>
        </span>
        <span className="shrink-0 text-xs text-white/50">{open ? "Hide" : "Edit"}</span>
      </button>

      {open && (
        <div className="border-t border-white/10 p-4">
          {!loaded && !error ? (
            <p className="text-sm text-white/40">Loading…</p>
          ) : (
            <>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/40">
                Subject
              </label>
              <input
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  setDirty(true);
                }}
                className="mt-1 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-white/30"
              />

              <label className="mt-4 block text-[11px] font-bold uppercase tracking-widest text-white/40">
                Body
              </label>
              <textarea
                value={body}
                onChange={(e) => {
                  setBody(e.target.value);
                  setDirty(true);
                }}
                rows={20}
                spellCheck
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 font-mono text-[13px] leading-relaxed text-white outline-none focus:border-white/30"
              />

              <div className="mt-3 rounded-lg border border-white/10 bg-white/[0.02] p-3">
                <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">
                  Placeholders
                </p>
                <ul className="mt-2 grid gap-1 text-[12px] sm:grid-cols-2">
                  {OUTREACH_PLACEHOLDERS.map((p) => (
                    <li key={p.token} className="flex gap-2">
                      <code className="shrink-0 rounded bg-white/10 px-1 text-amber-300">
                        {p.token}
                      </code>
                      <span className="min-w-0 text-white/50">{p.what}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[12px] leading-relaxed text-white/40">
                  Blank line makes a new paragraph. A line starting{" "}
                  <code className="rounded bg-white/10 px-1">- </code> becomes a
                  bullet. Everything else is sent as written. Use{" "}
                  <strong className="text-white/70">Test</strong> on any school
                  to post yourself a copy before you send it to anyone real.
                </p>
              </div>

              {error && (
                <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                  {error}
                </p>
              )}
              {note && (
                <p className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
                  {note}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => save()}
                  disabled={busy || !dirty}
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400 disabled:opacity-40"
                >
                  {busy ? "Saving…" : "Save the email"}
                </button>
                {!isDefault && (
                  <button
                    onClick={() => save("reset")}
                    disabled={busy}
                    className="rounded-lg border border-white/15 px-4 py-2 text-sm hover:bg-white/5"
                  >
                    Back to default
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
