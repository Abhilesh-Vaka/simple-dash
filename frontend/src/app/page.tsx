import Link from "next/link";

const highlights = [
  "JWT auth with protected dashboard",
  "Profile management",
  "Task CRUD with search & filters",
  "Validation on client and server",
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-12 md:px-12 lg:px-16">
      <header className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/60 px-6 py-4 shadow-lg shadow-slate-200/60 backdrop-blur">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
            Frontend Developer Intern
          </p>
          <h1 className="text-2xl font-bold text-slate-900">
            Secure Task Dashboard
          </h1>
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="btn-secondary">
            Login
          </Link>
          <Link href="/signup" className="btn-primary">
            Get Started
          </Link>
        </div>
      </header>

      <section className="grid gap-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-8 shadow-xl shadow-indigo-100/60 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium text-indigo-700">Assignment Ready</p>
          <h2 className="text-4xl font-bold leading-tight text-slate-900">
            Ship a production-style auth flow with a task dashboard in days, not
            weeks.
          </h2>
          <p className="text-lg text-slate-600">
            React + Next.js on the frontend, Express + Mongo on the backend, JWT
            security, validation, and responsive UI with Tailwind.
          </p>
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {highlights.map((item) => (
              <div
                key={item}
                className="card flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-800"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">
                  ✓
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/dashboard" className="btn-primary">
              Open Dashboard
            </Link>
            <Link href="/login" className="btn-secondary">
              View Auth
            </Link>
          </div>
        </div>
        <div className="card flex flex-col gap-3 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
                Demo Account
              </p>
              <p className="text-sm text-slate-600">
                Use the forms to create your own user.
              </p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              JWT Secured
            </span>
          </div>
          <div className="grid gap-2 text-sm text-slate-700">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="font-semibold text-slate-900">Profile</span>
              <span className="text-slate-600">Name, email, timestamps</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="font-semibold text-slate-900">
                Tasks CRUD + Search
              </span>
              <span className="text-slate-600">Filters & status chips</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="font-semibold text-slate-900">Secure API</span>
              <span className="text-slate-600">Express + Mongo + Zod</span>
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50 px-4 py-3 text-xs text-indigo-700">
            Tip: configure <code className="font-mono">NEXT_PUBLIC_API_URL</code>{" "}
            to point at the backend. Defaults to{" "}
            <code className="font-mono">http://localhost:4000</code>.
          </div>
        </div>
      </section>
    </main>
  );
}
