"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { ShieldAlert, MapPin, Video, CheckCircle, Clock, Activity } from "lucide-react";

export default function AdminDashboardPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // DYNAMIC URL: Uses environment variable
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
    const interval = setInterval(fetchHistory, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MainLayout tickerMessage="ADMINISTRATOR ACCESS GRANTED. Viewing national hazard logs.">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <ShieldAlert className="text-red-600" size={32} />
            Nodal Officer Command Center
          </h1>
          <p className="text-gray-500 mt-2 text-sm max-w-2xl">
            Live audit trail of all AI video processing jobs and identified road hazards across your jurisdiction.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Clock className="text-blue-600" size={20} /> Recent AI Processing Logs
          </h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
            Live Sync: Active
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
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading database records...</td></tr>
              ) : history.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">No database records found. Have you added your Firebase JSON to the backend?</td></tr>
              ) : (
                history.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-500">
                        <Video size={16} />
                      </div>
                      <span className="font-medium text-gray-900">{record.filename}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <MapPin size={14} className="text-orange-500" />
                        {record.location}
                      </div>
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
