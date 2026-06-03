import { cn } from "../../lib/utils";

export function IconButton({ className, label, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]",
        className,
      )}
      {...props}
    />
  );
}
