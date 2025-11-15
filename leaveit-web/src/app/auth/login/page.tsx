"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const employeeId = formData.get("employeeId") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("https://leave-it-wmz2.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, password }),
      });

      if (!res.ok) {
        setError("Invalid employee ID or password");
        setLoading(false);
        return;
      }

      const user = await res.json();
      setUser({
        id: user.id,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        role: user.role,
      });

      setLoading(false);

      if (user.role === "manager") {
        router.push("/management/dashboard");
      } else {
        router.push("/employee/dashboard");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-8 shadow-md">
        <h1 className="text-2xl font-semibold mb-2 text-center text-slate-900">LeaveIt</h1>
        <p className="text-slate-500 text-center mb-6">Login to manage your leaves</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="employeeId">
              Employee ID
            </label>
            <input
              id="employeeId"
              name="employeeId"
              required
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 px-4 py-2 text-sm font-medium"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-500 text-center">
          Don&apos;t have an account? <a href="/auth/register" className="text-indigo-600 hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
}
