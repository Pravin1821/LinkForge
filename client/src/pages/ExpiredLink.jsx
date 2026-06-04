import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Link2, AlertTriangle, ArrowRight, Home, Calendar } from "lucide-react";

export default function ExpiredLink() {
  const [searchParams] = useSearchParams();
  const alias = searchParams.get("alias");
  const expiresAtStr = searchParams.get("expiresAt");
  
  const expiryDate = expiresAtStr ? new Date(expiresAtStr) : null;
  const formattedDate = expiryDate ? expiryDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }) : "Recently";
  
  const formattedTime = expiryDate ? expiryDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  }) : "";

  return (
    <div className="min-h-screen bg-[var(--bg-page)] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-8 shadow-[var(--shadow-card)] text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-rose-500" />
        
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10">
          <Clock className="h-8 w-8 text-rose-500" />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-500 mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
          Expired Status
        </div>

        <h1 className="mb-2 text-2xl font-bold tracking-tight text-primary">🔗 Link Expired</h1>
        <p className="mb-6 text-sm text-secondary">
          This short link has reached its expiration date and is no longer available to the public.
        </p>

        <div className="mb-8 space-y-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-muted)]/50 p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs border-b border-[var(--border)] pb-2">
                <span className="text-tertiary">Alias Name</span>
                <span className="font-semibold text-primary">/{alias || "unknown"}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-tertiary">Expired on</span>
                <span className="font-semibold text-rose-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formattedDate} {formattedTime}
                </span>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-3 text-left">
            <p className="text-[11px] leading-relaxed text-amber-700/80">
              <span className="font-bold">Owner Message:</span> Access to this resource has been limited by the administrator. Please contact the link creator for a renewed URL.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[var(--accent-hover)] transition-all"
          >
            <Home className="h-4 w-4" /> Return Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2.5 text-sm font-medium text-primary hover:bg-[var(--bg-muted)] transition-all"
          >
            Go Back
          </button>
        </div>

        <p className="mt-8 text-[10px] text-tertiary flex items-center justify-center gap-1">
          <AlertTriangle className="h-3 w-3" /> If you are the owner, reactivate this link in your settings.
        </p>
      </motion.div>
      
      <p className="mt-8 text-xs text-tertiary">
        Powered by <span className="font-bold text-primary">Forge Links</span> • Secure Link Management
      </p>
    </div>
  );
}
