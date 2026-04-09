"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PotholeTable from "@/components/dashboard/PotholeTable";
import PotholeMap from "@/components/dashboard/PotholeMap";
import useAuth from "../hooks/useAuth";
import { AlertOctagon, Clock, CheckCircle2, Map, LayoutList, Activity } from "lucide-react";

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
                  <option value="Detected">🔴 Detected</option>
                  <option value="Under Review">🟡 Under Review</option>
                  <option value="Repair Scheduled">🔵 Repair Scheduled</option>
                  <option value="Repaired">🟢 Repaired</option>
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

      {/* Data Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
          <LayoutList className="text-blue-800" size={20} />
          <h2 className="text-lg font-bold text-gray-800">Unified Hazard Registry</h2>
        </div>
        <div className="p-6">
          <PotholeTable title="" allowStatusUpdate />
        </div>
      </div>

    </MainLayout>
  );
}