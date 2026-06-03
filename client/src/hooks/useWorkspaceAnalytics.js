import { useCallback, useEffect, useState } from "react";
import { getWorkspaceAnalytics } from "../services/api";

export function useWorkspaceAnalytics({ enabled = true } = {}) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getWorkspaceAnalytics();
      setAnalytics(res?.data?.analytics ?? null);
    } catch (err) {
      setAnalytics(null);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load workspace analytics",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    fetchAnalytics();
  }, [enabled, fetchAnalytics]);

  return {
    analytics,
    loading,
    error,
    refresh: fetchAnalytics,
  };
}
