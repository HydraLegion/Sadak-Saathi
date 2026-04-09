"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import { stateData, StateEntry } from "./data";
import useAuth from "./hooks/useAuth";
import { Activity, ShieldCheck, MapPin, ChevronRight, FileText } from "lucide-react";

export default function Home() {
  useAuth();
  const [activeState, setActiveState] = useState<StateEntry>(stateData[0]);

  const totals = useMemo(() => {
    return stateData.reduce(
      (acc, state) => {
        acc.total += state.total;
        return acc;
      },
      { total: 0 }
    );
  }, []);

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
            {/* FIXED: This button now routes cleanly to your new dashboard! */}
            <Link href="/user-dashboard">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg flex items-center gap-2">
                Launch Citizen Workspace <Activity size={18} />
              </button>
            </Link>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2">
              View Analytics <ChevronRight size={18} />
            </button>
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

      {/* Density Report Section */}
      <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="bg-gray-50/80 px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">National Pothole Density Report</h2>
            <p className="text-sm text-gray-500 mt-1">Live ranking and district-level distribution of identified hazards</p>
          </div>
          <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg text-sm font-semibold border border-blue-100 flex items-center gap-2">
            <Activity size={16} /> Total Hazards: {totals.total.toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {/* States List */}
          <div className="md:col-span-5 lg:col-span-4 bg-white">
            <div className="px-5 py-3 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Top States by Hazard Count
            </div>
            <ul className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
              {stateData.map((state, index) => (
                <li
                  key={state.id}
                  onClick={() => setActiveState(state)}
                  className={`px-5 py-4 flex items-center justify-between cursor-pointer transition-all ${
                    activeState.id === state.id 
                      ? "bg-blue-50/50 border-l-4 border-l-blue-600" 
                      : "hover:bg-gray-50 border-l-4 border-l-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      index < 3 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </span>
                    <span className={`font-semibold ${activeState.id === state.id ? 'text-blue-900' : 'text-gray-700'}`}>
                      {state.name}
                    </span>
                  </div>
                  <span className="font-bold text-gray-900">{state.total.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities Breakdown */}
          <div className="md:col-span-7 lg:col-span-8 bg-gray-50/30">
            <div className="px-6 py-3 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
              District Breakdown: <span className="text-blue-800">{activeState.name}</span>
            </div>
            <div className="p-6 space-y-6">
              {activeState.cities.map((city) => (
                <div key={city.name} className="group">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-gray-700 group-hover:text-blue-800 transition-colors">{city.name}</span>
                    <span className="font-bold text-gray-900">{city.count.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`${city.color} h-2.5 rounded-full transition-all duration-1000 ease-out`} 
                      style={{ width: `${city.percent}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
