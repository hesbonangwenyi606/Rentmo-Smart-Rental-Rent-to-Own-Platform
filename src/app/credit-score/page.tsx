"use client";

import {
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Info,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";

const scoreHistory = [
  { month: "Apr '25", score: 640 },
  { month: "May '25", score: 648 },
  { month: "Jun '25", score: 657 },
  { month: "Jul '25", score: 668 },
  { month: "Aug '25", score: 680 },
  { month: "Sep '25", score: 693 },
  { month: "Oct '25", score: 700 },
  { month: "Nov '25", score: 706 },
  { month: "Dec '25", score: 710 },
  { month: "Jan '26", score: 714 },
  { month: "Feb '26", score: 718 },
  { month: "Mar '26", score: 720 },
];

const radarData = [
  { factor: "On-Time Payments", value: 95, fullMark: 100 },
  { factor: "Payment Consistency", value: 88, fullMark: 100 },
  { factor: "Loan Repayment", value: 90, fullMark: 100 },
  { factor: "Rental History", value: 82, fullMark: 100 },
  { factor: "Account Age", value: 72, fullMark: 100 },
];

const factors = [
  { label: "On-Time Payments", score: 95, weight: 35, color: "bg-green-500", status: "excellent" },
  { label: "Payment Consistency", score: 88, weight: 25, color: "bg-green-400", status: "good" },
  { label: "Loan Repayment", score: 90, weight: 20, color: "bg-green-500", status: "good" },
  { label: "Rental History Length", score: 72, weight: 10, color: "bg-yellow-400", status: "fair" },
  { label: "Account Activity", score: 68, weight: 10, color: "bg-yellow-400", status: "fair" },
];

const scoreRanges = [
  { label: "Exceptional", range: "750–850", color: "bg-green-500", active: false },
  { label: "Good", range: "700–749", color: "bg-green-400", active: true },
  { label: "Fair", range: "640–699", color: "bg-yellow-400", active: false },
  { label: "Poor", range: "580–639", color: "bg-orange-400", active: false },
  { label: "Very Poor", range: "300–579", color: "bg-red-500", active: false },
];

const tips = [
  { title: "Pay rent on the 1st of every month", impact: "+5 to +12 pts", icon: CheckCircle2, color: "text-green-500" },
  { title: "Maintain consistent payment amounts", impact: "+3 to +8 pts", icon: TrendingUp, color: "text-blue-500" },
  { title: "Keep your M-Pesa active for payments", impact: "+2 to +5 pts", icon: Info, color: "text-primary" },
  { title: "Repay any loans before the due date", impact: "+5 to +15 pts", icon: ArrowUpRight, color: "text-purple-500" },
];

function GaugeBar({ score }: { score: number }) {
  const pct = ((score - 300) / 550) * 100;
  const color = score >= 700 ? "#22c55e" : score >= 640 ? "#f59e0b" : "#ef4444";
  const label = score >= 750 ? "Exceptional" : score >= 700 ? "Good" : score >= 640 ? "Fair" : "Poor";

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 mb-3">
        <div>
          <div className="text-5xl sm:text-6xl font-black text-navy">{score}</div>
          <div className="text-base sm:text-lg font-semibold mt-1" style={{ color }}>{label}</div>
        </div>
        <div className="sm:text-right text-sm text-gray-400">
          <p>Range: 300–850</p>
          <p className="font-medium text-green-600 flex items-center gap-1 sm:justify-end mt-1">
            <ArrowUpRight className="w-4 h-4" />
            +80 pts in 12 months
          </p>
        </div>
      </div>
      <div className="relative h-4 bg-gradient-to-r from-red-400 via-yellow-400 via-green-300 to-green-500 rounded-full overflow-hidden">
        <div
          className="absolute top-0 right-0 bottom-0 bg-gray-100 rounded-r-full"
          style={{ width: `${100 - pct}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-4 border-navy rounded-full shadow-lg transition-all duration-700"
          style={{ left: `calc(${pct}% - 10px)` }}
        />
      </div>
      <div className="flex justify-between text-[10px] sm:text-xs text-gray-400 mt-1.5">
        <span>300</span>
        <span className="hidden sm:inline">580 Fair</span>
        <span className="hidden sm:inline">700 Good</span>
        <span>850</span>
      </div>
    </div>
  );
}

export default function CreditScorePage() {
  return (
    <div className="min-h-screen bg-gray-50 page-content">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-navy">Credit Score</h1>
          <p className="text-gray-400 mt-1">Track your Rentmo credit score and improve it over time.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Score Card */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-navy text-lg">Your Credit Score</h2>
                <div className="flex items-center gap-1.5 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  Last updated: Mar 31, 2026
                </div>
              </div>
              <GaugeBar score={720} />
            </div>

            {/* Score History Chart */}
            <div className="card">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-navy text-lg">Score History (12 months)</h2>
                <span className="badge-green flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +80 pts
                </span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={scoreHistory}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[600, 780]} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={2.5} fill="url(#scoreGrad)" dot={{ r: 3.5, fill: "#22c55e" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Score Factors */}
            <div className="card">
              <h2 className="font-bold text-navy text-lg mb-5">Score Factors</h2>
              <div className="space-y-5">
                {factors.map((f) => (
                  <div key={f.label}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-navy">{f.label}</span>
                        <span className="text-xs text-gray-400">({f.weight}% weight)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            f.status === "excellent" ? "badge-green" :
                            f.status === "good" ? "badge-blue" :
                            "badge-yellow"
                          }
                        >
                          {f.status}
                        </span>
                        <span className="text-sm font-bold text-navy">{f.score}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className={`${f.color} h-2.5 rounded-full transition-all duration-700`}
                        style={{ width: `${f.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Radar chart */}
            <div className="card">
              <h3 className="font-bold text-navy mb-4">Score Profile</h3>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#f0f0f0" />
                  <PolarAngleAxis dataKey="factor" tick={{ fontSize: 10, fill: "#9ca3af" }} />
                  <Radar name="Score" dataKey="value" stroke="#E63946" fill="#E63946" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Score ranges */}
            <div className="card">
              <h3 className="font-bold text-navy mb-4">Score Ranges</h3>
              <div className="space-y-2">
                {scoreRanges.map((r) => (
                  <div
                    key={r.label}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-sm ${r.active ? "bg-green-50 border border-green-200" : "hover:bg-gray-50"}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${r.color}`} />
                      <span className={r.active ? "font-bold text-green-800" : "text-gray-600"}>{r.label}</span>
                      {r.active && <span className="text-xs bg-green-200 text-green-800 px-1.5 py-0.5 rounded-full">You</span>}
                    </div>
                    <span className={r.active ? "text-green-700 font-medium" : "text-gray-400"}>{r.range}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="card">
              <h3 className="font-bold text-navy mb-4">Improve Your Score</h3>
              <div className="space-y-3">
                {tips.map((tip) => (
                  <div key={tip.title} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <tip.icon className={`w-5 h-5 ${tip.color} shrink-0 mt-0.5`} />
                    <div>
                      <p className="text-sm text-navy font-medium">{tip.title}</p>
                      <p className="text-xs text-green-600 font-medium mt-0.5">{tip.impact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next update */}
            <div className="card bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-primary" />
                <p className="font-semibold text-navy text-sm">Next Score Update</p>
              </div>
              <p className="text-2xl font-bold text-primary">Apr 30, 2026</p>
              <p className="text-xs text-gray-400 mt-1">Scores update monthly after each payment cycle.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
