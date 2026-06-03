import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useShell } from "../context/ShellContext";

export function FloatingCreateButton() {
  const { openCreateLink } = useShell();

  return (
    <motion.button
      type="button"
      onClick={openCreateLink}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      className="fixed bottom-6 right-6 z-50 inline-flex h-14 items-center gap-2 rounded-2xl border border-white/20 bg-gradient-to-r from-purple-500 to-cyan-400 px-5 text-sm font-semibold text-zinc-950 shadow-[0_8px_32px_-4px_rgba(168,85,247,0.5)] focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 md:bottom-8 md:right-8"
      aria-label="Create link"
    >
      <Plus className="h-5 w-5" />
      <span className="hidden sm:inline">Create link</span>
    </motion.button>
  );
}
