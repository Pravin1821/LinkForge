import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Link2, AlertTriangle, ArrowRight } from "lucide-react";

export default function ExpiredLink() {
  const [searchParams] = useSearchParams();
  const alias = searchParams.get("alias");

  return (
    <div className="min-h-screen bg-[var(--bg-page)] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-8 shadow-[var(--shadow-card)] text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
        
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
          <Clock className="h-8 w-8 text-amber-500" />
        </div>

        <h1 className="mb-2 text-2xl font-bold tracking-tight text-primary">Link Expired</h1>
        <p className="mb-6 text-sm text-secondary">
          The shortened link you are trying to access has expired and is no longer active.
        </p>

        {alias && (
          <div className="mb-8 rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] p-4 flex items-center justify-center gap-2 text-sm text-primary font-medium">
            <Link2 className="h-4 w-4 text-tertiary" />
            forge.ly/{alias}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-[var(--bg-surface)] shadow-sm hover:bg-[var(--accent-hover)] transition-all"
          >
            Create Your Own Link <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2.5 text-sm font-medium text-primary hover:bg-[var(--bg-muted)] transition-all"
          >
            Go Back
          </button>
        </div>

        <p className="mt-6 text-xs text-tertiary flex items-center justify-center gap-1">
          <AlertTriangle className="h-3 w-3" /> If you are the owner, you can reactivate it in your dashboard.
        </p>
      </motion.div>
    </div>
  );
}
