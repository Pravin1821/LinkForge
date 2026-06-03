import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { deleteUrl as deleteUrlApi, getUrls } from "../services/api";
import { useShell } from "../context/ShellContext";

function normalizeUrlsResponse(res) {
  return res?.data?.data ?? res?.data ?? [];
}

export function useUrls({ enabled = true } = {}) {
  const { linksVersion, bumpLinks } = useShell();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  const fetchUrls = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUrls();
      setUrls(normalizeUrlsResponse(res));
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to load links";
      setError(message);
      setUrls([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    fetchUrls();
  }, [enabled, fetchUrls, linksVersion]);

  const removeUrl = useCallback(
    async (id) => {
      try {
        await deleteUrlApi(id);
        toast.success("Link deleted");
        bumpLinks();
        setUrls((prev) => prev.filter((u) => u._id !== id));
      } catch (err) {
        toast.error(
          err?.response?.data?.message || err?.message || "Failed to delete link",
        );
        throw err;
      }
    },
    [bumpLinks],
  );

  return {
    urls,
    loading,
    error,
    refresh: fetchUrls,
    deleteUrl: removeUrl,
  };
}
