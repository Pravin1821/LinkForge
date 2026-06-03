export function buildTrendFromVisits(visits, days = 14) {
  const counts = new Map();

  for (const visit of visits || []) {
    const ts = visit?.timestamp;
    if (!ts) continue;
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) continue;
    const key = d.toISOString().slice(0, 10);
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  const result = [];
  const end = new Date();
  end.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(end);
    day.setDate(end.getDate() - i);
    const key = day.toISOString().slice(0, 10);
    result.push({
      date: day.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      clicks: counts.get(key) || 0,
      sortKey: key,
    });
  }

  return result;
}

export function countStatKeys(stats) {
  return Object.keys(stats || {}).filter((k) => (stats[k] || 0) > 0).length;
}

export function sumStatValues(stats) {
  return Object.values(stats || {}).reduce((a, b) => a + (Number(b) || 0), 0);
}

export function getAnalyticsKpis(analytics) {
  const browserStats = analytics?.browserStats || {};
  const deviceStats = analytics?.deviceStats || {};
  return {
    totalClicks: analytics?.totalClicks ?? 0,
    uniqueBrowsers: countStatKeys(browserStats),
    deviceTypes: countStatKeys(deviceStats),
    lastVisited: analytics?.lastVisited ?? null,
  };
}
