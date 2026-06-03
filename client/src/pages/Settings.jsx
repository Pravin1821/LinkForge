import { useEffect, useState } from "react";
import { Moon, Sun, Server, HardDrive, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { getStoredUser } from "../lib/authStorage";
import { useTheme } from "../context/ThemeContext";

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

export function SettingsPage() {
  const user = getStoredUser();
  const { theme, setTheme } = useTheme();
  const [apiStatus, setApiStatus] = useState("checking");
  const storageKb = Math.round(
    Object.keys(localStorage).reduce(
      (acc, key) => acc + (localStorage.getItem(key)?.length || 0) + key.length,
      0,
    ) / 1024,
  );

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/`)
      .then((r) => {
        if (!cancelled) setApiStatus(r.ok ? "online" : "degraded");
      })
      .catch(() => {
        if (!cancelled) setApiStatus("offline");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-5">
      <header className="border-b border-[var(--border)] pb-4">
        <h1 className="text-xl font-semibold text-primary">Settings</h1>
        <p className="mt-0.5 text-sm text-secondary">
          Profile, appearance, and connection status.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4 text-secondary" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-[var(--bg-muted)] text-sm font-semibold">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-primary">{user?.name || "User"}</p>
              <p className="text-sm text-secondary">{user?.email}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {theme === "dark" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {["light", "dark"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={`flex-1 rounded-md border px-3 py-2 text-sm capitalize transition-colors ${
                    theme === t
                      ? "border-[var(--border-strong)] bg-[var(--bg-muted)] font-medium text-primary"
                      : "border-[var(--border)] text-secondary hover:bg-[var(--bg-hover)]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-4 w-4 text-secondary" />
              API
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StatusPill status={apiStatus} />
            <p className="mt-2 break-all text-xs text-tertiary">{API_BASE}</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-secondary" />
              Local storage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-secondary">
              ~{storageKb} KB used for session data
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    checking: "bg-[var(--bg-muted)] text-secondary",
    online: "bg-[#E8F3EC] text-[#448361]",
    degraded: "bg-[#FAF3E8] text-[#D9730D]",
    offline: "bg-[#FCE8E8] text-[#C14C4C]",
  };
  return (
    <span
      className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${map[status] || map.checking}`}
    >
      {status}
    </span>
  );
}

export default SettingsPage;
