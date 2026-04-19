import { useState, useEffect, useCallback } from "react";
import {
  Users, Building2, DollarSign, CreditCard,
  CheckCircle2, XCircle, Search, RefreshCw,
  Shield, Bell, MapPin,
} from "lucide-react";
import { admin, loans as loansApi, AdminUser, AdminLoan, AdminStats, AdminProperty } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { clsx } from "clsx";

type Tab = "overview" | "tenants" | "loans" | "properties";
type KycFilter = "ALL" | "PENDING" | "VERIFIED" | "REJECTED";
type LoanStatusFilter = "ALL" | "PENDING" | "APPROVED" | "DISBURSED" | "REJECTED" | "REPAID";
type PropStatusFilter = "ALL" | "PENDING" | "APPROVED" | "REJECTED";

const KYC_LABELS: Record<string, string> = { PENDING: "Pending", VERIFIED: "Verified", REJECTED: "Rejected" };
const LOAN_LABELS: Record<string, string> = { PENDING: "Pending", APPROVED: "Approved", DISBURSED: "Disbursed", REJECTED: "Rejected", REPAID: "Repaid" };

export default function AdminDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Tenants
  const [tenants, setTenants] = useState<AdminUser[]>([]);
  const [tenantsLoading, setTenantsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [kycFilter, setKycFilter] = useState<KycFilter>("ALL");

  // Loans
  const [loansList, setLoansList] = useState<AdminLoan[]>([]);
  const [loansLoading, setLoansLoading] = useState(false);
  const [loanFilter, setLoanFilter] = useState<LoanStatusFilter>("PENDING");

  // Properties
  const [propList, setPropList] = useState<AdminProperty[]>([]);
  const [propsLoading, setPropsLoading] = useState(false);
  const [propFilter, setPropFilter] = useState<PropStatusFilter>("PENDING");

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const refreshStats = useCallback(() => {
    admin.getStats().then(setStats).catch(() => {});
  }, []);

  useEffect(() => {
    setStatsLoading(true);
    admin.getStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, []);

  const loadTenants = useCallback(() => {
    setTenantsLoading(true);
    admin
      .getUsers({ role: "TENANT", search: search || undefined, limit: 100 })
      .then((u) => setTenants(u))
      .catch(() => {})
      .finally(() => setTenantsLoading(false));
  }, [search]);

  const loadLoans = useCallback(() => {
    setLoansLoading(true);
    admin
      .getLoans({ status: loanFilter !== "ALL" ? loanFilter : undefined, limit: 100 })
      .then((l) => setLoansList(l))
      .catch(() => {})
      .finally(() => setLoansLoading(false));
  }, [loanFilter]);

  const loadProperties = useCallback(() => {
    setPropsLoading(true);
    admin
      .getProperties({ status: propFilter !== "ALL" ? propFilter : undefined })
      .then((p) => setPropList(p))
      .catch(() => {})
      .finally(() => setPropsLoading(false));
  }, [propFilter]);

  // Overview: load pending tenants + loans + properties
  useEffect(() => {
    if (tab === "overview") {
      setTenantsLoading(true);
      admin.getUsers({ role: "TENANT", limit: 100 })
        .then(setTenants)
        .catch(() => {})
        .finally(() => setTenantsLoading(false));

      setLoansLoading(true);
      admin.getLoans({ status: "PENDING", limit: 100 })
        .then(setLoansList)
        .catch(() => {})
        .finally(() => setLoansLoading(false));

      setPropsLoading(true);
      admin.getProperties({ status: "PENDING" })
        .then(setPropList)
        .catch(() => {})
        .finally(() => setPropsLoading(false));
    }
  }, [tab]);

  useEffect(() => {
    if (tab === "tenants") loadTenants();
  }, [tab, loadTenants]);

  useEffect(() => {
    if (tab === "loans") loadLoans();
  }, [tab, loadLoans]);

  useEffect(() => {
    if (tab === "properties") loadProperties();
  }, [tab, loadProperties]);

  const handleKyc = async (userId: string, status: "VERIFIED" | "REJECTED") => {
    setActionLoading(userId + status);
    try {
      await admin.updateUser(userId, { kycStatus: status });
      setTenants((prev) => prev.map((u) => u.id === userId ? { ...u, kycStatus: status } : u));
      refreshStats();
    } catch {}
    setActionLoading(null);
  };

  const handleLoan = async (loanId: string, status: "APPROVED" | "REJECTED" | "DISBURSED") => {
    setActionLoading(loanId + status);
    try {
      await loansApi.updateStatus(loanId, { status });
      setLoansList((prev) => prev.map((l) => l.id === loanId ? { ...l, status } : l));
      refreshStats();
    } catch {}
    setActionLoading(null);
  };

  const handleProperty = async (propId: string, status: "APPROVED" | "REJECTED") => {
    setActionLoading(propId + status);
    try {
      await admin.updatePropertyStatus(propId, { status });
      setPropList((prev) => prev.map((p) => p.id === propId ? { ...p, status } : p));
      refreshStats();
    } catch {}
    setActionLoading(null);
  };

  const pendingTenants = tenants.filter((t) => t.kycStatus === "PENDING");
  const pendingLoans = loansList.filter((l) => l.status === "PENDING");
  const pendingProps = propList.filter((p) => p.status === "PENDING");

  const filteredTenants = tenants.filter((t) => {
    if (kycFilter !== "ALL" && t.kycStatus !== kycFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 page-content">
      {/* Header */}
      <div className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Admin Control Panel
              </p>
              <h1 className="text-xl sm:text-2xl font-bold mt-0.5">
                Welcome, {user?.name?.split(" ")[0]}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {(pendingTenants.length > 0 || (stats?.pendingLoans ?? 0) > 0) && (
                <div className="flex items-center gap-1.5 bg-primary/20 border border-primary/40 px-3 py-1.5 rounded-xl">
                  <Bell className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">
                    {pendingTenants.length + (stats?.pendingLoans ?? 0)} pending
                  </span>
                </div>
              )}
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center font-bold text-sm">
                {user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total Users",
              value: statsLoading ? "—" : (stats?.users.total ?? 0).toLocaleString(),
              sub: statsLoading ? "" : `${stats?.users.byRole.TENANT ?? 0} tenants · ${stats?.users.byRole.LANDLORD ?? 0} landlords`,
              icon: Users,
              color: "text-blue-600 bg-blue-50",
            },
            {
              label: "Properties",
              value: statsLoading ? "—" : (stats?.properties.total ?? 0).toLocaleString(),
              sub: statsLoading ? "" : `${stats?.properties.activeLeases ?? 0} active leases`,
              icon: Building2,
              color: "text-primary bg-primary/10",
            },
            {
              label: "Total Revenue",
              value: statsLoading ? "—" : `KES ${(((stats?.payments.totalAmountKES ?? 0)) / 1_000_000).toFixed(1)}M`,
              sub: statsLoading ? "" : `${stats?.payments.total ?? 0} payments`,
              icon: DollarSign,
              color: "text-green-600 bg-green-50",
            },
            {
              label: "Pending Loans",
              value: statsLoading ? "—" : (stats?.pendingLoans ?? 0).toString(),
              sub: statsLoading ? "" : `${stats?.pendingClaims ?? 0} pending insurance claims`,
              icon: CreditCard,
              color: "text-amber-600 bg-amber-50",
            },
          ].map((s) => (
            <div key={s.label} className="card">
              <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-navy">{s.value}</div>
              <div className="text-xs font-medium text-gray-500 mt-1">{s.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit flex-wrap">
          {(["overview", "tenants", "loans", "properties"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={clsx(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                tab === t ? "bg-white text-navy shadow-sm" : "text-gray-500 hover:text-navy"
              )}
            >
              {t === "tenants" ? (
                <span className="flex items-center gap-1.5">
                  Tenants
                  {pendingTenants.length > 0 && (
                    <span className="w-5 h-5 bg-primary text-white rounded-full text-xs flex items-center justify-center">
                      {pendingTenants.length}
                    </span>
                  )}
                </span>
              ) : t === "loans" ? (
                <span className="flex items-center gap-1.5">
                  Loan Applications
                  {(stats?.pendingLoans ?? 0) > 0 && (
                    <span className="w-5 h-5 bg-amber-500 text-white rounded-full text-xs flex items-center justify-center">
                      {stats?.pendingLoans}
                    </span>
                  )}
                </span>
              ) : t === "properties" ? (
                <span className="flex items-center gap-1.5">
                  Properties
                  {pendingProps.length > 0 && (
                    <span className="w-5 h-5 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center">
                      {pendingProps.length}
                    </span>
                  )}
                </span>
              ) : (
                "Overview"
              )}
            </button>
          ))}
        </div>

        {/* ── Overview ─────────────────────────────────────────────────── */}
        {tab === "overview" && (
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Pending tenant approvals */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-navy text-lg">Pending Tenant Approvals</h2>
                {pendingTenants.length > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
                    {pendingTenants.length} pending
                  </span>
                )}
              </div>

              {tenantsLoading ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
              ) : pendingTenants.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-green-400" />
                  <p className="text-sm">All tenants are reviewed</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingTenants.slice(0, 6).map((t) => (
                    <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className="w-9 h-9 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xs font-bold shrink-0">
                        {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-navy truncate">{t.name}</p>
                        <p className="text-xs text-gray-400 truncate">{t.email}</p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => handleKyc(t.id, "VERIFIED")}
                          disabled={actionLoading === t.id + "VERIFIED"}
                          className="px-2.5 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleKyc(t.id, "REJECTED")}
                          disabled={actionLoading === t.id + "REJECTED"}
                          className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                  {pendingTenants.length > 6 && (
                    <button onClick={() => setTab("tenants")} className="w-full text-center text-xs text-primary py-2 hover:underline">
                      View all {pendingTenants.length} pending tenants →
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Pending loan applications */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-navy text-lg">Pending Loan Applications</h2>
                {pendingLoans.length > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
                    {pendingLoans.length} pending
                  </span>
                )}
              </div>

              {loansLoading ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
              ) : pendingLoans.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-green-400" />
                  <p className="text-sm">No pending loan applications</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingLoans.slice(0, 6).map((loan) => (
                    <div key={loan.id} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className="w-9 h-9 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xs font-bold shrink-0">
                        {loan.tenant?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ?? "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-navy">{loan.tenant?.name}</p>
                        <p className="text-xs text-gray-500">
                          KES {loan.amount.toLocaleString()}
                          {loan.tenant?.creditScore?.score && (
                            <span className="ml-1.5 text-gray-400">· Score: {loan.tenant.creditScore.score}</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{loan.purpose}</p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => handleLoan(loan.id, "APPROVED")}
                          disabled={!!actionLoading}
                          className="px-2.5 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleLoan(loan.id, "REJECTED")}
                          disabled={!!actionLoading}
                          className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                  {pendingLoans.length > 6 && (
                    <button onClick={() => setTab("loans")} className="w-full text-center text-xs text-primary py-2 hover:underline">
                      View all {pendingLoans.length} pending loans →
                    </button>
                  )}
                </div>
              )}
            </div>
            {/* Pending property approvals */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-navy text-lg">Pending Properties</h2>
                {pendingProps.length > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                    {pendingProps.length} pending
                  </span>
                )}
              </div>

              {propsLoading ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
              ) : pendingProps.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-green-400" />
                  <p className="text-sm">No properties awaiting review</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingProps.slice(0, 5).map((p) => (
                    <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className="w-9 h-9 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-navy truncate">{p.title}</p>
                        <p className="text-xs text-gray-400 truncate">{p.owner?.name} · {p.neighborhood}</p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => handleProperty(p.id, "APPROVED")}
                          disabled={!!actionLoading}
                          className="px-2.5 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleProperty(p.id, "REJECTED")}
                          disabled={!!actionLoading}
                          className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                  {pendingProps.length > 5 && (
                    <button onClick={() => setTab("properties")} className="w-full text-center text-xs text-primary py-2 hover:underline">
                      View all {pendingProps.length} pending properties →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Tenants ──────────────────────────────────────────────────── */}
        {tab === "tenants" && (
          <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {(["ALL", "PENDING", "VERIFIED", "REJECTED"] as KycFilter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setKycFilter(f)}
                    className={clsx(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                      kycFilter === f ? "bg-navy text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {f === "ALL" ? "All" : KYC_LABELS[f]}
                    {f === "PENDING" && pendingTenants.length > 0 && ` (${pendingTenants.length})`}
                  </button>
                ))}
              </div>
              <button
                onClick={loadTenants}
                className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shrink-0"
                title="Refresh"
              >
                <RefreshCw className={clsx("w-4 h-4 text-gray-400", tenantsLoading && "animate-spin")} />
              </button>
            </div>

            {tenantsLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : filteredTenants.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No tenants found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {["Tenant", "Phone", "KYC Status", "Leases", "Joined", "Actions"].map((h) => (
                        <th key={h} className="text-left text-xs font-medium text-gray-400 pb-3 pr-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredTenants.map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-xs font-bold shrink-0">
                              {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-navy">{t.name}</p>
                              <p className="text-xs text-gray-400">{t.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-gray-500">{t.phone || "—"}</td>
                        <td className="py-3 pr-4">
                          <span className={clsx(
                            "px-2.5 py-1 rounded-full text-xs font-semibold",
                            t.kycStatus === "VERIFIED" ? "bg-green-50 text-green-700" :
                            t.kycStatus === "REJECTED" ? "bg-red-50 text-red-600" :
                            "bg-amber-50 text-amber-700"
                          )}>
                            {KYC_LABELS[t.kycStatus]}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-gray-500">{t._count?.leases ?? 0}</td>
                        <td className="py-3 pr-4 text-gray-400 text-xs whitespace-nowrap">
                          {new Date(t.createdAt).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="py-3">
                          {t.kycStatus === "PENDING" ? (
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => handleKyc(t.id, "VERIFIED")}
                                disabled={actionLoading === t.id + "VERIFIED"}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-xs font-medium transition-colors disabled:opacity-50"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                              </button>
                              <button
                                onClick={() => handleKyc(t.id, "REJECTED")}
                                disabled={actionLoading === t.id + "REJECTED"}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium transition-colors disabled:opacity-50"
                              >
                                <XCircle className="w-3.5 h-3.5" /> Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Loan Applications ────────────────────────────────────────── */}
        {tab === "loans" && (
          <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
              <h2 className="font-bold text-navy text-lg flex-1">Loan Applications</h2>
              <div className="flex gap-1.5 flex-wrap">
                {(["ALL", "PENDING", "APPROVED", "DISBURSED", "REJECTED", "REPAID"] as LoanStatusFilter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setLoanFilter(f)}
                    className={clsx(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                      loanFilter === f ? "bg-navy text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {f === "ALL" ? "All" : LOAN_LABELS[f]}
                  </button>
                ))}
              </div>
              <button
                onClick={loadLoans}
                className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shrink-0"
                title="Refresh"
              >
                <RefreshCw className={clsx("w-4 h-4 text-gray-400", loansLoading && "animate-spin")} />
              </button>
            </div>

            {loansLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : loansList.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No loan applications found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {["Applicant", "Amount", "Purpose", "Credit Score", "Status", "Applied", "Actions"].map((h) => (
                        <th key={h} className="text-left text-xs font-medium text-gray-400 pb-3 pr-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loansList.map((loan) => (
                      <tr key={loan.id} className="hover:bg-gray-50">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center text-xs font-bold shrink-0">
                              {loan.tenant?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ?? "?"}
                            </div>
                            <div>
                              <p className="font-medium text-navy">{loan.tenant?.name}</p>
                              <p className="text-xs text-gray-400">{loan.tenant?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <p className="font-semibold text-navy">KES {loan.amount.toLocaleString()}</p>
                          {loan.monthlyRepayment && (
                            <p className="text-xs text-gray-400">{loan.monthlyRepayment.toLocaleString()}/mo</p>
                          )}
                        </td>
                        <td className="py-3 pr-4 text-gray-600 max-w-[160px]">
                          <span className="line-clamp-2">{loan.purpose}</span>
                        </td>
                        <td className="py-3 pr-4">
                          {loan.tenant?.creditScore?.score != null ? (
                            <span className={clsx(
                              "font-semibold",
                              loan.tenant.creditScore.score >= 700 ? "text-green-600" :
                              loan.tenant.creditScore.score >= 600 ? "text-amber-600" : "text-red-500"
                            )}>
                              {loan.tenant.creditScore.score}
                            </span>
                          ) : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="py-3 pr-4">
                          <span className={clsx(
                            "px-2.5 py-1 rounded-full text-xs font-semibold",
                            loan.status === "APPROVED" ? "bg-green-50 text-green-700" :
                            loan.status === "DISBURSED" ? "bg-blue-50 text-blue-700" :
                            loan.status === "REJECTED" ? "bg-red-50 text-red-600" :
                            loan.status === "REPAID" ? "bg-gray-100 text-gray-600" :
                            "bg-amber-50 text-amber-700"
                          )}>
                            {LOAN_LABELS[loan.status]}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-gray-400 text-xs whitespace-nowrap">
                          {new Date(loan.createdAt).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="py-3">
                          {loan.status === "PENDING" ? (
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => handleLoan(loan.id, "APPROVED")}
                                disabled={!!actionLoading}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-xs font-medium transition-colors disabled:opacity-50"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                              </button>
                              <button
                                onClick={() => handleLoan(loan.id, "REJECTED")}
                                disabled={!!actionLoading}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium transition-colors disabled:opacity-50"
                              >
                                <XCircle className="w-3.5 h-3.5" /> Reject
                              </button>
                            </div>
                          ) : loan.status === "APPROVED" ? (
                            <button
                              onClick={() => handleLoan(loan.id, "DISBURSED")}
                              disabled={!!actionLoading}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium transition-colors disabled:opacity-50"
                            >
                              Mark Disbursed
                            </button>
                          ) : (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {/* ── Properties ──────────────────────────────────────────────── */}
        {tab === "properties" && (
          <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
              <h2 className="font-bold text-navy text-lg flex-1">Property Listings</h2>
              <div className="flex gap-1.5 flex-wrap">
                {(["ALL", "PENDING", "APPROVED", "REJECTED"] as PropStatusFilter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setPropFilter(f)}
                    className={clsx(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                      propFilter === f ? "bg-navy text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
                    {f === "PENDING" && pendingProps.length > 0 && ` (${pendingProps.length})`}
                  </button>
                ))}
              </div>
              <button
                onClick={loadProperties}
                className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shrink-0"
                title="Refresh"
              >
                <RefreshCw className={clsx("w-4 h-4 text-gray-400", propsLoading && "animate-spin")} />
              </button>
            </div>

            {propsLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : propList.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No properties found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {propList.map((p) => (
                  <div key={p.id} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-navy">{p.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{p.location} · {p.neighborhood}</p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-xs text-gray-500">
                          {p.bedrooms}BR · {p.bathrooms}BA · KES {p.price.toLocaleString()}/mo
                        </span>
                        <span className="text-xs text-gray-400">by {p.owner?.name}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={clsx(
                        "px-2.5 py-1 rounded-full text-xs font-semibold",
                        p.status === "APPROVED" ? "bg-green-50 text-green-700" :
                        p.status === "REJECTED" ? "bg-red-50 text-red-600" :
                        "bg-amber-50 text-amber-700"
                      )}>
                        {p.status.charAt(0) + p.status.slice(1).toLowerCase()}
                      </span>
                      {p.status === "PENDING" && (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleProperty(p.id, "APPROVED")}
                            disabled={!!actionLoading}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-xs font-medium transition-colors disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleProperty(p.id, "REJECTED")}
                            disabled={!!actionLoading}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium transition-colors disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
