"use client";

import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { MapPin, Filter, Layers } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase"; 

export default function PotholeMap({ title }: { title?: string }) {
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [livePotholes, setLivePotholes] = useState<any[]>([]);
  const [MapModules, setMapModules] = useState<any>(null);

  // 1. Map Engine Loader (Safely unfreezes the map)
  useEffect(() => {
    let isMounted = true;
    Promise.all([
      import("leaflet"),
      import("react-leaflet")
    ]).then(([L, ReactLeaflet]) => {
      if (isMounted) {
        setMapModules({ L, RL: ReactLeaflet });
        setMounted(true);
      }
    }).catch(err => {
      console.error("Leaflet failed to load:", err);
    });
    return () => { isMounted = false; };
  }, []);

  // 2. Safe Firebase Listener
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(collection(db, "potholes"), (snapshot) => {
        const liveData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id.slice(0, 8).toUpperCase(),
            lat: parseFloat(data.latitude),
            lng: parseFloat(data.longitude),
            severity: data.severity || "Medium",
            status: "Newly Detected",
            location: "GPS Upload"
          };
        });
        setLivePotholes(liveData);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Firebase Map connection warning:", error);
      // Map will still load even if DB is empty!
    }
  }, []);

  if (!mounted || !MapModules) {
    return (
      <div className="w-full h-full min-h-[400px] bg-gray-100 flex flex-col items-center justify-center rounded-xl border border-gray-200">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-bold tracking-wide">Mounting Live Map Engine...</p>
      </div>
    );
  }

  const { L, RL } = MapModules;
  const { MapContainer, TileLayer, Marker, Popup } = RL;

  const createCustomIcon = (severity: string) => {
    let mainColor = severity === "Dangerous" || severity === "High" ? "#ef4444" : 
                    severity === "Moderate" || severity === "Medium" ? "#f97316" : "#22c55e";
    
    return L.divIcon({
      className: "custom-leaflet-icon",
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
          <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; opacity: 0.4; background-color: ${mainColor}; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: relative; z-index: 10; display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; background-color: ${mainColor}; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
            <div style="width: 6px; height: 6px; background-color: white; border-radius: 50%;"></div>
          </div>
        </div>
        <style>@keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }</style>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });
  };

  const filteredPotholes = activeFilter === "All" 
    ? livePotholes 
    : livePotholes.filter((p: any) => p.severity === activeFilter || (activeFilter === "High" && p.severity === "Dangerous") || (activeFilter === "Medium" && p.severity === "Moderate") || (activeFilter === "Low" && p.severity === "Minor"));

  return (
    <div className="relative w-full h-full min-h-[400px] flex flex-col z-0 rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-gray-100">
      
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-xl shadow-lg border border-gray-200 pointer-events-auto flex items-center gap-1">
          <div className="px-2 text-gray-400 border-r border-gray-200 flex items-center gap-2">
            <Filter size={16} />
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{livePotholes.length} Live</span>
          </div>
          {["All", "High", "Medium", "Low"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                activeFilter === filter ? "bg-blue-900 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {title && (
        <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-gray-200 flex items-center gap-2 pointer-events-auto">
          <MapPin size={18} className="text-blue-700" />
          <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
        </div>
      )}

      {/* Default Center set to Bhilai/Durg Region */}
      <MapContainer center={[21.2100, 81.3800]} zoom={11} scrollWheelZoom={true} className="w-full h-full min-h-[400px] z-0" zoomControl={true}>
        <TileLayer
          key="carto-light-voyager"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {filteredPotholes.map((pothole: any) => {
          if (isNaN(pothole.lat) || isNaN(pothole.lng)) return null;

          return (
            <Marker key={pothole.id} position={[pothole.lat, pothole.lng]} icon={createCustomIcon(pothole.severity)}>
              <Popup className="rounded-xl overflow-hidden shadow-xl border-0">
                <div className="p-1 min-w-[180px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold text-gray-400 tracking-wider uppercase">ID: {pothole.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      pothole.severity === "Dangerous" || pothole.severity === "High" ? "bg-red-100 text-red-700 border border-red-200" :
                      pothole.severity === "Moderate" || pothole.severity === "Medium" ? "bg-orange-100 text-orange-700 border border-orange-200" :
                      "bg-green-100 text-green-700 border border-green-200"
                    }`}>
                      {pothole.severity} Risk
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-2">{pothole.location}</h4>
                  <div className="flex flex-col gap-1 text-xs text-gray-700 bg-gray-50/80 p-2 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2">
                      <Layers size={14} className="text-blue-600" />
                      Status: <span className="font-bold">{pothole.status}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}