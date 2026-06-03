import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { initTheme } from "./lib/theme";

initTheme();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <ThemedToaster />
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);

function ThemedToaster() {
  const { theme } = useTheme();
  return (
    <Toaster
      theme={theme}
      position="top-right"
      toastOptions={{
        className:
          "border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-[var(--shadow-card)]",
      }}
    />
  );
}
