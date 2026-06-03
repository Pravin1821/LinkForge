import { motion } from "framer-motion";

/** Miniature product UI for auth marketing panel — same palette as app */
export function AuthProductPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="relative mt-10"
    >
      <div className="absolute -inset-4 rounded-2xl bg-[var(--bg-page)] opacity-60 blur-2xl" />
      <div className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-[0_8px_30px_rgb(0_0_0_0.08)]">
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 border-b border-[var(--border)] bg-[var(--bg-muted)] px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-[#E8E8E4]" />
          <span className="h-2 w-2 rounded-full bg-[#E8E8E4]" />
          <span className="h-2 w-2 rounded-full bg-[#E8E8E4]" />
          <span className="ml-2 text-[10px] text-tertiary">forge.links / workspace</span>
        </div>

        <div className="flex">
          {/* Mini sidebar */}
          <div className="w-14 shrink-0 border-r border-[var(--border)] bg-[var(--bg-surface)] p-2">
            <div className="mb-3 h-6 w-6 rounded bg-[var(--bg-muted)]" />
            <div className="space-y-1.5">
              <div className="h-2 w-full rounded-sm bg-[var(--accent)] opacity-90" />
              <div className="h-2 w-full rounded-sm bg-[var(--bg-muted)]" />
              <div className="h-2 w-3/4 rounded-sm bg-[var(--bg-muted)]" />
            </div>
          </div>

          {/* Mini content */}
          <div className="min-w-0 flex-1 p-3">
            <div className="flex gap-2">
              <PreviewStat label="Links" value="24" />
              <PreviewStat label="Clicks" value="1.2k" />
              <PreviewStat label="Active" value="18" />
            </div>
            <div className="mt-3 space-y-1.5 rounded-lg border border-[var(--border)]">
              <PreviewRow short="forge.ly/launch" clicks="842" active />
              <PreviewRow short="forge.ly/docs" clicks="312" />
              <PreviewRow short="forge.ly/beta" clicks="89" />
            </div>
            <div className="mt-3 flex h-12 items-end gap-0.5 border-b border-[var(--border)] pb-1">
              {[40, 55, 35, 70, 50, 85, 65].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-[var(--accent)] opacity-20"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PreviewStat({ label, value }) {
  return (
    <div className="flex-1 rounded-md border border-[var(--border)] px-2 py-1.5">
      <p className="text-[8px] uppercase tracking-wide text-tertiary">{label}</p>
      <p className="text-xs font-semibold tabular-nums text-primary">{value}</p>
    </div>
  );
}

function PreviewRow({ short, clicks, active }) {
  return (
    <div className="flex items-center gap-2 border-b border-[var(--border)] px-2 py-1.5 last:border-0">
      <div className="h-6 w-6 shrink-0 rounded border border-[var(--border)] bg-white" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] font-medium text-primary">{short}</p>
        <p className="text-[8px] text-tertiary">{clicks} clicks</p>
      </div>
      {active ? (
        <span className="rounded px-1 py-0.5 text-[7px] font-medium uppercase bg-[#E8F3EC] text-[#448361]">
          Live
        </span>
      ) : null}
    </div>
  );
}
