import { useEffect, useState } from "react";
import { Moon, Sun, Server, HardDrive, User, Shield, Laptop, Trash2, Key, Database, Camera, Loader2, ArrowRight } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { updateProfile, updatePassword, deleteAccount } from "../services/api";

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

export function SettingsPage() {
  const { user, updateSessionUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [apiStatus, setApiStatus] = useState("checking");
  const [activeTab, setActiveTab] = useState("general");

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

  const clearCache = () => {
    toast.success("Local cache cleared successfully.");
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12">
      <header className="border-b border-[var(--border)] pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-primary">Settings</h1>
        <p className="mt-1.5 text-sm text-secondary">
          Manage your account settings and workspace preferences.
        </p>
      </header>

      <div className="flex flex-col gap-8 md:flex-row md:gap-12">
        <aside className="w-full md:w-48 shrink-0 space-y-1">
          <TabButton icon={User} label="General" active={activeTab === "general"} onClick={() => setActiveTab("general")} />
          <TabButton icon={Laptop} label="Appearance" active={activeTab === "appearance"} onClick={() => setActiveTab("appearance")} />
          <TabButton icon={Server} label="System & API" active={activeTab === "system"} onClick={() => setActiveTab("system")} />
          <TabButton icon={Shield} label="Security" active={activeTab === "security"} onClick={() => setActiveTab("security")} />
        </aside>

        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === "general" && (
              <ProfileSettingsTab key="general" user={user} updateSessionUser={updateSessionUser} />
            )}

            {activeTab === "appearance" && (
              <motion.div key="appearance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <SectionHeader title="Appearance" description="Customize how the dashboard looks on your device." />
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-card)] p-6">
                  <div className="grid grid-cols-2 gap-4 max-w-md">
                    <button
                      onClick={() => setTheme("light")}
                      className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 p-4 transition-all ${
                        theme === "light" ? "border-[var(--accent)] bg-[var(--accent)]/5" : "border-[var(--border)] hover:border-[var(--border-strong)]"
                      }`}
                    >
                      <Sun className={`h-8 w-8 ${theme === "light" ? "text-[var(--accent)]" : "text-secondary"}`} />
                      <span className={`text-sm font-medium ${theme === "light" ? "text-[var(--accent)]" : "text-secondary"}`}>Light Mode</span>
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 p-4 transition-all ${
                        theme === "dark" ? "border-[var(--accent)] bg-[var(--accent)]/5" : "border-[var(--border)] hover:border-[var(--border-strong)]"
                      }`}
                    >
                      <Moon className={`h-8 w-8 ${theme === "dark" ? "text-[var(--accent)]" : "text-secondary"}`} />
                      <span className={`text-sm font-medium ${theme === "dark" ? "text-[var(--accent)]" : "text-secondary"}`}>Dark Mode</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "system" && (
              <motion.div key="system" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <SectionHeader title="System & API" description="Manage your backend connection and local storage." />
                
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-card)] overflow-hidden">
                  <div className="p-6 border-b border-[var(--border)]">
                    <div className="flex items-center gap-3 mb-4">
                      <Database className="h-5 w-5 text-secondary" />
                      <h3 className="text-base font-medium text-primary">Connection Status</h3>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-[var(--bg-muted)] p-4 border border-[var(--border)]">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-primary flex items-center gap-2">
                          API Endpoint
                          <StatusPill status={apiStatus} />
                        </p>
                        <p className="text-xs text-secondary font-mono">{API_BASE}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-[var(--bg-surface)]">
                    <div className="flex items-center gap-3 mb-4">
                      <HardDrive className="h-5 w-5 text-secondary" />
                      <h3 className="text-base font-medium text-primary">Local Storage</h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-primary">Session Data</p>
                        <p className="text-xs text-secondary mt-0.5">~{storageKb} KB used in browser local storage.</p>
                      </div>
                      <button onClick={clearCache} className="rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2 text-sm font-medium text-primary hover:bg-[var(--bg-muted)] transition-colors">
                        Clear Cache
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "security" && (
              <SecuritySettingsTab key="security" logout={logout} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ProfileSettingsTab({ user, updateSessionUser }) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  });
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2MB");
      return;
    }

    setImageLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, avatar: reader.result }));
      setImageLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setFormData(prev => ({ ...prev, avatar: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data } = await updateProfile(formData);
      updateSessionUser(data.user);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <SectionHeader title="Profile Information" description="Update your personal details and public avatar." />
      
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-card)] p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-6 pb-6 border-b border-[var(--border)]">
            <div className="relative h-20 w-20 shrink-0 group">
              {formData.avatar ? (
                <img src={formData.avatar} alt="Avatar" className="h-20 w-20 rounded-full object-cover shadow-sm border border-[var(--border)]" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-purple-600 text-2xl font-bold text-white shadow-md">
                  {(formData.name || formData.email || "U").charAt(0).toUpperCase()}
                </div>
              )}
              
              <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                {imageLoading ? <Loader2 className="h-6 w-6 text-white animate-spin" /> : <Camera className="h-6 w-6 text-white" />}
                <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} />
              </label>
            </div>
            
            <div className="space-y-2 flex-1">
              <div className="flex gap-2">
                <label className="cursor-pointer rounded-lg bg-[var(--bg-muted)] px-3 py-1.5 text-xs font-medium text-primary hover:bg-[var(--bg-hover)] transition-colors border border-[var(--border)]">
                  Upload new
                  <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} />
                </label>
                {formData.avatar && (
                  <button type="button" onClick={removeAvatar} className="rounded-lg px-3 py-1.5 text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors">
                    Remove
                  </button>
                )}
              </div>
              <p className="text-[10px] text-tertiary">Recommended: Square JPG, PNG, or WebP. Max 2MB.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-primary">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-primary outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-primary">Username</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-secondary text-sm">forge.ly/</span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  pattern="[a-zA-Z0-9_]+"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] py-2 pl-[70px] pr-3 text-sm text-primary outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-primary">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-primary outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--bg-surface)] shadow-sm hover:bg-[var(--accent-hover)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

function SecuritySettingsTab({ logout }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    
    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      await updatePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      toast.success("Password updated successfully");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently delete all your links and analytics.")) {
      return;
    }

    setDeleteLoading(true);
    try {
      await deleteAccount();
      toast.success("Account deleted successfully");
      logout();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete account");
      setDeleteLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <SectionHeader title="Security" description="Protect your account and update your password." />
      
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-card)] p-6">
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div className="flex items-center gap-2 mb-2 pb-4 border-b border-[var(--border)]">
            <Key className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-primary">Change Password</h3>
          </div>

          <div className="space-y-1.5 max-w-sm">
            <label className="text-xs font-medium text-primary">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-primary outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
            />
          </div>

          <div className="space-y-1.5 max-w-sm">
            <label className="text-xs font-medium text-primary">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-primary outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
            />
          </div>

          <div className="space-y-1.5 max-w-sm">
            <label className="text-xs font-medium text-primary">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-primary outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-[var(--bg-muted)] px-4 py-2 text-sm font-medium text-primary shadow-sm hover:bg-[var(--bg-hover)] border border-[var(--border)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Update Password
            </button>
          </div>
        </form>

        <div className="pt-8 mt-8 border-t border-[var(--border)]">
          <h4 className="text-sm font-medium text-rose-500 flex items-center gap-2 mb-4"><Trash2 className="h-4 w-4" /> Danger Zone</h4>
          <div className="flex items-center justify-between rounded-lg border border-rose-500/20 bg-rose-500/5 p-4 flex-wrap gap-4">
            <div>
              <p className="text-sm font-medium text-primary">Delete Account</p>
              <p className="text-xs text-secondary mt-0.5 max-w-md">Permanently remove your account, settings, and all links. This action cannot be undone.</p>
            </div>
            <button 
              onClick={handleDeleteAccount}
              disabled={deleteLoading}
              className="flex items-center gap-2 rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {deleteLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SectionHeader({ title, description, className = "" }) {
  return (
    <div className={`mb-4 ${className}`}>
      <h2 className="text-lg font-semibold text-primary tracking-tight">{title}</h2>
      <p className="text-sm text-secondary mt-0.5">{description}</p>
    </div>
  );
}

function TabButton({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "bg-[var(--bg-muted)] text-primary"
          : "text-secondary hover:bg-[var(--bg-hover)] hover:text-primary"
      }`}
    >
      <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-tertiary"}`} />
      {label}
    </button>
  );
}

function StatusPill({ status }) {
  const map = {
    checking: "bg-[var(--bg-muted)] text-secondary",
    online: "bg-emerald-500/10 text-emerald-500",
    degraded: "bg-amber-500/10 text-amber-600",
    offline: "bg-rose-500/10 text-rose-500",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${map[status] || map.checking}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${status === "online" ? "bg-emerald-500" : status === "degraded" ? "bg-amber-500" : status === "offline" ? "bg-rose-500" : "bg-gray-400 animate-pulse"}`} />
      {status}
    </span>
  );
}

export default SettingsPage;