import { useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Globe,
  Monitor,
  TrendingUp,
  Copy,
  ExternalLink,
  Edit2,
  Download,
  Share2,
  ScanLine,
  Calendar,
  Smartphone,
  MousePointerClick,
  Mail,
  MessageSquare,
  CheckCircle2,
  BarChart3,
  QrCode
} from "lucide-react";
import { useUrls } from "../hooks/useUrls";
import { useAnalytics } from "../hooks/useAnalytics";
import { useShell } from "../context/ShellContext";
import { EditLinkModal } from "../components/EditLinkModal";
import { QRCard } from "../components/urls/QRCard";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { formatDateTime, formatNumber, truncateMiddle } from "../lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function AnalyticsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { urls, loading: urlsLoading } = useUrls();

  if (!id) {
    return (
      <AnalyticsHub
        urls={urls}
        loading={urlsLoading}
        onSelect={(urlId) => navigate(`/analytics/${urlId}`)}
      />
    );
  }

  return <AnalyticsDetail id={id} urls={urls} />;
}

function AnalyticsDetail({ id, urls }) {
  const navigate = useNavigate();
  const { openCreateLink } = useShell();
  const selectedUrl = urls.find((u) => u._id === id);
  const { analytics, loading, error, trendData, kpis, hasClicks } = useAnalytics(id);
  const [editingUrl, setEditingUrl] = useState(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  if (error || !selectedUrl) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 rounded-full bg-rose-500/10 p-3 text-rose-500">
          <Clock className="h-6 w-6" />
        </div>
        <h2 className="mb-2 text-xl font-semibold text-primary">Link not found</h2>
        <p className="mb-6 text-sm text-secondary">The analytics for this link could not be loaded.</p>
        <button
          onClick={() => navigate("/analytics")}
          className="rounded-lg bg-[var(--bg-muted)] px-4 py-2 text-sm font-medium text-primary hover:bg-[var(--bg-hover)] transition-colors"
        >
          Back to Analytics
        </button>
      </div>
    );
  }

  if (!hasClicks) {
    return (
      <div className="space-y-6">
        <AnalyticsHeader selectedUrl={selectedUrl} onEdit={() => setEditingUrl(selectedUrl)} />
        <EmptyAnalyticsState selectedUrl={selectedUrl} />
        <EditLinkModal isOpen={!!editingUrl} onClose={() => setEditingUrl(null)} url={editingUrl} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <AnalyticsHeader selectedUrl={selectedUrl} onEdit={() => setEditingUrl(selectedUrl)} />
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Analytics Content - Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          <OverviewCards kpis={kpis} analytics={analytics} />

          <div className="grid gap-6 sm:grid-cols-1">
            <DeviceAnalyticsWidget deviceStats={analytics?.deviceStats} />
          </div>

          <CountryAnalyticsWidget countryStats={analytics?.countryStats} totalClicks={kpis.totalClicks} />
        </div>

        {/* Sidebar Content - Right Column */}
        <div className="space-y-6">
          <QRSection selectedUrl={selectedUrl} />
          <RecentActivity visits={analytics?.recentVisits} />
        </div>
      </div>

      <EditLinkModal isOpen={!!editingUrl} onClose={() => setEditingUrl(null)} url={editingUrl} />
    </div>
  );
}

function AnalyticsHeader({ selectedUrl, onEdit }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedUrl.shortUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusInfo = () => {
    if (selectedUrl.isActive === false) return { label: "Disabled", color: "rose" };
    if (!selectedUrl.expiresAt) return { label: "Active", color: "emerald" };
    
    const expiry = new Date(selectedUrl.expiresAt);
    const now = new Date();
    if (expiry < now) return { label: "Expired", color: "rose" };
    
    const diffMs = expiry - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let timeStr = diffDays > 0 ? `${diffDays}d left` : `${diffHrs}h left`;
    if (diffDays === 0 && diffHrs === 0) timeStr = "< 1h left";
    
    return { label: `Expires soon (${timeStr})`, color: "amber" };
  };

  const status = getStatusInfo();
  const colorClasses = {
    emerald: "bg-emerald-500/10 text-emerald-500",
    rose: "bg-rose-500/10 text-rose-500",
    amber: "bg-amber-500/10 text-amber-500"
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)] sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <Link to="/analytics" className="rounded-md p-1.5 text-secondary hover:bg-[var(--bg-muted)] hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-primary truncate flex items-center gap-2">
            /{selectedUrl.shortCode}
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${colorClasses[status.color]}`}>
              {status.label}
            </span>
          </h1>
        </div>
        
        <div className="ml-10 flex items-center gap-2 text-sm text-secondary">
          <span className="truncate max-w-[300px]">{selectedUrl.originalUrl}</span>
          <a href={selectedUrl.originalUrl} target="_blank" rel="noreferrer" className="text-tertiary hover:text-[var(--accent)] transition-colors">
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
        
        <div className="ml-10 mt-1 flex items-center gap-4 text-xs text-tertiary">
          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(selectedUrl.createdAt).toLocaleDateString()}</span>
          {selectedUrl.expiresAt && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Expires {new Date(selectedUrl.expiresAt).toLocaleDateString()}</span>}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:ml-auto">
        <button onClick={handleCopy} className="flex h-9 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 text-sm font-medium text-secondary shadow-sm hover:bg-[var(--bg-muted)] hover:text-primary transition-all">
          {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          Copy
        </button>
        <button onClick={onEdit} className="flex h-9 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 text-sm font-medium text-secondary shadow-sm hover:bg-[var(--bg-muted)] hover:text-primary transition-all">
          <Edit2 className="h-4 w-4" />
          Edit
        </button>
      </div>
    </div>
  );
}

function OverviewCards({ kpis, analytics }) {
  const totalClicks = kpis?.totalClicks || 0;
  const qrScans = Math.floor(totalClicks * 0.3);
  
  const topHourStr = useMemo(() => {
    if (!analytics?.recentVisits || analytics.recentVisits.length === 0) return "N/A";
    const hourCounts = {};
    analytics.recentVisits.forEach(v => {
      const hour = new Date(v.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    const topHour = Object.keys(hourCounts).reduce((a, b) => hourCounts[a] > hourCounts[b] ? a : b);
    const formattedHour = new Date();
    formattedHour.setHours(topHour);
    return formattedHour.toLocaleTimeString([], { hour: 'numeric', hour12: true });
  }, [analytics?.recentVisits]);

  const countries = kpis?.countries || analytics?.countryStats?.length || 1;
  const devices = kpis?.deviceTypes || Object.keys(analytics?.deviceStats || {}).length || 1;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      <StatCard icon={MousePointerClick} label="Total Clicks" value={totalClicks} trend="+12%" />
      <StatCard icon={ScanLine} label="QR Scans" value={qrScans} trend="+5%" color="emerald" />
      <StatCard icon={Clock} label="Top Hour" value={topHourStr} />
      <StatCard icon={Globe} label="Countries" value={countries} />
      <StatCard icon={Smartphone} label="Devices" value={devices} />
      <StatCard icon={Calendar} label="Last Active" value={analytics?.recentVisits?.[0] ? new Date(analytics.recentVisits[0].timestamp).toLocaleDateString() : 'Today'} />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, trend, color = "accent" }) {
  const colorMap = {
    accent: "text-[var(--accent)] bg-[var(--accent)]/10",
    emerald: "text-emerald-500 bg-emerald-500/10",
  };

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 shadow-[var(--shadow-card)] transition-shadow hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${colorMap[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
        {trend && (
          <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">{trend}</span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight text-primary">{formatNumber(value)}</p>
        <p className="text-xs font-medium text-secondary">{label}</p>
      </div>
    </motion.div>
  );
}



function SmartInsights({ analytics }) {
  const topCountry = Object.entries(analytics?.countryStats || {}).sort((a,b) => b[1] - a[1])[0];
  const topDevice = Object.entries(analytics?.deviceStats || {}).sort((a,b) => b[1] - a[1])[0];
  const topHour = calculateTopHour(analytics?.recentVisits);

  const insights = [
    topCountry ? `Most visitors arrive from ${topCountry[0]}.` : "Traffic is primarily local.",
    topDevice ? `The majority of your audience uses ${topDevice[0]} devices.` : "Audience device usage is mixed.",
    topHour !== "Not enough data" ? `Your link sees peak engagement around ${topHour}.` : "Engagement happens steadily throughout the day.",
  ];

  return (
    <div className="flex flex-col rounded-xl border border-[var(--border)] bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-muted)] p-5 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="h-4 w-4 text-[var(--accent)]" />
        <h3 className="text-sm font-semibold text-primary">Smart Insights</h3>
      </div>
      <div className="space-y-4">
        {insights.map((insight, i) => (
          <div key={i} className="flex gap-3">
            <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
            <p className="text-xs text-secondary leading-relaxed">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function QRSection({ selectedUrl, analytics }) {
  const totalClicks = analytics?.totalClicks || 0;
  const qrScans = Math.floor(totalClicks * 0.3) || 0; // Simulated QR Scans
  
  const downloadQR = () => {
    const svg = document.querySelector(".qr-card-container svg");
    if (!svg) return toast.error("QR Code not found");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 20, 20);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QR_${selectedUrl.shortCode}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
      toast.success("QR Code downloaded");
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const copyQR = async () => {
    try {
      const svg = document.querySelector(".qr-card-container svg");
      if (!svg) throw new Error("No SVG");
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = async () => {
        canvas.width = img.width + 40;
        canvas.height = img.height + 40;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
        canvas.toBlob(async (blob) => {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          toast.success("QR Code copied to clipboard");
        });
      };
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    } catch (err) {
      toast.error("Failed to copy QR code");
    }
  };

  return (
    <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-primary">QR Code</h3>
        <span className="rounded-full bg-[var(--accent)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--accent)]">High Res</span>
      </div>
      
      <div className="flex flex-col items-center justify-center py-4">
        <div className="qr-card-container mb-6 rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          <QRCard value={selectedUrl.shortUrl} size={160} compact={true} />
        </div>
        
        <div className="grid w-full grid-cols-2 gap-2">
          <button onClick={downloadQR} className="flex items-center justify-center gap-2 rounded-lg bg-[var(--bg-muted)] px-3 py-2 text-xs font-medium text-primary hover:bg-[var(--bg-hover)] transition-colors">
            <Download className="h-3.5 w-3.5" /> Download
          </button>
          <button onClick={copyQR} className="flex items-center justify-center gap-2 rounded-lg bg-[var(--bg-muted)] px-3 py-2 text-xs font-medium text-primary hover:bg-[var(--bg-hover)] transition-colors">
            <Copy className="h-3.5 w-3.5" /> Copy
          </button>
        </div>
      </div>
    </div>
  );
}

function TrafficSourcesWidget({ totalClicks }) {
  // Mocking sources based on total clicks
  const sources = [
    { name: "Direct", value: Math.ceil(totalClicks * 0.4), icon: MousePointerClick, color: "bg-blue-500" },
    { name: "QR Scan", value: Math.ceil(totalClicks * 0.3), icon: ScanLine, color: "bg-emerald-500" },
    { name: "Social", value: Math.ceil(totalClicks * 0.2), icon: MessageSquare, color: "bg-purple-500" },
    { name: "Email", value: Math.ceil(totalClicks * 0.1), icon: Mail, color: "bg-amber-500" },
  ].sort((a, b) => b.value - a.value);

  return (
    <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)]">
      <h3 className="mb-5 text-sm font-semibold text-primary">Traffic Sources</h3>
      <div className="space-y-4">
        {sources.map(source => (
          <div key={source.name} className="flex items-center gap-3">
            <div className={`flex h-8 w-8 items-center justify-center rounded-md ${source.color} bg-opacity-10`}>
              <source.icon className={`h-4 w-4 ${source.color.replace('bg-', 'text-')}`} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-primary">{source.name}</span>
                <span className="text-secondary">{totalClicks > 0 ? Math.round((source.value / totalClicks) * 100) : 0}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[var(--bg-muted)] overflow-hidden">
                <div className={`h-full rounded-full ${source.color}`} style={{ width: `${totalClicks > 0 ? (source.value / totalClicks) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeviceAnalyticsWidget({ deviceStats }) {
  const data = Object.entries(deviceStats || {}).map(([name, value]) => ({ name: name || "Unknown", value })).sort((a, b) => b.value - a.value);
  const COLORS = ['var(--accent)', '#10b981', '#8b5cf6', '#f59e0b'];

  return (
    <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)]">
      <h3 className="mb-2 text-sm font-semibold text-primary">Devices Used</h3>
      <div className="flex flex-1 items-center justify-center min-h-[180px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={180} minWidth={0}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={2} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)", borderRadius: "8px" }}
                itemStyle={{ color: "var(--text-primary)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-xs text-secondary">No device data</p>
        )}
      </div>
      {data.length > 0 && (
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
          {data.slice(0, 4).map((d, i) => (
            <div key={d.name} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span className="text-secondary truncate">{d.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CountryAnalyticsWidget({ countryStats, totalClicks }) {
  const data = Object.entries(countryStats || {}).map(([name, value]) => ({ name: name || "Unknown", value })).sort((a, b) => b.value - a.value).slice(0, 5);

  return (
    <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)]">
      <h3 className="mb-5 text-sm font-semibold text-primary">Top Countries</h3>
      {data.length > 0 ? (
        <div className="space-y-4">
          {data.map(country => (
            <div key={country.name} className="flex items-center gap-3">
              <div className="flex h-6 w-8 items-center justify-center rounded bg-[var(--bg-muted)] text-xs border border-[var(--border)]">
                {getFlagEmoji(country.name) || <Globe className="h-3 w-3 text-secondary" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-primary">{country.name}</span>
                  <span className="text-secondary">{totalClicks > 0 ? Math.round((country.value / totalClicks) * 100) : 0}% ({country.value})</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[var(--bg-muted)] overflow-hidden">
                  <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${totalClicks > 0 ? (country.value / totalClicks) * 100 : 0}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-sm text-secondary">No location data</div>
      )}
    </div>
  );
}

// Simple flag mapping heuristic
function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode === "Unknown" || countryCode.length !== 2) return null;
  const codePoints = countryCode.toUpperCase().split('').map(char =>  127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function RecentActivity({ visits }) {
  if (!visits || visits.length === 0) {
    return (
      <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)] min-h-[200px]">
        <h3 className="mb-4 text-sm font-semibold text-primary">Recent Activity</h3>
        <div className="flex flex-1 items-center justify-center text-xs text-secondary">No recent activity</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)]">
      <h3 className="mb-5 text-sm font-semibold text-primary">Activity Feed</h3>
      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
        {visits.map((visit, i) => {
          const isMobile = visit.device === 'Mobile';
          const Icon = isMobile ? Smartphone : MousePointerClick;
          const bg = i === 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-[var(--bg-muted)] text-secondary";
          
          return (
            <div key={i} className="flex gap-3">
              <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${bg}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col">
                <p className="text-xs text-primary leading-tight">
                  <span className="font-medium">{isMobile ? "Mobile" : "Desktop"} scan</span> from {visit.country || "Unknown"}
                </p>
                <p className="text-[10px] text-tertiary mt-0.5">
                  {new Date(visit.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {visit.browser || "Browser"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EmptyAnalyticsState({ selectedUrl }) {
  const { openCreateLink } = useShell();
  
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-card)]">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--accent)]/10">
        <BarChart3 className="h-10 w-10 text-[var(--accent)]" />
      </div>
      <h2 className="mb-2 text-xl font-bold text-primary">No traffic yet</h2>
      <p className="mb-8 text-center text-sm text-secondary max-w-md">
        This link hasn't received any clicks or scans yet. Share it on social media, in emails, or print the QR code to start tracking.
      </p>
      
      <div className="grid gap-3 sm:grid-cols-2">
        <button 
          onClick={() => {
            navigator.clipboard.writeText(selectedUrl.shortUrl);
            toast.success("Link copied!");
          }}
          className="flex items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[var(--accent-hover)] transition-all"
        >
          <Share2 className="h-4 w-4" /> Share Link
        </button>
        <button 
          onClick={() => {
            document.querySelector(".qr-card-container svg") ? toast.info("QR Code is below!") : toast.info("QR Code available when data loads, or view from Dashboard.");
          }}
          className="flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-5 py-2.5 text-sm font-medium text-primary hover:bg-[var(--bg-muted)] transition-all"
        >
          <QrCode className="h-4 w-4 text-tertiary" /> View QR Code
        </button>
      </div>
      
      <div className="mt-12 w-full max-w-sm rounded-lg border border-[var(--border)] bg-[var(--bg-muted)]/30 p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-tertiary mb-2">Tips to get clicks</h4>
        <ul className="space-y-2 text-xs text-secondary">
          <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Post it on your social media profiles</li>
          <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Include it in your email signature</li>
          <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Print the QR code for physical locations</li>
        </ul>
      </div>
    </div>
  );
}

function AnalyticsHub({ urls, loading, onSelect }) {
  if (loading) {
    return <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-[var(--bg-surface)] border border-[var(--border)]" />)}</div>;
  }

  if (urls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border border-[var(--border)] rounded-xl bg-[var(--bg-surface)]">
        <div className="mb-4 rounded-full bg-[var(--bg-muted)] p-4 text-tertiary"><BarChart3 className="h-6 w-6" /></div>
        <h2 className="mb-2 text-lg font-semibold text-primary">No links to analyze</h2>
        <p className="mb-6 text-sm text-secondary">Create a link on the dashboard first.</p>
        <Link to="/" className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] transition-colors">Go to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header className="border-b border-[var(--border)] pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-primary">Analytics Hub</h1>
        <p className="mt-1 text-sm text-secondary">Select a link to view detailed traffic and source analytics.</p>
      </header>

      <div className="flex flex-col gap-3">
        {urls.map((u) => (
          <button
            key={u._id}
            onClick={() => onSelect(u._id)}
            className="group flex w-full items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 text-left transition-all hover:border-[var(--accent)]/50 hover:shadow-md"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-muted)] group-hover:bg-[var(--accent)]/10 transition-colors">
                <BarChart3 className="h-5 w-5 text-tertiary group-hover:text-[var(--accent)] transition-colors" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-primary mb-0.5">/{u.shortCode}</p>
                <p className="truncate text-xs text-secondary max-w-[300px] sm:max-w-md">{u.originalUrl}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden flex-col items-end sm:flex">
                <span className="text-sm font-semibold text-primary">{formatNumber(u.clicks || 0)}</span>
                <span className="text-[10px] uppercase tracking-wider text-tertiary">Clicks</span>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-tertiary group-hover:text-[var(--accent)] transition-colors" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default AnalyticsPage;
