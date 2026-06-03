import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Link2, ArrowRight, CheckCircle2, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      await login({ email, password });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] flex">
      {/* Left Side - Brand & Features */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-muted)] border-r border-[var(--border)] relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,var(--accent)_0%,transparent_50%)] opacity-5 pointer-events-none" />
        
        <div>
          <Link to="/" className="flex items-center gap-3 w-fit mb-20">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent)] to-purple-600 shadow-md">
              <Link2 className="h-6 w-6 text-white" strokeWidth={2.5} />
            </span>
            <span className="text-xl font-bold text-primary tracking-tight">Forge Links</span>
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-md">
            <h1 className="text-4xl font-bold text-primary tracking-tight leading-tight">
              Shorten links, track performance.
            </h1>
            <p className="text-lg text-secondary">
              The premier link management platform for modern startups, creators, and marketers.
            </p>
            
            <div className="pt-8 space-y-4">
              <FeatureItem text="Unlimited link shortening" />
              <FeatureItem text="Advanced geolocation analytics" />
              <FeatureItem text="High-resolution QR codes" />
              <FeatureItem text="Custom alias branding" />
            </div>
          </motion.div>
        </div>

        <div className="flex items-center gap-4 border-t border-[var(--border)] pt-8">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-8 w-8 rounded-full border-2 border-[var(--bg-surface)] bg-gradient-to-br from-[var(--accent)] to-purple-600 opacity-80" />
            ))}
          </div>
          <p className="text-sm font-medium text-secondary">Join 10,000+ teams worldwide</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-24 xl:px-32 relative">
        <Link to="/" className="lg:hidden flex items-center gap-2 w-fit mb-8">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] shadow-sm">
            <Link2 className="h-4 w-4 text-white" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-bold text-primary tracking-tight">Forge Links</span>
        </Link>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="w-full max-w-sm mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary tracking-tight">Welcome back</h2>
            <p className="text-sm text-secondary mt-1">Enter your credentials to access your workspace.</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-rose-500/10 p-3 text-sm font-medium text-rose-500 border border-rose-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-primary">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-tertiary" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] py-2 pl-9 pr-3 text-sm text-primary placeholder:text-tertiary outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-primary">Password</label>
                <Link to="/forgot-password" className="text-xs font-medium text-[var(--accent)] hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-tertiary" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] py-2 pl-9 pr-10 text-sm text-primary placeholder:text-tertiary outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-tertiary hover:text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="remember" className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)] bg-[var(--bg-surface)]" />
              <label htmlFor="remember" className="text-xs text-secondary cursor-pointer">Remember me for 30 days</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 flex items-center justify-center gap-2 rounded-lg bg-[var(--accent)] py-2.5 text-sm font-medium text-[var(--bg-surface)] shadow-sm hover:bg-[var(--accent-hover)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>Sign In <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-secondary">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-[var(--accent)] hover:underline">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureItem({ text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
      </div>
      <span className="text-sm font-medium text-primary">{text}</span>
    </div>
  );
}