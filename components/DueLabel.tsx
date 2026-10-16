"use client";

import { useEffect, useState } from "react";

// Whole days from today (in the user's own timezone) until a YYYY-MM-DD date.
function daysUntil(isoDate: string) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const due = new Date(y, m - 1, d);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((due.getTime() - today.getTime()) / 86_400_000);
}

function labelFor(days: number) {
  if (days < 0) return "Overdue";
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due in ${days} days`;
}

export default function DueLabel({ dueDate }: { dueDate: string }) {
  // Computed after mount so "today" is the user's day, not the server's.
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => setDays(daysUntil(dueDate)), [dueDate]);

  if (days === null) return null;

  const style =
    days < 0
      ? "bg-red-100 text-red-800 ring-red-200"
      : days < 7
        ? "bg-amber-100 text-amber-900 ring-amber-200"
        : "bg-slate-100 text-slate-600 ring-slate-200";

  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${style}`}>
      {labelFor(days)}
    </span>
  );
}
