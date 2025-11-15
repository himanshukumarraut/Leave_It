"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../auth-context";

interface Leave {
  _id: string;
  employeeId: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: string;
}

export default function ManagementDashboard() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== "manager") {
      router.replace("/auth/login");
      return;
    }

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("https://leave-it-wmz2.onrender.com/api/leaves/pending");
        if (!res.ok) throw new Error("Failed to load data");
        const data = await res.json();
        setLeaves(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, router]);

  async function handleAction(id: string, action: "approve" | "reject") {
    try {
      const res = await fetch(`https://leave-it-wmz2.onrender.com/api/leaves/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to update leave");
      }

      setLeaves((prev) => prev.filter((l) => l._id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to update leave");
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">LeaveIt - Management Dashboard</h1>
        <div className="flex items-center gap-4 text-sm text-slate-700">
          <span>Manager</span>
          <button
            onClick={() => {
              setUser(null);
              router.replace("/auth/login");
            }}
            className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium hover:bg-slate-100"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="px-6 py-6">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-medium mb-3">Pending Leave Requests</h2>
          {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
          <div className="overflow-x-auto text-sm">
            <table className="min-w-full text-left">
              <thead className="border-b border-slate-200 text-slate-500 text-xs">
                <tr>
                  <th className="py-2 pr-4">Employee ID</th>
                  <th className="py-2 pr-4">From</th>
                  <th className="py-2 pr-4">To</th>
                  <th className="py-2 pr-4">Reason</th>
                  <th className="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave._id} className="border-b border-slate-200 last:border-0">
                    <td className="py-2 pr-4">{leave.employeeId}</td>
                    <td className="py-2 pr-4">
                      {new Date(leave.fromDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 pr-4">
                      {new Date(leave.toDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 pr-4 max-w-xs truncate" title={leave.reason}>
                      {leave.reason}
                    </td>
                    <td className="py-2 pr-4 space-x-2">
                      <button
                        onClick={() => handleAction(leave._id, "approve")}
                        className="rounded-md bg-emerald-600 hover:bg-emerald-500 px-3 py-1 text-xs font-medium text-white"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(leave._id, "reject")}
                        className="rounded-md bg-red-600 hover:bg-red-500 px-3 py-1 text-xs font-medium text-white"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
                {leaves.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-slate-500">
                      No pending requests.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
