'use client';

import { AlertTriangle, TrendingUp, TrendingDown, Wrench, Activity, Map, BarChart3, Clock } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface AdminKPIData {
  dangerousUnresolved: number;
  repairCompletionRate: number;
  detectedToday: number;
  totalComplaints: number;
  highRiskSegments: number;
  avgConfidence: number;
  pendingApproval: number;
  avgDaysToRepair: number;
}

// Backend integration: GET /api/admin/kpi-summary
const KPI_DATA: AdminKPIData = {
  dangerousUnresolved: 9,
  repairCompletionRate: 62,
  detectedToday: 23,
  totalComplaints: 147,
  highRiskSegments: 4,
  avgConfidence: 88.4,
  pendingApproval: 12,
  avgDaysToRepair: 8.3,
};

interface CardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  trend?: { value: number; direction: 'up' | 'down'; positive?: boolean };
  variant: 'alert' | 'success' | 'warning' | 'info' | 'default';
  featured?: boolean;
}

function AdminKPICard({ label, value, unit, subtext, icon: Icon, trend, variant, featured = false }: CardProps) {
  const bgMap = {
    alert: 'bg-destructive/8 border-destructive/30',
    success: 'bg-success/5 border-success/25',
    warning: 'bg-warning/8 border-warning/30',
    info: 'bg-info/8 border-info/25',
    default: 'card',
  };

  const iconBgMap = {
    alert: 'bg-destructive/20 text-destructive',
    success: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
    info: 'bg-info/20 text-info',
    default: 'bg-primary/15 text-primary',
  };

  const trendPositive = trend
    ? (trend.direction === 'up' && trend.positive !== false) ||
      (trend.direction === 'down' && trend.positive === false)
    : null;

  return (
    <div className={`
      ${featured ? 'card border-primary/30' : `border ${bgMap[variant]}`}
      ${!featured ? 'rounded-card' : ''}
      p-5 flex flex-col gap-4 transition-all duration-200 hover:shadow-elevated
      ${featured ? 'bg-gradient-to-br from-primary/10 to-orange-900/10' : ''}
    `}
      style={{ borderRadius: '12px' }}
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBgMap[variant]}`}>
          <Icon size={20} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-500 ${trendPositive ? 'text-success' : 'text-destructive'}`}>
            {trend.direction === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend.value}%
          </div>
        )}
        {variant === 'alert' && (
          <span className="flex items-center gap-1 text-[10px] font-600 text-destructive bg-destructive/10 px-2 py-0.5 rounded-full border border-destructive/20">
            <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
            URGENT
          </span>
        )}
      </div>
      <div>
        <div className={`font-700 font-variant-numeric tabular-nums mb-1 leading-none ${featured ? 'text-4xl text-primary' : 'text-3xl text-text'}`}>
          {value}
          {unit && <span className="text-lg text-muted-foreground font-500 ml-1">{unit}</span>}
        </div>
        <div className="stat-label mb-1">{label}</div>
        <p className="text-xs text-muted-foreground">{subtext}</p>
      </div>
    </div>
  );
}

interface AdminKPICardsProps {
  isLoading?: boolean;
}

export default function AdminKPICards({ isLoading = false }: AdminKPICardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card p-5 space-y-4">
            <div className="skeleton w-10 h-10 rounded-xl" />
            <div className="space-y-2">
              <div className="skeleton h-9 w-16" />
              <div className="skeleton h-3 w-24" />
              <div className="skeleton h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 8 cards → grid-cols-4 → row 1: 4 cards, row 2: 4 cards
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {/* Row 1 */}
      <AdminKPICard
        label="Dangerous Unresolved"
        value={KPI_DATA.dangerousUnresolved}
        subtext="Requires immediate dispatch"
        icon={AlertTriangle}
        trend={{ value: 12, direction: 'up', positive: false }}
        variant="alert"
        featured={false}
      />
      <AdminKPICard
        label="Repair Completion Rate"
        value={`${KPI_DATA.repairCompletionRate}`}
        unit="%"
        subtext="Target: 75% · down from 68% last week"
        icon={Wrench}
        trend={{ value: 6, direction: 'down', positive: false }}
        variant="warning"
      />
      <AdminKPICard
        label="Detected Today"
        value={KPI_DATA.detectedToday}
        subtext="Across 6 active field workers"
        icon={Activity}
        trend={{ value: 31, direction: 'up', positive: true }}
        variant="info"
      />
      <AdminKPICard
        label="Total Complaints"
        value={KPI_DATA.totalComplaints}
        subtext="Auto-filed this month"
        icon={BarChart3}
        trend={{ value: 18, direction: 'up', positive: true }}
        variant="default"
      />

      {/* Row 2 */}
      <AdminKPICard
        label="Pending Approval"
        value={KPI_DATA.pendingApproval}
        subtext="Awaiting admin review"
        icon={Clock}
        trend={{ value: 4, direction: 'up', positive: false }}
        variant="warning"/>
      <AdminKPICard
        label="High-Risk Segments"
        value={KPI_DATA.highRiskSegments}
        subtext="Road segments with ≥3 potholes/500m"
        icon={Map}
        trend={{ value: 1, direction: 'up', positive: false }}
        variant="alert"
      />
      <AdminKPICard
        label="Avg AI Confidence"
        value={`${KPI_DATA.avgConfidence}`}
        unit="%"
        subtext="YOLOv8 detection accuracy"
        trend={{ value: 2, direction: 'up', positive: true }}
        icon={Activity}
        variant="success"
      />
      <AdminKPICard
        label="Avg Days to Repair"
        value={KPI_DATA.avgDaysToRepair}
        subtext="From detection to confirmed repair"
        icon={Clock}
        trend={{ value: 5, direction: 'down', positive: true }}
        variant="default"
      />
    </div>
  );
}