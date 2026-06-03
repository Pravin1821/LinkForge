import { useState, useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

export function TrendChartWidget({ data }) {
  const [timeRange, setTimeRange] = useState(30);

  const filteredData = useMemo(() => {
    if (!data) return [];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeRange);
    
    return data.filter(item => new Date(item.date) >= cutoffDate);
  }, [data, timeRange]);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] text-sm text-secondary">
        No click data available yet.
      </div>
    );
  }

  // Format data for Recharts
  const chartData = filteredData.map(item => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    clicks: item.clicks
  }));

  return (
    <div className="flex h-72 flex-col rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-primary">Click Trends</h3>
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(Number(e.target.value))}
          className="rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-2 py-1 text-xs text-secondary outline-none cursor-pointer focus:ring-1 focus:ring-[var(--accent)]"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>
      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: "var(--text-tertiary)" }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: "var(--text-tertiary)" }} 
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border)",
                borderRadius: "8px",
                boxShadow: "var(--shadow-card)",
                fontSize: "12px",
              }}
              itemStyle={{ color: "var(--text-primary)", fontWeight: "500" }}
              labelStyle={{ color: "var(--text-secondary)", marginBottom: "4px" }}
            />
            <Area
              type="monotone"
              dataKey="clicks"
              stroke="var(--accent)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorClicks)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
