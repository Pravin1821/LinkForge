import { createContext, useCallback, useContext, useEffect, useState } from "react";

const ShellContext = createContext(null);

export function ShellProvider({ children }) {
  const [createLinkOpen, setCreateLinkOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [linksVersion, setLinksVersion] = useState(0);

  const bumpLinks = useCallback(() => {
    setLinksVersion((v) => v + 1);
  }, []);

  const openCreateLink = useCallback(() => setCreateLinkOpen(true), []);
  const openCommandPalette = useCallback(() => setCommandPaletteOpen(true), []);

  useEffect(() => {
    function handleOpenCreate() {
      setCreateLinkOpen(true);
    }
    document.addEventListener("forge:open-create", handleOpenCreate);
    return () =>
      document.removeEventListener("forge:open-create", handleOpenCreate);
  }, []);

  return (
    <ShellContext.Provider
      value={{
        createLinkOpen,
        setCreateLinkOpen,
        commandPaletteOpen,
        setCommandPaletteOpen,
        linksVersion,
        bumpLinks,
        openCreateLink,
        openCommandPalette,
      }}
    >
      {children}
    </ShellContext.Provider>
  );
}

export function useShell() {
  const ctx = useContext(ShellContext);
  if (!ctx) throw new Error("useShell must be used within ShellProvider");
  return ctx;
}
