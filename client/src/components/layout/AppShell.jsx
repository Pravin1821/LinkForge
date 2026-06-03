import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Command, Sparkles, Gauge, BarChart3 } from "lucide-react";
import { cn } from "../../lib/utils";
import { ShellProvider, useShell } from "../../context/ShellContext";
import { CommandPalette } from "../CommandPalette";
import { CreateLinkDialog } from "../CreateLinkDialog";
import { FloatingCreateButton } from "../FloatingCreateButton";

export function AppShell({ children }) {
  return (
    <ShellProvider>
      <AppShellInner>{children}</AppShellInner>
    </ShellProvider>
  );
}

function AppShellInner({ children }) {
  const { openCommandPalette } = useShell();
  const location = useLocation();
  const isAuth =
    location.pathname === "/login" || location.pathname === "/register";

  if (isAuth) {
    return <div className="min-h-dvh bg-zinc-950 text-zinc-100">{children}</div>;
  }

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">
      <Background />

      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-zinc-950/50 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <Link
            to="/"
            className="group inline-flex items-center gap-2.5 rounded-xl px-2 py-1.5 focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-gradient-to-br from-purple-500/20 to-cyan-400/20">
              <Sparkles className="h-5 w-5 text-cyan-200" />
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight text-zinc-100">
                Forge Links
              </div>
              <div className="text-[11px] text-zinc-500">Premium URL platform</div>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            <TopNavLink to="/" icon={Gauge}>
              Dashboard
            </TopNavLink>
            <TopNavLink to="/analytics" icon={BarChart3}>
              Analytics
            </TopNavLink>
            <button
              type="button"
              onClick={openCommandPalette}
              className="ml-1 hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-400 transition hover:bg-white/10 hover:text-zinc-200 sm:inline-flex"
            >
              <Command className="h-3.5 w-3.5" />
              <span className="text-zinc-500">Ctrl</span>
              <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-zinc-300">
                K
              </kbd>
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
        {children}
      </main>

      <footer className="border-t border-white/[0.06] bg-zinc-950/40 pb-24 md:pb-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <span>© {new Date().getFullYear()} Forge Links</span>
          <span className="text-zinc-600">
            Crafted with glassmorphism · Linear · Vercel inspired
          </span>
        </div>
      </footer>

      <FloatingCreateButton />
      <CreateLinkDialog />
      <CommandPalette />
    </div>
  );
}

function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-48 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-400/15 blur-3xl" />
      <div className="absolute top-1/3 -right-32 h-[480px] w-[480px] rounded-full bg-gradient-to-l from-cyan-400/10 to-purple-500/15 blur-3xl" />
      <div className="absolute -bottom-40 left-[-80px] h-[400px] w-[400px] rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/80 to-zinc-950" />
    </div>
  );
}

function TopNavLink({ to, icon: Icon, children }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        cn(
          "relative inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-zinc-400 transition hover:bg-white/5 hover:text-zinc-100 focus-visible:ring-2 focus-visible:ring-cyan-300/70",
          isActive && "bg-white/5 text-zinc-100",
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{children}</span>
          {isActive ? <NavLinkUnderline /> : null}
        </>
      )}
    </NavLink>
  );
}

function NavLinkUnderline() {
  return (
    <motion.span
      layoutId="nav-underline"
      className="absolute inset-x-2 -bottom-px h-px bg-gradient-to-r from-purple-400/80 to-cyan-300/80"
    />
  );
}
