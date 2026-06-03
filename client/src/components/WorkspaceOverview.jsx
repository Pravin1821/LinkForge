import { motion } from "framer-motion";
import { Link2, MousePointerClick, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/Button";
import { useShell } from "../context/ShellContext";
import { formatNumber } from "../lib/utils";

export function WorkspaceOverview({
  totalLinks = 0,
  totalClicks = 0,
  activeLinks = 0,
  loading = false,
}) {
  const { openCreateLink } = useShell();

  return (
    <motion.header
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-4 border-b border-[var(--border)] pb-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-primary">
          Workspace
        </h1>
        <p className="mt-0.5 text-sm text-secondary">
          Manage your short links and track engagement.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-4 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2 shadow-[var(--shadow-card)]">
          <Metric
            icon={Link2}
            label="Links"
            value={loading ? "—" : formatNumber(totalLinks)}
          />
          <div className="h-8 w-px bg-[var(--border)]" />
          <Metric
            icon={MousePointerClick}
            label="Clicks"
            value={loading ? "—" : formatNumber(totalClicks)}
          />
          <div className="h-8 w-px bg-[var(--border)]" />
          <Metric label="Active" value={loading ? "—" : formatNumber(activeLinks)} />
        </div>
        <Button variant="primary" onClick={openCreateLink}>
          <Plus className="h-4 w-4" />
          New link
        </Button>
        <Link to="/analytics" className="hidden sm:block">
          <Button variant="subtle">Analytics</Button>
        </Link>
      </div>
    </motion.header>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="min-w-[4.5rem]">
      <div className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-tertiary">
        {Icon ? <Icon className="h-3 w-3" /> : null}
        {label}
      </div>
      <div className="mt-0.5 text-base font-semibold tabular-nums text-primary">
        {value}
      </div>
    </div>
  );
}
