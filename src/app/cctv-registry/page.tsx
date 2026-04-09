"use client";

import { useEffect, useState, type FormEvent } from "react";
import MainLayout from "@/components/layout/MainLayout";

interface RegisteredCamera {
    id: string;
    ip: string;
    location: string;
    lastDetection: number;
    status: string;
    lastChecked: string;
}

export default function CCTVRegistryPage() {
    const [view, setView] = useState<"home" | "admin">("admin");
    const [cameras, setCameras] = useState<RegisteredCamera[]>([]);
    const [newIp, setNewIp] = useState("");
    const [newLoc, setNewLoc] = useState("");
    const [isBackendOnline, setIsBackendOnline] = useState(true);

    useEffect(() => {
        if (view === "admin") {
            const fetchCameras = async () => {
                try {
                    const response = await fetch("http://localhost:8000/api/cameras");
                    if (response.ok) {
                        const data = await response.json();
                        setCameras(data);
                        setIsBackendOnline(true);
                    }
                } catch (error) {
                    console.error("Backend offline. Make sure main.py is running!");
                    setIsBackendOnline(false);
                }
            };

            fetchCameras();
            const interval = setInterval(fetchCameras, 2000);
            return () => clearInterval(interval);
        }
    }, [view]);

    const addCamera = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await fetch("http://localhost:8000/api/cameras", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ip: newIp, location: newLoc }),
            });
            setNewIp("");
            setNewLoc("");
        } catch (error) {
            alert("Failed to register IP. Check backend connection.");
        }
    };

    return (
        <MainLayout tickerMessage="Highway CCTV monitoring system active">
            <div className="bg-slate-50 min-h-screen font-sans -mx-4 sm:-mx-6 lg:-mx-8">
                <nav className="bg-blue-900 text-white p-4 flex justify-between items-center shadow-lg">
                    <h1 className="font-bold text-xl tracking-tighter uppercase flex items-center">
                        Sadak Saathi <span className="text-orange-500 underline ml-1">Pro</span>
                        {!isBackendOnline && (
                            <span className="ml-4 text-[10px] bg-red-600 px-2 py-1 rounded animate-pulse">
                                API OFFLINE
                            </span>
                        )}
                    </h1>
                    <div className="space-x-4 text-sm font-bold">
                        <button
                            onClick={() => setView("home")}
                            className={
                                view === "home"
                                    ? "text-orange-400 border-b-2 border-orange-400"
                                    : "text-slate-300"
                            }
                        >
                            Public View
                        </button>
                        <button
                            onClick={() => setView("admin")}
                            className={
                                view === "admin"
                                    ? "text-orange-400 border-b-2 border-orange-400"
                                    : "text-slate-300"
                            }
                        >
                            Admin Registry
                        </button>
                    </div>
                </nav>

                <main className="p-4 sm:p-8 max-w-6xl mx-auto">
                    {view === "admin" ? (
                        <div className="space-y-8 animate-in fade-in zoom-in duration-300">
                            <div className="bg-white p-6 rounded-lg shadow-md border-l-8 border-blue-600">
                                <h2 className="text-lg font-bold mb-4 text-slate-800 flex items-center">
                                    <span className="mr-2">🔌</span> Register New Highway CCTV (IP/RTSP)
                                </h2>
                                <form
                                    onSubmit={addCamera}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                >
                                    <input
                                        type="text"
                                        placeholder="Camera IP (e.g. 10.0.4.22)"
                                        className="border border-slate-300 p-2 rounded text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        value={newIp}
                                        onChange={(e) => setNewIp(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Location (e.g. Sector 24 Junction)"
                                        className="border border-slate-300 p-2 rounded text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        value={newLoc}
                                        onChange={(e) => setNewLoc(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white font-bold py-2 rounded shadow hover:bg-blue-700 transition active:scale-95"
                                    >
                                        Add to YOLO12 Monitor
                                    </button>
                                </form>
                            </div>

                            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-200">
                                <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
                                    <h3 className="font-bold text-sm uppercase tracking-widest text-slate-300">
                                        Active Camera Intelligence Registry
                                    </h3>
                                    <span className="text-[10px] bg-green-600 px-2 py-1 rounded font-mono shadow-[0_0_8px_#16a34a]">
                                        YOLO12 POLLING: ACTIVE
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[600px]">
                                        <thead>
                                            <tr className="bg-slate-100 text-slate-500 text-[10px] uppercase font-bold border-b border-slate-200">
                                                <th className="p-4">Camera ID</th>
                                                <th className="p-4">IP Address / Source</th>
                                                <th className="p-4">Geographic Location</th>
                                                <th className="p-4">Detection Status</th>
                                                <th className="p-4">AI Last Sync</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm divide-y divide-slate-100">
                                            {cameras.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                                        No cameras registered. Add an IP above.
                                                    </td>
                                                </tr>
                                            ) : (
                                                cameras.map((cam) => (
                                                    <tr key={cam.id} className="hover:bg-slate-50 transition">
                                                        <td className="p-4 font-mono font-bold text-blue-600 flex items-center">
                                                            {cam.status === "Online" && (
                                                                <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
                                                            )}
                                                            {cam.id}
                                                        </td>
                                                        <td className="p-4 text-slate-600 font-mono text-xs">
                                                            {cam.ip}
                                                        </td>
                                                        <td className="p-4 font-medium text-slate-800">
                                                            {cam.location}
                                                        </td>
                                                        <td className="p-4">
                                                            {cam.lastDetection > 0 ? (
                                                                <span className="bg-red-100 text-red-700 border border-red-200 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                                                                    ⚠️ {cam.lastDetection} Hazards Logged
                                                                </span>
                                                            ) : (
                                                                <span className="bg-green-100 text-green-700 border border-green-200 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                                                                    ✅ Surface Clear
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="p-4 text-[11px] text-slate-400 font-mono">
                                                            {cam.lastChecked}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20 animate-in fade-in">
                            <h2 className="text-3xl font-bold text-slate-800">
                                Welcome to Sadak Saathi Public Portal
                            </h2>
                            <p className="text-slate-500 mt-2">
                                Citizens can view aggregate data here. Secure CCTV routing is
                                restricted to Nodal Officers.
                            </p>
                            <button
                                onClick={() => setView("admin")}
                                className="mt-8 bg-blue-900 text-white px-6 py-2 rounded font-bold shadow-lg hover:bg-blue-800 transition"
                            >
                                Access Admin Console
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </MainLayout>
    );
}