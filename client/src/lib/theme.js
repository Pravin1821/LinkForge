const STORAGE_KEY = "forge-theme";

export function getStoredTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "dark") return "dark";
  return "light";
}

export function applyTheme(theme) {
  const resolved = theme === "dark" ? "dark" : "light";
  const root = document.documentElement;

  root.dataset.theme = resolved;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;

  localStorage.setItem(STORAGE_KEY, resolved);
  return resolved;
}

export function initTheme() {
  return applyTheme(getStoredTheme());
}
