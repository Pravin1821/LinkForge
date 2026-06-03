import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Link2,
  QrCode,
  Shield,
  Zap,
} from "lucide-react";
import { AuthProductPreview } from "./AuthProductPreview";

const FEATURES = [
  { icon: Link2, label: "Branded short links & custom aliases" },
  { icon: BarChart3, label: "Browser, device & country breakdown" },
  { icon: QrCode, label: "QR codes generated automatically" },
];

const REGISTER_PERKS = [
  { icon: Zap, label: "Unlimited links on your workspace" },
  { icon: BarChart3, label: "Real-time click analytics" },
  { icon: Shield, label: "Secure, private link library" },
];

const STATS = [
  { label: "Links created", value: "50k+" },
  { label: "Clicks tracked", value: "2M+" },
  { label: "Avg. setup", value: "< 2 min" },
];

const AuthLayout = ({
  title,
  subtitle,
  children,
  variant = "login",
  footer,
}) => {
  const isRegister = variant === "register";

  return (
    <div className="auth-page flex min-h-screen bg-[var(--bg-page)]">
      {/* Left — brand & product story */}
      <div className="auth-panel-left relative hidden w-[48%] flex-col overflow-hidden border-r border-[var(--border)] bg-[var(--bg-surface)] lg:flex">
        <div className="auth-dot-grid pointer-events-none absolute inset-0 opacity-[0.45]" />

        <div className="relative flex flex-1 flex-col justify-between p-10 xl:p-12">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Link to="/" className="inline-flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--border)] bg-[var(--bg-page)] shadow-[var(--shadow-card)]">
                <Link2 className="h-5 w-5 text-primary" strokeWidth={2} />
              </span>
              <div>
                <span className="text-sm font-semibold tracking-tight text-primary">
                  Forge Links
                </span>
                <span className="mt-0.5 block text-[11px] text-tertiary">
                  Link intelligence for teams
                </span>
              </div>
            </Link>
          </motion.div>

          <div className="my-8 max-w-md">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.08 }}
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-tertiary"
            >
              {isRegister ? "Get started" : "Welcome back"}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.4 }}
              className="mt-3 text-[2rem] font-semibold leading-[1.15] tracking-tight text-primary xl:text-[2.35rem]"
            >
              {isRegister ? (
                <>
                  Your links.
                  <br />
                  <span className="text-secondary">One calm workspace.</span>
                </>
              ) : (
                <>
                  Know where every
                  <br />
                  click comes from.
                </>
              )}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-[15px] leading-relaxed text-secondary"
            >
              {isRegister
                ? "Create an account in seconds. Shorten URLs, share QR codes, and read analytics that marketers actually use."
                : "Sign in to manage campaigns, track performance, and ship links your team can trust."}
            </motion.p>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.28 }}
              className="mt-6 space-y-3"
            >
              {(isRegister ? REGISTER_PERKS : FEATURES).map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 text-sm text-secondary"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[var(--border)] bg-[var(--bg-page)]">
                    <Icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.75} />
                  </span>
                  {label}
                </li>
              ))}
            </motion.ul>
          </div>

          <AuthProductPreview />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex gap-6 border-t border-[var(--border)] pt-6"
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-lg font-semibold tabular-nums tracking-tight text-primary">
                  {s.value}
                </p>
                <p className="text-[11px] text-tertiary">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 xl:px-20">
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto w-full max-w-[400px]"
        >
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-card)]">
              <Link2 className="h-4 w-4 text-primary" strokeWidth={2} />
            </span>
            <span className="font-semibold text-primary">Forge Links</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-primary sm:text-[1.65rem]">
              {title}
            </h1>
            <p className="mt-2 text-[15px] leading-relaxed text-secondary">{subtitle}</p>
          </div>

          <div className="auth-form-card overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-[0_4px_24px_rgb(0_0_0_0.06)]">
            <div className="h-1 bg-[var(--accent)]" aria-hidden />
            <div className="p-7 sm:p-8">{children}</div>
          </div>

          {footer ? <div className="mt-6">{footer}</div> : null}

          <p className="mt-10 text-center text-xs text-tertiary lg:hidden">
            © {new Date().getFullYear()} Forge Links
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
