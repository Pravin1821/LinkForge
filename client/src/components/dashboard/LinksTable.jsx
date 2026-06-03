import { useState } from "react";
import { Copy, MoreHorizontal, QrCode, Trash2, ExternalLink, BarChart2, Check, Edit2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatNumber } from "../../lib/utils";
import { toast } from "sonner";
import { useShell } from "../../context/ShellContext";
import { QRCard } from "../urls/QRCard";

export function LinksTable({ urls, onDelete, onEdit }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const { openCreateLink } = useShell();

  if (!urls || urls.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-card)]">
        <p className="text-sm font-medium text-primary">No links created yet.</p>
        <p className="mt-1 text-xs text-secondary">Your short links will appear here.</p>
        <button 
          onClick={openCreateLink}
          className="mt-4 rounded-md bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-[var(--accent)]/90"
        >
          Create Link
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-card)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--bg-muted)]/30 text-xs text-secondary border-b border-[var(--border)]">
            <tr>
              <th className="px-5 py-3 font-medium">Short Link</th>
              <th className="px-5 py-3 font-medium">Original URL</th>
              <th className="px-5 py-3 font-medium">Clicks</th>
              <th className="px-5 py-3 font-medium">Created</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {urls.map((url) => (
              <LinkRow 
                key={url._id} 
                url={url} 
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LinkRow({ url, activeMenu, setActiveMenu, onDelete, onEdit }) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const isMenuOpen = activeMenu === url._id;

  const handleCopy = () => {
    navigator.clipboard.writeText(url.shortUrl);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setActiveMenu(isMenuOpen ? null : url._id);
  };

  return (
    <>
      <tr className="group hover:bg-[var(--bg-muted)]/20 transition-colors">
        <td className="px-5 py-3 align-top">
          <div className="flex flex-col">
            <span className="font-medium text-primary flex items-center gap-1.5">
              /{url.shortCode}
              <button onClick={handleCopy} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[var(--bg-muted)] rounded">
                {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3 text-tertiary" />}
              </button>
            </span>
            <span className="text-[10px] text-tertiary mt-0.5 max-w-[120px] truncate">{url.shortUrl}</span>
          </div>
        </td>
        <td className="px-5 py-3 align-top max-w-[200px] truncate">
          <div className="flex items-center gap-2">
            {url.originalUrl && (
              <img
                src={`https://www.google.com/s2/favicons?domain=${url.originalUrl}&sz=32`}
                alt="Favicon"
                className="h-4 w-4 rounded-sm"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <a href={url.originalUrl} target="_blank" rel="noreferrer" className="truncate text-secondary hover:text-primary hover:underline transition-colors">
              {url.originalUrl}
            </a>
          </div>
        </td>
        <td className="px-5 py-3 align-top">
          <span className="inline-flex items-center rounded-full bg-[var(--bg-muted)] px-2 py-0.5 text-xs font-medium text-primary">
            {formatNumber(url.clicks || 0)}
          </span>
        </td>
        <td className="px-5 py-3 align-top">
          <LinkStatusBadge url={url} />
        </td>
        <td className="px-5 py-3 align-top">
          <span className="text-tertiary whitespace-nowrap text-xs">
            {new Date(url.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </td>
        <td className="px-5 py-3 align-top text-right relative">
          <div className="flex items-center justify-end gap-1">
            <button 
              onClick={() => setShowQR(true)}
              className="p-1.5 text-tertiary hover:text-primary hover:bg-[var(--bg-muted)] rounded-md transition-colors"
              title="View QR Code"
            >
              <QrCode className="h-4 w-4" />
            </button>
            <Link 
              to={`/analytics/${url._id}`}
              className="p-1.5 text-tertiary hover:text-[var(--accent)] hover:bg-[var(--bg-muted)] rounded-md transition-colors"
              title="Analytics"
            >
              <BarChart2 className="h-4 w-4" />
            </Link>
            
            <div className="relative">
              <button 
                onClick={toggleMenu}
                className="p-1.5 text-tertiary hover:text-primary hover:bg-[var(--bg-muted)] rounded-md transition-colors"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
              
              {isMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setActiveMenu(null)}
                  />
                  <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-md border border-[var(--border)] bg-[var(--bg-surface)] p-1 shadow-lg">
                    <button 
                      onClick={() => { handleCopy(); setActiveMenu(null); }}
                      className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-xs text-secondary hover:bg-[var(--bg-muted)] hover:text-primary"
                    >
                      <Copy className="h-3.5 w-3.5" /> Copy link
                    </button>
                    <a 
                      href={url.shortUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      onClick={() => setActiveMenu(null)}
                      className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-xs text-secondary hover:bg-[var(--bg-muted)] hover:text-primary"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Open in new tab
                    </a>
                    {onEdit && (
                      <button 
                        onClick={() => { onEdit(url); setActiveMenu(null); }}
                        className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-xs text-secondary hover:bg-[var(--bg-muted)] hover:text-primary"
                      >
                        <Edit2 className="h-3.5 w-3.5" /> Edit
                      </button>
                    )}
                    <div className="my-1 h-px bg-[var(--border)]" />
                    <button 
                      onClick={() => { 
                        if (window.confirm("Are you sure you want to delete this link?")) {
                          onDelete(url._id); 
                        }
                        setActiveMenu(null); 
                      }}
                      className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-xs text-rose-500 hover:bg-rose-500/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </td>
      </tr>
      
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="relative">
            <button 
              onClick={() => setShowQR(false)} 
              className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-surface)] text-primary shadow-lg hover:bg-[var(--bg-muted)] z-10 border border-[var(--border)]"
            >
              ×
            </button>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-2xl">
              <QRCard url={url.shortUrl} title={`/${url.shortCode}`} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function LinkStatusBadge({ url }) {
  if (url.isActive === false) {
    return (
      <div className="flex flex-col gap-0.5">
        <span className="inline-flex w-fit items-center rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-500">
          Disabled
        </span>
      </div>
    );
  }

  if (!url.expiresAt) {
    return (
      <div className="flex flex-col gap-0.5">
        <span className="inline-flex w-fit items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500">
          Active
        </span>
        <span className="text-[10px] text-tertiary">Never expires</span>
      </div>
    );
  }

  const expiry = new Date(url.expiresAt);
  const now = new Date();
  
  if (expiry < now) {
    return (
      <div className="flex flex-col gap-0.5">
        <span className="inline-flex w-fit items-center rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-500">
          Expired
        </span>
        <span className="text-[10px] text-tertiary">
          {Math.floor((now - expiry) / (1000 * 60 * 60 * 24))}d ago
        </span>
      </div>
    );
  }

  const diffMs = expiry - now;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  let timeString = "";
  if (diffDays > 0) timeString += `${diffDays}d `;
  if (diffHrs > 0 || diffDays === 0) timeString += `${diffHrs}h`;
  if (timeString === "") timeString = "< 1h";

  return (
    <div className="flex flex-col gap-0.5">
      <span className="inline-flex w-fit items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-500">
        Expires soon
      </span>
      <span className="text-[10px] text-tertiary">In {timeString.trim()}</span>
    </div>
  );
}
