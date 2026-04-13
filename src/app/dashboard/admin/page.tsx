import { Link } from "react-router-dom";
import { Users, Building2, DollarSign, TrendingUp, Bell, Shield, AlertCircle, CheckCircle2, ChevronRight, Search, MoreVertical, ArrowUpRight } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const userGrowth = [
  { month: "Oct", tenants: 6200, landlords: 520 }, { month: "Nov", tenants: 6800, landlords: 560 },
  { month: "Dec", tenants: 7200, landlords: 590 }, { month: "Jan", tenants: 7700, landlords: 620 },
  { month: "Feb", tenants: 8100, landlords: 650 }, { month: "Mar", tenants: 8500, landlords: 680 },
];
const revenueFlow = [
  { month: "Oct", revenue: 12.4 }, { month: "Nov", revenue: 14.1 }, { month: "Dec", revenue: 15.8 },
  { month: "Jan", revenue: 17.2 }, { month: "Feb", revenue: 19.5 }, { month: "Mar", revenue: 21.3 },
];
const loanStatusData = [
  { name: "Approved", value: 45, color: "#22c55e" }, { name: "Pending", value: 28, color: "#f59e0b" },
  { name: "Rejected", value: 12, color: "#ef4444" }, { name: "Paid", value: 15, color: "#3b82f6" },
];
const pendingActions = [
  { id: 1, type: "Listing Approval", title: "5BR Villa – Muthaiga", user: "Peter Otieno", time: "2h ago", icon: Building2, color: "text-blue-500 bg-blue-50" },
  { id: 2, type: "Loan Application", title: "KES 50,000 – Rent Loan", user: "Susan Njeri", time: "4h ago", icon: DollarSign, color: "text-green-500 bg-green-50" },
  { id: 3, type: "Loan Application", title: "KES 85,000 – Rent Loan", user: "David Mwangi", time: "5h ago", icon: DollarSign, color: "text-green-500 bg-green-50" },
  { id: 4, type: "Insurance Claim", title: "Claim #2089 – Basic Plan", user: "Mary Wambui", time: "1d ago", icon: Shield, color: "text-purple-500 bg-purple-50" },
];
const recentUsers = [
  { name: "James Kamau", role: "Tenant", location: "Kilimani", score: 720, joined: "Today" },
  { name: "Grace Wanjiku", role: "Landlord", location: "Westlands", score: null, joined: "Today" },
  { name: "Susan Njeri", role: "Tenant", location: "Lavington", score: 640, joined: "Yesterday" },
  { name: "Peter Otieno", role: "Landlord", location: "Karen", score: null, joined: "2 days ago" },
  { name: "Fatima Ali", role: "Tenant", location: "Parklands", score: 695, joined: "3 days ago" },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-400 text-sm">Admin Control Panel</p><h1 className="text-2xl font-bold">Rentmo Admin 🛡️</h1></div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search users, properties..." className="pl-9 pr-4 py-2 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-xl text-sm outline-none focus:bg-white/20 transition-colors w-56" />
              </div>
              <button className="relative p-2 rounded-xl border border-white/20 hover:bg-white/10 transition-colors">
                <Bell className="w-5 h-5 text-white" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </button>
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center font-bold text-sm">AD</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { label: "Total Users", value: "9,180", icon: Users, color: "text-blue-600 bg-blue-50", trend: "+12% MoM" },
            { label: "Active Listings", value: "2,416", icon: Building2, color: "text-primary bg-primary/10", trend: "+8% MoM" },
            { label: "Monthly Revenue", value: "KES 21.3M", icon: DollarSign, color: "text-green-600 bg-green-50", trend: "+9.2% MoM" },
            { label: "Avg Credit Score", value: "672", icon: TrendingUp, color: "text-purple-600 bg-purple-50", trend: "+14 pts avg" },
          ].map((stat) => (
            <div key={stat.label} className="card">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}><stat.icon className="w-5 h-5" /></div>
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-navy">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
              <div className="text-xs text-green-600 font-medium mt-1">{stat.trend}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-navy text-lg">Platform Revenue (KES Millions)</h2>
                <span className="badge-green flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +72% YoY</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={revenueFlow}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1a2332" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#1a2332" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}M`} />
                  <Tooltip formatter={(v) => [`KES ${v}M`, "Revenue"]} />
                  <Area type="monotone" dataKey="revenue" stroke="#1a2332" strokeWidth={2.5} fill="url(#revGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-navy text-lg">User Growth</h2>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-primary rounded inline-block" />Tenants</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-navy rounded inline-block" />Landlords</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="tenants" stroke="#E63946" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="landlords" stroke="#1a2332" strokeWidth={2} dot={false} strokeDasharray="4 2" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-navy text-lg">Recent Registrations</h2>
                <Link to="#" className="text-xs text-primary flex items-center gap-1 hover:underline">View All <ChevronRight className="w-3 h-3" /></Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {["User", "Role", "Location", "Credit", "Joined", ""].map((h) => (
                        <th key={h} className="text-left text-xs font-medium text-gray-400 pb-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentUsers.map((u) => (
                      <tr key={u.name} className="hover:bg-gray-50">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-xs font-bold">{u.name.split(" ").map((n) => n[0]).join("")}</div>
                            <span className="font-medium text-navy">{u.name}</span>
                          </div>
                        </td>
                        <td className="py-3"><span className={u.role === "Tenant" ? "badge-blue" : "badge-green"}>{u.role}</span></td>
                        <td className="py-3 text-gray-500">{u.location}</td>
                        <td className="py-3">{u.score != null ? <span className="font-medium text-navy">{u.score}</span> : <span className="text-gray-300">—</span>}</td>
                        <td className="py-3 text-gray-400 text-xs">{u.joined}</td>
                        <td className="py-3"><button className="text-gray-300 hover:text-gray-600 transition-colors"><MoreVertical className="w-4 h-4" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h2 className="font-bold text-navy text-lg mb-5">Loan Portfolio</h2>
              <div className="flex justify-center mb-4">
                <PieChart width={160} height={160}>
                  <Pie data={loanStatusData} cx={75} cy={75} innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                    {loanStatusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </div>
              <div className="space-y-2">
                {loanStatusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} /><span className="text-gray-600">{item.name}</span></div>
                    <span className="font-semibold text-navy">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-navy text-lg">Pending Actions</h2>
                <span className="badge-yellow">{pendingActions.length}</span>
              </div>
              <div className="space-y-3">
                {pendingActions.map((action) => (
                  <div key={action.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100 hover:border-gray-200">
                    <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center shrink-0`}><action.icon className="w-4 h-4" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{action.type}</p>
                      <p className="text-sm font-medium text-navy leading-snug mt-0.5">{action.title}</p>
                      <p className="text-xs text-gray-400">{action.user} · {action.time}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button className="p-1 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"><CheckCircle2 className="w-4 h-4" /></button>
                      <button className="p-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-100"><AlertCircle className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-green-50 border border-green-100">
              <div className="flex items-center gap-2 mb-3"><div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" /><h2 className="font-bold text-green-800">System Healthy</h2></div>
              <div className="space-y-2">
                {[["API Response", "98ms"], ["M-Pesa Gateway", "Online"], ["Card Payments", "Online"], ["SMS Service", "Online"]].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-xs">
                    <span className="text-green-700">{label}</span>
                    <span className="text-green-600 font-medium">{value}</span>
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
