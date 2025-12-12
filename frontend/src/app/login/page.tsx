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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/20 to-purple-50/10 px-6 py-12">
      <div className="floating-glow opacity-50"></div>
      <div className="floating-glow delay-150 opacity-50"></div>
      
      <div className="relative z-10 w-full max-w-5xl">
        <div className="grid gap-8 rounded-3xl border border-white/20 bg-white/70 p-8 shadow-2xl backdrop-blur-xl lg:grid-cols-2 lg:gap-12 lg:p-12">
          {/* Left side - Visual */}
          <div className="flex flex-col justify-center gap-6 lg:pr-8">
            <div className="space-y-4">
              <div className="inline-block rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-lg">
                Welcome back
              </div>
              <h1 className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 bg-clip-text text-5xl font-extrabold text-transparent">
                Log in
              </h1>
              <p className="text-lg text-slate-600">
                Access your profile, manage tasks, and explore the protected dashboard.
              </p>
            </div>
            
            <div className="space-y-3 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">✓</div>
                <span className="text-sm font-medium text-slate-700">Secure JWT authentication</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">✓</div>
                <span className="text-sm font-medium text-slate-700">Protected dashboard access</span>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="you@example.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div className="animate-shake rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 px-4 py-3 text-sm text-rose-700 shadow-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/60 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <span className="relative z-10">{loading ? "Logging in..." : "Sign In"}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </button>

            <p className="text-center text-sm text-slate-600">
              No account?{" "}
              <Link href="/signup" className="font-semibold text-indigo-600 transition-colors hover:text-indigo-700">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
