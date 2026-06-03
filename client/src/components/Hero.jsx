import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Link2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/Button";
import { fadeUp } from "../lib/motion";
import { useShell } from "../context/ShellContext";

export function Hero({ totalLinks = 0, totalClicks = 0 }) {
  const { openCreateLink } = useShell();

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="gradient-border relative overflow-hidden rounded-3xl glass-strong hero-glow"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-400/10" />
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl" />

      <div className="relative px-6 py-10 md:px-10 md:py-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              Premium link analytics
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-zinc-50 md:text-5xl md:leading-[1.1]">
              Forge links that{" "}
              <span className="bg-gradient-to-r from-purple-300 via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                convert
              </span>
            </h1>

            <p className="mt-4 text-base leading-relaxed text-zinc-400 md:text-lg">
              Shorten, share, and measure every touchpoint with real-time analytics,
              QR codes, and insights inspired by the best SaaS products.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button variant="primary" size="lg" onClick={openCreateLink}>
                <Link2 className="h-4 w-4" />
                Create link
                <ArrowRight className="h-4 w-4 opacity-80" />
              </Button>
              <Link to="/analytics">
                <Button variant="subtle" size="lg">
                  <BarChart3 className="h-4 w-4" />
                  Analytics Center
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:min-w-[280px]">
            <HeroStat label="Live links" value={totalLinks} />
            <HeroStat label="Total clicks" value={totalClicks} />
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function HeroStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/40 px-4 py-4 backdrop-blur">
      <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold tracking-tight text-zinc-100">
        {typeof value === "number"
          ? new Intl.NumberFormat().format(value)
          : value}
      </div>
    </div>
  );
}
