"use client";

import { useState } from "react";
import { AlertCircle, MapPin, Calendar, Navigation, CheckCircle2, Clock, Activity } from "lucide-react";

interface PotholeRecord {
  id: string;
  location: string;
  severity: "High" | "Medium" | "Low";
  dateReported: string;
  status: "Detected" | "Under Review" | "Repair Scheduled" | "Repaired";
}

// Mock data: Matches the map locations for consistency
const MOCK_POTHOLES: PotholeRecord[] = [
  { id: "PH-1042", location: "NH-30, Raipur Bypass", severity: "High", dateReported: "2026-04-05", status: "Repair Scheduled" },
  { id: "PH-1043", location: "VIP Road, Durg", severity: "Medium", dateReported: "2026-04-04", status: "Under Review" },
  { id: "PH-1044", location: "GE Road, Bhilai", severity: "High", dateReported: "2026-04-03", status: "Detected" },
  { id: "PH-1045", location: "Sector 10 Street", severity: "Low", dateReported: "2026-04-01", status: "Repaired" },
];

interface PotholeTableProps {
  title?: string;
  allowStatusUpdate?: boolean;
}

export default function PotholeTable({ title, allowStatusUpdate = false }: PotholeTableProps) {
  const [records, setRecords] = useState<PotholeRecord[]>(MOCK_POTHOLES);

  const handleStatusChange = (id: string, newStatus: PotholeRecord["status"]) => {
    setRecords((prev) =>
      prev.map((record) => (record.id === id ? { ...record, status: newStatus } : record))
    );
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "High": return "bg-red-100 text-red-700 border-red-200";
      case "Medium": return "bg-orange-100 text-orange-700 border-orange-200";
      case "Low": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Detected": return "bg-red-50 text-red-700 border-red-200 outline-red-200 focus:ring-red-500";
      case "Under Review": return "bg-yellow-50 text-yellow-700 border-yellow-200 outline-yellow-200 focus:ring-yellow-500";
      case "Repair Scheduled": return "bg-blue-50 text-blue-700 border-blue-200 outline-blue-200 focus:ring-blue-500";
      case "Repaired": return "bg-green-50 text-green-700 border-green-200 outline-green-200 focus:ring-green-500";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      
      {title && (
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/80 flex items-center gap-2">
          <Activity className="text-blue-600" size={18} />
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Hazard ID</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Geofence Location</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Severity</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Detection Date</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Workflow Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-blue-50/30 transition-colors group">
                
                {/* ID */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-blue-500 transition-colors"></div>
                    <span className="text-sm font-bold text-blue-950">{record.id}</span>
                  </div>
                </td>

                {/* Location */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-blue-400" />
                    <span className="text-sm text-gray-700 font-semibold">{record.location}</span>
                  </div>
                </td>

                {/* Severity Badge */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wide ${getSeverityBadge(record.severity)}`}>
                    <AlertCircle size={12} />
                    {record.severity}
                  </span>
                </td>

                {/* Date */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                    <Calendar size={14} className="text-gray-400" />
                    {record.dateReported}
                  </div>
                </td>

                {/* Status Update / Display */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {allowStatusUpdate ? (
                    <select
                      value={record.status}
                      onChange={(e) => handleStatusChange(record.id, e.target.value as PotholeRecord["status"])}
                      className={`text-sm font-semibold rounded-lg px-3 py-1.5 border transition-all cursor-pointer ${getStatusColor(record.status)}`}
                    >
                      <option value="Detected">🔴 Detected</option>
                      <option value="Under Review">🟡 Under Review</option>
                      <option value="Repair Scheduled">🔵 Repair Scheduled</option>
                      <option value="Repaired">🟢 Repaired</option>
                    </select>
                  ) : (
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold ${getStatusColor(record.status)}`}>
                      {record.status === "Repaired" ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                      {record.status}
                    </div>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100" title="Locate on Map">
                    <Navigation size={18} />
                  </button>
                </td>

              </tr>
            ))}
            
            {records.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <CheckCircle2 size={32} className="text-green-400 mb-2" />
                    <p className="text-sm font-medium">All clear! No active pothole records found.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}