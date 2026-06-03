import { cn } from "../../lib/utils";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn("surface-card rounded-lg", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={cn("px-4 pt-4 pb-2", className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn("text-sm font-semibold text-primary", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }) {
  return (
    <p className={cn("mt-0.5 text-xs text-secondary", className)} {...props} />
  );
}

export function CardContent({ className, ...props }) {
  return <div className={cn("px-4 pb-4", className)} {...props} />;
}
