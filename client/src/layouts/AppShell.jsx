import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Gauge,
  Link2,
  Menu,
  Plus,
  Search,
  Settings,
  X,
} from "lucide-react";
import { cn } from "../lib/utils";
import { getStoredUser } from "../lib/authStorage";
import { ShellProvider, useShell } from "../context/ShellContext";
import { CommandPalette } from "../components/CommandPalette";
import { CreateLinkModal } from "../components/urls/CreateLinkModal";
import { useAuth } from "../hooks/useAuth";

const NAV = [
  { to: "/", icon: Gauge, label: "Dashboard", end: true },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export default function AppShell() {
  return (
    <ShellProvider>
      <AppShellLayout />
    </ShellProvider>
  );
}

function AppShellLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { openCommandPalette, openCreateLink } = useShell();
  const { logout } = useAuth();
  const user = getStoredUser();

  return (
    <div className="min-h-dvh bg-[var(--bg-page)]">
      <AnimatePresence>
        {sidebarOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col border-r border-[var(--border)] bg-[var(--bg-surface)] transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-[var(--border)] px-3">
          <Link
            to="/"
            className="flex items-center gap-2"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="grid h-8 w-8 place-items-center rounded-md bg-[var(--bg-muted)]">
              <Link2 className="h-4 w-4 text-[var(--text-primary)]" strokeWidth={2} />
            </span>
            <span className="text-sm font-semibold text-primary">Forge Links</span>
          </Link>
          <button
            type="button"
            className="rounded-md p-1.5 text-secondary hover:bg-[var(--bg-hover)] lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 p-2">
          {NAV.map((item) => (
            <SidebarLink
              key={item.to}
              {...item}
              onNavigate={() => setSidebarOpen(false)}
            />
          ))}
        </nav>

        <div className="border-t border-[var(--border)] p-2">
          <button
            type="button"
            onClick={() => {
              openCreateLink();
              setSidebarOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium text-[var(--bg-surface)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition-colors"
          >
            <Plus className="h-4 w-4" />
            New link
          </button>
          <p className="mt-2 px-2 text-[10px] text-tertiary">
            <kbd className="rounded border border-[var(--border)] bg-[var(--bg-muted)] px-1">
              ⌘K
            </kbd>{" "}
            search
          </p>
        </div>
      </aside>

      <div className="lg:pl-[220px]">
        <header className="sticky top-0 z-30 flex h-12 items-center gap-3 border-b border-[var(--border)] bg-[var(--bg-page)]/95 px-4 backdrop-blur-sm">
          <button
            type="button"
            className="rounded-md p-1.5 text-secondary hover:bg-[var(--bg-hover)] lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={openCommandPalette}
            className="flex flex-1 max-w-md items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5 text-sm text-tertiary transition-colors hover:border-[var(--border-strong)]"
          >
            <Search className="h-3.5 w-3.5 shrink-0" />
            <span>Search…</span>
            <kbd className="ml-auto hidden rounded border border-[var(--border)] bg-[var(--bg-muted)] px-1 text-[10px] sm:inline">
              ⌘K
            </kbd>
          </button>
          <div className="relative ml-auto">
            <button
              type="button"
              onClick={() => setUserMenuOpen((o) => !o)}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg-surface)] text-xs font-semibold text-primary hover:bg-[var(--bg-hover)]"
            >
              {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
            </button>
            {userMenuOpen ? (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setUserMenuOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 z-50 mt-1 w-44 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] py-1 shadow-[var(--shadow-card-hover)]"
                >
                  <p className="border-b border-[var(--border)] px-3 py-2 text-xs text-secondary truncate">
                    {user?.email}
                  </p>
                  <Link
                    to="/settings"
                    className="block px-3 py-2 text-sm text-primary hover:bg-[var(--bg-hover)]"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm text-[#C14C4C] hover:bg-[var(--bg-hover)]"
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                  >
                    Sign out
                  </button>
                </motion.div>
              </>
            ) : null}
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <button
        type="button"
        onClick={openCreateLink}
        className="fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full border border-[var(--border)] bg-[var(--accent)] text-[var(--bg-surface)] shadow-[var(--shadow-card-hover)] lg:hidden"
        aria-label="Create link"
      >
        <Plus className="h-5 w-5" />
      </button>

      <CreateLinkModal />
      <CommandPalette />
    </div>
  );
}

function SidebarLink({ to, icon: Icon, label, end, onNavigate }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors",
          isActive
            ? "bg-[var(--bg-muted)] font-medium text-primary"
            : "text-secondary hover:bg-[var(--bg-hover)] hover:text-primary",
        )
      }
    >
      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
      {label}
    </NavLink>
  );
}
