import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Globe,
  Monitor,
  TrendingUp,
} from "lucide-react";
import { useUrls } from "../hooks/useUrls";
import { useAnalytics } from "../hooks/useAnalytics";
import { EmptyState } from "../components/EmptyState";
import { StatsCard } from "../components/StatsCard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";
import {
  TrendChart,
  DonutChart,
  PieChartView,
  CountryChart,
  StatLegend,
} from "../components/charts/AnalyticsCharts";
import { ActivityTimeline } from "../components/analytics/ActivityTimeline";
import { ChartSkeleton, StatsCardSkeleton } from "../components/ui/Skeleton";
import { formatDateTime, formatNumber, truncateMiddle } from "../lib/utils";

export function AnalyticsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { urls, loading: urlsLoading } = useUrls();

  if (!id) {
    return (
      <AnalyticsHub
        urls={urls}
        loading={urlsLoading}
        onSelect={(urlId) => navigate(`/analytics/${urlId}`)}
      />
    );
  }

  return <AnalyticsDetail id={id} urls={urls} />;
}

function AnalyticsDetail({ id, urls }) {
  const selectedUrl = urls.find((u) => u._id === id);
  const { analytics, loading, error, trendData, kpis, hasClicks } =
    useAnalytics(id);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-14 animate-pulse rounded-lg bg-[var(--bg-muted)]" />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>
        <ChartSkeleton />
        <div className="grid gap-3 lg:grid-cols-2">
          <ChartSkeleton height="h-[220px]" />
          <ChartSkeleton height="h-[220px]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        variant="error"
        title="Couldn't load analytics"
        description={error}
        actionLabel="Back"
        onAction={() => navigate("/analytics")}
      />
    );
  }

  if (!hasClicks) {
    return (
      <div className="space-y-4">
        <AnalyticsHeader selectedUrl={selectedUrl} id={id} />
        <EmptyState
          variant="no-clicks"
          title="No clicks yet"
          description="Share this link to start collecting traffic data."
          actionLabel="Back to dashboard"
          onAction={() => navigate("/")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <AnalyticsHeader
        selectedUrl={selectedUrl}
        id={id}
        totalClicks={kpis.totalClicks}
      />

      <section className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total clicks" value={kpis.totalClicks} icon={TrendingUp} />
        <StatsCard title="Browsers" value={kpis.uniqueBrowsers} icon={Globe} />
        <StatsCard title="Devices" value={kpis.deviceTypes} icon={Monitor} />
        <StatsCard
          title="Last visit"
          value={kpis.lastVisited ? formatDateTime(kpis.lastVisited) : "—"}
          icon={Clock}
        />
      </section>

      <Card>
        <CardHeader className="border-b border-[var(--border)]">
          <CardTitle>Clicks over time</CardTitle>
          <CardDescription>Daily volume from recent visits</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <TrendChart data={trendData} />
        </CardContent>
      </Card>

      <div className="grid gap-3 lg:grid-cols-2">
        <ChartPanel title="Browsers" description="Session breakdown">
          <div className="grid gap-4 sm:grid-cols-2">
            <DonutChart stats={analytics?.browserStats} />
            <StatLegend stats={analytics?.browserStats} />
          </div>
        </ChartPanel>
        <ChartPanel title="Devices" description="Form factor">
          <div className="grid gap-4 sm:grid-cols-2">
            <PieChartView stats={analytics?.deviceStats} />
            <StatLegend stats={analytics?.deviceStats} />
          </div>
        </ChartPanel>
      </div>

      <ChartPanel title="Countries" description="Top locations">
        <CountryChart stats={analytics?.countryStats} />
        <StatLegend
          stats={analytics?.countryStats}
          className="mt-4 border-t border-[var(--border)] pt-3"
          limit={8}
        />
      </ChartPanel>

      <Card>
        <CardHeader className="border-b border-[var(--border)]">
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>Last 50 visits</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <ActivityTimeline visits={analytics?.recentVisits} />
        </CardContent>
      </Card>
    </div>
  );
}

function AnalyticsHeader({ selectedUrl, id, totalClicks }) {
  return (
    <header className="flex flex-col gap-3 border-b border-[var(--border)] pb-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-2">
        <Link
          to="/analytics"
          className="mt-0.5 rounded-md p-1 text-secondary hover:bg-[var(--bg-hover)]"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-tertiary">
            Link report
          </p>
          <h1 className="text-lg font-semibold text-primary">
            {truncateMiddle(
              selectedUrl?.shortUrl || selectedUrl?.shortCode || id,
              48,
              12,
            )}
          </h1>
          <p className="mt-0.5 text-xs text-secondary">
            {truncateMiddle(selectedUrl?.originalUrl || "", 72, 16)}
          </p>
        </div>
      </div>
      {totalClicks !== undefined ? (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2 shadow-[var(--shadow-card)]">
          <p className="text-[10px] uppercase tracking-wide text-tertiary">
            Total clicks
          </p>
          <p className="text-xl font-semibold tabular-nums text-primary">
            {formatNumber(totalClicks)}
          </p>
        </div>
      ) : null}
    </header>
  );
}

function ChartPanel({ title, description, children }) {
  return (
    <Card>
      <CardHeader className="border-b border-[var(--border)] py-3">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">{children}</CardContent>
    </Card>
  );
}

function AnalyticsHub({ urls, loading, onSelect }) {
  return (
    <div className="space-y-5">
      <header className="border-b border-[var(--border)] pb-4">
        <h1 className="text-xl font-semibold text-primary">Analytics</h1>
        <p className="mt-0.5 text-sm text-secondary">
          Select a link to view traffic, sources, and activity.
        </p>
      </header>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-[var(--bg-muted)]" />
          ))}
        </div>
      ) : urls.length === 0 ? (
        <EmptyState
          variant="analytics"
          title="No links to analyze"
          description="Create a link on the dashboard first."
          actionLabel="Go to dashboard"
          onAction={() => {
            window.location.href = "/";
          }}
        />
      ) : (
        <div className="surface-card overflow-hidden rounded-lg divide-y divide-[var(--border)]">
          {urls.map((u) => (
            <button
              key={u._id}
              type="button"
              onClick={() => onSelect(u._id)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--bg-hover)]"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-primary">
                  {truncateMiddle(u.shortUrl || u.shortCode, 40, 10)}
                </p>
                <p className="text-xs text-secondary">
                  {formatNumber(u.clicks || 0)} clicks
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-tertiary" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default AnalyticsPage;
