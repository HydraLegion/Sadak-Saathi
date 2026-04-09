'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,  } from 'recharts';

// Backend integration: GET /api/analytics/user-trend?days=14
const TREND_DATA = [
  { date: 'Feb 28', dangerous: 1, moderate: 2, minor: 1 },
  { date: 'Mar 1',  dangerous: 0, moderate: 1, minor: 2 },
  { date: 'Mar 2',  dangerous: 2, moderate: 3, minor: 1 },
  { date: 'Mar 3',  dangerous: 1, moderate: 2, minor: 3 },
  { date: 'Mar 4',  dangerous: 3, moderate: 1, minor: 2 },
  { date: 'Mar 5',  dangerous: 0, moderate: 4, minor: 1 },
  { date: 'Mar 6',  dangerous: 2, moderate: 2, minor: 4 },
  { date: 'Mar 7',  dangerous: 1, moderate: 3, minor: 2 },
  { date: 'Mar 8',  dangerous: 4, moderate: 2, minor: 1 },
  { date: 'Mar 9',  dangerous: 2, moderate: 1, minor: 3 },
  { date: 'Mar 10', dangerous: 1, moderate: 3, minor: 2 },
  { date: 'Mar 11', dangerous: 3, moderate: 4, minor: 2 },
  { date: 'Mar 12', dangerous: 2, moderate: 2, minor: 3 },
  { date: 'Mar 13', dangerous: 3, moderate: 3, minor: 3 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + p.value, 0);
  return (
    <div className="card-elevated p-3 shadow-elevated min-w-[160px]">
      <p className="text-xs font-600 text-text mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-xs text-text-secondary capitalize">{p.name}</span>
          </div>
          <span className="font-mono text-xs font-600 text-text">{p.value}</span>
        </div>
      ))}
      <div className="border-t border-border/40 mt-2 pt-2 flex justify-between">
        <span className="text-xs text-muted-foreground">Total</span>
        <span className="font-mono text-xs font-700 text-primary">{total}</span>
      </div>
    </div>
  );
}

export default function DetectionTrendChart() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-600 text-text">Detection Trend</h2>
          <p className="text-xs text-muted-foreground">Potholes detected per day · last 14 days</p>
        </div>
        <div className="flex items-center gap-3">
          {[
            { key: 'dangerous', color: '#ef4444', label: 'Dangerous' },
            { key: 'moderate', color: '#f59e0b', label: 'Moderate' },
            { key: 'minor', color: '#22c55e', label: 'Minor' },
          ].map((item) => (
            <div key={item.key} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
              <span className="text-[11px] text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={TREND_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="dangerousGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="moderateGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="minorGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 14% 20%)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: 'hsl(220 12% 55%)', fontSize: 10, fontFamily: 'DM Sans' }}
            axisLine={false}
            tickLine={false}
            interval={2}
          />
          <YAxis
            tick={{ fill: 'hsl(220 12% 55%)', fontSize: 10, fontFamily: 'DM Sans' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="minor"
            stroke="#22c55e"
            strokeWidth={1.5}
            fill="url(#minorGrad)"
            dot={false}
            activeDot={{ r: 4, fill: '#22c55e', strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="moderate"
            stroke="#f59e0b"
            strokeWidth={1.5}
            fill="url(#moderateGrad)"
            dot={false}
            activeDot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="dangerous"
            stroke="#ef4444"
            strokeWidth={2}
            fill="url(#dangerousGrad)"
            dot={false}
            activeDot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}