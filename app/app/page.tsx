import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DeadlineForm from "@/components/DeadlineForm";
import DeleteButton from "@/components/DeleteButton";
import DueLabel from "@/components/DueLabel";

export const metadata = { title: "My deadlines · DeadlineBox" };

type Deadline = {
  id: string;
  title: string;
  due_date: string;
  course: string;
  kind: string;
};

function formatDate(isoDate: string) {
  // due_date is a plain date; parse at noon UTC so no timezone shifts the day
  return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function AppPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("deadlines")
    .select("id, title, due_date, course, kind")
    .order("due_date", { ascending: true })
    .order("created_at", { ascending: true });
  const deadlines = (data ?? []) as Deadline[];

  return (
    <div>
      <h1 className="text-2xl font-bold">My deadlines</h1>
      <DeadlineForm />

      {error && (
        <p role="alert" className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          Could not load deadlines: {error.message}
        </p>
      )}

      {deadlines.length === 0 && !error ? (
        <p className="mt-8 text-center text-slate-500">No deadlines yet. Add your first one above.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {deadlines.map((d) => (
            <li
              key={d.id}
              data-testid="core-item"
              className="flex items-start justify-between gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
            >
              <div className="min-w-0">
                <p className="font-semibold break-words text-slate-900">{d.title}</p>
                <p className="mt-1 text-sm text-slate-600">
                  <time dateTime={d.due_date} className="font-medium text-indigo-700">
                    {formatDate(d.due_date)}
                  </time>
                  <span className="break-words"> · {d.course}</span>
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <DueLabel dueDate={d.due_date} />
                  <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-700">
                    {d.kind}
                  </span>
                </div>
              </div>
              <DeleteButton id={d.id} title={d.title} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
