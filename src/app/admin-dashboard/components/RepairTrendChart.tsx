'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

// Backend integration: GET /api/admin/repair-trend?weeks=8
const REPAIR_DATA = [
  { week: 'Jan W3', detected: 18, repaired: 9,  rate: 50 },
  { week: 'Jan W4', detected: 24, repaired: 14, rate: 58 },
  { week: 'Feb W1', detected: 21, repaired: 13, rate: 62 },
  { week: 'Feb W2', detected: 31, repaired: 17, rate: 55 },
  { week: 'Feb W3', detected: 27, repaired: 19, rate: 70 },
  { week: 'Feb W4', detected: 19, repaired: 14, rate: 74 },
  { week: 'Mar W1', detected: 29, repaired: 16, rate: 55 },
  { week: 'Mar W2', detected: 23, repaired: 14, rate: 61 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const detected = payload.find((p) => p.name === 'detected')?.value ?? 0;
  const repaired = payload.find((p) => p.name === 'repaired')?.value ?? 0;
  const rate = detected > 0 ? Math.round((repaired / detected) * 100) : 0;

  return (
    <div className="card-elevated p-3 shadow-elevated min-w-[160px]">
      <p className="text-xs font-600 text-text mb-2">{label}</p>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-info" />
            <span className="text-xs text-text-secondary">Detected</span>
          </div>
          <span className="font-mono text-xs font-600 text-text">{detected}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-success" />
            <span className="text-xs text-text-secondary">Repaired</span>
          </div>
          <span className="font-mono text-xs font-600 text-text">{repaired}</span>
        </div>
        <div className="border-t border-border/40 pt-1.5 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Repair rate</span>
          <span className={`font-mono text-xs font-700 ${rate >= 70 ? 'text-success' : rate >= 55 ? 'text-warning' : 'text-destructive'}`}>
            {rate}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default function RepairTrendChart() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-600 text-text">Repair Progress</h2>
          <p className="text-xs text-muted-foreground">Weekly detected vs repaired · last 8 weeks</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded-sm bg-info" />
            <span className="text-[11px] text-muted-foreground">Detected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded-sm bg-success" />
            <span className="text-[11px] text-muted-foreground">Repaired</span>
          </div>
          <div className="text-[11px] text-muted-foreground border-l border-border/40 pl-3">
            Target: <span className="text-warning font-600">75%</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={REPAIR_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barGap={3}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 14% 20%)" vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fill: 'hsl(220 12% 55%)', fontSize: 10, fontFamily: 'DM Sans' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'hsl(220 12% 55%)', fontSize: 10, fontFamily: 'DM Sans' }}
            axisLine={false}
            tickLine={false}
          />
          <ReferenceLine
            y={0}
            stroke="hsl(222 14% 20%)"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(222 14% 20% / 0.5)' }} />
          <Bar dataKey="detected" fill="#3b82f6" radius={[3, 3, 0, 0]} maxBarSize={20} />
          <Bar dataKey="repaired" fill="#22c55e" radius={[3, 3, 0, 0]} maxBarSize={20} />
        </BarChart>
      </ResponsiveContainer>

      {/* Target annotation */}
      <div className="mt-3 flex items-center justify-between px-1">
        <p className="text-xs text-muted-foreground">
          Current repair rate is <span className="text-warning font-600">62%</span> — 13pp below target
        </p>
        <span className="text-xs text-muted-foreground">
          Best: <span className="font-mono font-600 text-success">74%</span> (Feb W4)
        </span>
      </div>
    </div>
  );
}