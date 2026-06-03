import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { CHART_COLORS } from "../../lib/chartColors";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-2.5 py-1.5 text-xs shadow-[var(--shadow-card)]">
      <p className="text-tertiary">{item?.name}</p>
      <p className="font-semibold text-primary">{item?.value}</p>
    </div>
  );
}

export function DonutChart({ stats }) {
  const entries = Object.entries(stats || {})
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  if (!entries.length) {
    return (
      <div className="flex h-[200px] items-center justify-center text-sm text-secondary">
        No data
      </div>
    );
  }

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<CustomTooltip />} />
          <Pie
            data={entries}
            dataKey="value"
            nameKey="name"
            innerRadius={48}
            outerRadius={72}
            paddingAngle={1}
            stroke="var(--bg-surface)"
            strokeWidth={2}
          >
            {entries.map((_, index) => (
              <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
