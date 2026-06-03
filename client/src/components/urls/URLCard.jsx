import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Check,
  Copy,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "../ui/Badge";
import { IconButton } from "../ui/IconButton";
import { QRCard } from "./QRCard";
import {
  formatDateTime,
  formatNumber,
  truncateMiddle,
} from "../../lib/utils";
import { staggerItem } from "../../lib/motion";

export function URLCard({ url, onDelete }) {
  const isActive = url?.isActive !== false;
  const shortLink = url?.shortUrl || "";
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isExpired =
    url?.expiresAt && new Date(url.expiresAt) < new Date();

  async function copyToClipboard() {
    if (!shortLink) return;
    try {
      await navigator.clipboard.writeText(shortLink);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  }

  async function handleDelete() {
    if (!onDelete) return;
    if (!window.confirm("Delete this short link permanently?")) return;
    setDeleting(true);
    try {
      await onDelete(url._id);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <motion.article
      variants={staggerItem}
      whileHover={{ backgroundColor: "var(--bg-hover)" }}
      transition={{ duration: 0.12 }}
      className="group flex gap-3 border-b border-[var(--border)] px-3 py-3 last:border-b-0 sm:gap-4 sm:px-4"
    >
      <QRCard value={shortLink} imageSrc={url?.qrCode} size={48} label="" compact />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-sm font-medium text-primary">
            {truncateMiddle(shortLink || url?.shortCode || "—", 36, 10)}
          </h3>
          <Badge tone={isActive && !isExpired ? "good" : isExpired ? "warn" : "neutral"}>
            {!isActive ? "Off" : isExpired ? "Expired" : "Active"}
          </Badge>
        </div>
        <p className="mt-0.5 truncate text-xs text-secondary">
          {url?.originalUrl || "—"}
        </p>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-secondary">
          <span>
            <span className="text-tertiary">Clicks</span>{" "}
            <span className="font-medium tabular-nums text-primary">
              {formatNumber(url?.clicks || 0)}
            </span>
          </span>
          <span>
            <span className="text-tertiary">Created</span>{" "}
            {formatDateTime(url?.createdAt)}
          </span>
          {url?.customAlias ? (
            <span>
              <span className="text-tertiary">Alias</span> {url.customAlias}
            </span>
          ) : null}
          {url?.expiresAt ? (
            <span>
              <span className="text-tertiary">Expires</span>{" "}
              {formatDateTime(url.expiresAt)}
            </span>
          ) : null}
          {(url?.clicks || 0) > 0 && url?.updatedAt ? (
            <span>
              <span className="text-tertiary">Last click</span>{" "}
              {formatDateTime(url.updatedAt)}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-start gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <IconButton label="Copy" onClick={copyToClipboard}>
          {copied ? (
            <Check className="h-3.5 w-3.5 text-[#448361]" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </IconButton>
        <a href={shortLink} target="_blank" rel="noreferrer">
          <IconButton label="Open">
            <ExternalLink className="h-3.5 w-3.5" />
          </IconButton>
        </a>
        <Link to={`/analytics/${url?._id}`}>
          <IconButton label="Analytics">
            <BarChart3 className="h-3.5 w-3.5" />
          </IconButton>
        </Link>
        <IconButton label="Delete" onClick={handleDelete} disabled={deleting}>
          <Trash2 className="h-3.5 w-3.5" />
        </IconButton>
      </div>
    </motion.article>
  );
}
