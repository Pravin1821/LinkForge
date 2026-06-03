import { Globe, MapPin } from "lucide-react";

export function GeoInsightsWidget({ countries, cities, totalClicks }) {
  if (!countries || countries.length === 0) {
    return (
      <div className="flex h-72 flex-col rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)]">
        <h3 className="mb-4 text-sm font-semibold text-primary">Top Locations</h3>
        <div className="flex flex-1 items-center justify-center text-sm text-secondary">
          Not enough location data.
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-72 flex-col rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)]">
      <h3 className="mb-4 text-sm font-semibold text-primary">Top Locations</h3>
      
      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        <div>
          <h4 className="mb-3 flex items-center text-xs font-medium text-secondary">
            <Globe className="mr-1.5 h-3 w-3" /> Countries
          </h4>
          <div className="space-y-3">
            {countries.map((country) => (
              <GeoRow 
                key={country._id} 
                label={country._id || "Unknown"} 
                count={country.count} 
                total={totalClicks} 
              />
            ))}
          </div>
        </div>

        {cities && cities.length > 0 && (
          <div className="pt-2">
            <h4 className="mb-3 flex items-center text-xs font-medium text-secondary">
              <MapPin className="mr-1.5 h-3 w-3" /> Cities
            </h4>
            <div className="space-y-3">
              {cities.map((city) => (
                <GeoRow 
                  key={city._id} 
                  label={city._id || "Unknown"} 
                  count={city.count} 
                  total={totalClicks} 
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function GeoRow({ label, count, total }) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-primary">{label}</span>
          <span className="text-secondary">{percentage}%</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-muted)]">
          <div 
            className="h-full rounded-full bg-[var(--accent)]" 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <div className="w-8 text-right text-xs font-medium tabular-nums text-primary">
        {count}
      </div>
    </div>
  );
}
