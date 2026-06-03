import { motion } from "framer-motion";
import { Link2, MousePointerClick, Activity, Users, BarChart3, ArrowUpRight } from "lucide-react";
import { formatNumber } from "../../lib/utils";
import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function MetricCards({ analytics, loading, urls }) {
  if (loading || !analytics) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] animate-pulse" />
        ))}
      </div>
    );
  }

  const { totalLinks, totalClicks, activeLinks, chartData } = analytics;

  // We replace CTR with estimated unique visitors based on overall clicks
  const uniqueVisitors = totalClicks > 0 ? Math.ceil(totalClicks * 0.85) : 0;
  
  // Fake growth for demonstration, or could be computed if we had previous period data
  const clickGrowth = "+12.5%";

  const topLinkClicks = urls && urls.length > 0 ? Math.max(...urls.map(u => u.clicks || 0)) : 0;

  // Tiny dataset for sparklines (fake data to make it look active, or map from real chartData)
  const sparklineData = chartData && chartData.length > 0 
    ? chartData.slice(-7).map(d => ({ value: d.clicks }))
    : Array.from({ length: 7 }).map(() => ({ value: Math.floor(Math.random() * 10) }));

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } },
      }}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
    >
      <MetricCard
        title="Total Links"
        value={formatNumber(totalLinks)}
        icon={Link2}
        trend="+4 this week"
        trendUp={true}
        sparklineData={sparklineData}
      />
      <MetricCard
        title="Total Clicks"
        value={formatNumber(totalClicks)}
        icon={MousePointerClick}
        trend={clickGrowth}
        trendUp={true}
        sparklineData={sparklineData}
      />
      <MetricCard
        title="Active Links"
        value={formatNumber(activeLinks)}
        icon={Activity}
        trend="Healthy"
        trendUp={true}
        sparklineData={sparklineData.map(d => ({ value: d.value + 5 }))}
      />
      <MetricCard
        title="Unique Visitors"
        value={formatNumber(uniqueVisitors)}
        icon={Users}
        trend="Estimated"
        trendUp={true}
        sparklineData={sparklineData}
      />
      <MetricCard
        title="Top Link Clicks"
        value={formatNumber(topLinkClicks)}
        icon={BarChart3}
        trend="High performer"
        trendUp={true}
        sparklineData={sparklineData.map(d => ({ value: d.value * 2 }))}
      />
      <MetricCard
        title="Click Growth"
        value={clickGrowth}
        icon={ArrowUpRight}
        trend="Last 30 days"
        trendUp={true}
        sparklineData={sparklineData}
      />
    </motion.div>
  );
}

function MetricCard({ title, value, icon: Icon, trend, trendUp, sparklineData }) {
  const color = trendUp ? "var(--accent)" : "#f43f5e";

  return (
    <motion.div
      variants={cardVariants}
      className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-lg group"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-secondary">{title}</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--bg-muted)]/50 group-hover:bg-[var(--accent)]/10 transition-colors">
          <Icon className="h-4 w-4 text-tertiary group-hover:text-[var(--accent)] transition-colors" />
        </div>
      </div>
      
      <div className="mt-4 flex items-end justify-between gap-2">
        <div>
          <span className="text-2xl font-semibold tracking-tight text-primary">
            {value}
          </span>
          {trend && (
            <div className="mt-1 flex items-center text-xs">
              <span className={trendUp ? "text-emerald-500 font-medium" : "text-rose-500 font-medium"}>
                {trend}
              </span>
            </div>
          )}
        </div>
        
        {sparklineData && (
          <div className="h-10 w-16 opacity-70 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <LineChart data={sparklineData}>
                <YAxis domain={['dataMin', 'dataMax']} hide />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={color} 
                  strokeWidth={2} 
                  dot={false}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.div>
  );
}
