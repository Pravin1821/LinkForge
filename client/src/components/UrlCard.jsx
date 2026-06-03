import { useState } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Link } from "react-router-dom";
import { Copy, ExternalLink, BarChart3, Check } from "lucide-react";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { IconButton } from "./ui/IconButton";
import { truncateMiddle, formatNumber } from "../lib/utils";
import { staggerItem } from "../lib/motion";

export function UrlCard({ url }) {
  const isActive = url?.isActive !== false;
  const shortLink = url?.shortUrl || "";
  const [copied, setCopied] = useState(false);

  async function copyToClipboard() {
    if (!shortLink) return;
    try {
      await navigator.clipboard.writeText(shortLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <motion.div variants={staggerItem} whileHover={{ y: -3 }} layout>
      <Card className="glass-hover rounded-2xl p-5 md:p-6">
        <div className="flex flex-col gap-5 sm:flex-row">
          <div className="flex shrink-0 flex-col items-center gap-2">
            <div className="rounded-xl border border-white/10 bg-white p-2 shadow-inner">
              <QRCodeSVG
                value={shortLink || "https://forge.ly"}
                size={80}
                level="M"
                bgColor="#ffffff"
                fgColor="#09090b"
                includeMargin={false}
              />
            </div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              QR preview
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-sm font-semibold tracking-tight text-zinc-100">
                    {truncateMiddle(
                      url?.shortUrl || url?.shortCode || "—",
                      28,
                      10,
                    )}
                  </div>
                  <Badge tone={isActive ? "good" : "neutral"}>
                    {isActive ? "Active" : "Disabled"}
                  </Badge>
                </div>
                <div className="mt-2 line-clamp-2 text-xs text-zinc-400">
                  {url?.originalUrl || "—"}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <IconButton label="Copy short link" onClick={copyToClipboard}>
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </IconButton>
                <a
                  href={shortLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex"
                >
                  <IconButton label="Open short link">
                    <ExternalLink className="h-4 w-4" />
                  </IconButton>
                </a>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
              <div className="text-xs text-zinc-400">
                <span className="font-medium text-zinc-200">
                  {formatNumber(url?.clicks || 0)}
                </span>{" "}
                clicks
              </div>

              <Link
                to={`/analytics/${url?._id}`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-gradient-to-r from-purple-500/10 to-cyan-400/10 px-3 py-2 text-xs font-medium text-zinc-200 transition hover:from-purple-500/20 hover:to-cyan-400/20 focus-visible:ring-2 focus-visible:ring-cyan-300/70"
              >
                <BarChart3 className="h-4 w-4 text-cyan-300/90" />
                View analytics
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
