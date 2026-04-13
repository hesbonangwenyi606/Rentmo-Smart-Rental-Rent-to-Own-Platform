import { Link } from "react-router-dom";
import { Bell, Building2, Users, TrendingUp, DollarSign, Plus, ChevronRight, CheckCircle2, Clock, AlertCircle, MapPin, Eye } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const revenueData = [
  { month: "Oct", revenue: 340000 }, { month: "Nov", revenue: 340000 }, { month: "Dec", revenue: 340000 },
  { month: "Jan", revenue: 425000 }, { month: "Feb", revenue: 425000 }, { month: "Mar", revenue: 425000 },
];
const myProperties = [
  { id: "1", title: "Modern 3BR – Kilimani", rent: 85000, tenant: "James Kamau", status: "occupied", paymentStatus: "paid", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&q=60" },
  { id: "2", title: "Cozy 2BR – Westlands", rent: 65000, tenant: "Amara Ochieng", status: "occupied", paymentStatus: "pending", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&q=60" },
  { id: "3", title: "Studio – Lavington", rent: 28000, tenant: "Vacant", status: "vacant", paymentStatus: "n/a", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200&q=60" },
  { id: "4", title: "3BR Townhouse – Parklands", rent: 75000, tenant: "Fatima Ali", status: "occupied", paymentStatus: "paid", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200&q=60" },
];
const recentActivity = [
  { id: 1, icon: CheckCircle2, color: "text-green-500 bg-green-50", title: "Rent received", desc: "James Kamau paid KES 85,000 via M-Pesa", time: "Today, 9:14 AM" },
  { id: 2, icon: Clock, color: "text-yellow-500 bg-yellow-50", title: "Payment overdue", desc: "Amara Ochieng – KES 65,000 overdue by 3 days", time: "3 days ago" },
  { id: 3, icon: AlertCircle, color: "text-blue-500 bg-blue-50", title: "Lease renewal", desc: "Fatima Ali's lease expires in 30 days", time: "Yesterday" },
  { id: 4, icon: Users, color: "text-purple-500 bg-purple-50", title: "New inquiry", desc: "New tenant interested in Studio – Lavington", time: "2 days ago" },
];

export default function LandlordDashboard() {
  const occupancyRate = Math.round((myProperties.filter((p) => p.status === "occupied").length / myProperties.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Landlord Dashboard</p><h1 className="text-2xl font-bold text-navy">Grace Wanjiku 🏡</h1></div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </button>
              <button className="btn-primary !py-2 !px-4 flex items-center gap-2 text-sm">
                <Plus className="w-4 h-4" />Add Property
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { label: "Total Properties", value: "4", icon: Building2, color: "text-primary bg-primary/10", sub: "+1 this year" },
            { label: "Active Tenants", value: "3", icon: Users, color: "text-blue-600 bg-blue-50", sub: "1 unit vacant" },
            { label: "Monthly Revenue", value: "KES 425K", icon: DollarSign, color: "text-green-600 bg-green-50", sub: "+25% vs last year" },
            { label: "Occupancy Rate", value: `${occupancyRate}%`, icon: TrendingUp, color: "text-purple-600 bg-purple-50", sub: "Industry avg: 78%" },
          ].map((stat) => (
            <div key={stat.label} className="card">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}><stat.icon className="w-5 h-5" /></div>
              <div className="text-2xl font-bold text-navy">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
              <div className="text-xs text-green-600 font-medium mt-1">{stat.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="flex items-center justify-between mb-5">
                <div><h2 className="font-bold text-navy text-lg">Revenue Overview</h2><p className="text-xs text-gray-400 mt-0.5">Monthly rental income collected</p></div>
                <div className="text-right"><p className="text-2xl font-bold text-navy">KES 425K</p><p className="text-xs text-green-600">This month</p></div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={revenueData} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                  <Tooltip formatter={(v) => [`KES ${Number(v).toLocaleString()}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="#1a2332" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-navy text-lg">My Properties</h2>
                <Link to="/properties" className="text-xs text-primary flex items-center gap-1 hover:underline">Manage All <ChevronRight className="w-3 h-3" /></Link>
              </div>
              <div className="space-y-4">
                {myProperties.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-navy truncate">{p.title}</p>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5"><Users className="w-3 h-3" />{p.tenant}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-navy">KES {p.rent.toLocaleString()}</p>
                      <span className={p.paymentStatus === "paid" ? "badge-green" : p.paymentStatus === "pending" ? "badge-yellow" : "badge-blue"}>
                        {p.paymentStatus === "n/a" ? "Vacant" : p.paymentStatus}
                      </span>
                    </div>
                    <Link to={`/properties/${p.id}`} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-navy transition-colors"><Eye className="w-4 h-4" /></Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card bg-navy text-white">
              <h2 className="font-bold text-lg mb-4">This Month</h2>
              <div className="space-y-3">
                {[["Expected Revenue", "KES 425,000", "text-white"], ["Collected", "KES 360,000", "text-green-400"], ["Outstanding", "KES 65,000", "text-yellow-400"]].map(([l, v, cls]) => (
                  <div key={l} className="flex justify-between"><span className="text-gray-400 text-sm">{l}</span><span className={`font-semibold ${cls}`}>{v}</span></div>
                ))}
                <div className="h-px bg-white/10 my-1" />
                <div className="flex justify-between"><span className="text-gray-400 text-sm">Collection Rate</span><span className="font-bold text-primary">84.7%</span></div>
              </div>
              <div className="mt-4"><div className="w-full bg-white/10 rounded-full h-2"><div className="bg-primary h-2 rounded-full" style={{ width: "84.7%" }} /></div></div>
            </div>

            <div className="card">
              <h2 className="font-bold text-navy text-lg mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {recentActivity.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center shrink-0`}><item.icon className="w-4 h-4" /></div>
                    <div><p className="text-sm font-medium text-navy leading-snug">{item.title}</p><p className="text-xs text-gray-400 mt-0.5 leading-snug">{item.desc}</p><p className="text-xs text-gray-300 mt-1">{item.time}</p></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card border-2 border-dashed border-primary/30 bg-primary/5 text-center p-6">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-3"><MapPin className="w-6 h-6" /></div>
              <p className="font-semibold text-navy text-sm">1 Unit Vacant</p>
              <p className="text-xs text-gray-500 mt-1 mb-4">Studio in Lavington is ready to rent</p>
              <Link to="/properties/4" className="btn-primary !py-2 !text-sm w-full text-center block">Find Tenant</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
