import { formatDateTime, truncateMiddle } from "../../lib/utils";

export function ActivityTimeline({ visits }) {
  if (!visits?.length) {
    return (
      <p className="py-8 text-center text-sm text-secondary">
        No visits recorded yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] text-[10px] font-medium uppercase tracking-wide text-tertiary">
            <th className="pb-2 pr-4 font-medium">Time</th>
            <th className="pb-2 pr-4 font-medium">Browser</th>
            <th className="pb-2 pr-4 font-medium">OS</th>
            <th className="pb-2 pr-4 font-medium">Device</th>
            <th className="pb-2 font-medium">IP</th>
          </tr>
        </thead>
        <tbody>
          {visits.map((v, idx) => (
            <tr
              key={`${v.timestamp}-${idx}`}
              className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-hover)]"
            >
              <td className="py-2.5 pr-4 text-xs text-secondary whitespace-nowrap">
                {formatDateTime(v.timestamp)}
              </td>
              <td className="py-2.5 pr-4 text-primary">{v.browser || "—"}</td>
              <td className="py-2.5 pr-4 text-secondary">{v.os || "—"}</td>
              <td className="py-2.5 pr-4 text-secondary">{v.device || "—"}</td>
              <td className="py-2.5 font-mono text-xs text-tertiary">
                {truncateMiddle(v.ip || "—", 16, 6)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
