'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, AlertTriangle } from 'lucide-react';

const ADMIN_MARKERS = [
  { id: 'PTH-001', lat: 21.2513, lng: 81.6293, severity: 'Dangerous' as const, status: 'Reported', reporter: 'Priya Sharma' },
  { id: 'PTH-002', lat: 21.2518, lng: 81.6298, severity: 'Moderate' as const, status: 'Under Review', reporter: 'Arjun Mishra' },
  { id: 'PTH-003', lat: 21.2524, lng: 81.6305, severity: 'Minor' as const, status: 'Detected', reporter: 'Rahul Sahu' },
  { id: 'PTH-004', lat: 21.2531, lng: 81.6311, severity: 'Dangerous' as const, status: 'Under Review', reporter: 'Priya Sharma' },
  { id: 'PTH-005', lat: 21.2539, lng: 81.6319, severity: 'Moderate' as const, status: 'Repair Scheduled', reporter: 'Kavita Dewangan' },
  { id: 'PTH-006', lat: 21.2546, lng: 81.6325, severity: 'Minor' as const, status: 'Detected', reporter: 'Priya Sharma' },
  { id: 'PTH-007', lat: 21.2553, lng: 81.6332, severity: 'Dangerous' as const, status: 'Reported', reporter: 'Rahul Sahu' },
  { id: 'PTH-008', lat: 21.2561, lng: 81.6341, severity: 'Moderate' as const, status: 'Repaired', reporter: 'Arjun Mishra' },
  { id: 'PTH-009', lat: 21.2568, lng: 81.6348, severity: 'Minor' as const, status: 'Closed', reporter: 'Sunita Yadav' },
  { id: 'PTH-010', lat: 21.2574, lng: 81.6355, severity: 'Moderate' as const, status: 'Under Review', reporter: 'Arjun Mishra' },
  { id: 'PTH-011', lat: 21.2581, lng: 81.6362, severity: 'Dangerous' as const, status: 'Reported', reporter: 'Priya Sharma' },
  { id: 'PTH-012', lat: 21.2590, lng: 81.6370, severity: 'Dangerous' as const, status: 'Detected', reporter: 'Kavita Dewangan' },
];

const SEVERITY_COLORS = {
  Dangerous: '#ef4444',
  Moderate: '#f59e0b',
  Minor: '#22c55e',
};

export default function AdminMapPanel() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<unknown>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const initMap = async () => {
      try {
        // Backend integration: GET /api/heatmap for heatmap layer data
        const L = await import('leaflet');
        if (!mapRef.current || leafletMapRef.current) return;

        const map = L.map(mapRef.current, {
          center: [21.2550, 81.6330],
          zoom: 14,
          zoomControl: false,
          attributionControl: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap',
          maxZoom: 19,
        }).addTo(map);

        ADMIN_MARKERS.forEach((marker) => {
          const color = SEVERITY_COLORS[marker.severity];
          const size = marker.severity === 'Dangerous' ? 18 : marker.severity === 'Moderate' ? 14 : 11;

          const icon = L.divIcon({
            className: '',
            html: `<div style="
              width:${size}px;height:${size}px;
              background:${color};
              border:2px solid ${color}88;
              border-radius:50%;
              box-shadow:0 0 ${size}px ${color}55;
            "></div>`,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
          });

          const m = L.marker([marker.lat, marker.lng], { icon }).addTo(map);
          m.bindPopup(`
            <div style="font-family:'DM Sans',sans-serif;min-width:170px;padding:4px 0">
              <div style="font-weight:600;font-size:12px;color:hsl(220 20% 92%);margin-bottom:5px">${marker.id}</div>
              <div style="font-size:11px;color:${color};font-weight:600;margin-bottom:4px">${marker.severity}</div>
              <div style="font-size:11px;color:hsl(220 12% 65%);margin-bottom:2px">Reporter: ${marker.reporter}</div>
              <div style="font-size:11px;color:hsl(220 12% 65%)">Status: ${marker.status}</div>
            </div>
          `);
        });

        leafletMapRef.current = map;
        setMapLoaded(true);
      } catch (err) {
        console.error('Admin map error:', err);
        setMapError(true);
      }
    };
    initMap();
    return () => {
      if (leafletMapRef.current) {
        (leafletMapRef.current as { remove: () => void }).remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  const counts = {
    all: ADMIN_MARKERS.length,
    Dangerous: ADMIN_MARKERS.filter((m) => m.severity === 'Dangerous').length,
    Moderate: ADMIN_MARKERS.filter((m) => m.severity === 'Moderate').length,
    Minor: ADMIN_MARKERS.filter((m) => m.severity === 'Minor').length,
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
        <div>
          <h2 className="text-base font-600 text-text">City-Wide Risk Map</h2>
          <p className="text-xs text-muted-foreground">{ADMIN_MARKERS.length} active markers · Raipur</p>
        </div>
        <div className="flex items-center gap-1.5">
          {(['all', 'Dangerous', 'Moderate', 'Minor'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-all duration-150 ${
                activeFilter === f
                  ? f === 'all' ?'bg-primary/15 border-primary/40 text-primary'
                    : f === 'Dangerous' ?'bg-destructive/15 border-destructive/40 text-destructive'
                    : f === 'Moderate' ?'bg-warning/15 border-warning/40 text-warning' :'bg-success/15 border-success/40 text-success' :'border-border text-muted-foreground hover:bg-surface-elevated hover:text-text'
              }`}
            >
              {f === 'all' ? 'All' : f}
              <span className="ml-1 font-mono text-[10px]">
                ({f === 'all' ? counts.all : counts[f as keyof typeof counts]})
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative" style={{ height: '320px' }}>
        {!mapLoaded && !mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="text-xs text-muted-foreground">Loading city map…</p>
            </div>
          </div>
        )}
        {mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface z-10">
            <div className="text-center space-y-2">
              <MapPin size={28} className="text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">Map unavailable — check connection</p>
            </div>
          </div>
        )}
        <div ref={mapRef} className="w-full h-full" />

        {/* Dangerous alert overlay */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive/20 border border-destructive/40 text-xs text-destructive font-500">
          <AlertTriangle size={12} />
          {counts.Dangerous} dangerous · unresolved
        </div>
      </div>
    </div>
  );
}