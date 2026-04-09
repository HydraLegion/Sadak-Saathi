"use client";

import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import { Activity, ShieldCheck, MapPin, ChevronRight, FileText } from "lucide-react";

export default function Home() {
  return (
    <MainLayout tickerMessage="New YOLO deployment active on NH corridors. State nodal officers are requested to update repair logs for this week.">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 rounded-2xl shadow-xl p-8 sm:p-12 mb-8 text-white">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Safer Roads, <span className="text-orange-400">Powered by AI.</span>
          </h1>
          <p className="text-lg text-blue-100 mb-8 leading-relaxed">
            Sadak Saathi is a national initiative utilizing automated pothole detection, geotagging, and an intelligent repair workflow to track and resolve road hazards faster than ever.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/user-dashboard">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg flex items-center gap-2">
                Launch Citizen Workspace <Activity size={18} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics & Circulars Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <MapPin size={24} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900">1.4M+</h3>
            <p className="text-sm text-gray-500 font-medium mt-1">Images Processed</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-4">
              <Activity size={24} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900">12,450</h3>
            <p className="text-sm text-gray-500 font-medium mt-1">Hazards Detected</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900">98.2%</h3>
            <p className="text-sm text-gray-500 font-medium mt-1">Model Accuracy</p>
          </div>
        </div>

        <aside className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="text-blue-800" size={20} />
            <h3 className="text-lg font-bold text-gray-900">Latest Circulars</h3>
          </div>
          <ul className="space-y-3">
            {[
              "YOLO API integration SOP for state engineering teams",
              "Monsoon preparedness advisory for district roads",
              "Dashboard training calendar for field supervisors",
              "Data privacy and retention notification update"
            ].map((circular, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-600 hover:text-blue-700 transition cursor-pointer group">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 group-hover:bg-blue-600 shrink-0 transition-colors"></span>
                <span className="leading-tight">{circular}</span>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      {/* Density Report Section (Static safe version for deployment) */}
      <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="bg-gray-50/80 px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">National Pothole Density Report</h2>
            <p className="text-sm text-gray-500 mt-1">Live ranking and district-level distribution of identified hazards</p>
          </div>
          <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg text-sm font-semibold border border-blue-100 flex items-center gap-2">
            <Activity size={16} /> Total Hazards: 12,450
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="md:col-span-5 lg:col-span-4 bg-white">
            <div className="px-5 py-3 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Top States by Hazard Count
            </div>
            <ul className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
              {[
                { name: "Maharashtra", count: "3,240" },
                { name: "Karnataka", count: "2,890" },
                { name: "Chhattisgarh", count: "1,950" },
                { name: "Gujarat", count: "1,420" },
              ].map((state, index) => (
                <li key={state.name} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 border-l-4 border-l-transparent transition-all">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${index < 3 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                      {index + 1}
                    </span>
                    <span className="font-semibold text-gray-700">{state.name}</span>
                  </div>
                  <span className="font-bold text-gray-900">{state.count}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-7 lg:col-span-8 bg-gray-50/30 p-8 flex flex-col items-center justify-center">
            <ShieldCheck size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-700">Select a state to view district breakdown</h3>
            <p className="text-gray-500 text-sm mt-2 text-center max-w-sm">Detailed district-level data is currently syncing with the national highway database.</p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
