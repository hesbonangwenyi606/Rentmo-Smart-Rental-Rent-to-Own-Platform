import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Eye, EyeOff, ArrowLeft, AlertCircle, Building2, Key } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type Role = "TENANT" | "LANDLORD";

export default function RegisterPage() {
  const [role, setRole] = useState<Role | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });
  const navigate = useNavigate();
  const { register } = useAuth();

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    if (form.password !== form.confirmPassword) {
      setPasswordMismatch(true);
      return;
    }
    setPasswordMismatch(false);
    setLoading(true);
    setError("");
    try {
      const user = await register({ name: form.fullName, email: form.email, password: form.password, phone: form.phone, role });
      navigate(user.role === "LANDLORD" ? "/dashboard/landlord" : "/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white/[0.07] border border-white/[0.12] rounded-2xl px-4 py-3.5 text-white placeholder-gray-500 outline-none focus:border-primary/60 focus:bg-white/[0.10] transition-all text-sm";

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      {/* Top bar */}
      <div className="flex items-center px-5 pt-6 pb-2">
        <button
          type="button"
          onClick={() => (role ? setRole(null) : navigate(-1))}
          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors rounded-xl hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Link to="/" className="flex items-center gap-2 mx-auto">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow">
            <Home className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white">Rentmo</span>
        </Link>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-10">
        <div className="max-w-sm mx-auto w-full">

          {/* ── Step 1: Role selection ── */}
          {!role ? (
            <>
              <h1 className="text-3xl font-bold text-white text-center mb-2">Join Rentmo</h1>
              <p className="text-gray-400 text-center text-sm mb-10">Who are you joining as?</p>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setRole("TENANT")}
                  className="w-full flex items-start gap-5 p-5 rounded-2xl border-2 border-white/10 bg-white/[0.05] hover:border-primary/60 hover:bg-white/[0.10] transition-all group text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/30 transition-colors">
                    <Key className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-base">I'm a Tenant</p>
                    <p className="text-gray-400 text-sm mt-1 leading-snug">
                      Looking to rent or buy through rent-to-own. Browse listings and manage your lease.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("LANDLORD")}
                  className="w-full flex items-start gap-5 p-5 rounded-2xl border-2 border-white/10 bg-white/[0.05] hover:border-primary/60 hover:bg-white/[0.10] transition-all group text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0 group-hover:bg-blue-500/30 transition-colors">
                    <Building2 className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-base">I'm a Landlord</p>
                    <p className="text-gray-400 text-sm mt-1 leading-snug">
                      List your properties and manage tenants, rent collection, and leases.
                    </p>
                  </div>
                </button>
              </div>

              <p className="text-center text-sm text-gray-500 mt-8">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
              </p>
            </>
          ) : (
            /* ── Step 2: Registration form ── */
            <>
              <div className="flex items-center gap-3 mb-7">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${role === "LANDLORD" ? "bg-blue-500/20" : "bg-primary/20"}`}>
                  {role === "LANDLORD" ? <Building2 className="w-5 h-5 text-blue-400" /> : <Key className="w-5 h-5 text-primary" />}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Create account</h1>
                  <p className="text-xs text-gray-400">Signing up as a <span className="text-primary capitalize">{role.toLowerCase()}</span></p>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl px-4 py-3 text-sm mb-4">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                  <input type="text" value={form.fullName} onChange={(e) => update("fullName", e.target.value)}
                    placeholder="James Mwangi" required className={inputClass} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Email</label>
                  <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
                    placeholder="you@example.com" required className={inputClass} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Phone Number</label>
                  <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)}
                    placeholder="+254 7XX XXX XXX" required className={inputClass} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={form.password}
                      onChange={(e) => update("password", e.target.value)} placeholder="••••••••"
                      required minLength={8} className={`${inputClass} pr-12`} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
                  <div className="relative">
                    <input type={showConfirmPassword ? "text" : "password"} value={form.confirmPassword}
                      onChange={(e) => { update("confirmPassword", e.target.value); setPasswordMismatch(false); }}
                      placeholder="••••••••" required minLength={8}
                      className={`${inputClass} pr-12 ${passwordMismatch ? "border-red-500/70 focus:border-red-500/70" : ""}`} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordMismatch && <p className="text-red-400 text-xs mt-1.5">Passwords do not match</p>}
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed transition-colors shadow-lg">
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Create Account"}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
