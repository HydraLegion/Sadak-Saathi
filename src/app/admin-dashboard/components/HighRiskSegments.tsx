'use client';

import { AlertTriangle, MapPin, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface RoadSegment {
  id: string;
  name: string;
  district: string;
  potholeCount: number;
  dangerousCount: number;
  lengthKm: number;
  riskScore: number;
  lastSurveyed: string;
  department: string;
}

// Backend integration: GET /api/admin/high-risk-segments
const HIGH_RISK_SEGMENTS: RoadSegment[] = [
  {
    id: 'SEG-001',
    name: 'NH-30, Km 12–15',
    district: 'Raipur North',
    potholeCount: 14,
    dangerousCount: 6,
    lengthKm: 3.0,
    riskScore: 94,
    lastSurveyed: '2026-03-13',
    department: 'PWD Raipur Division',
  },
  {
    id: 'SEG-002',
    name: 'Ring Road, Shankar Nagar',
    district: 'Raipur Central',
    potholeCount: 11,
    dangerousCount: 3,
    lengthKm: 2.2,
    riskScore: 78,
    lastSurveyed: '2026-03-12',
    department: 'Municipal Corp. Raipur',
  },
  {
    id: 'SEG-003',
    name: 'Sector 4 Bypass',
    district: 'Raipur South',
    potholeCount: 9,
    dangerousCount: 4,
    lengthKm: 1.8,
    riskScore: 71,
    lastSurveyed: '2026-03-11',
    department: 'PWD Raipur Division',
  },
  {
    id: 'SEG-004',
    name: 'Airport Rd, Mana',
    district: 'Raipur East',
    potholeCount: 7,
    dangerousCount: 2,
    lengthKm: 4.1,
    riskScore: 58,
    lastSurveyed: '2026-03-10',
    department: 'NHAI Regional Office',
  },
];

function RiskScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? '#ef4444' : score >= 60 ? '#f59e0b' : '#22c55e';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-surface-elevated overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <span
        className="font-mono text-xs font-700 w-6 text-right"
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
}

export default function HighRiskSegments() {
  return (
    <div className="card">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
        <div>
          <h2 className="text-base font-600 text-text">High-Risk Road Segments</h2>
          <p className="text-xs text-muted-foreground">≥3 potholes per 500m · ranked by risk score</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-500 text-destructive bg-destructive/10 px-2.5 py-1 rounded-full border border-destructive/20">
          <AlertTriangle size={12} />
          {HIGH_RISK_SEGMENTS.length} critical segments
        </span>
      </div>

      <div className="divide-y divide-border/30">
        {HIGH_RISK_SEGMENTS.map((seg, idx) => (
          <div
            key={seg.id}
            className="px-5 py-4 hover:bg-surface-elevated/40 transition-colors group cursor-pointer"
            onClick={() => toast.info(`Opening segment map: ${seg.name}`)}
          >
            <div className="flex items-start gap-3">
              {/* Rank badge */}
              <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-700 ${
                idx === 0 ? 'bg-destructive/20 text-destructive' :
                idx === 1 ? 'bg-warning/20 text-warning': 'bg-surface-elevated text-muted-foreground'
              }`}>
                #{idx + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <p className="text-sm font-600 text-text truncate">{seg.name}</p>
                    <span className="font-mono text-[10px] text-muted-foreground flex-shrink-0">{seg.id}</span>
                  </div>
                  <ChevronRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </div>

                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin size={11} />
                    {seg.district}
                  </span>
                  <span className="text-xs text-muted-foreground">{seg.lengthKm} km</span>
                  <span className="text-xs text-muted-foreground">{seg.department}</span>
                </div>

                <div className="flex items-center gap-4 mb-2">
                  <div className="text-center">
                    <p className="font-mono text-base font-700 text-text">{seg.potholeCount}</p>
                    <p className="text-[10px] text-muted-foreground">total</p>
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-base font-700 text-destructive">{seg.dangerousCount}</p>
                    <p className="text-[10px] text-muted-foreground">dangerous</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-muted-foreground mb-1">Risk Score</p>
                    <RiskScoreBar score={seg.riskScore} />
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground">
                  Last surveyed: <span className="font-mono">{seg.lastSurveyed}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}