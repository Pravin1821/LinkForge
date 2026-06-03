import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link2, X } from "lucide-react";
import { updateUrl } from "../lib/api";
import { useShell } from "../context/ShellContext";
import { Button } from "./ui/Button";
import { scaleIn } from "../lib/motion";
import { toast } from "sonner";

export function EditLinkModal({ isOpen, onClose, url }) {
  const { bumpLinks } = useShell();
  const [originalUrl, setOriginalUrl] = useState("");
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (url) {
      setOriginalUrl(url.originalUrl || "");
    }
  }, [url]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!originalUrl.trim() || !url) return;

    setStatus("loading");
    try {
      await updateUrl(url._id, { originalUrl: originalUrl.trim() });
      toast.success("Link updated successfully");
      bumpLinks();
      onClose();
    } catch (err) {
      setStatus("error");
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to update link",
      );
    } finally {
      if (status !== "error") setStatus("idle");
    }
  }

  return (
    <AnimatePresence>
      {isOpen && url ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-zinc-950/70 backdrop-blur-sm"
            onClick={onClose}
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
                    Edit Link
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">
                    Update the destination URL for /{url.shortCode}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
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

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={status === "loading" || originalUrl === url.originalUrl}
                  >
                    {status === "loading" ? "Saving…" : "Save Changes"}
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
