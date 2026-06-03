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
  QrCode,
  Download,
  ChevronDown
} from "lucide-react";
import { cn } from "../lib/utils";
import { getStoredUser } from "../lib/authStorage";
import { ShellProvider, useShell } from "../context/ShellContext";
import { CommandPalette } from "../components/CommandPalette";
import { CreateLinkModal } from "../components/urls/CreateLinkModal";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import { useUrls } from "../hooks/useUrls";

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
  const { urls } = useUrls();

  const handleExport = () => {
    if (!urls || urls.length === 0) {
      toast.error("No links to export.");
      return;
    }

    const headers = ["Short Code", "Original URL", "Clicks", "Created At"];
    const csvContent = [
      headers.join(","),
      ...urls.map(u => [
        u.shortCode,
        `"${u.originalUrl}"`, 
        u.clicks || 0,
        new Date(u.createdAt).toISOString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `forge_links_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Analytics exported successfully.");
    setSidebarOpen(false);
  };

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
          "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-[var(--border)] bg-[var(--bg-surface)] transition-transform lg:translate-x-0 shadow-sm",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Workspace Header */}
        <div className="flex h-[72px] items-center justify-between border-b border-[var(--border)] px-4">
          <Link
            to="/"
            className="flex flex-1 items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-[var(--bg-muted)]"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent)] to-purple-600 shadow-sm">
              <Link2 className="h-5 w-5 text-white" strokeWidth={2.5} />
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-primary leading-tight">Forge Links</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-medium text-secondary">Free Plan</span>
              </div>
            </div>
            <ChevronDown className="ml-auto h-4 w-4 text-tertiary" />
          </Link>
          <button
            type="button"
            className="ml-2 rounded-md p-1.5 text-secondary hover:bg-[var(--bg-hover)] lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          <div className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-wider text-tertiary">
            Menu
          </div>
          {NAV.map((item) => (
            <SidebarLink
              key={item.to}
              {...item}
              onNavigate={() => setSidebarOpen(false)}
            />
          ))}
        </nav>

        {/* Quick Actions Panel */}
        <div className="border-t border-[var(--border)] p-4 space-y-2">
          <div className="pb-1 text-[10px] font-semibold uppercase tracking-wider text-tertiary">
            Quick Actions
          </div>
          <button
            type="button"
            onClick={() => {
              openCreateLink();
              setSidebarOpen(false);
            }}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-[var(--bg-surface)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition-all shadow-sm hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            Create New Link
          </button>
          
          <button
            type="button"
            onClick={() => {
              openCreateLink();
              setSidebarOpen(false);
            }}
            className="flex w-full items-center gap-2.5 rounded-md border border-[var(--border)] px-3 py-2 text-sm font-medium text-secondary hover:bg-[var(--bg-muted)] hover:text-primary transition-all"
          >
            <QrCode className="h-4 w-4 text-tertiary" />
            Generate QR
          </button>

          <button
            type="button"
            onClick={handleExport}
            className="flex w-full items-center gap-2.5 rounded-md border border-[var(--border)] px-3 py-2 text-sm font-medium text-secondary hover:bg-[var(--bg-muted)] hover:text-primary transition-all"
          >
            <Download className="h-4 w-4 text-tertiary" />
            Export Data
          </button>
          
          <div className="pt-2 text-center">
            <p className="text-[10px] text-tertiary">
              <kbd className="rounded border border-[var(--border)] bg-[var(--bg-muted)] px-1 font-sans">
                ⌘K
              </kbd>{" "}
              search anywhere
            </p>
          </div>
        </div>
      </aside>

      <div className="lg:pl-[280px]">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-[var(--border)] bg-[var(--bg-page)]/90 px-4 sm:px-6 backdrop-blur-md">
          <button
            type="button"
            className="rounded-md p-1.5 text-secondary hover:bg-[var(--bg-hover)] lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={openCommandPalette}
            className="flex flex-1 max-w-md items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-tertiary transition-colors hover:border-[var(--border-strong)] shadow-sm"
          >
            <Search className="h-4 w-4 shrink-0" />
            <span>Search links, analytics...</span>
            <kbd className="ml-auto hidden rounded border border-[var(--border)] bg-[var(--bg-muted)] px-1.5 text-[10px] font-semibold sm:inline text-secondary">
              ⌘K
            </kbd>
          </button>
          <div className="relative ml-auto">
            <button
              type="button"
              onClick={() => setUserMenuOpen((o) => !o)}
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--bg-surface)] text-sm font-semibold text-primary hover:bg-[var(--bg-hover)] shadow-sm"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                (user?.name || user?.email || "U").charAt(0).toUpperCase()
              )}
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
                  className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] py-1 shadow-lg"
                >
                  <div className="border-b border-[var(--border)] px-4 py-3">
                    <p className="text-xs font-medium text-primary">Account</p>
                    <p className="text-xs text-secondary truncate mt-0.5">
                      {user?.email}
                    </p>
                  </div>
                  <div className="p-1">
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-primary hover:bg-[var(--bg-hover)]"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 text-secondary" />
                      Settings
                    </Link>
                  </div>
                  <div className="border-t border-[var(--border)] p-1">
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-[#C14C4C] hover:bg-rose-500/10"
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                </motion.div>
              </>
            ) : null}
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8 min-h-[calc(100vh-56px)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <button
        type="button"
        onClick={openCreateLink}
        className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full border border-[var(--border)] bg-[var(--accent)] text-[var(--bg-surface)] shadow-lg lg:hidden hover:scale-105 transition-transform"
        aria-label="Create link"
      >
        <Plus className="h-6 w-6" />
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
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all relative group",
          isActive
            ? "bg-[var(--accent)]/10 text-[var(--accent)]"
            : "text-secondary hover:bg-[var(--bg-hover)] hover:text-primary",
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="sidebar-active"
              className="absolute left-0 top-1/2 h-1/2 w-1 -translate-y-1/2 rounded-r-full bg-[var(--accent)]"
            />
          )}
          <Icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-[var(--accent)]" : "text-tertiary group-hover:text-primary")} strokeWidth={2} />
          {label}
        </>
      )}
    </NavLink>
  );
}
