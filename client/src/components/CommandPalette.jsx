import { useEffect, useMemo, useState } from "react";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";
import { BarChart3, Gauge, Link2, Plus, Settings } from "lucide-react";
import { getUrls } from "../services/api";
import { useShell } from "../context/ShellContext";
import { truncateMiddle } from "../lib/utils";

const ACTIONS = [
  { id: "dashboard", label: "Dashboard", icon: Gauge, path: "/" },
  { id: "analytics", label: "Analytics", icon: BarChart3, path: "/analytics" },
  { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  { id: "create", label: "Create new link", icon: Plus, action: "create" },
];

export function CommandPalette() {
  const navigate = useNavigate();
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    openCreateLink,
    linksVersion,
  } = useShell();
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    if (!commandPaletteOpen) return;
    let cancelled = false;
    getUrls()
      .then((res) => {
        if (!cancelled) setUrls(res?.data?.data ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [commandPaletteOpen, linksVersion]);

  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((open) => !open);
      }
      if (e.key === "Escape") setCommandPaletteOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setCommandPaletteOpen]);

  const linkItems = useMemo(
    () =>
      urls.map((u) => ({
        id: `link-${u._id}`,
        label: truncateMiddle(u.shortUrl || u.shortCode, 40, 12),
        keywords: `${u.originalUrl} ${u.shortCode}`,
        path: `/analytics/${u._id}`,
        icon: Link2,
      })),
    [urls],
  );

  function close() {
    setCommandPaletteOpen(false);
  }

  function run(item) {
    close();
    if (item.action === "create") {
      openCreateLink();
      return;
    }
    if (item.path) navigate(item.path);
  }

  if (!commandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]">
      <div className="absolute inset-0 bg-black/20" onClick={close} />
      <Command
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-card-hover)]"
        label="Command menu"
      >
        <div className="flex items-center border-b border-[var(--border)] px-3">
          <Command.Input
            placeholder="Search links or pages…"
            className="flex-1 bg-transparent py-3 text-sm outline-none"
            autoFocus
          />
        </div>
        <Command.List className="max-h-[360px] overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-secondary">
            No results
          </Command.Empty>
          <Command.Group heading="Navigation" className="text-[10px] uppercase text-tertiary px-2 py-1">
            {ACTIONS.map((item) => (
              <CommandItem key={item.id} item={item} onSelect={run} />
            ))}
          </Command.Group>
          {linkItems.length > 0 ? (
            <Command.Group heading="Links" className="mt-2 text-[10px] uppercase text-tertiary px-2 py-1">
              {linkItems.map((item) => (
                <CommandItem key={item.id} item={item} onSelect={run} />
              ))}
            </Command.Group>
          ) : null}
        </Command.List>
      </Command>
    </div>
  );
}

function CommandItem({ item, onSelect }) {
  const Icon = item.icon;
  return (
    <Command.Item
      value={`${item.label} ${item.keywords || ""}`}
      onSelect={() => onSelect(item)}
      className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-primary aria-selected:bg-[var(--bg-hover)]"
    >
      <Icon className="h-4 w-4 text-secondary" strokeWidth={1.5} />
      <span className="truncate">{item.label}</span>
    </Command.Item>
  );
}
