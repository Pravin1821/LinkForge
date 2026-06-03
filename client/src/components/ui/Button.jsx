import { cn } from "../../lib/utils";

const variants = {
  primary:
    "bg-[var(--accent)] text-[var(--bg-surface)] hover:bg-[var(--accent-hover)] border border-transparent",
  subtle:
    "bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] border border-[var(--border)]",
  ghost:
    "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] border border-transparent",
};

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-3.5 text-sm",
  lg: "h-10 px-4 text-sm",
};

export function Button({
  className,
  variant = "subtle",
  size = "md",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
