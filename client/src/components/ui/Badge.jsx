import { cn } from "../../lib/utils";

const tones = {
  good: "bg-[#E8F3EC] text-[#448361] border-[#C7E2D0]",
  neutral: "bg-[var(--bg-muted)] text-[var(--text-secondary)] border-[var(--border)]",
  warn: "bg-[#FAF3E8] text-[#D9730D] border-[#F0E0C8]",
};

export function Badge({ className, tone = "neutral", children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
