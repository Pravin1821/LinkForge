import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link2, X } from "lucide-react";
import { createUrl } from "../lib/api";
import { useShell } from "../context/ShellContext";
import { Button } from "./ui/Button";
import { scaleIn } from "../lib/motion";

export function CreateLinkDialog() {
  const { createLinkOpen, setCreateLinkOpen, bumpLinks } = useShell();
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  function close() {
    setCreateLinkOpen(false);
    setStatus("idle");
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!originalUrl.trim()) return;

    setStatus("loading");
    setError(null);
    try {
      const payload = { originalUrl: originalUrl.trim() };
      if (customAlias.trim()) payload.customAlias = customAlias.trim();
      await createUrl(payload);
      setOriginalUrl("");
      setCustomAlias("");
      bumpLinks();
      close();
    } catch (err) {
      setStatus("error");
      setError(
        err?.response?.data?.message || err?.message || "Failed to create link",
      );
    }
  }

  return (
    <AnimatePresence>
      {createLinkOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-zinc-950/70 backdrop-blur-sm"
            onClick={close}
          />
          <div className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center">
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="gradient-border w-full max-w-lg rounded-2xl glass-strong p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-zinc-200">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-purple-500/30 to-cyan-400/30">
                      <Link2 className="h-4 w-4 text-cyan-200" />
                    </span>
                    New short link
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">
                    Paste a destination URL. Optionally set a custom alias.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="rounded-xl p-2 text-zinc-400 transition hover:bg-white/10 hover:text-zinc-100"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-xs font-medium text-zinc-400">
                    Destination URL
                  </span>
                  <input
                    type="url"
                    required
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    placeholder="https://yoursite.com/page"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-zinc-950/60 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-medium text-zinc-400">
                    Custom alias (optional)
                  </span>
                  <input
                    type="text"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value)}
                    placeholder="my-campaign"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-zinc-950/60 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                  />
                </label>

                {error ? (
                  <p className="text-sm text-rose-300">{error}</p>
                ) : null}

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" onClick={close}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? "Creating…" : "Create link"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
