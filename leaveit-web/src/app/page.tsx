"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-context";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  // If logged in, redirect by role
  useEffect(() => {
    if (!user) return;

    if (user.role === "manager") {
      router.replace("/management/dashboard");
    } else {
      router.replace("/employee/dashboard");
    }
  }, [user, router]);

  // Landing page UI when not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col text-slate-900" style={{
        background: "radial-gradient(circle at top left, #e0e7ff 0, #f9fafb 40%, #ffffff 100%)",
      }}>
        <header className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="text-lg font-semibold text-slate-900">LeaveIt</div>
          <nav className="space-x-3 text-sm">
            <a href="/auth/login" className="text-slate-600 hover:text-slate-900">Login</a>
            <a
              href="/auth/register"
              className="inline-flex items-center rounded-md bg-indigo-600 hover:bg-indigo-500 px-3 py-1 font-medium text-white"
            >
              Get started
            </a>
          </nav>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-slate-900">
            Simple leave management for your team
          </h1>
          <p className="max-w-xl text-slate-600 mb-8 text-sm md:text-base">
            LeaveIt lets employees request time off and managers approve leaves quickly.
            Track balances, approvals, and history in one clean dashboard.
          </p>
          <div className="space-x-3">
            <a
              href="/auth/register"
              className="inline-flex items-center rounded-md bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-medium text-white"
            >
              Create account
            </a>
            <a
              href="/auth/login"
              className="inline-flex items-center rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Login
            </a>
          </div>
        </main>

        <footer className="px-6 py-3 border-t border-slate-200 bg-white text-xs text-slate-500 text-center">
          © {new Date().getFullYear()} LeaveIt. All rights reserved.
        </footer>
      </div>
    );
  }

  // While redirecting after login
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">
      Loading...
    </div>
  );
}
