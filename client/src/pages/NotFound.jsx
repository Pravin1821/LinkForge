import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Link2, AlertTriangle, ArrowRight, Home, HelpCircle } from "lucide-react";

export function NotFoundPage() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  return (
    <div className="min-h-screen bg-[var(--bg-page)] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-8 shadow-[var(--shadow-card)] text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-500" />
        
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10">
          <Search className="h-8 w-8 text-indigo-500" />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-500 mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
          404 Not Found
        </div>

        <h1 className="mb-2 text-2xl font-bold tracking-tight text-primary">🔗 Link Not Found</h1>
        <p className="mb-6 text-sm text-secondary">
          The link you're looking for doesn't exist or has been moved to a new address.
        </p>

        <div className="mb-8 space-y-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-muted)]/50 p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-tertiary">Requested Code</span>
                <span className="font-semibold text-primary">/{code || "unknown"}</span>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg bg-indigo-500/5 border border-indigo-500/20 p-3 text-left">
            <p className="text-[11px] leading-relaxed text-indigo-700/80">
              <span className="font-bold">Possible reasons:</span> The link might have been deleted by the owner, or there might be a typo in the URL.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[var(--accent-hover)] transition-all"
          >
            <Home className="h-4 w-4" /> Go to Dashboard
          </Link>
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2.5 text-sm font-medium text-primary hover:bg-[var(--bg-muted)] transition-all"
          >
            Sign In to Forge Links
          </Link>
        </div>

        <p className="mt-8 text-[10px] text-tertiary flex items-center justify-center gap-1">
          <HelpCircle className="h-3 w-3" /> Double check the URL for any spelling mistakes.
        </p>
      </motion.div>
      
      <p className="mt-8 text-xs text-tertiary">
        Powered by <span className="font-bold text-primary">Forge Links</span> • Secure Link Management
      </p>
    </div>
  );
}
