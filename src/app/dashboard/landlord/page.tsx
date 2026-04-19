import { useState, useEffect, useCallback, useRef } from "react";
import {
  Bell, Building2, Users, TrendingUp, DollarSign, Plus,
  Eye, X, Clock, CheckCircle2, XCircle, AlertCircle,
  RefreshCw, Pencil, Trash2, ImagePlus, Upload,
} from "lucide-react";
import { Link } from "react-router-dom";
import { clsx } from "clsx";
import { properties as propertiesApi, Property, uploadImage } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending Approval",
  APPROVED: "Live",
  REJECTED: "Rejected",
};

type FormState = {
  title: string; description: string; location: string; neighborhood: string;
  price: string; type: "RENT" | "RENT_TO_OWN"; bedrooms: string; bathrooms: string;
  size: string; propertyValue: string; equityRate: string;
};

const EMPTY_FORM: FormState = {
  title: "", description: "", location: "", neighborhood: "",
  price: "", type: "RENT", bedrooms: "1", bathrooms: "1",
  size: "", propertyValue: "", equityRate: "",
};

function propertyToForm(p: Property): FormState {
  return {
    title: p.title, description: p.description ?? "", location: p.location,
    neighborhood: p.neighborhood, price: String(p.price),
    type: (p.type === "rent-to-own" ? "RENT_TO_OWN" : "RENT"),
    bedrooms: String(p.bedrooms), bathrooms: String(p.bathrooms),
    size: String(p.size), propertyValue: p.propertyValue ? String(p.propertyValue) : "",
    equityRate: p.equityRate ? String(p.equityRate) : "",
  };
}

// ── Image upload section ───────────────────────────────────────────────────────
function ImageUploadSection({
  images, onAdd, onRemove,
}: {
  images: string[];
  onAdd: (url: string) => void;
  onRemove: (idx: number) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError("");
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (images.length >= 6) { setUploadError("Maximum 6 images allowed"); break; }
        const url = await uploadImage(file);
        onAdd(url);
      }
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-2">
        Property Photos <span className="text-gray-400 font-normal">({images.length}/6)</span>
      </label>

      <div className="grid grid-cols-3 gap-2 mb-2">
        {images.map((url, i) => (
          <div key={i} className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 group">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {images.length < 6 && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="aspect-video rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/40 hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-1 disabled:opacity-50"
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            ) : (
              <>
                <ImagePlus className="w-5 h-5 text-gray-300" />
                <span className="text-xs text-gray-400">Add photo</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {images.length === 0 && (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-full border-2 border-dashed border-gray-200 rounded-xl py-5 flex flex-col items-center gap-2 hover:border-primary/40 hover:bg-primary/5 transition-colors disabled:opacity-50"
        >
          <Upload className="w-6 h-6 text-gray-300" />
          <span className="text-sm text-gray-400">Click to upload photos</span>
          <span className="text-xs text-gray-300">JPG, PNG, WEBP — max 5MB each</span>
        </button>
      )}

      {uploadError && (
        <p className="text-red-500 text-xs mt-1">{uploadError}</p>
      )}
    </div>
  );
}

// ── Property form modal ────────────────────────────────────────────────────────
function PropertyModal({
  mode, property, onClose, onSaved,
}: {
  mode: "add" | "edit";
  property?: Property;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<FormState>(
    mode === "edit" && property ? propertyToForm(property) : EMPTY_FORM
  );
  const [images, setImages] = useState<string[]>(
    mode === "edit" && property?.images ? property.images : []
  );
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const update = (field: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        description: form.description || undefined,
        location: form.location,
        neighborhood: form.neighborhood,
        price: Number(form.price),
        type: form.type as "rent" | "rent-to-own",
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        size: Number(form.size),
        images,
        features: property?.features ?? [],
        available: true,
        ...(form.type === "RENT_TO_OWN" && form.propertyValue
          ? { propertyValue: Number(form.propertyValue) } : {}),
        ...(form.type === "RENT_TO_OWN" && form.equityRate
          ? { equityRate: Number(form.equityRate) } : {}),
      };

      if (mode === "add") {
        await propertiesApi.create(payload);
      } else {
        await propertiesApi.update(property!.id, payload);
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to save property.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl z-10">
          <div>
            <h2 className="text-lg font-bold text-navy">
              {mode === "add" ? "Add Property" : "Edit Property"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {mode === "add" ? "Submitted for admin review before going live" : "Changes require admin re-approval"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {formError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" /> {formError}
            </div>
          )}

          <ImageUploadSection
            images={images}
            onAdd={(url) => setImages((prev) => [...prev, url])}
            onRemove={(i) => setImages((prev) => prev.filter((_, idx) => idx !== i))}
          />

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
              <select value={form.type} onChange={(e) => update("type", e.target.value as "RENT" | "RENT_TO_OWN")} className={inputCls}>
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
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {submitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {mode === "add" ? "Submit for Review" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete confirmation ────────────────────────────────────────────────────────
function DeleteConfirm({ property, onClose, onDeleted }: {
  property: Property; onClose: () => void; onDeleted: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const handle = async () => {
    setDeleting(true);
    try { await propertiesApi.delete(property.id); onDeleted(); onClose(); }
    catch { setDeleting(false); }
  };
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-navy text-center mb-1">Delete Property?</h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          "{property.title}" will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={handle} disabled={deleting}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60 flex items-center justify-center gap-2">
            {deleting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main dashboard ─────────────────────────────────────────────────────────────
export default function LandlordDashboard() {
  const { user } = useAuth();
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ mode: "add" | "edit"; property?: Property } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    propertiesApi.mine()
      .then(setMyProperties)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const approvedCount = myProperties.filter((p) => p.status === "APPROVED").length;
  const pendingCount = myProperties.filter((p) => p.status === "PENDING").length;

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
            <div className="flex items-center gap-2 shrink-0">
              <button className="relative p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setModal({ mode: "add" })}
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
            { label: "Total Listed", value: String(myProperties.length), icon: Building2, color: "text-primary bg-primary/10", sub: `${approvedCount} live` },
            { label: "Pending Review", value: String(pendingCount), icon: TrendingUp, color: "text-amber-600 bg-amber-50", sub: "Awaiting admin" },
            { label: "Active Tenants", value: "—", icon: Users, color: "text-blue-600 bg-blue-50", sub: "Active leases" },
            { label: "Monthly Revenue", value: "—", icon: DollarSign, color: "text-green-600 bg-green-50", sub: "Collected rent" },
          ].map((s) => (
            <div key={s.label} className="card">
              <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-navy">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
              <div className="text-xs text-gray-500 font-medium mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Properties */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-navy text-lg">My Properties</h2>
            <button onClick={load} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <RefreshCw className={clsx("w-4 h-4 text-gray-400", loading && "animate-spin")} />
            </button>
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
              <button onClick={() => setModal({ mode: "add" })}
                className="btn-primary !py-2 !px-5 text-sm inline-flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Property
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myProperties.map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                  {/* Thumbnail */}
                  <div className="w-16 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-6 h-6 text-gray-300" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy truncate">{p.title}</p>
                    <p className="text-xs text-gray-400 truncate">{p.location}</p>
                  </div>

                  {/* Price + status */}
                  <div className="text-right shrink-0 hidden sm:block">
                    <p className="text-sm font-bold text-navy">KES {p.price.toLocaleString()}/mo</p>
                    <span className={clsx(
                      "inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold",
                      p.status === "APPROVED" ? "bg-green-50 text-green-700" :
                      p.status === "REJECTED" ? "bg-red-50 text-red-600" :
                      "bg-amber-50 text-amber-700"
                    )}>
                      {p.status === "APPROVED" ? <CheckCircle2 className="w-3 h-3" /> :
                       p.status === "REJECTED" ? <XCircle className="w-3 h-3" /> :
                       <Clock className="w-3 h-3" />}
                      {p.status ? STATUS_LABELS[p.status] ?? p.status : "Unknown"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {p.status === "APPROVED" && (
                      <Link to={`/properties/${p.id}`}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-navy transition-colors"
                        title="View live listing">
                        <Eye className="w-4 h-4" />
                      </Link>
                    )}
                    <button
                      onClick={() => setModal({ mode: "edit", property: p })}
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit property"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(p)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete property"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending banner */}
        {pendingCount > 0 && (
          <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              <strong>{pendingCount}</strong> {pendingCount === 1 ? "property is" : "properties are"} awaiting admin review.
              Once approved, {pendingCount === 1 ? "it" : "they"} will appear on the Rentmo website.
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {modal && (
        <PropertyModal
          mode={modal.mode}
          property={modal.property}
          onClose={() => setModal(null)}
          onSaved={load}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          property={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={load}
        />
      )}
    </div>
  );
}
