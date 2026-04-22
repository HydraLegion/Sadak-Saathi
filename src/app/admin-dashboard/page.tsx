"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PotholeMap from "@/components/dashboard/PotholeMap";
import useAuth from "../hooks/useAuth";
import { AlertOctagon, Clock, CheckCircle2, Map, LayoutList, Activity, Video, CheckCircle } from "lucide-react";

type RepairStatus = "Detected" | "Under Review" | "Repair Scheduled" | "Repaired";

const initialRepairRows: Array<{ zone: string; pending: number; status: RepairStatus }> = [
  { zone: "Raipur North", pending: 14, status: "Under Review" },
  { zone: "Raipur South", pending: 9, status: "Repair Scheduled" },
  { zone: "NH-30 Corridor", pending: 7, status: "Detected" },
  { zone: "Bypass Stretch", pending: 5, status: "Repaired" },
];

const getStatusColor = (status: RepairStatus) => {
  switch (status) {
    case "Detected": return "bg-red-50 text-red-700 border-red-200";
    case "Under Review": return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "Repair Scheduled": return "bg-blue-50 text-blue-700 border-blue-200";
    case "Repaired": return "bg-green-50 text-green-700 border-green-200";
    default: return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export default function AdminDashboardPage() {
  useAuth();
  const [repairRows, setRepairRows] = useState(initialRepairRows);
  
  // NEW: State for our live Firebase database logs
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // NEW: Fetch live data from the Ngrok backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/history`, {
          headers: { "ngrok-skip-browser-warning": "true" }
        });
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
    // Poll every 10 seconds for new uploads
    const interval = setInterval(fetchHistory, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MainLayout tickerMessage="Admin command center active. Priority: NH-30 Corridor has 7 pending severe hazards.">
      
      {/* Dashboard Header */}
      <section className="mb-8">
        <h1 className="text-3xl font-extrabold text-blue-950 tracking-tight">Command Center</h1>
        <p className="text-gray-500 mt-2 text-sm max-w-2xl">
          Monitor national highway networks, manage repair operations, and track autonomous AI detections in real-time.
        </p>
      </section>

      {/* Admin KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center shrink-0">
            <AlertOctagon size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Critical Hazards</p>
            <p className="text-2xl font-bold text-gray-900">34 <span className="text-xs font-normal text-red-500">Action Required</span></p>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Avg. Repair Time</p>
            <p className="text-2xl font-bold text-gray-900">4.2 <span className="text-xs font-normal text-gray-400">days</span></p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Repaired</p>
            <p className="text-2xl font-bold text-gray-900">1,204 <span className="text-xs font-normal text-green-500">This Month</span></p>
          </div>
        </div>
      </div>

      {/* Operations Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        
        {/* Status Panel (1 Column) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="text-blue-800" size={20} />
              <h2 className="text-lg font-bold text-gray-800">Active Corridors</h2>
            </div>
          </div>
          <div className="p-6 flex-1 overflow-y-auto space-y-4">
            {repairRows.map((row) => (
              <div
                key={row.zone}
                className="group border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-blue-100 transition-all bg-white"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-800 transition-colors">{row.zone}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Pending Hazards: <span className="font-semibold text-gray-700">{row.pending}</span></p>
                  </div>
                </div>
                <select
                  value={row.status}
                  onChange={(e) => {
                    const value = e.target.value as RepairStatus;
                    setRepairRows((prev) =>
                      prev.map((item) => (item.zone === row.zone ? { ...item, status: value } : item))
                    );
                  }}
                  className={`w-full text-xs font-semibold rounded-lg px-3 py-2 border outline-none cursor-pointer appearance-none ${getStatusColor(row.status)}`}
                >
                  <option value="Detected">• Detected</option>
                  <option value="Under Review">• Under Review</option>
                  <option value="Repair Scheduled">• Repair Scheduled</option>
                  <option value="Repaired">• Repaired</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Map Panel (2 Columns) */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full min-h-[400px]">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <Map className="text-blue-800" size={20} />
            <h2 className="text-lg font-bold text-gray-800">Live Infrastructure Map</h2>
          </div>
          <div className="p-2 flex-1 relative z-0">
            <div className="w-full h-full rounded-xl overflow-hidden border border-gray-200">
              <PotholeMap title="" />
            </div>
          </div>
        </div>
      </div>

      {/* NEW: Live Firebase Database Logs Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutList className="text-blue-800" size={20} />
            <h2 className="text-lg font-bold text-gray-800">Live AI Processing Logs</h2>
          </div>
          <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Database Sync Active
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-semibold">Video File</th>
                <th className="p-4 font-semibold">Location</th>
                <th className="p-4 font-semibold">Time</th>
                <th className="p-4 font-semibold text-center">Frames Analyzed</th>
                <th className="p-4 font-semibold text-center">Hazards Found</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading live AI logs from backend...</td></tr>
              ) : history.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">No database records found yet. Upload a video on the Citizen Workspace!</td></tr>
              ) : (
                history.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-500">
                        <Video size={16} />
                      </div>
                      <span className="font-medium text-gray-900">{record.filename}</span>
                    </td>
                    <td className="p-4 text-sm text-gray-600 font-medium">
                      {record.location}
                    </td>
                    <td className="p-4 text-sm text-gray-500">{record.timestamp}</td>
                    <td className="p-4 text-center font-mono text-blue-700 font-bold">{record.frames}</td>
                    <td className="p-4 text-center font-mono text-red-600 font-bold">{record.hazards}</td>
                    <td className="p-4">
                      {record.status === "Completed" ? (
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold border border-green-200">
                          <CheckCircle size={12} /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full text-xs font-bold border border-orange-200 animate-pulse">
                          <Activity size={12} /> Processing...
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </MainLayout>
  );
}
