import { cn } from "../../lib/utils";

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-[var(--bg-muted)]", className)}
      {...props}
    />
  );
}

export function StatsCardSkeleton() {
  return <Skeleton className="h-[72px] w-full" />;
}

export function UrlCardSkeleton() {
  return (
    <div className="flex gap-3 border-b border-[var(--border)] px-4 py-3">
      <Skeleton className="h-12 w-12 shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function ChartSkeleton({ height = "h-[240px]" }) {
  return (
    <div className={cn("surface-card rounded-lg p-4", height)}>
      <Skeleton className="mb-3 h-4 w-28" />
      <Skeleton className="h-[calc(100%-2rem)] w-full" />
    </div>
  );
}
