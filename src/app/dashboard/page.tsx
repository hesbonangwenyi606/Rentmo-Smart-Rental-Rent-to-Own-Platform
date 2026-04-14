import { Link } from "react-router-dom";
import { Home, TrendingUp, Bell, Calendar, ChevronRight, AlertCircle, CheckCircle2, Clock, ArrowUpRight, Banknote, Shield, Star, MapPin, CreditCard } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const paymentHistory = [
  { month: "Oct", amount: 85000 }, { month: "Nov", amount: 85000 }, { month: "Dec", amount: 85000 },
  { month: "Jan", amount: 85000 }, { month: "Feb", amount: 85000 }, { month: "Mar", amount: 85000 },
];
const creditHistory = [
  { month: "Oct", score: 640 }, { month: "Nov", score: 655 }, { month: "Dec", score: 670 },
  { month: "Jan", score: 690 }, { month: "Feb", score: 705 }, { month: "Mar", score: 720 },
];
const notifications = [
  { id: 1, title: "Rent due in 5 days", desc: "KES 85,000 due on April 18, 2026", time: "2h ago", icon: AlertCircle, color: "text-yellow-500 bg-yellow-50" },
  { id: 2, title: "Credit score updated", desc: "Your score increased by 15 points to 720", time: "1d ago", icon: TrendingUp, color: "text-green-500 bg-green-50" },
  { id: 3, title: "Lease renewal coming up", desc: "Your lease expires in 45 days", time: "2d ago", icon: Calendar, color: "text-blue-500 bg-blue-50" },
];
const quickActions = [
  { label: "Pay Rent", icon: CreditCard, href: "/payments", color: "bg-primary/10 text-primary" },
  { label: "Apply for Loan", icon: Banknote, href: "/loans", color: "bg-blue-50 text-blue-600" },
  { label: "View Credit", icon: TrendingUp, href: "/credit-score", color: "bg-green-50 text-green-600" },
  { label: "Insurance", icon: Shield, href: "/insurance", color: "bg-purple-50 text-purple-600" },
];

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
  return (
    <div className="min-h-screen bg-gray-50 page-content">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-500">Good morning,</p>
              <h1 className="text-xl sm:text-2xl font-bold text-navy truncate">James Kamau 👋</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button className="relative p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </button>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm">JK</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { label: "Credit Score", value: "720", sub: "+15 this month", icon: TrendingUp, color: "text-green-500 bg-green-50" },
            { label: "Monthly Rent", value: "KES 85K", sub: "Due Apr 18, 2026", icon: Home, color: "text-primary bg-primary/10" },
            { label: "Equity Built", value: "34%", sub: "KES 1.07M total", icon: Star, color: "text-purple-500 bg-purple-50" },
            { label: "Active Loan", value: "None", sub: "Good standing", icon: Banknote, color: "text-blue-500 bg-blue-50" },
          ].map((stat) => (
            <div key={stat.label} className="card">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}><stat.icon className="w-5 h-5" /></div>
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
            <div className="card">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-navy text-lg">Active Rental</h2>
                <Link to="/properties/1" className="text-xs text-primary flex items-center gap-1 hover:underline">View Details <ChevronRight className="w-3 h-3" /></Link>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&q=60" alt="Property" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-navy">Modern 3BR Apartment</h3>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1"><MapPin className="w-3.5 h-3.5 text-primary" />Kilimani, Nairobi</div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div><p className="text-xs text-gray-400">Lease Period</p><p className="text-sm font-medium text-navy">Apr 2025 – Apr 2026</p></div>
                    <div><p className="text-xs text-gray-400">Property Type</p><span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">Rent-to-Own</span></div>
                    <div><p className="text-xs text-gray-400">Monthly Rent</p><p className="text-sm font-bold text-navy">KES 85,000</p></div>
                    <div><p className="text-xs text-gray-400">Payment Status</p><span className="badge-green">Paid</span></div>
                  </div>
                </div>
              </div>
              <div className="mt-5 pt-5 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-navy">Ownership Progress</span>
                  <span className="text-primary font-bold">34% / 100%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-orange-400 h-full rounded-full" style={{ width: "34%" }} />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">~6.3 years remaining at current payment rate</p>
              </div>
            </div>

            {/* Payment History */}
            <div className="card">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-navy text-lg">Payment History</h2>
                <span className="badge-green flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> 6 months on time</span>
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

            {/* Credit Score Chart */}
            <div className="card">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-navy text-lg">Credit Score Growth</h2>
                <Link to="/credit-score" className="text-xs text-primary flex items-center gap-1 hover:underline">Full Report <ChevronRight className="w-3 h-3" /></Link>
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
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div className="card text-center">
              <h2 className="font-bold text-navy text-lg mb-5">Credit Score</h2>
              <ScoreGauge score={720} />
              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                {[{ v: "24", l: "Months" }, { v: "100%", l: "On Time", cls: "text-green-500" }, { v: "+80", l: "Points" }].map((s) => (
                  <div key={s.l} className="bg-gray-50 rounded-xl p-3">
                    <p className={`text-lg font-bold text-navy ${s.cls || ""}`}>{s.v}</p>
                    <p className="text-xs text-gray-400">{s.l}</p>
                  </div>
                ))}
              </div>
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
                <span className="badge-red">3 new</span>
              </div>
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className={`w-8 h-8 rounded-lg ${n.color} flex items-center justify-center shrink-0`}><n.icon className="w-4 h-4" /></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-navy leading-snug">{n.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-snug">{n.desc}</p>
                      <div className="flex items-center gap-1 mt-1"><Clock className="w-3 h-3 text-gray-300" /><span className="text-xs text-gray-400">{n.time}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
