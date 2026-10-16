"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const KINDS = ["assignment", "exam", "quiz", "project"] as const;

// Today + 7 days as YYYY-MM-DD in the user's own timezone (matches the DB default).
function defaultDueDate() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function DeadlineForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Prefill after mount so server and browser render the same HTML.
  useEffect(() => setDueDate(defaultDueDate()), []);
  const [course, setCourse] = useState("");
  const [kind, setKind] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return setError("Type a title first.");
    setError(null);
    setSaving(true);

    // Only send what is filled in; the database fills the defaults (an emptied date falls back to today + 7).
    const row: Record<string, string> = { title: trimmed };
    if (dueDate) row.due_date = dueDate;
    if (course.trim()) row.course = course.trim();
    if (kind) row.kind = kind;

    const { error } = await createClient().from("deadlines").insert(row);
    setSaving(false);
    if (error) return setError(error.message);

    setTitle("");
    setDueDate(defaultDueDate());
    setCourse("");
    setKind("");
    router.refresh();
  }

  const fieldClass =
    "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200";

  return (
    <form onSubmit={onSubmit} className="mt-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_11rem]">
        <label className="block min-w-0 text-sm font-medium text-slate-700">
          What&apos;s due?
          <input
            type="text"
            data-testid="core-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Quiz 3 – Statistics"
            maxLength={200}
            className={fieldClass}
          />
        </label>
        <label className="block min-w-0 text-sm font-medium text-slate-700">
          Due date
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={`${fieldClass} min-w-0`}
          />
        </label>
      </div>

      <details className="mt-3 text-sm">
        <summary className="cursor-pointer py-2 text-slate-600">More options (course, type)</summary>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <label className="block font-medium text-slate-700">
            Course
            <input
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="General"
              maxLength={100}
              className={fieldClass}
            />
          </label>
          <label className="block font-medium text-slate-700">
            Type
            <select value={kind} onChange={(e) => setKind(e.target.value)} className={fieldClass}>
              <option value="">Assignment (default)</option>
              {KINDS.map((k) => (
                <option key={k} value={k} className="capitalize">
                  {k[0].toUpperCase() + k.slice(1)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="mt-2 text-slate-500">Leave empty: course &quot;General&quot;, type assignment.</p>
      </details>

      {error && (
        <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        data-testid="core-submit"
        disabled={saving}
        className="mt-3 min-h-12 w-full rounded-lg bg-indigo-600 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save deadline"}
      </button>
    </form>
  );
}
