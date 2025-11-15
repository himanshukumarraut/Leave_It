"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Leave {
  _id: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: string;
}

interface EmployeeInfo {
  employeeId: string;
  name: string;
  totalLeavesPerYear: number;
  leavesTaken: number;
  leavesRemaining: number;
}

export default function EmployeeDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [employee, setEmployee] = useState<EmployeeInfo | null>(null);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session as any).user.role !== "employee") {
      router.replace("/auth/login");
      return;
    }

    const employeeId = (session as any).user.employeeId as string;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:4000/api/leaves/employee/${employeeId}`);
        if (!res.ok) throw new Error("Failed to load data");
        const data = await res.json();
        setEmployee(data.employee);
        setLeaves(data.leaves);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [session, status, router]);

  async function handleCreateLeave(formData: FormData) {
    if (!session) return;
    const employeeId = (session as any).user.employeeId as string;

    try {
      const payload = {
        employeeId,
        fromDate: formData.get("fromDate") as string,
        toDate: formData.get("toDate") as string,
        reason: formData.get("reason") as string,
      };

      const res = await fetch("http://localhost:4000/api/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to create leave");
      }

      // reload
      const refreshed = await fetch(`http://localhost:4000/api/leaves/employee/${employeeId}`);
      const data = await refreshed.json();
      setEmployee(data.employee);
      setLeaves(data.leaves);
    } catch (err: any) {
      alert(err.message || "Failed to create leave");
    }
  }

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">Loading...</div>;
  }

  if (!employee) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">No data</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">LeaveIt - Employee Dashboard</h1>
        <div className="flex items-center gap-4 text-sm text-slate-700">
          <span>
            {employee.name} ({employee.employeeId})
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium hover:bg-slate-100"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="px-6 py-6 space-y-6">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">Total Leaves / Year</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{employee.totalLeavesPerYear}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">Leaves Taken</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{employee.leavesTaken}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">Leaves Remaining</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-600">{employee.leavesRemaining}</p>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-medium mb-3">Request Leave</h2>
            <form
              action={(formData) => {
                handleCreateLeave(formData);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs mb-1" htmlFor="fromDate">
                  From Date
                </label>
                <input
                  id="fromDate"
                  name="fromDate"
                  type="date"
                  required
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs mb-1" htmlFor="toDate">
                  To Date
                </label>
                <input
                  id="toDate"
                  name="toDate"
                  type="date"
                  required
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs mb-1" htmlFor="reason">
                  Reason
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  required
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-medium text-white"
              >
                Submit Request
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-medium mb-3">Your Leave Requests</h2>
            {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
            <div className="overflow-x-auto text-sm">
              <table className="min-w-full text-left">
                <thead className="border-b border-slate-200 text-slate-500 text-xs">
                  <tr>
                    <th className="py-2 pr-4">From</th>
                    <th className="py-2 pr-4">To</th>
                    <th className="py-2 pr-4">Reason</th>
                    <th className="py-2 pr-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((leave) => (
                    <tr key={leave._id} className="border-b border-slate-200 last:border-0">
                      <td className="py-2 pr-4">
                        {new Date(leave.fromDate).toISOString().split("T")[0]}
                      </td>
                      <td className="py-2 pr-4">
                        {new Date(leave.toDate).toISOString().split("T")[0]}
                      </td>
                      <td className="py-2 pr-4 max-w-xs truncate" title={leave.reason}>
                        {leave.reason}
                      </td>
                      <td className="py-2 pr-4">
                        <span
                          className={
                            leave.status === "approved"
                              ? "text-emerald-600"
                              : leave.status === "rejected"
                              ? "text-red-600"
                              : "text-amber-500"
                          }
                        >
                          {leave.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {leaves.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-500">
                        No leave requests yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
