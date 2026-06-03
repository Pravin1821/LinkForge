import { motion } from "framer-motion";
import { Link2, BarChart3, AlertCircle, MousePointerClick } from "lucide-react";
import { Button } from "./ui/Button";

const icons = {
  links: Link2,
  analytics: BarChart3,
  error: AlertCircle,
  "no-clicks": MousePointerClick,
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  variant = "links",
}) {
  const Icon = icons[variant] || Link2;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-surface)] px-6 py-12 text-center"
    >
      <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-[var(--bg-muted)]">
        <Icon className="h-5 w-5 text-secondary" strokeWidth={1.5} />
      </div>
      <h2 className="text-sm font-semibold text-primary">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-secondary">{description}</p>
      {actionLabel ? (
        <div className="mt-4">
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </motion.div>
  );
}
