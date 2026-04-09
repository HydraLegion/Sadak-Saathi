import React from 'react';

type Severity = 'Dangerous' | 'Moderate' | 'Minor';
type Status = 'Detected' | 'Reported' | 'Under Review' | 'Repair Scheduled' | 'Repaired' | 'Closed' | 'Rejected';

interface SeverityBadgeProps {
  severity: Severity;
  size?: 'sm' | 'md';
}

interface StatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md';
}

export function SeverityBadge({ severity, size = 'md' }: SeverityBadgeProps) {
  const sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1';

  const classMap: Record<Severity, string> = {
    Dangerous: `badge-dangerous ${sizeClass} rounded-badge font-600 inline-flex items-center gap-1`,
    Moderate: `badge-moderate ${sizeClass} rounded-badge font-600 inline-flex items-center gap-1`,
    Minor: `badge-minor ${sizeClass} rounded-badge font-600 inline-flex items-center gap-1`,
  };

  const dotMap: Record<Severity, string> = {
    Dangerous: 'bg-red-400',
    Moderate: 'bg-amber-400',
    Minor: 'bg-green-400',
  };

  return (
    <span className={classMap[severity]}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotMap[severity]}`} />
      {severity}
    </span>
  );
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1';

  const classMap: Record<Status, string> = {
    Detected: `badge-pending ${sizeClass} rounded-badge font-500`,
    Reported: `badge-reported ${sizeClass} rounded-badge font-500`,
    'Under Review': `badge-pending ${sizeClass} rounded-badge font-500`,
    'Repair Scheduled': `badge-reported ${sizeClass} rounded-badge font-500`,
    Repaired: `badge-repaired ${sizeClass} rounded-badge font-500`,
    Closed: `text-[10px] px-1.5 py-0.5 rounded-badge font-500 bg-surface-elevated text-muted-foreground border border-border`,
    Rejected: `text-xs px-2 py-1 rounded-badge font-500 bg-destructive/10 text-destructive border border-destructive/20`,
  };

  return <span className={classMap[status]}>{status}</span>;
}