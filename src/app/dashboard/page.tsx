import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  users as usersApi,
  notifications as notificationsApi,
  Notification,
} from "@/lib/api";
import {
  Home, TrendingUp, Bell, Calendar, ChevronRight, AlertCircle, CheckCircle2,
  Clock, ArrowUpRight, Banknote, Shield, Star, MapPin, CreditCard,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";

interface DashboardProperty {
  id: string;
  title: string;
  location: string;
  type: string;
  images: string[];
  propertyValue?: number;
}

interface DashboardLease {
  id: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  equityBuilt: number;
  status: string;
  property: DashboardProperty;
  payments: { id: string; amount: number; status: string; createdAt: string }[];
}

interface DashboardData {
  user: { id: string; name: string; email: string; role: string };
  activeLease: DashboardLease | null;
  recentPayments: { id: string; amount: number; method: string; status: string; createdAt: string }[];
  unreadNotifications: number;
  creditScore: {
    score: number;
    label: string;
    history: { month: string; year: number; score: number }[];
    stats: { totalPayments: number; onTimePayments: number; onTimePercent: number };
  } | null;
}

const quickActions = [
  { label: "Pay Rent", icon: CreditCard, href: "/payments", color: "bg-primary/10 text-primary" },
  { label: "Apply for Loan", icon: Banknote, href: "/loans", color: "bg-blue-50 text-blue-600" },
  { label: "View Credit", icon: TrendingUp, href: "/credit-score", color: "bg-green-50 text-green-600" },
  { label: "Insurance", icon: Shield, href: "/insurance", color: "bg-purple-50 text-purple-600" },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function notifStyle(type: string) {
  if (type === "warning") return { icon: AlertCircle, color: "text-yellow-500 bg-yellow-50" };
  if (type === "success") return { icon: CheckCircle2, color: "text-green-500 bg-green-50" };
  if (type === "error") return { icon: AlertCircle, color: "text-red-500 bg-red-50" };
  return { icon: Calendar, color: "text-blue-500 bg-blue-50" };
}

function ScoreGauge({ score }: { score: number }) {
  const pct = ((score - 300) / 550) * 100;
  const color = score >= 700 ? "#22c55e" : score >= 600 ? "#f59e0b" : "#ef4444";
  const label = score >= 750 ? "Excellent" : score >= 700 ? "Good" : score >= 650 ? "Fair" : "Needs Work";
  return (
    <div className="flex flex-col items-center">
      <div className="text-4xl sm:text-5xl font-black text-navy mb-1">{score}</div>
      <div className="text-sm font-semibold mb-3" style={{ color }}>{label}</div>
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <div className="flex justify-between w-full text-xs text-gray-400 mt-1"><span>300</span><span>850</span></div>
    </div>
  );
}

export default function TenantDashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      usersApi.getDashboard() as Promise<DashboardData>,
      notificationsApi.list().catch(() => [] as Notification[]),
    ]).then(([dash, notifList]) => {
      setDashboard(dash);
      setNotifs(notifList.slice(0, 3));
    }).finally(() => setLoading(false));
  }, []);

  const firstName = (user?.name ?? "").split(" ")[0] || "there";
  const initials = (user?.name ?? "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const score = dashboard?.creditScore?.score ?? 0;
  const creditStats = dashboard?.creditScore?.stats;
  const activeLease = dashboard?.activeLease ?? null;
  const monthlyRent = activeLease?.monthlyRent ?? 0;
  const equityPct = activeLease?.equityBuilt ?? 0;
  const unreadCount = dashboard?.unreadNotifications ?? notifs.filter((n) => !n.read).length;

  const creditHistory = (dashboard?.creditScore?.history ?? [])
    .slice(-6)
    .map((h) => ({ month: h.month.slice(0, 3), score: h.score }));

  const paymentSource = activeLease?.payments?.length
    ? activeLease.payments
    : (dashboard?.recentPayments ?? []);
  const paymentHistory = paymentSource.slice(0, 6).map((p) => ({
    month: MONTHS[new Date(p.createdAt).getMonth()],
    amount: p.amount,
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 page-content">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-500">Good morning,</p>
              <h1 className="text-xl sm:text-2xl font-bold text-navy truncate">{firstName} 👋</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button className="relative p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                )}
              </button>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm">
                {initials}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            {
              label: "Credit Score",
              value: score > 0 ? String(score) : "—",
              sub: score > 0 ? (score >= 700 ? "Good standing" : "Keep improving") : "Not yet built",
              icon: TrendingUp,
              color: "text-green-500 bg-green-50",
            },
            {
              label: "Monthly Rent",
              value: activeLease ? `KES ${(monthlyRent / 1000).toFixed(0)}K` : "—",
              sub: activeLease ? `KES ${monthlyRent.toLocaleString()}/mo` : "No active lease",
              icon: Home,
              color: "text-primary bg-primary/10",
            },
            {
              label: "Equity Built",
              value: activeLease ? `${equityPct}%` : "—",
              sub: activeLease?.property.propertyValue
                ? `KES ${((equityPct / 100) * activeLease.property.propertyValue / 1_000_000).toFixed(1)}M total`
                : "Rent-to-own only",
              icon: Star,
              color: "text-purple-500 bg-purple-50",
            },
            {
              label: "Active Loan",
              value: "None",
              sub: "Good standing",
              icon: Banknote,
              color: "text-blue-500 bg-blue-50",
            },
          ].map((stat) => (
            <div key={stat.label} className="card">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-navy">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1 truncate">{stat.label}</div>
              <div className="text-xs text-green-600 font-medium mt-1 truncate">{stat.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Rental */}
            {activeLease ? (
              <div className="card">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-navy text-lg">Active Rental</h2>
                  <Link to={`/properties/${activeLease.property.id}`} className="text-xs text-primary flex items-center gap-1 hover:underline">
                    View Details <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                    <img
                      src={activeLease.property.images[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&q=60"}
                      alt="Property"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-navy">{activeLease.property.title}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {activeLease.property.location}
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <p className="text-xs text-gray-400">Lease Period</p>
                        <p className="text-sm font-medium text-navy">
                          {new Date(activeLease.startDate).toLocaleDateString("en-KE", { month: "short", year: "numeric" })} –{" "}
                          {new Date(activeLease.endDate).toLocaleDateString("en-KE", { month: "short", year: "numeric" })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Property Type</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          activeLease.property.type === "RENT_TO_OWN" ? "bg-primary/10 text-primary" : "bg-navy/10 text-navy"
                        }`}>
                          {activeLease.property.type === "RENT_TO_OWN" ? "Rent-to-Own" : "For Rent"}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Monthly Rent</p>
                        <p className="text-sm font-bold text-navy">KES {monthlyRent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Lease Status</p>
                        <span className="badge-green">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
                {activeLease.property.type === "RENT_TO_OWN" && equityPct > 0 && (
                  <div className="mt-5 pt-5 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium text-navy">Ownership Progress</span>
                      <span className="text-primary font-bold">{equityPct}% / 100%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-primary to-orange-400 h-full rounded-full" style={{ width: `${equityPct}%` }} />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="card text-center py-10">
                <div className="text-5xl mb-3">🏠</div>
                <h3 className="font-bold text-navy mb-1">No Active Rental</h3>
                <p className="text-sm text-gray-400 mb-4">Browse properties to find your perfect home.</p>
                <Link to="/properties" className="btn-primary inline-block">Browse Properties</Link>
              </div>
            )}

            {/* Payment History */}
            {paymentHistory.length > 0 && (
              <div className="card">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-navy text-lg">Payment History</h2>
                  <span className="badge-green flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {paymentHistory.length} months on time
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={paymentHistory} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                    <Tooltip formatter={(v) => [`KES ${Number(v).toLocaleString()}`, "Amount"]} />
                    <Bar dataKey="amount" fill="#E63946" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Credit Score Chart */}
            {creditHistory.length > 0 && (
              <div className="card">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-navy text-lg">Credit Score Growth</h2>
                  <Link to="/credit-score" className="text-xs text-primary flex items-center gap-1 hover:underline">
                    Full Report <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={creditHistory}>
                    <defs>
                      <linearGradient id="creditGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E63946" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#E63946" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[600, 800]} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="score" stroke="#E63946" strokeWidth={2.5} fill="url(#creditGrad)" dot={{ r: 4, fill: "#E63946" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div className="card text-center">
              <h2 className="font-bold text-navy text-lg mb-5">Credit Score</h2>
              {score > 0 ? (
                <>
                  <ScoreGauge score={score} />
                  <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                    {[
                      { v: String(creditStats?.totalPayments ?? 0), l: "Payments" },
                      { v: `${creditStats?.onTimePercent ?? 0}%`, l: "On Time", cls: "text-green-500" },
                      { v: score > 300 ? `+${score - 300}` : "0", l: "Points" },
                    ].map((s) => (
                      <div key={s.l} className="bg-gray-50 rounded-xl p-3">
                        <p className={`text-lg font-bold text-navy ${s.cls ?? ""}`}>{s.v}</p>
                        <p className="text-xs text-gray-400">{s.l}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-400 py-6">Make your first payment to build your score.</p>
              )}
              <Link to="/credit-score" className="btn-outline w-full mt-4 !py-2.5 !text-sm text-center block">View Full Report</Link>
            </div>

            <div className="card">
              <h2 className="font-bold text-navy text-lg mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Link key={action.label} to={action.href} className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100 hover:border-gray-200">
                    <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center`}><action.icon className="w-5 h-5" /></div>
                    <span className="text-xs font-medium text-navy text-center">{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-navy text-lg">Notifications</h2>
                {unreadCount > 0 && <span className="badge-red">{unreadCount} new</span>}
              </div>
              {notifs.length > 0 ? (
                <div className="space-y-3">
                  {notifs.map((n) => {
                    const { icon: Icon, color } = notifStyle(n.type);
                    return (
                      <div key={n.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center shrink-0`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-navy leading-snug">{n.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5 leading-snug">{n.message}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 text-gray-300" />
                            <span className="text-xs text-gray-400">{timeAgo(n.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">You're all caught up!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
