"use client";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <header className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="text-lg font-semibold">LeaveIt</div>
        <nav className="space-x-3 text-sm">
          <a href="/auth/login" className="text-slate-300 hover:text-white">Login</a>
          <a
            href="/auth/register"
            className="inline-flex items-center rounded-md bg-indigo-600 hover:bg-indigo-500 px-3 py-1 font-medium"
          >
            Get started
          </a>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-semibold mb-4">
          Simple leave management for your team
        </h1>
        <p className="max-w-xl text-slate-400 mb-8 text-sm md:text-base">
          LeaveIt helps employees request time off and managers approve leaves in seconds.
          Track balances, approvals, and history in one clean dashboard.
        </p>
        <div className="space-x-3">
          <a
            href="/auth/register"
            className="inline-flex items-center rounded-md bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-medium"
          >
            Create account
          </a>
          <a
            href="/auth/login"
            className="inline-flex items-center rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-900"
          >
            Login
          </a>
        </div>
      </main>

      <footer className="px-6 py-3 border-t border-slate-800 text-xs text-slate-500 text-center">
        © {new Date().getFullYear()} LeaveIt. All rights reserved.
      </footer>
    </div>
  );
}
