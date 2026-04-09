'use client';

import { CheckCircle, XCircle, Wrench, Upload, AlertTriangle, Eye, Clock } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface ActivityLogEntry {
  id: string;
  type: 'approved' | 'rejected' | 'repaired' | 'uploaded' | 'flagged' | 'reviewed';
  actor: string;
  target: string;
  detail: string;
  timestamp: string;
}

// Backend integration: GET /api/admin/activity-log?limit=10
const ACTIVITY_LOG: ActivityLogEntry[] = [
  { id: 'ACT-091', type: 'uploaded', actor: 'Kavita Dewangan', target: 'nh30_extension.mp4', detail: '3 potholes detected, 2 dangerous', timestamp: '2026-03-13T14:10:00' },
  { id: 'ACT-090', type: 'flagged', actor: 'AI System', target: 'PTH-012', detail: 'Dangerous pothole auto-flagged for urgent review', timestamp: '2026-03-13T14:10:22' },
  { id: 'ACT-089', type: 'approved', actor: 'Admin Rajesh Kumar', target: 'PTH-010', detail: 'Moved to Under Review · assigned to Municipal Corp.', timestamp: '2026-03-13T08:15:00' },
  { id: 'ACT-088', type: 'repaired', actor: 'Admin Rajesh Kumar', target: 'PTH-008', detail: 'Marked as Repaired · NHAI confirmed completion', timestamp: '2026-03-12T15:30:00' },
  { id: 'ACT-087', type: 'reviewed', actor: 'Admin Rajesh Kumar', target: 'PTH-005', detail: 'Repair scheduled with NHAI for Mar 15', timestamp: '2026-03-12T09:45:00' },
  { id: 'ACT-086', type: 'rejected', actor: 'Admin Rajesh Kumar', target: 'PTH-013', detail: 'False report — shadow misidentified as pothole', timestamp: '2026-03-11T17:20:00' },
  { id: 'ACT-085', type: 'uploaded', actor: 'Rahul Sahu', target: 'main_road_raipur.mp4', detail: '5 potholes detected including 2 dangerous', timestamp: '2026-03-11T09:30:00' },
];

const TYPE_CONFIG = {
  approved: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/15', label: 'Approved' },
  rejected: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/15', label: 'Rejected' },
  repaired: { icon: Wrench, color: 'text-info', bg: 'bg-info/15', label: 'Repaired' },
  uploaded: { icon: Upload, color: 'text-primary', bg: 'bg-primary/15', label: 'Uploaded' },
  flagged: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/15', label: 'Flagged' },
  reviewed: { icon: Eye, color: 'text-muted-foreground', bg: 'bg-surface-elevated', label: 'Reviewed' },
};

function formatRelTime(iso: string): string {
  const now = new Date('2026-03-13T14:51:02');
  const d = new Date(iso);
  const diffMin = Math.floor((now.getTime() - d.getTime()) / 60000);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

export default function RecentActivityLog() {
  return (
    <div className="card">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
        <div>
          <h2 className="text-base font-600 text-text">Recent Activity</h2>
          <p className="text-xs text-muted-foreground">Admin actions & AI events · last 48h</p>
        </div>
        <Clock size={16} className="text-muted-foreground" />
      </div>

      <div className="divide-y divide-border/30 max-h-[340px] overflow-y-auto">
        {ACTIVITY_LOG.map((entry) => {
          const cfg = TYPE_CONFIG[entry.type];
          const Icon = cfg.icon;
          return (
            <div key={entry.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-surface-elevated/40 transition-colors">
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 ${cfg.bg}`}>
                <Icon size={14} className={cfg.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2 mb-0.5">
                  <span className="text-xs font-600 text-text">{entry.actor}</span>
                  <span className="text-[11px] text-muted-foreground font-mono flex-shrink-0">{formatRelTime(entry.timestamp)}</span>
                </div>
                <p className="text-xs text-text-secondary truncate">
                  <span className={`font-600 ${cfg.color}`}>{cfg.label}</span>
                  {' · '}
                  <span className="font-mono">{entry.target}</span>
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{entry.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}