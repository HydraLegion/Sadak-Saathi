'use client';

import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from 'recharts';

// Backend integration: GET /api/admin/severity-distribution
const SEVERITY_DATA = [
  { name: 'Dangerous', value: 34, fill: '#ef4444', total: 147 },
  { name: 'Moderate', value: 71, fill: '#f59e0b', total: 147 },
  { name: 'Minor', value: 42, fill: '#22c55e', total: 147 },
];

const TOTAL = 147;

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: { name: string; value: number; fill: string } }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="card-elevated p-3 shadow-elevated">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.fill }} />
        <span className="text-xs font-600 text-text">{d.name}</span>
      </div>
      <p className="font-mono text-sm font-700 text-text">{d.value}</p>
      <p className="text-[11px] text-muted-foreground">{Math.round((d.value / TOTAL) * 100)}% of total</p>
    </div>
  );
}

export default function SeverityDistributionChart() {
  return (
    <div className="card p-5">
      <div className="mb-4">
        <h2 className="text-base font-600 text-text">Severity Distribution</h2>
        <p className="text-xs text-muted-foreground">All potholes · current month</p>
      </div>

      <div className="flex items-center gap-6">
        {/* Radial chart */}
        <div className="relative flex-shrink-0" style={{ width: 160, height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius={35}
              outerRadius={75}
              data={SEVERITY_DATA}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar
                dataKey="value"
                cornerRadius={4}
                background={{ fill: 'hsl(222 16% 14%)' }}
              >
                {SEVERITY_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </RadialBar>
              <Tooltip content={<CustomTooltip />} />
            </RadialBarChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="font-mono text-2xl font-700 text-text">{TOTAL}</span>
            <span className="text-[10px] text-muted-foreground">total</span>
          </div>
        </div>

        {/* Legend with stats */}
        <div className="flex-1 space-y-3">
          {SEVERITY_DATA.map((item) => {
            const pct = Math.round((item.value / TOTAL) * 100);
            return (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.fill }} />
                    <span className="text-xs font-500 text-text">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-700 text-text">{item.value}</span>
                    <span className="text-[11px] text-muted-foreground w-8 text-right">{pct}%</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: item.fill }}
                  />
                </div>
              </div>
            );
          })}

          <div className="pt-2 border-t border-border/40">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Dangerous rate</span>
              <span className="font-mono text-xs font-600 text-destructive">
                {Math.round((34 / TOTAL) * 100)}% — above threshold
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}