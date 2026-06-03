import { useCallback, useEffect, useMemo, useState } from "react";
import { getAnalytics } from "../services/api";
import {
  buildTrendFromVisits,
  getAnalyticsKpis,
} from "../lib/analyticsUtils";

function normalizeAnalytics(res) {
  return res?.data?.analytics ?? res?.analytics ?? null;
}

export function useAnalytics(urlId, { enabled = true } = {}) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(Boolean(enabled && urlId));
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    if (!urlId) {
      setAnalytics(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await getAnalytics(urlId);
      setAnalytics(normalizeAnalytics(res));
    } catch (err) {
      setAnalytics(null);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load analytics",
      );
    } finally {
      setLoading(false);
    }
  }, [urlId]);

  useEffect(() => {
    if (!enabled || !urlId) {
      setLoading(false);
      return;
    }
    fetchAnalytics();
  }, [enabled, urlId, fetchAnalytics]);

  const trendData = useMemo(
    () => buildTrendFromVisits(analytics?.recentVisits),
    [analytics?.recentVisits],
  );

  const kpis = useMemo(() => getAnalyticsKpis(analytics), [analytics]);

  const hasClicks = (analytics?.totalClicks ?? 0) > 0;

  return {
    analytics,
    loading,
    error,
    trendData,
    kpis,
    hasClicks,
    refresh: fetchAnalytics,
  };
}
