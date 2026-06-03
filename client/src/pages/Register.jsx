import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Link2, ArrowRight, CheckCircle2, Lock, Mail, Eye, EyeOff, User, AtSign } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    
    setLoading(true);
    
    try {
      await register({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Registration failed. Please try again.");
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
              Start building your audience today.
            </h1>
            <p className="text-lg text-secondary">
              Create an account to unlock powerful link management, custom branding, and real-time analytics.
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

      {/* Right Side - Register Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-24 xl:px-32 relative py-12 overflow-y-auto">
        <Link to="/" className="lg:hidden flex items-center gap-2 w-fit mb-8">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] shadow-sm">
            <Link2 className="h-4 w-4 text-white" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-bold text-primary tracking-tight">Forge Links</span>
        </Link>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="w-full max-w-sm mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary tracking-tight">Create an account</h2>
            <p className="text-sm text-secondary mt-1">Get started with Forge Links for free.</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-rose-500/10 p-3 text-sm font-medium text-rose-500 border border-rose-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-primary">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-tertiary" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] py-2 pl-9 pr-3 text-sm text-primary placeholder:text-tertiary outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-primary">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSign className="h-4 w-4 text-tertiary" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] py-2 pl-9 pr-3 text-sm text-primary placeholder:text-tertiary outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
                  required
                  pattern="[a-zA-Z0-9_]+"
                  title="Only letters, numbers, and underscores are allowed"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-primary">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-tertiary" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] py-2 pl-9 pr-3 text-sm text-primary placeholder:text-tertiary outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-primary">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-tertiary" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] py-2 pl-9 pr-10 text-sm text-primary placeholder:text-tertiary outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
                  required
                  minLength={6}
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

            <div className="space-y-1">
              <label className="text-xs font-medium text-primary">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-tertiary" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] py-2 pl-9 pr-3 text-sm text-primary placeholder:text-tertiary outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="flex items-start gap-2 mt-4">
              <input type="checkbox" id="terms" required className="mt-0.5 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)] bg-[var(--bg-surface)]" />
              <label htmlFor="terms" className="text-xs text-secondary cursor-pointer">
                I agree to the <a href="#" className="text-[var(--accent)] hover:underline">Terms of Service</a> and <a href="#" className="text-[var(--accent)] hover:underline">Privacy Policy</a>.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 flex items-center justify-center gap-2 rounded-lg bg-[var(--accent)] py-2.5 text-sm font-medium text-[var(--bg-surface)] shadow-sm hover:bg-[var(--accent-hover)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>Create Account <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-secondary">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-[var(--accent)] hover:underline">
              Sign in
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