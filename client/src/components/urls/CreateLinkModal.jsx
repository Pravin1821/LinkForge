import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, ExternalLink, X } from "lucide-react";
import { toast } from "sonner";
import { createUrl } from "../../services/api";
import { useShell } from "../../context/ShellContext";
import { Button } from "../ui/Button";
import { QRCard } from "./QRCard";
import { scaleIn } from "../../lib/motion";

export function CreateLinkModal() {
  const { createLinkOpen, setCreateLinkOpen, bumpLinks } = useShell();
  const [step, setStep] = useState("form");
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [created, setCreated] = useState(null);
  const [copied, setCopied] = useState(false);

  function reset() {
    setStep("form");
    setOriginalUrl("");
    setCustomAlias("");
    setExpiresAt("");
    setError(null);
    setCreated(null);
    setCopied(false);
    setLoading(false);
  }

  function close() {
    setCreateLinkOpen(false);
    setTimeout(reset, 200);
  }

  useEffect(() => {
    if (!createLinkOpen) reset();
  }, [createLinkOpen]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!originalUrl.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const payload = { originalUrl: originalUrl.trim() };
      if (customAlias.trim()) payload.customAlias = customAlias.trim();
      if (expiresAt) payload.expiresAt = new Date(expiresAt).toISOString();

      const res = await createUrl(payload);
      const link = res?.data?.data ?? res?.data;
      setCreated(link);
      setStep("success");
      bumpLinks();
      toast.success("Link created");
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || "Failed to create link",
      );
      toast.error(err?.response?.data?.message || "Failed to create link");
    } finally {
      setLoading(false);
    }
  }

  async function copyCreated() {
    const url = created?.shortUrl;
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <AnimatePresence>
      {createLinkOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/25"
            onClick={close}
          />
          <div className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center">
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-card-hover)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
                <h2 className="text-sm font-semibold text-primary">
                  {step === "success" ? "Link created" : "New link"}
                </h2>
                <button
                  type="button"
                  onClick={close}
                  className="rounded-md p-1 text-secondary hover:bg-[var(--bg-hover)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4">
                {step === "form" ? (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <Field label="Destination URL" required>
                      <input
                        type="url"
                        required
                        value={originalUrl}
                        onChange={(e) => setOriginalUrl(e.target.value)}
                        placeholder="https://example.com/page"
                        className="input-field"
                      />
                    </Field>
                    <Field label="Custom alias (Optional)">
                      <input
                        type="text"
                        value={customAlias}
                        onChange={(e) => setCustomAlias(e.target.value)}
                        placeholder="summer-sale"
                        className="input-field"
                      />
                    </Field>
                    
                    <div className="space-y-2">
                      <label className="block text-left text-xs font-medium text-secondary">Expiration</label>
                      <div className="flex gap-2">
                        <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 text-xs font-medium text-primary hover:bg-[var(--bg-muted)] transition-all has-[:checked]:border-[var(--accent)] has-[:checked]:bg-[var(--accent)]/5 has-[:checked]:text-[var(--accent)]">
                          <input 
                            type="radio" 
                            name="expirationType" 
                            className="hidden" 
                            checked={!expiresAt} 
                            onChange={() => setExpiresAt("")} 
                          />
                          Never Expire
                        </label>
                        <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 text-xs font-medium text-primary hover:bg-[var(--bg-muted)] transition-all has-[:checked]:border-[var(--accent)] has-[:checked]:bg-[var(--accent)]/5 has-[:checked]:text-[var(--accent)]">
                          <input 
                            type="radio" 
                            name="expirationType" 
                            className="hidden" 
                            checked={!!expiresAt} 
                            onChange={() => {
                              const tmr = new Date();
                              tmr.setDate(tmr.getDate() + 1);
                              // Format for datetime-local: YYYY-MM-DDThh:mm
                              const tzoffset = (new Date()).getTimezoneOffset() * 60000;
                              const localISOTime = (new Date(tmr - tzoffset)).toISOString().slice(0, 16);
                              setExpiresAt(localISOTime);
                            }} 
                          />
                          Custom Date
                        </label>
                      </div>
                      
                      {expiresAt !== "" && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                          <input
                            type="datetime-local"
                            value={expiresAt}
                            onChange={(e) => setExpiresAt(e.target.value)}
                            min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                            className="input-field mt-2"
                            required
                          />
                        </motion.div>
                      )}
                    </div>
                    {error ? (
                      <p className="text-sm text-[#C14C4C]">{error}</p>
                    ) : null}
                    <div className="flex justify-end gap-2 pt-2">
                      <Button type="button" variant="ghost" onClick={close}>
                        Cancel
                      </Button>
                      <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? "Creating…" : "Create"}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4 text-center"
                  >
                    <p className="break-all text-sm font-medium text-primary">
                      {created?.shortUrl}
                    </p>
                    <div className="flex justify-center">
                      <QRCard
                        value={created?.shortUrl}
                        imageSrc={created?.qrCode}
                        size={100}
                      />
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Button variant="primary" onClick={copyCreated}>
                        {copied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        Copy
                      </Button>
                      <a href={created?.shortUrl} target="_blank" rel="noreferrer">
                        <Button variant="subtle">
                          <ExternalLink className="h-4 w-4" />
                          Open
                        </Button>
                      </a>
                      <Button variant="ghost" onClick={close}>
                        Done
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function Field({ label, children, required }) {
  return (
    <label className="block text-left">
      <span className="text-xs font-medium text-secondary">
        {label}
        {required ? " *" : ""}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
