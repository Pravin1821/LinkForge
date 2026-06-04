import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AppShell from "./layouts/AppShell";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ExpiredLink from "./pages/ExpiredLink";
import { DashboardPage } from "./pages/Dashboard";
import { AnalyticsPage } from "./pages/Analytics";
import { SettingsPage } from "./pages/Settings";
import { NotFoundPage } from "./pages/NotFound";
import { API_URL } from "./config/api";
import { AlertTriangle } from "lucide-react";

export default function App() {
  const isMissingApi = import.meta.env.PROD && !API_URL;

  if (isMissingApi) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#09090b] p-6 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-white">API Configuration Missing</h1>
        <p className="max-w-md text-zinc-400">
          This production build is missing the <code className="bg-zinc-800 px-1 py-0.5 rounded text-zinc-200">VITE_API_URL</code> environment variable. 
          Please configure it in your Vercel deployment settings.
        </p>
        <div className="mt-8 text-xs text-zinc-500">
          Expected format: https://your-backend.onrender.com
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/expired" element={<ExpiredLink />} />
      <Route path="/not-found" element={<NotFoundPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="analytics/:id" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="/dashboard" element={<Navigate to="/" replace />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
