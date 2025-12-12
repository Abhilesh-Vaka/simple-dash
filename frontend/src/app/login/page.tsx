"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { login, setToken } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    try {
      setLoading(true);
      const res = await login({ email, password });
      setToken(res.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl items-center px-6 py-12">
      <div className="grid w-full gap-10 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-xl shadow-slate-200/70 lg:grid-cols-2">
        <div className="flex flex-col justify-center gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
            Welcome back
          </p>
          <h1 className="text-4xl font-bold text-slate-900">Log in</h1>
          <p className="text-slate-600">
            Access your profile, manage tasks, and explore the protected dashboard.
          </p>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
            Use the signup page to create a user, then log in to see protected routes.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card flex flex-col gap-4 p-6">
          <div>
            <label className="text-sm font-semibold text-slate-800">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:border-indigo-500"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-800">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:border-indigo-500"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          {error && (
            <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          )}
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="text-sm text-slate-600">
            No account?{" "}
            <Link href="/signup" className="font-semibold text-indigo-600">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
