import { Sparkles } from "lucide-react";

export function InsightsWidget({ analytics }) {
  const { totalLinks, totalClicks, activeLinks } = analytics || {};
  
  let insights = [];

  if (!analytics || totalClicks === 0) {
    insights = [
      "Share your links on social media to start generating traffic.",
      "Check your QR codes for physical marketing campaigns."
    ];
  } else {
    insights.push(`Your links generated ${totalClicks} total clicks so far.`);
    if (activeLinks && totalLinks) {
      insights.push(`${Math.round((activeLinks / totalLinks) * 100)}% of your links are currently active.`);
    }
    const countryCount = analytics.countryStats?.length || 0;
    if (countryCount > 0) {
      insights.push(`Your traffic comes from ${countryCount} different countries.`);
    }
  }

  return (
    <div className="flex flex-col rounded-xl border border-[var(--border)] bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-muted)] p-5 shadow-[var(--shadow-card)]">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-[var(--accent)]" />
        <h3 className="text-sm font-semibold text-primary">AI Insights</h3>
      </div>
      <ul className="space-y-3">
        {insights.map((insight, idx) => (
          <li key={idx} className="flex items-start gap-2 text-xs text-secondary">
            <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
            <span>{insight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
