import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <section className="rounded-2xl bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
      <p className="mt-2 text-slate-600">Admin tools will be available here.</p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
      >
        Back to website
      </Link>
    </section>
  );
}