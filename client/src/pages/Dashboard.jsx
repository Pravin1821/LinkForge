import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useUrls } from "../hooks/useUrls";
import { useWorkspaceAnalytics } from "../hooks/useWorkspaceAnalytics";
import { useShell } from "../context/ShellContext";
import { staggerContainer } from "../lib/motion";
import { EmptyState } from "../components/EmptyState";

// New Dashboard Components
import { MetricCards } from "../components/dashboard/MetricCards";
import { TrendChartWidget } from "../components/dashboard/TrendChartWidget";
import { GeoInsightsWidget } from "../components/dashboard/GeoInsightsWidget";
import { ActivityFeed } from "../components/dashboard/ActivityFeed";
import { LinksTable } from "../components/dashboard/LinksTable";
import { InsightsWidget } from "../components/dashboard/InsightsWidget";
import { QuickActionsWidget } from "../components/dashboard/QuickActionsWidget";
import { EditLinkModal } from "../components/EditLinkModal";
import { Button } from "../components/ui/Button";
import { Plus } from "lucide-react";

export function DashboardPage() {
  const { openCreateLink } = useShell();
  const { urls, loading: urlsLoading, error: urlsError, deleteUrl } = useUrls();
  const { analytics, loading: analyticsLoading, error: analyticsError } = useWorkspaceAnalytics();
  const [editingUrl, setEditingUrl] = useState(null);

  const loading = urlsLoading || analyticsLoading;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-primary">
            Overview
          </h1>
          <p className="mt-1 text-sm text-secondary">
            Your workspace performance at a glance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" onClick={openCreateLink} className="shadow-md">
            <Plus className="h-4 w-4 mr-1.5" />
            Create Link
          </Button>
        </div>
      </motion.header>

      {/* Top Metrics */}
      <section>
        <MetricCards analytics={analytics} loading={loading} urls={urls} />
      </section>

      {/* Analytics Overview Grid */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {/* Main Chart */}
        <div className="lg:col-span-2 xl:col-span-3">
          <TrendChartWidget data={analytics?.chartData} />
        </div>
        
        {/* Actions & Insights */}
        <div className="flex flex-col gap-6 lg:col-span-1 xl:col-span-1">
          <QuickActionsWidget />
        </div>
      </section>

      {/* Geo & Activity & Links Grid */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <InsightsWidget analytics={analytics} />
          <GeoInsightsWidget 
            countries={analytics?.countryStats} 
            cities={analytics?.cityStats} 
            totalClicks={analytics?.totalClicks} 
          />
        </div>
        
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ActivityFeed visits={analytics?.recentVisits} />
          
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary tracking-tight">Recent Links</h2>
              <Link
                to="/analytics"
                className="text-sm font-medium text-[var(--accent)] hover:underline"
              >
                View all analytics →
              </Link>
            </div>
            <LinksTable 
              urls={urls.slice(0, 5)} 
              onDelete={deleteUrl} 
              onEdit={(url) => setEditingUrl(url)} 
            />
          </div>
        </div>
      </section>

      <EditLinkModal 
        isOpen={!!editingUrl} 
        onClose={() => setEditingUrl(null)} 
        url={editingUrl} 
      />
    </div>
  );
}
