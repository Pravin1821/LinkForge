import { motion } from "framer-motion";
import { staggerItem } from "../lib/motion";

export function StatsCard({ title, value, icon: Icon, hint }) {
  return (
    <motion.div
      variants={staggerItem}
      className="rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 shadow-[var(--shadow-card)]"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-tertiary">
            {title}
          </p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-primary">
            {typeof value === "number"
              ? new Intl.NumberFormat().format(value)
              : value}
          </p>
          {hint ? <p className="mt-0.5 text-xs text-secondary">{hint}</p> : null}
        </div>
        {Icon ? (
          <Icon className="h-4 w-4 text-tertiary" strokeWidth={1.5} />
        ) : null}
      </div>
    </motion.div>
  );
}
