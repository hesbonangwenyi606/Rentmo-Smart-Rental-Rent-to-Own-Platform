import { useState, useEffect, useCallback } from "react";
import {
  Bell, Building2, Users, TrendingUp, DollarSign, Plus, ChevronRight,
  Eye, X, Clock, CheckCircle2, XCircle, AlertCircle, RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { clsx } from "clsx";
import { properties as propertiesApi, Property, users as usersApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const STATUS_LABELS: Record<string, string> = { PENDING: "Pending Approval", APPROVED: "Live", REJECTED: "Rejected" };

const emptyForm = {
  title: "", description: "", location: "", neighborhood: "",
  price: "", type: "RENT" as "RENT" | "RENT_TO_OWN",
  bedrooms: "1", bathrooms: "1", size: "",
  propertyValue: "", equityRate: "",
};

export default function LandlordDashboard() {
  const { user } = useAuth();
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [dashboard, setDashboard] = useState<Record<string, unknown> | null>(null);

  const loadProperties = useCallback(() => {
    setLoading(true);
    propertiesApi.mine()
      .then(setMyProperties)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadProperties();
    usersApi.getLandlordDashboard().then((d) => setDashboard(d as Record<string, unknown>)).catch(() => {});
  }, [loadProperties]);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      await propertiesApi.create({
        title: form.title,
        description: form.description || undefined,
        location: form.location,
        neighborhood: form.neighborhood,
        price: Number(form.price),
        type: form.type as "rent" | "rent-to-own",
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        size: Number(form.size),
        images: [],
        features: [],
        available: true,
        ...(form.type === "RENT_TO_OWN" && form.propertyValue ? { propertyValue: Number(form.propertyValue) } : {}),
        ...(form.type === "RENT_TO_OWN" && form.equityRate ? { equityRate: Number(form.equityRate) } : {}),
      });
      setShowModal(false);
      setForm(emptyForm);
      loadProperties();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to submit property.");
    } finally {
      setSubmitting(false);
    }
  };

  const approvedProps = myProperties.filter((p) => p.status === "APPROVED");
  const pendingProps = myProperties.filter((p) => p.status === "PENDING");
  const activeLeases = (dashboard as { activeLeases?: number } | null)?.activeLeases ?? 0;
  const monthlyRevenue = (dashboard as { monthlyRevenue?: number } | null)?.monthlyRevenue ?? 0;

  const inputCls = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors";

  return (
    <div className="min-h-screen bg-gray-50 page-content">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-500">Landlord Dashboard</p>
              <h1 className="text-xl sm:text-2xl font-bold text-navy truncate">{user?.name}</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button className="relative p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="btn-primary !py-2 !px-3 sm:!px-4 flex items-center gap-1.5 text-sm"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Add Property</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { label: "Total Listed", value: myProperties.length.toString(), icon: Building2, color: "text-primary bg-primary/10", sub: `${approvedProps.length} live` },
            { label: "Active Tenants", value: activeLeases.toString(), icon: Users, color: "text-blue-600 bg-blue-50", sub: "Active leases" },
            { label: "Monthly Revenue", value: monthlyRevenue > 0 ? `KES ${(monthlyRevenue / 1000).toFixed(0)}K` : "—", icon: DollarSign, color: "text-green-600 bg-green-50", sub: "Collected rent" },
            { label: "Pending Review", value: pendingProps.length.toString(), icon: TrendingUp, color: "text-amber-600 bg-amber-50", sub: "Awaiting admin approval" },
          ].map((stat) => (
            <div key={stat.label} className="card">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-navy">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
              <div className="text-xs text-gray-500 font-medium mt-1">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Properties list */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-navy text-lg">My Properties</h2>
            <div className="flex items-center gap-2">
              <button onClick={loadProperties} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <RefreshCw className={clsx("w-4 h-4 text-gray-400", loading && "animate-spin")} />
              </button>
              <Link to="/properties" className="text-xs text-primary flex items-center gap-1 hover:underline">
                Browse All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : myProperties.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-200" />
              <p className="text-gray-500 font-medium">No properties yet</p>
              <p className="text-gray-400 text-sm mt-1 mb-4">Add your first property to get started</p>
              <button onClick={() => setShowModal(true)} className="btn-primary !py-2 !px-5 text-sm inline-flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Property
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myProperties.map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="w-16 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy truncate">{p.title}</p>
                    <p className="text-xs text-gray-400 truncate">{p.location}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-navy">KES {p.price.toLocaleString()}/mo</p>
                    <span className={clsx(
                      "inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold",
                      p.status === "APPROVED" ? "bg-green-50 text-green-700" :
                      p.status === "REJECTED" ? "bg-red-50 text-red-600" :
                      "bg-amber-50 text-amber-700"
                    )}>
                      {p.status === "APPROVED" ? <CheckCircle2 className="w-3 h-3 inline mr-0.5" /> :
                       p.status === "REJECTED" ? <XCircle className="w-3 h-3 inline mr-0.5" /> :
                       <Clock className="w-3 h-3 inline mr-0.5" />}
                      {p.status ? (STATUS_LABELS[p.status] ?? p.status) : "Unknown"}
                    </span>
                  </div>
                  {p.status === "APPROVED" && (
                    <Link to={`/properties/${p.id}`} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-navy transition-colors">
                      <Eye className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending review note */}
        {pendingProps.length > 0 && (
          <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              You have <strong>{pendingProps.length}</strong> {pendingProps.length === 1 ? "property" : "properties"} awaiting admin review.
              Once approved, {pendingProps.length === 1 ? "it" : "they"} will appear on the Rentmo website.
            </p>
          </div>
        )}
      </div>

      {/* ── Add Property Modal ─────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-navy">Add Property</h2>
                <p className="text-xs text-gray-400 mt-0.5">Submitted for admin review before going live</p>
              </div>
              <button onClick={() => { setShowModal(false); setFormError(""); setForm(emptyForm); }}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {formError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Property Title *</label>
                  <input value={form.title} onChange={(e) => update("title", e.target.value)}
                    placeholder="e.g. Modern 3BR – Kilimani" required className={inputCls} />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Location *</label>
                  <input value={form.location} onChange={(e) => update("location", e.target.value)}
                    placeholder="e.g. Nairobi, Kenya" required className={inputCls} />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Neighborhood *</label>
                  <input value={form.neighborhood} onChange={(e) => update("neighborhood", e.target.value)}
                    placeholder="e.g. Kilimani" required className={inputCls} />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Monthly Price (KES) *</label>
                  <input type="number" value={form.price} onChange={(e) => update("price", e.target.value)}
                    placeholder="85000" required min={1} className={inputCls} />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Type *</label>
                  <select value={form.type} onChange={(e) => update("type", e.target.value)} className={inputCls}>
                    <option value="RENT">Rent</option>
                    <option value="RENT_TO_OWN">Rent-to-Own</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Bedrooms *</label>
                  <select value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} className={inputCls}>
                    {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} BR</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Bathrooms *</label>
                  <select value={form.bathrooms} onChange={(e) => update("bathrooms", e.target.value)} className={inputCls}>
                    {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Size (sqm) *</label>
                  <input type="number" value={form.size} onChange={(e) => update("size", e.target.value)}
                    placeholder="80" required min={1} className={inputCls} />
                </div>

                {form.type === "RENT_TO_OWN" && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Property Value (KES)</label>
                      <input type="number" value={form.propertyValue} onChange={(e) => update("propertyValue", e.target.value)}
                        placeholder="5000000" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Equity Rate (%)</label>
                      <input type="number" value={form.equityRate} onChange={(e) => update("equityRate", e.target.value)}
                        placeholder="2.5" step="0.1" className={inputCls} />
                    </div>
                  </>
                )}

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea value={form.description} onChange={(e) => update("description", e.target.value)}
                    placeholder="Describe the property..." rows={3}
                    className={`${inputCls} resize-none`} />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setFormError(""); setForm(emptyForm); }}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                  Submit for Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
