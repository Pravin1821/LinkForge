import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { formatDateTime, truncateMiddle } from "../lib/utils";
import { staggerContainer, staggerItem } from "../lib/motion";

export function Timeline({ visits }) {
  if (!visits?.length) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 py-10 text-center text-sm text-zinc-500">
        No visits recorded yet. Share your link to see activity here.
      </div>
    );
  }

  return (
    <motion.ol
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-1"
    >
      {visits.map((v, idx) => (
        <motion.li
          key={`${v.timestamp}-${idx}`}
          variants={staggerItem}
          className="relative flex gap-4 rounded-xl px-3 py-3 transition hover:bg-white/[0.03]"
        >
          <div className="relative flex flex-col items-center pt-1">
            <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-purple-400 to-cyan-300 ring-4 ring-purple-500/10" />
            {idx < visits.length - 1 ? (
              <span className="absolute top-4 h-full w-px bg-gradient-to-b from-white/10 to-transparent" />
            ) : null}
          </div>
          <div className="min-w-0 flex-1 pb-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-500">
                {formatDateTime(v.timestamp)}
              </span>
              {v.country ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-zinc-400">
                  <Globe className="h-3 w-3" />
                  {v.country}
                </span>
              ) : null}
            </div>
            <div className="mt-1 text-sm font-medium text-zinc-100">
              {v.browser || "Unknown"} · {v.os || "Unknown"} ·{" "}
              {v.device || "Desktop"}
            </div>
            <div className="mt-0.5 text-xs text-zinc-500">
              IP {truncateMiddle(v.ip || "—", 18, 8)}
            </div>
          </div>
        </motion.li>
      ))}
    </motion.ol>
  );
}
