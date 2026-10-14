import Link from "next/link";

const benefits = [
  "Type a title, tap save — done in 5 seconds.",
  "Every assignment, exam, quiz and project in one list, soonest first.",
  "Private: only you can see your deadlines.",
];

export default function Home() {
  return (
    <section className="py-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">For IE students</p>
      <h1 className="mt-3 text-4xl font-extrabold leading-tight text-slate-900">
        Never miss a deadline again
      </h1>
      <p className="mt-4 text-lg text-slate-600">
        DeadlineBox lets you jot down every assignment, exam and quiz in 5 seconds, so they are all in one
        place, sorted by date.
      </p>
      <ul className="mx-auto mt-8 max-w-md space-y-3 text-left">
        {benefits.map((b) => (
          <li key={b} className="flex gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <span aria-hidden className="font-bold text-indigo-600">✓</span>
            <span className="text-slate-700">{b}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/signup"
        className="mt-10 inline-flex min-h-12 items-center justify-center rounded-xl bg-indigo-600 px-8 text-lg font-semibold text-white shadow hover:bg-indigo-700"
      >
        Sign up
      </Link>
    </section>
  );
}
