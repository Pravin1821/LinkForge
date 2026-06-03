import { Plus, QrCode, Download, Upload } from "lucide-react";
import { useShell } from "../../context/ShellContext";
import { useUrls } from "../../hooks/useUrls";
import { toast } from "sonner";
import { createUrl } from "../../lib/api";

export function QuickActionsWidget() {
  const { openCreateLink, bumpLinks } = useShell();
  const { urls } = useUrls();

  const handleExport = () => {
    if (!urls || urls.length === 0) {
      toast.error("No links to export.");
      return;
    }

    const headers = ["Short Code", "Original URL", "Clicks", "Created At"];
    const csvContent = [
      headers.join(","),
      ...urls.map(u => [
        u.shortCode,
        `"${u.originalUrl}"`, // Wrap in quotes in case of commas
        u.clicks || 0,
        new Date(u.createdAt).toISOString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `links_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Analytics exported successfully.");
  };

  const handleBulkImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const text = await file.text();
      const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
      // Assume basic CSV where the first column is the originalUrl or it has headers
      const firstLine = lines[0].toLowerCase();
      let urlsToImport = [];
      
      if (firstLine.includes("url") || firstLine.includes("link")) {
        // Skip header
        lines.shift();
      }

      for (const line of lines) {
        // Find the first valid http string in the row
        const match = line.match(/(https?:\/\/[^\s,]+)/);
        if (match) {
          urlsToImport.push(match[0].replace(/"/g, ''));
        }
      }

      if (urlsToImport.length === 0) {
        toast.error("No valid URLs found in the CSV.");
        return;
      }

      toast.info(`Importing ${urlsToImport.length} links...`);
      let successCount = 0;
      let errorCount = 0;

      for (const originalUrl of urlsToImport) {
        try {
          await createUrl({ originalUrl });
          successCount++;
        } catch {
          errorCount++;
        }
      }

      bumpLinks();
      
      if (errorCount === 0) {
        toast.success(`Successfully imported ${successCount} links.`);
      } else {
        toast.warning(`Imported ${successCount} links. Failed: ${errorCount}.`);
      }
    };
    input.click();
  };

  return (
    <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)]">
      <h3 className="mb-4 text-sm font-semibold text-primary">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
        <ActionButton 
          icon={Plus} 
          label="Create Link" 
          onClick={openCreateLink} 
        />
        <ActionButton 
          icon={QrCode} 
          label="Generate QR" 
          onClick={openCreateLink} // Triggers link creation which includes QR
        />
        <ActionButton 
          icon={Download} 
          label="Export Data" 
          onClick={handleExport} 
        />
        <ActionButton 
          icon={Upload} 
          label="Bulk Import" 
          onClick={handleBulkImport} 
        />
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-muted)]/30 p-3 transition-colors hover:bg-[var(--bg-muted)] hover:border-[var(--accent)]/50 group"
    >
      <Icon className="h-5 w-5 text-secondary group-hover:text-[var(--accent)] transition-colors" />
      <span className="text-xs font-medium text-primary text-center">{label}</span>
    </button>
  );
}
