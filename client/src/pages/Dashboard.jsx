import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { WorkspaceOverview } from "../components/WorkspaceOverview";
import { EmptyState } from "../components/EmptyState";
import { URLCard } from "../components/urls/URLCard";
import {
  StatsCardSkeleton,
  UrlCardSkeleton,
} from "../components/ui/Skeleton";
import { useUrls } from "../hooks/useUrls";
import { useShell } from "../context/ShellContext";
import { staggerContainer } from "../lib/motion";

export function DashboardPage() {
  const { openCreateLink } = useShell();
  const { urls, loading, error, deleteUrl } = useUrls();

  const metrics = {
    totalLinks: urls.length,
    totalClicks: urls.reduce((a, u) => a + (u.clicks || 0), 0),
    activeLinks: urls.filter((u) => u.isActive !== false).length,
  };

  return (
    <div className="space-y-6">
      <WorkspaceOverview
        totalLinks={metrics.totalLinks}
        totalClicks={metrics.totalClicks}
        activeLinks={metrics.activeLinks}
        loading={loading}
      />

      {error ? (
        <EmptyState
          variant="error"
          title="Couldn't load your links"
          description={error}
        />
      ) : null}

      {loading ? (
        <>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <StatsCardSkeleton key={i} />
            ))}
          </div>
          <div className="surface-card overflow-hidden rounded-lg">
            {Array.from({ length: 4 }).map((_, i) => (
              <UrlCardSkeleton key={i} />
            ))}
          </div>
        </>
      ) : (
        <>
          {!error && urls.length === 0 ? (
            <EmptyState
              variant="links"
              title="No links yet"
              description="Create a short link to start tracking clicks, QR scans, and referral analytics."
              actionLabel="Create link"
              onAction={openCreateLink}
            />
          ) : null}

          {urls.length > 0 ? (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-primary">All links</h2>
                <Link
                  to="/analytics"
                  className="text-xs font-medium text-secondary hover:text-primary"
                >
                  View analytics →
                </Link>
              </div>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="surface-card overflow-hidden rounded-lg divide-y divide-[var(--border)]"
              >
                {urls.map((url) => (
                  <URLCard key={url._id} url={url} onDelete={deleteUrl} />
                ))}
              </motion.div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
