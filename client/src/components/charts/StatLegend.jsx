import { cn } from "../../lib/utils";
import { CHART_COLORS } from "../../lib/chartColors";

export function StatLegend({ stats, className, limit = 6 }) {
  const entries = Object.entries(stats || {})
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);

  return (
    <div className={cn("space-y-1.5", className)}>
      {entries.map((e, i) => (
        <div key={e.name} className="flex items-center justify-between gap-2 text-xs">
          <span className="flex min-w-0 items-center gap-2 text-secondary">
            <span
              className="h-2 w-2 shrink-0 rounded-sm"
              style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
            />
            <span className="truncate">{e.name}</span>
          </span>
          <span className="shrink-0 font-medium tabular-nums text-primary">
            {e.value}
          </span>
        </div>
      ))}
    </div>
  );
}
