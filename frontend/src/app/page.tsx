import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
      <div className="floating-glow"></div>
      <div className="floating-glow delay-150"></div>
      <div className="floating-glow delay-300"></div>
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-400/20 blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-400/20 blur-3xl animate-pulse-slow delay-1000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 py-16 text-center">
        <div className="animate-fade-in group relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 opacity-20 blur group-hover:opacity-30 transition duration-300"></div>
          <div className="relative rounded-full border border-indigo-200/50 bg-white/90 backdrop-blur-md px-6 py-3 text-xs font-bold uppercase tracking-[0.3em] text-indigo-600 shadow-lg">
            ✨ Vaka Abhilesh
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="animate-slide-up bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 bg-clip-text text-5xl font-extrabold text-transparent sm:text-6xl md:text-7xl">
            Secure Task Dashboard
          </h1>
          <div className="animate-fade-in-delay mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        </div>
        
        <p className="animate-fade-in-delay max-w-2xl text-lg text-slate-600 leading-relaxed">
          Minimal and secure. Sign up, log in, and manage tasks behind a protected dashboard.
        </p>
        
        <div className="animate-fade-in-delay-2 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/signup"
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg shadow-indigo-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/60"
          >
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </Link>
          <Link
            href="/login"
            className="rounded-xl border-2 border-indigo-200 bg-white/80 px-8 py-4 font-semibold text-indigo-600 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-indigo-300 hover:bg-white hover:shadow-lg"
          >
            Sign In
          </Link>
        </div>

        {/* Feature highlights */}
        <div className="animate-fade-in-delay-2 mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="group rounded-2xl border border-indigo-100 bg-white/60 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-indigo-200 hover:bg-white/80 hover:shadow-lg">
            <div className="mb-3 text-2xl">🔐</div>
            <h3 className="mb-2 font-semibold text-slate-900">Secure Auth</h3>
            <p className="text-sm text-slate-600">JWT-based authentication</p>
          </div>
          <div className="group rounded-2xl border border-indigo-100 bg-white/60 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-indigo-200 hover:bg-white/80 hover:shadow-lg">
            <div className="mb-3 text-2xl">📋</div>
            <h3 className="mb-2 font-semibold text-slate-900">Task Management</h3>
            <p className="text-sm text-slate-600">CRUD with search & filters</p>
          </div>
          <div className="group rounded-2xl border border-indigo-100 bg-white/60 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-indigo-200 hover:bg-white/80 hover:shadow-lg">
            <div className="mb-3 text-2xl">⚡</div>
            <h3 className="mb-2 font-semibold text-slate-900">Fast & Modern</h3>
            <p className="text-sm text-slate-600">Built with Next.js & Tailwind</p>
          </div>
        </div>
      </div>
    </main>
  );
}
