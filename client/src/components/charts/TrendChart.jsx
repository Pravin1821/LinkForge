import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { CHART_GRID, CHART_STROKE, CHART_TICK } from "../../lib/chartColors";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-2.5 py-1.5 text-xs shadow-[var(--shadow-card)]">
      <p className="text-tertiary">{label}</p>
      <p className="font-semibold tabular-nums text-primary">{payload[0].value}</p>
    </div>
  );
}

function formatChartDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function TrendChart({ data }) {
  const safeData = (Array.isArray(data) ? data : []).map((d) => ({
    ...d,
    date: d.date?.includes?.("-") ? formatChartDate(d.date) : d.date,
  }));

  if (!safeData.length) {
    return (
      <div className="flex h-[240px] items-center justify-center rounded-md border border-dashed border-[var(--border)] text-sm text-secondary">
        No click data in this period
      </div>
    );
  }

  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={safeData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke={CHART_GRID} vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: CHART_TICK, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: CHART_TICK, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={32}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="clicks"
            stroke={CHART_STROKE}
            strokeWidth={1.5}
            fill={CHART_STROKE}
            fillOpacity={0.08}
            dot={false}
            activeDot={{ r: 3, fill: CHART_STROKE, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
