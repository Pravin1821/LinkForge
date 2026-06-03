import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { CHART_COLORS, CHART_TICK } from "../../lib/chartColors";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0]?.payload;
  return (
    <div className="rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-2.5 py-1.5 text-xs shadow-[var(--shadow-card)]">
      <p className="text-tertiary">{item?.name}</p>
      <p className="font-semibold text-primary">{item?.value}</p>
    </div>
  );
}

export function CountryChart({ stats }) {
  const data = Object.entries(stats || {})
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  if (!data.length) {
    return (
      <div className="flex h-[220px] items-center justify-center text-sm text-secondary">
        No country data
      </div>
    );
  }

  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 8, bottom: 0, left: 0 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={96}
            tick={{ fill: CHART_TICK, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--bg-muted)" }} />
          <Bar dataKey="value" radius={[0, 2, 2, 0]} barSize={14}>
            {data.map((_, index) => (
              <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
