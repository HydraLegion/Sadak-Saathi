'use client';

import { Building2, CheckCircle, Clock, AlertTriangle, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface Department {
  name: string;
  shortName: string;
  assignedPotholes: number;
  resolved: number;
  pending: number;
  overdue: number;
  avgResponseDays: number;
  lastActivity: string;
}

// Backend integration: GET /api/admin/departments
const DEPARTMENTS: Department[] = [
  {
    name: 'PWD Raipur Division',
    shortName: 'PWD',
    assignedPotholes: 58,
    resolved: 31,
    pending: 19,
    overdue: 8,
    avgResponseDays: 6.2,
    lastActivity: '2026-03-13',
  },
  {
    name: 'Municipal Corp. Raipur',
    shortName: 'MCR',
    assignedPotholes: 43,
    resolved: 29,
    pending: 11,
    overdue: 3,
    avgResponseDays: 4.8,
    lastActivity: '2026-03-12',
  },
  {
    name: 'NHAI Regional Office',
    shortName: 'NHAI',
    assignedPotholes: 31,
    resolved: 22,
    pending: 7,
    overdue: 2,
    avgResponseDays: 9.1,
    lastActivity: '2026-03-11',
  },
  {
    name: 'Chhattisgarh State PWD',
    shortName: 'SPWD',
    assignedPotholes: 15,
    resolved: 9,
    pending: 4,
    overdue: 2,
    avgResponseDays: 11.4,
    lastActivity: '2026-03-10',
  },
];

export default function DepartmentStatusPanel() {
  return (
    <div className="card">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
        <div>
          <h2 className="text-base font-600 text-text">Department Status</h2>
          <p className="text-xs text-muted-foreground">Complaint assignment & resolution tracking</p>
        </div>
        <Building2 size={18} className="text-muted-foreground" />
      </div>

      <div className="divide-y divide-border/30">
        {DEPARTMENTS.map((dept) => {
          const resolvedRate = Math.round((dept.resolved / dept.assignedPotholes) * 100);
          const hasOverdue = dept.overdue > 0;

          return (
            <div
              key={dept.name}
              className="px-5 py-4 hover:bg-surface-elevated/40 transition-colors cursor-pointer group"
              onClick={() => toast.info(`Opening ${dept.name} detail view`)}
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-700 text-primary font-mono">{dept.shortName}</span>
                  </div>
                  <div>
                    <p className="text-sm font-500 text-text">{dept.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      Avg response: <span className="font-mono">{dept.avgResponseDays}d</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {hasOverdue && (
                    <span className="flex items-center gap-1 text-[11px] font-500 text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                      <AlertTriangle size={10} />
                      {dept.overdue} overdue
                    </span>
                  )}
                  <ChevronRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-muted-foreground">Resolution rate</span>
                  <span className={`font-mono text-[11px] font-600 ${resolvedRate >= 70 ? 'text-success' : resolvedRate >= 55 ? 'text-warning' : 'text-destructive'}`}>
                    {resolvedRate}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-surface overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${resolvedRate >= 70 ? 'bg-success' : resolvedRate >= 55 ? 'bg-warning' : 'bg-destructive'}`}
                    style={{ width: `${resolvedRate}%` }}
                  />
                </div>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-info" />
                  <span>{dept.assignedPotholes} assigned</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <CheckCircle size={10} className="text-success" />
                  <span>{dept.resolved} resolved</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Clock size={10} className="text-warning" />
                  <span>{dept.pending} pending</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}