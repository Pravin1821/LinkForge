import { Clock, MousePointerClick } from "lucide-react";
import { Link } from "react-router-dom";

export function ActivityFeed({ visits }) {
  if (!visits || visits.length === 0) {
    return (
      <div className="flex h-72 flex-col rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)]">
        <h3 className="mb-4 text-sm font-semibold text-primary">Live Activity</h3>
        <div className="flex flex-1 items-center justify-center text-sm text-secondary">
          No recent activity.
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-72 flex-col rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-primary">Live Activity</h3>
        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-500">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          Live
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="space-y-4">
          {visits.map((visit) => {
            const shortCode = visit.url?.shortCode || "unknown";
            const timeAgo = getTimeAgo(new Date(visit.timestamp));
            const location = [visit.city, visit.country].filter(Boolean).join(", ") || "Unknown Location";

            return (
              <div key={visit._id} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--bg-muted)]">
                  <MousePointerClick className="h-3 w-3 text-secondary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-primary">
                    Someone from <span className="font-medium">{location}</span> clicked{" "}
                    <Link to={`/analytics/${visit.url?._id}`} className="font-medium text-[var(--accent)] hover:underline">
                      /{shortCode}
                    </Link>
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-[10px] text-tertiary">
                    <Clock className="h-2.5 w-2.5" />
                    {timeAgo} {visit.device ? `• ${visit.device}` : ""}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
}
